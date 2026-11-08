import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Coordinate, Place } from '@/game/types';
import places from './places.json';
import { rowToPlace, type PlaceRow } from './placeRows';
import { photoPublicUrl, supabase } from './supabase';

export interface PlaceRepository {
  getAll(): Promise<Place[]>;
}

type RawPlace = Omit<Place, 'coordinate'> & { coordinate: Coordinate | null };

// Locais empacotados no app (places.json + assets/places). Locais ainda sem coordenada
// (foto sem GPS) ficam fora do jogo até serem preenchidos à mão.
const localRepository: PlaceRepository = {
  getAll: async () =>
    (places as RawPlace[]).filter((place): place is Place => place.coordinate !== null),
};

const CACHE_KEY = 'geo-campus:places-cache';
const TIMEOUT_MS = 6000;

async function fetchRemote(): Promise<Place[]> {
  const query = supabase!.from('places').select('*').order('id');
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Supabase sem resposta')), TIMEOUT_MS),
  );
  const { data, error } = await Promise.race([query, timeout]);
  if (error) throw error;
  const list = (data as PlaceRow[])
    .map(row => rowToPlace(row, photoPublicUrl))
    .filter((place): place is Place => place !== null);
  if (list.length === 0) throw new Error('Nenhum local no Supabase');
  return list;
}

// Locais vindos do Supabase (tabela places + fotos no bucket). Sem internet, usa a última
// lista baixada (guardada no AsyncStorage); sem ela, os locais empacotados no app.
const remoteRepository: PlaceRepository = {
  getAll: async () => {
    try {
      const list = await fetchRemote();
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(list));
      return list;
    } catch {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      return cached ? (JSON.parse(cached) as Place[]) : localRepository.getAll();
    }
  },
};

// Com o .env do Supabase preenchido, os locais vêm da nuvem; sem ele, do próprio app.
export const placeRepository: PlaceRepository = supabase ? remoteRepository : localRepository;
