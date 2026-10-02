import { distanceInMeters, scoreForDistance } from './scoring';
import type { Coordinate, Round } from './types';

// idle → playing → result → playing … → finished
export type GameStatus = 'idle' | 'playing' | 'result' | 'finished';

export type GameState = {
  status: GameStatus;
  rounds: Round[];
  current: number;
  pendingGuess?: Coordinate;
};

export type GameAction =
  | { type: 'START'; rounds: Round[] }
  | { type: 'SET_GUESS'; coordinate: Coordinate }
  | { type: 'CONFIRM'; target: Coordinate }
  | { type: 'NEXT' };

export const initialGameState: GameState = { status: 'idle', rounds: [], current: 0 };

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START':
      return { status: 'playing', rounds: action.rounds, current: 0 };

    case 'SET_GUESS':
      return state.status === 'playing' ? { ...state, pendingGuess: action.coordinate } : state;

    case 'CONFIRM': {
      const guess = state.pendingGuess;
      if (state.status !== 'playing' || !guess) return state;
      const distance = distanceInMeters(guess, action.target);
      const rounds = state.rounds.map((round, index) =>
        index === state.current
          ? { ...round, guess, distance, score: scoreForDistance(distance) }
          : round,
      );
      return { ...state, status: 'result', rounds, pendingGuess: undefined };
    }

    case 'NEXT': {
      if (state.status !== 'result') return state;
      const next = state.current + 1;
      return next < state.rounds.length
        ? { ...state, status: 'playing', current: next }
        : { ...state, status: 'finished' };
    }

    default:
      return state;
  }
}

export function totalScore(state: GameState): number {
  return state.rounds.reduce((sum, round) => sum + (round.score ?? 0), 0);
}
