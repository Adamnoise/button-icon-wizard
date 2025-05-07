
import React from 'react';
import * as LucideIcons from 'lucide-react';
import * as HeroiconsSolid from '@heroicons/react/24/solid';
import * as HeroiconsOutline from '@heroicons/react/24/outline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as FaIcons from '@fortawesome/free-solid-svg-icons';
import * as MuiIcons from '@mui/icons-material';

// Támogatott ikontípusok
export type IconType = 'lucide' | 'heroicons-solid' | 'heroicons-outline' | 'fontawesome' | 'material';

// Az ikon interfész amit a komponensek használnak
export interface IconProps {
  icon: string;
  type?: IconType;
  size?: number;
  className?: string;
}

// Ikon komponens, ami a megfelelő ikont rendereli a típus alapján
export const Icon: React.FC<IconProps> = ({ 
  icon, 
  type = 'lucide', 
  size = 16,
  className = '' 
}) => {
  // Lucide ikonok kezelése
  if (type === 'lucide') {
    const LucideIcon = (LucideIcons as any)[icon];
    if (LucideIcon) {
      return <LucideIcon size={size} className={className} />;
    }
  }

  // Heroicons Solid változat kezelése
  if (type === 'heroicons-solid') {
    const HeroIcon = (HeroiconsSolid as any)[icon];
    if (HeroIcon) {
      return <HeroIcon width={size} height={size} className={className} />;
    }
  }

  // Heroicons Outline változat kezelése
  if (type === 'heroicons-outline') {
    const HeroIcon = (HeroiconsOutline as any)[icon];
    if (HeroIcon) {
      return <HeroIcon width={size} height={size} className={className} />;
    }
  }

  // FontAwesome ikonok kezelése
  if (type === 'fontawesome') {
    // A FontAwesome nevek camelCase-ből kebab-case-be konvertálása
    const faIconName = `fa${icon
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .toLowerCase()}`;

    if ((FaIcons as any)[faIconName]) {
      return <FontAwesomeIcon icon={(FaIcons as any)[faIconName]} className={className} style={{ width: size, height: size }} />;
    }
  }

  // Material UI ikonok kezelése
  if (type === 'material') {
    const MaterialIcon = (MuiIcons as any)[icon];
    if (MaterialIcon) {
      return <MaterialIcon sx={{ width: size, height: size }} className={className} />;
    }
  }

  // Fallback: ha nem talált ikont
  console.warn(`Icon not found: ${icon} with type ${type}`);
  return <LucideIcons.HelpCircle size={size} className={className} />;
};

// Segédfüggvény, ami az összes elérhető ikonnevet visszaadja típus szerint
export const getAvailableIcons = (type: IconType): string[] => {
  switch (type) {
    case 'lucide':
      return Object.keys(LucideIcons).filter(key => typeof LucideIcons[key as keyof typeof LucideIcons] === 'function');
    case 'heroicons-solid':
    case 'heroicons-outline':
      return Object.keys(type === 'heroicons-solid' ? HeroiconsSolid : HeroiconsOutline);
    case 'fontawesome':
      return Object.keys(FaIcons)
        .filter(key => key.startsWith('fa'))
        .map(key => {
          // kebab-case-ből camelCase konvertálás
          const withoutFa = key.slice(2);
          return withoutFa
            .split('-')
            .map((part, index) => {
              if (index === 0) return part;
              return part.charAt(0).toUpperCase() + part.slice(1);
            })
            .join('');
        });
    case 'material':
      return Object.keys(MuiIcons);
    default:
      return [];
  }
};
