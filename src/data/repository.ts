import type { Coordinate, Place } from '@/game/types';
import places from './places.json';

export interface PlaceRepository {
  getAll(): Promise<Place[]>;
}

type RawPlace = Omit<Place, 'coordinate'> & { coordinate: Coordinate | null };

// Locais ainda sem coordenada (foto sem GPS) ficam fora do jogo até serem preenchidos à mão.
const localRepository: PlaceRepository = {
  getAll: async () =>
    (places as RawPlace[]).filter((place): place is Place => place.coordinate !== null),
};

// Com backend, crie um remoteRepository com a mesma interface e troque só esta linha.
export const placeRepository: PlaceRepository = localRepository;
