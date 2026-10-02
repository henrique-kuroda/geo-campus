import { distanceInMeters, scoreForDistance } from '../scoring';

describe('distanceInMeters', () => {
  it('é zero para o mesmo ponto', () => {
    const point = { latitude: -22.0, longitude: -47.0 };
    expect(distanceInMeters(point, point)).toBe(0);
  });

  it('mede 1 grau de latitude como ~111 km', () => {
    const a = { latitude: -22.0, longitude: -47.0 };
    const b = { latitude: -21.0, longitude: -47.0 };
    expect(distanceInMeters(a, b)).toBeCloseTo(111_195, 0);
  });

  it('é simétrica', () => {
    const a = { latitude: -22.0012, longitude: -47.0034 };
    const b = { latitude: -22.0045, longitude: -47.0001 };
    expect(distanceInMeters(a, b)).toBeCloseTo(distanceInMeters(b, a), 6);
  });
});

describe('scoreForDistance', () => {
  it.each([
    [0, 5000],
    [10, 5000],
    [20, 4232],
    [50, 2567],
    [100, 1116],
    [200, 211],
  ])('erro de %i m vale %i pontos', (meters, points) => {
    expect(scoreForDistance(meters)).toBe(points);
  });

  it('nunca aumenta com a distância', () => {
    for (let m = 0; m < 500; m += 5) {
      expect(scoreForDistance(m + 5)).toBeLessThanOrEqual(scoreForDistance(m));
    }
  });
});
