import { useRef } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { CAMPUS_REGION } from '@/constants/campus';
import type { Coordinate } from '@/game/types';

type Props = {
  guess: Coordinate;
  target: Coordinate;
};

export function ResultMap({ guess, target }: Props) {
  const mapRef = useRef<MapView>(null);

  // edgePadding.bottom precisa ser maior que o painel de resultado, senão os pinos ficam atrás dele.
  const fitBothPoints = () =>
    mapRef.current?.fitToCoordinates([guess, target], {
      edgePadding: { top: 80, right: 60, bottom: 280, left: 60 },
      animated: true,
    });

  return (
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFill}
      mapType="satellite"
      initialRegion={CAMPUS_REGION}
      onMapReady={fitBothPoints}
    >
      <Marker coordinate={guess} pinColor="red" />
      <Marker coordinate={target} pinColor="green" />
      <Polyline coordinates={[guess, target]} strokeColor="#ffffff" strokeWidth={3} />
    </MapView>
  );
}
