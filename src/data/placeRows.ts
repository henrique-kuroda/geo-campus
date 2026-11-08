import type { Difficulty, Place } from '@/game/types';

// Uma linha da tabela public.places no Supabase (supabase/schema.sql).
export type PlaceRow = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  difficulty: string;
  indoor: boolean;
  photos: string[] | null;
};

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

// Converte a linha do banco no formato que o jogo usa. As fotos viram URLs públicas do bucket,
// que o resolvePhoto já trata como imagem remota. Linha sem foto fica fora do jogo.
export function rowToPlace(row: PlaceRow, photoUrl: (file: string) => string): Place | null {
  const photos = (row.photos ?? []).filter(Boolean).map(photoUrl);
  if (photos.length === 0) return null;
  return {
    id: row.id,
    name: row.name,
    coordinate: { latitude: row.latitude, longitude: row.longitude },
    difficulty: DIFFICULTIES.includes(row.difficulty as Difficulty)
      ? (row.difficulty as Difficulty)
      : 'medium',
    indoor: row.indoor,
    photos,
  };
}
