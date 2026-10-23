import { redirect } from 'next/navigation';
import { getLastNight, etDateOf } from '@/lib/supabase/queries';
import { routes } from '@/lib/routes';

export const revalidate = 300;

type Props = { params: Promise<{ locale: string }> };

/** « La nuit » du menu : renvoie vers la dernière nuit terminée */
export default async function LastNightPage({ params }: Props) {
  const { locale } = await params;
  const lastNight = await getLastNight();
  redirect(routes.night(locale as 'fr' | 'en', lastNight?.date ?? etDateOf(new Date())));
}
