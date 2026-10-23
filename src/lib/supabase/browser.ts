import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null | undefined;

/**
 * Client Supabase du navigateur, pour les votes de la tier list : la base reçoit ainsi
 * l'adresse du visiteur et peut limiter les abus. Clé publishable uniquement.
 */
export function getBrowserClient(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  client = url && key ? createSupabaseClient(url, key, { auth: { persistSession: false } }) : null;
  return client;
}
