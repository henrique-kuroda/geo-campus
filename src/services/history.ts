import AsyncStorage from '@react-native-async-storage/async-storage';
import type { MatchRecord } from '@/game/types';

export type { MatchRecord };

const HISTORY_KEY = 'geo-campus:history';
const HISTORY_LIMIT = 50;

export async function loadHistory(): Promise<MatchRecord[]> {
  const raw = await AsyncStorage.getItem(HISTORY_KEY);
  return raw ? (JSON.parse(raw) as MatchRecord[]) : [];
}

// A data (ISO, com milissegundos) identifica a partida.
export async function findMatch(date: string): Promise<MatchRecord | undefined> {
  const history = await loadHistory();
  return history.find(match => match.date === date);
}

export async function saveMatch(record: MatchRecord): Promise<void> {
  const history = await loadHistory();
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify([record, ...history].slice(0, HISTORY_LIMIT)));
}
