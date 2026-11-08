import { rowToPlace, type PlaceRow } from '../placeRows';

const url = (file: string) => `https://exemplo.supabase.co/storage/v1/object/public/places/${file}`;

const row: PlaceRow = {
  id: 'capela',
  name: 'Capela',
  latitude: -22.374513,
  longitude: -47.368397,
  difficulty: 'easy',
  indoor: false,
  photos: ['capela-1.jpg', 'capela-2.jpg'],
};

describe('rowToPlace', () => {
  it('converte a linha do banco no formato do jogo, com as fotos como URL', () => {
    expect(rowToPlace(row, url)).toEqual({
      id: 'capela',
      name: 'Capela',
      coordinate: { latitude: -22.374513, longitude: -47.368397 },
      difficulty: 'easy',
      indoor: false,
      photos: [url('capela-1.jpg'), url('capela-2.jpg')],
    });
  });

  it('deixa fora do jogo um local sem foto', () => {
    expect(rowToPlace({ ...row, photos: [] }, url)).toBeNull();
    expect(rowToPlace({ ...row, photos: null }, url)).toBeNull();
  });

  it('trata dificuldade desconhecida como média', () => {
    expect(rowToPlace({ ...row, difficulty: 'impossivel' }, url)?.difficulty).toBe('medium');
  });
});
