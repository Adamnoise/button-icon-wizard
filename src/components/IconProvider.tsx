
import React from 'react';
import * as HeroiconsOutline from '@heroicons/react/24/outline';
import * as HeroiconsSolid from '@heroicons/react/24/solid';

// Supported icon types
export type IconType = 'heroicons-solid' | 'heroicons-outline';

// Icon interface used by components
export interface IconProps {
  icon: string;
  type?: IconType;
  size?: number;
  className?: string;
}

// Icon component that renders the appropriate icon based on type
export const Icon: React.FC<IconProps> = ({ 
  icon, 
  type = 'heroicons-solid', 
  size = 16,
  className = '' 
}) => {
  // Heroicons Solid version handling
  if (type === 'heroicons-solid') {
    const HeroIcon = (HeroiconsSolid as any)[icon];
    if (HeroIcon) {
      return <HeroIcon width={size} height={size} className={className} />;
    }
  }

  // Heroicons Outline version handling
  if (type === 'heroicons-outline') {
    const HeroIcon = (HeroiconsOutline as any)[icon];
    if (HeroIcon) {
      return <HeroIcon width={size} height={size} className={className} />;
    }
  }

  // Fallback: if no icon found
  console.warn(`Icon not found: ${icon} with type ${type}`);
  return <HeroiconsSolid.QuestionMarkCircleIcon width={size} height={size} className={className} />;
};

// Helper function that returns all available icon names by type
export const getAvailableIcons = (type: IconType): string[] => {
  switch (type) {
    case 'heroicons-solid':
      return Object.keys(HeroiconsSolid);
    case 'heroicons-outline':
      return Object.keys(HeroiconsOutline);
    default:
      return [];
  }
};
