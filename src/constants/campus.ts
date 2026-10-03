import type { Region } from 'react-native-maps';
import type { Bounds } from '@/game/types';

// FHO / Uniararas, campus Duse Rüegger Ometto (Araras-SP).
// Área do campus no OpenStreetMap: lat -22.3792 a -22.3726, lng -47.3729 a -47.3664.

// Área onde o jogador pode navegar e palpitar: a do campus com ~110 m de folga em cada lado.
export const CAMPUS_BOUNDS: Bounds = {
  northEast: { latitude: -22.3716, longitude: -47.3654 },
  southWest: { latitude: -22.3802, longitude: -47.3739 },
};

// Enquadramento ao abrir o mapa.
export const CAMPUS_REGION: Region = {
  latitude: -22.375915,
  longitude: -47.369689,
  latitudeDelta: 0.007,
  longitudeDelta: 0.007,
};

// Limite de afastamento. Android (Google Maps) usa o nível de zoom;
// iPhone (Apple Maps) ignora o nível de zoom e usa a altura máxima da câmera em metros.
// Se o campus não couber na tela, baixe MIN_ZOOM_LEVEL para 15 / aumente a altura.
export const MIN_ZOOM_LEVEL = 16;
export const MAX_CAMERA_DISTANCE_METERS = 1500;
