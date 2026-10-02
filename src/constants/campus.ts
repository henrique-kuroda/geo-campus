import type { Region } from 'react-native-maps';

// Centro do campus: no Google Maps, segure o dedo no ponto e copie as coordenadas.
// Se o campus não couber na tela, aumente os deltas e baixe MIN_ZOOM_LEVEL para 15.
export const CAMPUS_REGION: Region = {
  latitude: -22.0,
  longitude: -47.0,
  latitudeDelta: 0.006,
  longitudeDelta: 0.006,
};

export const MIN_ZOOM_LEVEL = 16;
