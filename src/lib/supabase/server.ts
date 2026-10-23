import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Client Supabase en lecture seule : le site n'affiche que des données publiques
 * (matchs, équipes, verdicts), protégées côté base par les règles RLS.
 *
 * Clé « publishable » (nouvelle API Supabase). L'ancienne clé « anon »
 * (NEXT_PUBLIC_SUPABASE_ANON_KEY) n'est lue qu'en secours, le temps de mettre à jour
 * les variables de Vercel : à retirer avant de désactiver les anciennes clés Supabase.
 *
 * Renvoie null si la configuration manque : les pages s'affichent alors sans données
 * au lieu de faire échouer la compilation.
 */
export function createClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createSupabaseClient(url, key, { auth: { persistSession: false } });
}
