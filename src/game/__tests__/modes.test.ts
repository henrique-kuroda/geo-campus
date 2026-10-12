import { countsForRecord, modeLabel, roundCount } from '../modes';

describe('roundCount', () => {
  it('partida normal e desafio do dia têm 5 rodadas', () => {
    expect(roundCount('classic', 11)).toBe(5);
    expect(roundCount('daily', 11)).toBe(5);
  });

  it('com menos de 5 locais, usa todos', () => {
    expect(roundCount('classic', 3)).toBe(3);
  });

  it('modo todos usa todos os locais', () => {
    expect(roundCount('all', 11)).toBe(11);
    expect(roundCount('all', 30)).toBe(30);
  });
});

describe('modeLabel', () => {
  it('nomeia cada modo e trata desconhecido como partida', () => {
    expect(modeLabel('daily')).toBe('Desafio do dia');
    expect(modeLabel('all')).toBe('Todos os locais');
    expect(modeLabel('qualquer')).toBe('Partida');
  });
});

describe('countsForRecord', () => {
  it('só partidas de 5 rodadas contam para o recorde', () => {
    expect(countsForRecord('classic')).toBe(true);
    expect(countsForRecord('daily')).toBe(true);
    expect(countsForRecord('all')).toBe(false);
  });
});
