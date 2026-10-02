import { buildRounds, dailySeed, mulberry32 } from '../random';
import type { Place } from '../types';

const place = (id: string, photos = [`${id}-1`, `${id}-2`]): Place => ({
  id,
  name: id,
  coordinate: { latitude: -22, longitude: -47 },
  photos,
  difficulty: 'medium',
  indoor: false,
});

const places = ['a', 'b', 'c', 'd', 'e', 'f', 'g'].map(id => place(id));

describe('mulberry32', () => {
  it('gera a mesma sequência para a mesma seed', () => {
    const first = mulberry32(42);
    const second = mulberry32(42);
    for (let i = 0; i < 10; i++) expect(first()).toBe(second());
  });

  it('fica em [0, 1)', () => {
    const random = mulberry32(7);
    for (let i = 0; i < 1000; i++) {
      const value = random();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});

describe('dailySeed', () => {
  it('é igual ao longo do mesmo dia', () => {
    expect(dailySeed(new Date(2026, 9, 1, 0, 5))).toBe(dailySeed(new Date(2026, 9, 1, 23, 55)));
  });

  it('muda de um dia para o outro', () => {
    expect(dailySeed(new Date(2026, 9, 1))).not.toBe(dailySeed(new Date(2026, 9, 2)));
  });
});

describe('buildRounds', () => {
  it('sorteia a quantidade pedida, sem repetir local', () => {
    const rounds = buildRounds(places, 5);
    expect(rounds).toHaveLength(5);
    expect(new Set(rounds.map(round => round.placeId)).size).toBe(5);
  });

  it('usa todos os locais quando há menos que o pedido', () => {
    expect(buildRounds(places.slice(0, 3), 5)).toHaveLength(3);
  });

  it('escolhe uma foto do próprio local', () => {
    for (const round of buildRounds(places, 5)) {
      expect(places.find(p => p.id === round.placeId)!.photos).toContain(round.photo);
    }
  });

  it('com a mesma seed, dá o mesmo resultado independente da ordem do JSON', () => {
    const seed = dailySeed(new Date(2026, 9, 1));
    const shuffled = [...places].reverse();
    expect(buildRounds(shuffled, 5, mulberry32(seed))).toEqual(
      buildRounds(places, 5, mulberry32(seed)),
    );
  });
});
