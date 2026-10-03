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
