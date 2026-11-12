import { useEffect, useRef } from 'react';
import type { Map, Marker } from 'leaflet';
import { CAMPUS_BOUNDS, CAMPUS_REGION, MIN_ZOOM_LEVEL } from '@/constants/campus';
import { isInsideBounds } from '@/game/bounds';
import type { Coordinate } from '@/game/types';

type Props = {
  guess?: Coordinate;
  onGuess: (coordinate: Coordinate) => void;
};

// eslint-disable-next-line @typescript-eslint/no-require-imports -- carregado só no navegador (ver leafletMap.ts)
const leaflet = () => require('./leafletMap') as typeof import('./leafletMap');

// Versão web do mapa do palpite: o react-native-maps não roda no navegador, então aqui é
// o Leaflet com a mesma foto de satélite, a mesma área do campus e o mesmo limite de zoom.
export function GuessMap({ guess, onGuess }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const marker = useRef<Marker | null>(null);
  const onGuessRef = useRef(onGuess);

  useEffect(() => {
    onGuessRef.current = onGuess;
  }, [onGuess]);

  useEffect(() => {
    const instance = leaflet().createSatelliteMap(container.current!, {
      // No Leaflet a área é travada de verdade: não dá para arrastar para fora do campus.
      maxBounds: [
        [CAMPUS_BOUNDS.southWest.latitude, CAMPUS_BOUNDS.southWest.longitude],
        [CAMPUS_BOUNDS.northEast.latitude, CAMPUS_BOUNDS.northEast.longitude],
      ],
      maxBoundsViscosity: 1,
      minZoom: MIN_ZOOM_LEVEL,
    });
    instance.setView([CAMPUS_REGION.latitude, CAMPUS_REGION.longitude], MIN_ZOOM_LEVEL);
    instance.on('click', event => {
      const coordinate = { latitude: event.latlng.lat, longitude: event.latlng.lng };
      if (isInsideBounds(coordinate, CAMPUS_BOUNDS)) onGuessRef.current(coordinate);
    });
    map.current = instance;
    return () => {
      instance.remove();
      map.current = null;
      marker.current = null;
    };
  }, []);

  useEffect(() => {
    marker.current?.remove();
    marker.current = guess && map.current ? leaflet().addPin(map.current, guess, '#e53935') : null;
  }, [guess]);

  return <div ref={container} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />;
}
