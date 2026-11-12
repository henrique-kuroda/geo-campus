import { useEffect, useRef } from 'react';
import type { Coordinate } from '@/game/types';

type Props = {
  guess: Coordinate;
  target: Coordinate;
};

// Versão web do mapa de resultado: pino vermelho no palpite, verde no local certo e a linha entre eles.
export function ResultMap({ guess, target }: Props) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { createSatelliteMap, addLine, addPin, fitPoints } =
      // eslint-disable-next-line @typescript-eslint/no-require-imports -- carregado só no navegador (ver leafletMap.ts)
      require('./leafletMap') as typeof import('./leafletMap');
    const map = createSatelliteMap(container.current!);
    addLine(map, guess, target);
    addPin(map, guess, '#e53935');
    addPin(map, target, '#2e7d32');
    fitPoints(map, [guess, target]);
    return () => {
      map.remove();
    };
  }, [guess, target]);

  return <div ref={container} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />;
}
