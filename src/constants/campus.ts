import type { Region } from 'react-native-maps';

// FHO / Uniararas, campus Duse Rüegger Ometto (Araras-SP). Centro da área do campus no OpenStreetMap.
// Se o campus não couber na tela, aumente os deltas e baixe MIN_ZOOM_LEVEL para 15.
export const CAMPUS_REGION: Region = {
  latitude: -22.375915,
  longitude: -47.369689,
  latitudeDelta: 0.007,
  longitudeDelta: 0.007,
};

export const MIN_ZOOM_LEVEL = 16;
