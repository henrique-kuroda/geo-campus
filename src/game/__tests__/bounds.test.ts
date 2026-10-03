import { clampToBounds, isInsideBounds } from '../bounds';
import type { Bounds } from '../types';

const bounds: Bounds = {
  northEast: { latitude: -22.37, longitude: -47.36 },
  southWest: { latitude: -22.38, longitude: -47.37 },
};

describe('isInsideBounds', () => {
  it('aceita pontos dentro e na borda', () => {
    expect(isInsideBounds({ latitude: -22.375, longitude: -47.365 }, bounds)).toBe(true);
    expect(isInsideBounds(bounds.northEast, bounds)).toBe(true);
    expect(isInsideBounds(bounds.southWest, bounds)).toBe(true);
  });

  it.each([
    ['ao norte', { latitude: -22.369, longitude: -47.365 }],
    ['ao sul', { latitude: -22.381, longitude: -47.365 }],
    ['a leste', { latitude: -22.375, longitude: -47.359 }],
    ['a oeste', { latitude: -22.375, longitude: -47.371 }],
  ])('rejeita pontos %s', (_, point) => {
    expect(isInsideBounds(point, bounds)).toBe(false);
  });
});

describe('clampToBounds', () => {
  it('não mexe em ponto que já está dentro', () => {
    const point = { latitude: -22.375, longitude: -47.365 };
    expect(clampToBounds(point, bounds)).toEqual(point);
  });

  it('traz ponto de fora até a borda mais próxima', () => {
    expect(clampToBounds({ latitude: -22.36, longitude: -47.365 }, bounds)).toEqual({
      latitude: -22.37,
      longitude: -47.365,
    });
    expect(clampToBounds({ latitude: -22.40, longitude: -47.30 }, bounds)).toEqual({
      latitude: -22.38,
      longitude: -47.36,
    });
  });
});
