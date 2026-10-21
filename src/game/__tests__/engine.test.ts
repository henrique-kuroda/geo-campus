import {
  gameReducer,
  initialGameState,
  summarizeMatch,
  totalScore,
  type GameState,
} from '../engine';
import type { Round } from '../types';

const target = { latitude: -22.0, longitude: -47.0 };
const rounds: Round[] = [
  { placeId: 'a', photo: 'a-1' },
  { placeId: 'b', photo: 'b-1' },
];

const start = () => gameReducer(initialGameState, { type: 'START', rounds });

describe('gameReducer', () => {
  it('START começa na primeira rodada', () => {
    const state = start();
    expect(state.status).toBe('playing');
    expect(state.current).toBe(0);
    expect(state.rounds).toBe(rounds);
  });

  it('SET_GUESS guarda o palpite pendente e pode ser trocado', () => {
    let state = gameReducer(start(), { type: 'SET_GUESS', coordinate: target });
    const other = { latitude: -22.001, longitude: -47.0 };
    state = gameReducer(state, { type: 'SET_GUESS', coordinate: other });
    expect(state.pendingGuess).toEqual(other);
  });

  it('CONFIRM sem palpite não faz nada', () => {
    const state = start();
    expect(gameReducer(state, { type: 'CONFIRM', target })).toBe(state);
  });

  it('CONFIRM calcula distância e pontos da rodada atual', () => {
    let state = gameReducer(start(), { type: 'SET_GUESS', coordinate: target });
    state = gameReducer(state, { type: 'CONFIRM', target });
    expect(state.status).toBe('result');
    expect(state.pendingGuess).toBeUndefined();
    expect(state.rounds[0]).toMatchObject({ guess: target, distance: 0, score: 5000 });
    expect(state.rounds[1].score).toBeUndefined();
  });

  it('ignora SET_GUESS e CONFIRM durante o resultado', () => {
    let state = gameReducer(start(), { type: 'SET_GUESS', coordinate: target });
    state = gameReducer(state, { type: 'CONFIRM', target });
    expect(gameReducer(state, { type: 'SET_GUESS', coordinate: target })).toBe(state);
    expect(gameReducer(state, { type: 'CONFIRM', target })).toBe(state);
  });

  it('NEXT avança e termina depois da última rodada', () => {
    let state: GameState = start();
    for (let i = 0; i < rounds.length; i++) {
      state = gameReducer(state, { type: 'SET_GUESS', coordinate: target });
      state = gameReducer(state, { type: 'CONFIRM', target });
      state = gameReducer(state, { type: 'NEXT' });
    }
    expect(state.status).toBe('finished');
    expect(totalScore(state)).toBe(10000);
  });

  it('NEXT só funciona na tela de resultado', () => {
    const state = start();
    expect(gameReducer(state, { type: 'NEXT' })).toBe(state);
  });
});

describe('summarizeMatch', () => {
  it('monta o registro do histórico com as rodadas', () => {
    let state: GameState = start();
    const far = { latitude: -22.0009, longitude: -47.0 }; // ~100 m ao sul
    for (const guess of [target, far]) {
      state = gameReducer(state, { type: 'SET_GUESS', coordinate: guess });
      state = gameReducer(state, { type: 'CONFIRM', target });
      state = gameReducer(state, { type: 'NEXT' });
    }

    const record = summarizeMatch(state, { a: 'Capela' }, 'classic', '2026-10-21T20:00:00.000Z');

    expect(record).toMatchObject({ mode: 'classic', max: 10000, total: totalScore(state) });
    expect(record.rounds).toHaveLength(2);
    expect(record.rounds![0]).toEqual({ placeId: 'a', placeName: 'Capela', distance: 0, score: 5000 });
    // Sem nome conhecido, usa o id; a distância é arredondada para metros inteiros.
    expect(record.rounds![1]).toMatchObject({ placeId: 'b', placeName: 'b', distance: 100 });
  });
});
