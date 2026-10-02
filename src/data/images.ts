// Gerado por scripts/import-photos.mjs: o require de imagem precisa ser estático no React Native.
const images: Record<string, number> = {
  'busto-fundador-1': require('../../assets/places/busto-fundador-1.jpg'),
};

// Se o id não estiver no mapa, é tratado como URL (fotos remotas no futuro).
export function resolvePhoto(ref: string): number | { uri: string } {
  return images[ref] ?? { uri: ref };
}
