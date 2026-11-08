// Envia o catálogo local (src/data/places.json + fotos tratadas em assets/places) para o Supabase:
// cada foto vai para o bucket 'places' e cada local vira (ou atualiza) uma linha da tabela places.
// Usa a chave secret, que fica só no seu PC em .env.local; ela nunca vai para o app.
//
// Fluxo para um local novo: npm run import-photos → conferir places.json → npm run sync-supabase
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;
if (!url || !secretKey) {
  console.error('Falta EXPO_PUBLIC_SUPABASE_URL (.env) ou SUPABASE_SECRET_KEY (.env.local).');
  process.exit(1);
}

const BUCKET = 'places';
const PHOTOS_DIR = 'assets/places';
const supabase = createClient(url, secretKey, { auth: { persistSession: false } });

// Cria o bucket público das fotos se ainda não existir (o SQL do schema nem sempre consegue).
const { data: bucket } = await supabase.storage.getBucket(BUCKET);
if (!bucket) {
  const { error } = await supabase.storage.createBucket(BUCKET, { public: true });
  if (error) throw new Error(`Bucket ${BUCKET}: ${error.message}`);
  console.log(`Bucket '${BUCKET}' criado.`);
}

const places = JSON.parse(await readFile('src/data/places.json', 'utf8'));
const ready = places.filter(place => place.coordinate);
const skipped = places.filter(place => !place.coordinate).map(place => place.id);

let uploaded = 0;
for (const place of ready) {
  for (const photo of place.photos) {
    const file = `${photo}.jpg`;
    const body = await readFile(path.join(PHOTOS_DIR, file));
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(file, body, { contentType: 'image/jpeg', upsert: true });
    if (error) throw new Error(`Foto ${file}: ${error.message}`);
    uploaded++;
  }
}

const rows = ready.map(place => ({
  id: place.id,
  name: place.name,
  latitude: place.coordinate.latitude,
  longitude: place.coordinate.longitude,
  difficulty: place.difficulty,
  indoor: place.indoor,
  photos: place.photos.map(photo => `${photo}.jpg`),
  updated_at: new Date().toISOString(),
}));
const { error } = await supabase.from('places').upsert(rows);
if (error) throw new Error(`Tabela places: ${error.message}`);

console.log(`${rows.length} locais e ${uploaded} fotos enviados para o Supabase.`);
if (skipped.length) console.warn(`Sem coordenada, não enviados: ${skipped.join(', ')}`);
