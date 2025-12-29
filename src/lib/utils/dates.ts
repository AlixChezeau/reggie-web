import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { fr, enUS } from 'date-fns/locale';

const ET_TIMEZONE = 'America/New_York';

export function getETDate(date: Date = new Date()): Date {
  return toZonedTime(date, ET_TIMEZONE);
}

export function formatMatchDate(dateString: string, locale: 'fr' | 'en'): string {
  const date = new Date(dateString);
  const dateLocale = locale === 'fr' ? fr : enUS;

  return format(date, locale === 'fr' ? "EEEE d MMMM yyyy 'à' HH:mm" : "EEEE, MMMM d, yyyy 'at' h:mm a", {
    locale: dateLocale,
  });
}

export function formatMatchDateShort(dateString: string, locale: 'fr' | 'en'): string {
  const date = new Date(dateString);
  const dateLocale = locale === 'fr' ? fr : enUS;

  return format(date, locale === 'fr' ? 'd MMM yyyy' : 'MMM d, yyyy', {
    locale: dateLocale,
  });
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'HH:mm');
}

export function formatETTime(dateString: string): string {
  const date = new Date(dateString);
  const etDate = toZonedTime(date, ET_TIMEZONE);
  return format(etDate, 'h:mm a');
}

export function getYesterdayDateRange(): { start: string; end: string } {
  const now = getETDate();
  const yesterday = subDays(now, 1);

  return {
    start: startOfDay(yesterday).toISOString(),
    end: endOfDay(yesterday).toISOString(),
  };
}

export function getTodayDateRange(): { start: string; end: string } {
  const now = getETDate();

  return {
    start: startOfDay(now).toISOString(),
    end: endOfDay(now).toISOString(),
  };
}

export function getDateString(date: Date = new Date()): string {
  return format(date, 'yyyy-MM-dd');
}
