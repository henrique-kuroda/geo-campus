import { createClient } from '@supabase/supabase-js';

// Endereço e chave publishable do projeto Supabase, lidos do arquivo .env.
// A chave publishable pode ir no app: com o RLS (supabase/schema.sql), ela só permite ler.
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const PHOTOS_BUCKET = 'places';

// Sem configuração (por exemplo, num clone sem .env), o app usa os locais empacotados.
// O app não tem login, então nenhuma sessão é guardada.
export const supabase =
  url && key
    ? createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      })
    : null;

export function photoPublicUrl(file: string): string {
  return supabase!.storage.from(PHOTOS_BUCKET).getPublicUrl(file).data.publicUrl;
}
