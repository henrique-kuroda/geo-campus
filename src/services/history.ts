import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = 'geo-campus:history';
const HISTORY_LIMIT = 50;

export type MatchRecord = {
  date: string;
  mode: string;
  total: number;
  max: number;
};

export async function loadHistory(): Promise<MatchRecord[]> {
  const raw = await AsyncStorage.getItem(HISTORY_KEY);
  return raw ? (JSON.parse(raw) as MatchRecord[]) : [];
}

export async function saveMatch(record: MatchRecord): Promise<void> {
  const history = await loadHistory();
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify([record, ...history].slice(0, HISTORY_LIMIT)));
}
