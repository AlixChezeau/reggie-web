import { Team } from '@/types';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const NBA_TEAMS: Team[] = [
  // Eastern Conference - Atlantic
  { id: 1, name: 'Celtics', abbreviation: 'BOS', city: 'Boston', conference: 'East', logo: 'celtics', primaryColor: '#007A33', secondaryColor: '#BA9653', slug: 'boston-celtics' },
  { id: 2, name: 'Nets', abbreviation: 'BKN', city: 'Brooklyn', conference: 'East', logo: 'nets', primaryColor: '#000000', secondaryColor: '#FFFFFF', slug: 'brooklyn-nets' },
  { id: 3, name: 'Knicks', abbreviation: 'NYK', city: 'New York', conference: 'East', logo: 'knicks', primaryColor: '#006BB6', secondaryColor: '#F58426', slug: 'new-york-knicks' },
  { id: 4, name: '76ers', abbreviation: 'PHI', city: 'Philadelphia', conference: 'East', logo: '76ers', primaryColor: '#006BB6', secondaryColor: '#ED174C', slug: 'philadelphia-76ers' },
  { id: 5, name: 'Raptors', abbreviation: 'TOR', city: 'Toronto', conference: 'East', logo: 'raptors', primaryColor: '#CE1141', secondaryColor: '#000000', slug: 'toronto-raptors' },

  // Eastern Conference - Central
  { id: 6, name: 'Bulls', abbreviation: 'CHI', city: 'Chicago', conference: 'East', logo: 'bulls', primaryColor: '#CE1141', secondaryColor: '#000000', slug: 'chicago-bulls' },
  { id: 7, name: 'Cavaliers', abbreviation: 'CLE', city: 'Cleveland', conference: 'East', logo: 'cavaliers', primaryColor: '#860038', secondaryColor: '#FDBB30', slug: 'cleveland-cavaliers' },
  { id: 8, name: 'Pistons', abbreviation: 'DET', city: 'Detroit', conference: 'East', logo: 'pistons', primaryColor: '#C8102E', secondaryColor: '#1D42BA', slug: 'detroit-pistons' },
  { id: 9, name: 'Pacers', abbreviation: 'IND', city: 'Indiana', conference: 'East', logo: 'pacers', primaryColor: '#002D62', secondaryColor: '#FDBB30', slug: 'indiana-pacers' },
  { id: 10, name: 'Bucks', abbreviation: 'MIL', city: 'Milwaukee', conference: 'East', logo: 'bucks', primaryColor: '#00471B', secondaryColor: '#EEE1C6', slug: 'milwaukee-bucks' },

  // Eastern Conference - Southeast
  { id: 11, name: 'Hawks', abbreviation: 'ATL', city: 'Atlanta', conference: 'East', logo: 'hawks', primaryColor: '#E03A3E', secondaryColor: '#C1D32F', slug: 'atlanta-hawks' },
  { id: 12, name: 'Hornets', abbreviation: 'CHA', city: 'Charlotte', conference: 'East', logo: 'hornets', primaryColor: '#1D1160', secondaryColor: '#00788C', slug: 'charlotte-hornets' },
  { id: 13, name: 'Heat', abbreviation: 'MIA', city: 'Miami', conference: 'East', logo: 'heat', primaryColor: '#98002E', secondaryColor: '#F9A01B', slug: 'miami-heat' },
  { id: 14, name: 'Magic', abbreviation: 'ORL', city: 'Orlando', conference: 'East', logo: 'magic', primaryColor: '#0077C0', secondaryColor: '#C4CED4', slug: 'orlando-magic' },
  { id: 15, name: 'Wizards', abbreviation: 'WAS', city: 'Washington', conference: 'East', logo: 'wizards', primaryColor: '#002B5C', secondaryColor: '#E31837', slug: 'washington-wizards' },

  // Western Conference - Northwest
  { id: 16, name: 'Nuggets', abbreviation: 'DEN', city: 'Denver', conference: 'West', logo: 'nuggets', primaryColor: '#0E2240', secondaryColor: '#FEC524', slug: 'denver-nuggets' },
  { id: 17, name: 'Timberwolves', abbreviation: 'MIN', city: 'Minnesota', conference: 'West', logo: 'timberwolves', primaryColor: '#0C2340', secondaryColor: '#236192', slug: 'minnesota-timberwolves' },
  { id: 18, name: 'Thunder', abbreviation: 'OKC', city: 'Oklahoma City', conference: 'West', logo: 'thunder', primaryColor: '#007AC1', secondaryColor: '#EF3B24', slug: 'oklahoma-city-thunder' },
  { id: 19, name: 'Trail Blazers', abbreviation: 'POR', city: 'Portland', conference: 'West', logo: 'blazers', primaryColor: '#E03A3E', secondaryColor: '#000000', slug: 'portland-trail-blazers' },
  { id: 20, name: 'Jazz', abbreviation: 'UTA', city: 'Utah', conference: 'West', logo: 'jazz', primaryColor: '#002B5C', secondaryColor: '#00471B', slug: 'utah-jazz' },

  // Western Conference - Pacific
  { id: 21, name: 'Warriors', abbreviation: 'GSW', city: 'Golden State', conference: 'West', logo: 'warriors', primaryColor: '#1D428A', secondaryColor: '#FFC72C', slug: 'golden-state-warriors' },
  { id: 22, name: 'Clippers', abbreviation: 'LAC', city: 'LA', conference: 'West', logo: 'clippers', primaryColor: '#C8102E', secondaryColor: '#1D428A', slug: 'la-clippers' },
  { id: 23, name: 'Lakers', abbreviation: 'LAL', city: 'Los Angeles', conference: 'West', logo: 'lakers', primaryColor: '#552583', secondaryColor: '#FDB927', slug: 'los-angeles-lakers' },
  { id: 24, name: 'Suns', abbreviation: 'PHX', city: 'Phoenix', conference: 'West', logo: 'suns', primaryColor: '#1D1160', secondaryColor: '#E56020', slug: 'phoenix-suns' },
  { id: 25, name: 'Kings', abbreviation: 'SAC', city: 'Sacramento', conference: 'West', logo: 'kings', primaryColor: '#5A2D81', secondaryColor: '#63727A', slug: 'sacramento-kings' },

  // Western Conference - Southwest
  { id: 26, name: 'Mavericks', abbreviation: 'DAL', city: 'Dallas', conference: 'West', logo: 'mavericks', primaryColor: '#00538C', secondaryColor: '#002B5E', slug: 'dallas-mavericks' },
  { id: 27, name: 'Rockets', abbreviation: 'HOU', city: 'Houston', conference: 'West', logo: 'rockets', primaryColor: '#CE1141', secondaryColor: '#000000', slug: 'houston-rockets' },
  { id: 28, name: 'Grizzlies', abbreviation: 'MEM', city: 'Memphis', conference: 'West', logo: 'grizzlies', primaryColor: '#5D76A9', secondaryColor: '#12173F', slug: 'memphis-grizzlies' },
  { id: 29, name: 'Pelicans', abbreviation: 'NOP', city: 'New Orleans', conference: 'West', logo: 'pelicans', primaryColor: '#0C2340', secondaryColor: '#C8102E', slug: 'new-orleans-pelicans' },
  { id: 30, name: 'Spurs', abbreviation: 'SAS', city: 'San Antonio', conference: 'West', logo: 'spurs', primaryColor: '#C4CED4', secondaryColor: '#000000', slug: 'san-antonio-spurs' },
];

export const getTeamById = (id: number): Team | undefined => {
  return NBA_TEAMS.find(team => team.id === id);
};

export const getTeamByAbbreviation = (abbr: string): Team | undefined => {
  return NBA_TEAMS.find(team => team.abbreviation.toUpperCase() === abbr.toUpperCase());
};

export const getTeamBySlug = (slug: string): Team | undefined => {
  return NBA_TEAMS.find(team => team.slug === slug);
};

export const getTeamsByConference = (conference: 'East' | 'West'): Team[] => {
  return NBA_TEAMS.filter(team => team.conference === conference);
};

export const getTeamFullName = (team: Team): string => {
  return `${team.city} ${team.name}`;
};
