import { GAME_CONFIG } from './config';

// classic: 5 fotos sorteadas · daily: 5 fotos iguais para todos no dia · all: todas as fotos
export type GameMode = 'classic' | 'daily' | 'all';

const LABELS: Record<GameMode, string> = {
  classic: 'Partida',
  daily: 'Desafio do dia',
  all: 'Todos os locais',
};

export function modeLabel(mode: string): string {
  return LABELS[mode as GameMode] ?? LABELS.classic;
}

export function roundCount(mode: string, availablePlaces: number): number {
  return mode === 'all'
    ? availablePlaces
    : Math.min(GAME_CONFIG.roundsPerMatch, availablePlaces);
}

// O modo "todos" tem tamanho variável, então não entra no recorde de partidas de 5 rodadas.
export function countsForRecord(mode: string): boolean {
  return mode !== 'all';
}
