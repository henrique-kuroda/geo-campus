export type Coordinate = { latitude: number; longitude: number };

export type Bounds = { northEast: Coordinate; southWest: Coordinate };

export type Difficulty = 'easy' | 'medium' | 'hard';

export type Place = {
  id: string;
  name: string;
  coordinate: Coordinate;
  photos: string[];
  difficulty: Difficulty;
  indoor: boolean;
  block?: string;
  hint?: string;
};

export type Round = {
  placeId: string;
  photo: string;
  guess?: Coordinate;
  distance?: number;
  score?: number;
};

// O que fica salvo no histórico ao fim de cada partida.
export type RoundResult = {
  placeId: string;
  placeName: string;
  distance: number;
  score: number;
};

export type MatchRecord = {
  date: string;
  mode: string;
  total: number;
  max: number;
  // Partidas salvas antes da tela de detalhes não têm as rodadas.
  rounds?: RoundResult[];
};
