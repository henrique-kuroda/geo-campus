// Gerado por scripts/import-photos.mjs: o require de imagem precisa ser estático no React Native.
const images: Record<string, number> = {
  'busto-fundador-1': require('../../assets/places/busto-fundador-1.jpg'),
  'ginasio-1': require('../../assets/places/ginasio-1.jpg'),
  'neowater-1': require('../../assets/places/neowater-1.jpg'),
  'predio-budoya-1': require('../../assets/places/predio-budoya-1.jpg'),
};

// Se o id não estiver no mapa, é tratado como URL (fotos remotas no futuro).
export function resolvePhoto(ref: string): number | { uri: string } {
  return images[ref] ?? { uri: ref };
}
