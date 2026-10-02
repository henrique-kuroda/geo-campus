import { GAME_CONFIG } from './config';
import type { Coordinate } from './types';

const EARTH_RADIUS_METERS = 6_371_000;
const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

export function distanceInMeters(a: Coordinate, b: Coordinate): number {
  const dLat = toRadians(b.latitude - a.latitude);
  const dLon = toRadians(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(a.latitude)) * Math.cos(toRadians(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(h));
}

export function scoreForDistance(meters: number): number {
  const effective = Math.max(0, meters - GAME_CONFIG.toleranceMeters);
  return Math.round(GAME_CONFIG.maxScore * Math.exp(-effective / GAME_CONFIG.scoreDecayMeters));
}
