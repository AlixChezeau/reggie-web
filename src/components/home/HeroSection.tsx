import { Match } from '@/types';
import { FeaturedMatchCard } from './FeaturedMatchCard';
import { SmallMatchCard } from './SmallMatchCard';

interface HeroSectionProps {
  matches: Match[];
  locale: 'fr' | 'en';
  title: string;
  emptyMessage: string;
}

export function HeroSection({ matches, locale, title, emptyMessage }: HeroSectionProps) {
  if (matches.length === 0) {
    return (
      <section id="latest-news" className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl font-bold text-primary mb-6"
            style={{ fontFamily: 'var(--font-title)' }}
          >
            {title}
          </h2>
          <p className="text-foreground-secondary">{emptyMessage}</p>
        </div>
      </section>
    );
  }

  // Split matches: first 2 are featured, rest are sidebar
  const featuredMatches = matches.slice(0, 2);
  const sidebarMatches = matches.slice(2, 6);

  return (
    <section id="latest-news" className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-3xl font-bold text-primary mb-6"
          style={{ fontFamily: 'var(--font-title)' }}
        >
          {title}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured matches - 2/3 width on desktop */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredMatches.map((match) => (
              <FeaturedMatchCard
                key={match.id}
                match={match}
                locale={locale}
              />
            ))}
          </div>

          {/* Sidebar matches - 1/3 width on desktop */}
          <div className="space-y-3">
            {sidebarMatches.map((match) => (
              <SmallMatchCard
                key={match.id}
                match={match}
                locale={locale}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
