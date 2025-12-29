'use client';

import Image from 'next/image';
import { Team } from '@/types';

interface TeamLogoProps {
  team: Team;
  size?: number;
  className?: string;
}

export function TeamLogo({ team, size = 48, className = '' }: TeamLogoProps) {
  const logoPath = `/teams/${team.abbreviation.toLowerCase()}.png`;

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={logoPath}
        alt={`${team.city} ${team.name}`}
        width={size}
        height={size}
        className="object-contain"
        onError={(e) => {
          // Fallback to abbreviation circle
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            parent.innerHTML = `
              <div
                class="flex items-center justify-center rounded-full border-2"
                style="width: ${size}px; height: ${size}px; background-color: ${team.primaryColor}20; border-color: ${team.primaryColor};"
              >
                <span style="font-size: ${size * 0.35}px; color: ${team.primaryColor}; font-weight: bold;">
                  ${team.abbreviation}
                </span>
              </div>
            `;
          }
        }}
      />
    </div>
  );
}
