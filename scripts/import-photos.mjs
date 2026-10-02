// Lê o GPS das fotos em fotos-originais/, gera src/data/places.json e src/data/images.ts,
// redimensiona e remove os metadados (senão a resposta fica dentro do arquivo da foto).
// Nomeie as fotos como biblioteca-1.jpg, biblioteca-2.jpg: o número final agrupa fotos do mesmo local.
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import exifr from 'exifr';
import sharp from 'sharp';

const INPUT_DIR = 'fotos-originais';
const OUTPUT_DIR = 'assets/places';
const PLACES_FILE = 'src/data/places.json';
const IMAGES_FILE = 'src/data/images.ts';

const previous = new Map(
  JSON.parse(await readFile(PLACES_FILE, 'utf8').catch(() => '[]')).map(place => [place.id, place]),
);

await mkdir(OUTPUT_DIR, { recursive: true });
await mkdir(path.dirname(PLACES_FILE), { recursive: true });

const files = (await readdir(INPUT_DIR)).filter(file => /\.jpe?g$/i.test(file)).sort();
const places = new Map();

for (const file of files) {
  const input = path.join(INPUT_DIR, file);
  const photoId = path.parse(file).name.toLowerCase();
  const placeId = photoId.replace(/-\d+$/, '');
  const gps = await exifr.gps(input).catch(() => null);

  await sharp(input)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toFile(path.join(OUTPUT_DIR, `${photoId}.jpg`));

  const place = places.get(placeId) ?? {
    id: placeId,
    name: placeId,
    coordinate: null,
    difficulty: 'medium',
    indoor: false,
    ...previous.get(placeId),
    photos: [],
  };

  place.photos.push(photoId);
  if (!place.coordinate && gps) {
    place.coordinate = { latitude: gps.latitude, longitude: gps.longitude };
  }
  places.set(placeId, place);
}

const list = [...places.values()];
const registry = list
  .flatMap(place => place.photos)
  .map(id => `  '${id}': require('../../assets/places/${id}.jpg'),`)
  .join('\n');

await writeFile(PLACES_FILE, `${JSON.stringify(list, null, 2)}\n`);
await writeFile(
  IMAGES_FILE,
  `// Gerado por scripts/import-photos.mjs: o require de imagem precisa ser estático no React Native.\nconst images: Record<string, number> = {\n${registry}\n};\n\n// Se o id não estiver no mapa, é tratado como URL (fotos remotas no futuro).\nexport function resolvePhoto(ref: string): number | { uri: string } {\n  return images[ref] ?? { uri: ref };\n}\n`,
);

const missing = list.filter(place => !place.coordinate).map(place => place.id);
console.log(`${list.length} locais, ${files.length} fotos processadas`);
if (missing.length) console.warn(`Sem GPS, preencher à mão em ${PLACES_FILE}: ${missing.join(', ')}`);
