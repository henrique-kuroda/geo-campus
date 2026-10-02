import { useRef } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';
import { CAMPUS_REGION, MIN_ZOOM_LEVEL } from '@/constants/campus';
import type { Coordinate } from '@/game/types';

type Props = {
  guess?: Coordinate;
  onGuess: (coordinate: Coordinate) => void;
};

// Satélite de propósito: o mapa padrão mostra o nome dos prédios e entrega a resposta.
export function GuessMap({ guess, onGuess }: Props) {
  const mapRef = useRef<MapView>(null);

  // Traz a câmera de volta se o jogador arrastar para fora do campus.
  const keepInsideCampus = (region: Region) => {
    const outside =
      Math.abs(region.latitude - CAMPUS_REGION.latitude) > CAMPUS_REGION.latitudeDelta / 2 ||
      Math.abs(region.longitude - CAMPUS_REGION.longitude) > CAMPUS_REGION.longitudeDelta / 2;
    if (outside) mapRef.current?.animateToRegion(CAMPUS_REGION, 300);
  };

  return (
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFill}
      mapType="satellite"
      initialRegion={CAMPUS_REGION}
      minZoomLevel={MIN_ZOOM_LEVEL}
      rotateEnabled={false}
      pitchEnabled={false}
      toolbarEnabled={false}
      onPress={event => onGuess(event.nativeEvent.coordinate)}
      onRegionChangeComplete={keepInsideCampus}
    >
      {guess && <Marker coordinate={guess} />}
    </MapView>
  );
}
