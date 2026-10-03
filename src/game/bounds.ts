import type { Bounds, Coordinate } from './types';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function isInsideBounds(point: Coordinate, bounds: Bounds): boolean {
  const { northEast, southWest } = bounds;
  return (
    point.latitude >= southWest.latitude &&
    point.latitude <= northEast.latitude &&
    point.longitude >= southWest.longitude &&
    point.longitude <= northEast.longitude
  );
}

// Ponto mais próximo dentro da área: usado para trazer a câmera de volta só até a borda.
export function clampToBounds(point: Coordinate, bounds: Bounds): Coordinate {
  const { northEast, southWest } = bounds;
  return {
    latitude: clamp(point.latitude, southWest.latitude, northEast.latitude),
    longitude: clamp(point.longitude, southWest.longitude, northEast.longitude),
  };
}
