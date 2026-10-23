import { addDays, format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { fr, enUS } from 'date-fns/locale';

type Locale = 'fr' | 'en';

/**
 * Heures affichées : heure de Paris pour le site français, heure de New York pour
 * le site anglais (les fans américains regardent souvent en direct).
 */
export function timeZoneFor(locale: Locale): string {
  return locale === 'fr' ? 'Europe/Paris' : 'America/New_York';
}

export function formatMatchDate(dateString: string, locale: Locale): string {
  return formatInTimeZone(
    dateString,
    timeZoneFor(locale),
    locale === 'fr' ? "EEEE d MMMM 'à' HH:mm" : "EEEE, MMMM d 'at' h:mm a 'ET'",
    { locale: locale === 'fr' ? fr : enUS }
  );
}

export function formatMatchDateShort(dateString: string, locale: Locale): string {
  return formatInTimeZone(dateString, timeZoneFor(locale), locale === 'fr' ? 'd MMM yyyy' : 'MMM d, yyyy', {
    locale: locale === 'fr' ? fr : enUS,
  });
}

/** Heure de début : « 01:00 » à Paris, « 7:00 PM ET » à New York */
export function formatTime(dateString: string, locale: Locale): string {
  return formatInTimeZone(dateString, timeZoneFor(locale), locale === 'fr' ? 'HH:mm' : "h:mm a 'ET'");
}

/** Jour court : « 22 oct. », « Oct 22 » */
export function formatDay(dateString: string, locale: Locale): string {
  return formatInTimeZone(dateString, timeZoneFor(locale), locale === 'fr' ? 'd MMM' : 'MMM d', {
    locale: locale === 'fr' ? fr : enUS,
  });
}

/**
 * Titre d'une nuit à partir de sa date NBA (yyyy-MM-dd, heure de New York) :
 * « Nuit du 21 au 22 octobre » en français, « Night of October 21 » en anglais.
 */
export function nightTitle(etDate: string, locale: Locale): string {
  const day = new Date(`${etDate}T12:00:00Z`);
  if (locale === 'en') {
    return `Night of ${format(day, 'MMMM d', { locale: enUS })}`;
  }
  const next = addDays(day, 1);
  const sameMonth = day.getUTCMonth() === next.getUTCMonth();
  const from = format(day, sameMonth ? 'd' : 'd MMMM', { locale: fr });
  return `Nuit du ${from} au ${format(next, 'd MMMM', { locale: fr })}`;
}
