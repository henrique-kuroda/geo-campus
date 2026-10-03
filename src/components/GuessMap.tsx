import { useRef } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';
import {
  CAMPUS_BOUNDS,
  CAMPUS_REGION,
  MAX_CAMERA_DISTANCE_METERS,
  MIN_ZOOM_LEVEL,
} from '@/constants/campus';
import { clampToBounds, isInsideBounds } from '@/game/bounds';
import type { Coordinate } from '@/game/types';

// ~1 m: abaixo disso a câmera já está na borda e não precisa voltar (evita animar em loop).
const BOUNDS_TOLERANCE_DEGREES = 0.00001;

type Props = {
  guess?: Coordinate;
  onGuess: (coordinate: Coordinate) => void;
};

// Satélite de propósito: o mapa padrão mostra o nome dos prédios e entrega a resposta.
export function GuessMap({ guess, onGuess }: Props) {
  const mapRef = useRef<MapView>(null);

  // O react-native-maps não trava a câmera numa área (o setMapBoundaries não funciona na
  // nova arquitetura), então ao soltar fora do campus a câmera volta só até a borda.
  const keepInsideCampus = (region: Region) => {
    const center = clampToBounds(region, CAMPUS_BOUNDS);
    const offset =
      Math.abs(center.latitude - region.latitude) + Math.abs(center.longitude - region.longitude);
    if (offset > BOUNDS_TOLERANCE_DEGREES) {
      mapRef.current?.animateToRegion({ ...region, ...center }, 300);
    }
  };

  const handlePress = (coordinate: Coordinate) => {
    if (isInsideBounds(coordinate, CAMPUS_BOUNDS)) onGuess(coordinate);
  };

  return (
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFill}
      mapType="satellite"
      initialRegion={CAMPUS_REGION}
      minZoomLevel={MIN_ZOOM_LEVEL}
      cameraZoomRange={{ maxCenterCoordinateDistance: MAX_CAMERA_DISTANCE_METERS }}
      rotateEnabled={false}
      pitchEnabled={false}
      toolbarEnabled={false}
      onPress={event => handlePress(event.nativeEvent.coordinate)}
      onRegionChangeComplete={keepInsideCampus}
    >
      {guess && <Marker coordinate={guess} />}
    </MapView>
  );
}
