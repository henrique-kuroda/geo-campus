import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Coordinate } from '@/game/types';

// Só pode ser carregado no navegador: o Leaflet usa o `window` assim que é importado, e a
// versão web estática gera as páginas antes, no Node. Por isso os mapas web fazem o
// require deste arquivo dentro do useEffect.

// Foto de satélite da Esri (gratuita para exibição, com o crédito no canto do mapa).
const SATELLITE_TILES =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

const toLatLng = (point: Coordinate): L.LatLngTuple => [point.latitude, point.longitude];

// O ResizeObserver avisa o Leaflet quando o mapa muda de tamanho (no jogo ele cresce ao ser tocado).
export function createSatelliteMap(element: HTMLElement, options: L.MapOptions = {}): L.Map {
  const map = L.map(element, { zoomControl: false, ...options });
  L.tileLayer(SATELLITE_TILES, {
    maxZoom: 20,
    maxNativeZoom: 19,
    attribution: 'Imagens © Esri',
  }).addTo(map);
  map.attributionControl.setPrefix(false);
  const observer = new ResizeObserver(() => map.invalidateSize());
  observer.observe(element);
  map.on('unload', () => observer.disconnect());
  return map;
}

// Pino desenhado em SVG: os ícones padrão do Leaflet são arquivos PNG que o empacotador não acha.
export function addPin(map: L.Map, point: Coordinate, color: string): L.Marker {
  const icon = L.divIcon({
    className: '',
    iconSize: [28, 40],
    iconAnchor: [14, 40],
    html: `<svg width="28" height="40" viewBox="0 0 28 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0C6.3 0 0 6.3 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.3 21.7 0 14 0z" fill="${color}" stroke="#fff" stroke-width="2"/>
      <circle cx="14" cy="14" r="5" fill="#fff"/>
    </svg>`,
  });
  return L.marker(toLatLng(point), { icon }).addTo(map);
}

export function addLine(map: L.Map, from: Coordinate, to: Coordinate): void {
  L.polyline([toLatLng(from), toLatLng(to)], { color: '#ffffff', weight: 3 }).addTo(map);
}

export function fitPoints(map: L.Map, points: Coordinate[]): void {
  // O padding de baixo deixa os pinos acima do painel com a pontuação.
  map.fitBounds(L.latLngBounds(points.map(toLatLng)), {
    paddingTopLeft: [60, 80],
    paddingBottomRight: [60, 280],
    maxZoom: 19,
  });
}
