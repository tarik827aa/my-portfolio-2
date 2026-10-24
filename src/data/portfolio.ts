/**
 * ============================================================================
 * PORTFOLIO DATA & JSON CONTENT LOADER (`src/data/portfolio.ts`)
 * ============================================================================
 * Routine updates to the 3 Video Sections and 4 Photo Sections are managed in:
 *   -> `src/data/content.json`
 *
 * This file loads `src/data/content.json`, filters out unpublished items
 * (`published: false`), sorts items consistently (newest `publishDate` first
 * unless an explicit `displayOrder` is provided), and maps them into the
 * portfolio's 7 sections while preserving all existing artwork and styling.
 * ============================================================================
 */

import rawContentJson from './content.json';

export type AlbumCategory =
  | 'all'
  | 'book-reviews'
  | 'insights'
  | 'campus-promo'
  | 'achievements'
  | 'seminars'
  | 'tours'
  | 'personal';

export type VideoSectionKey = 'insights' | 'book-reviews' | 'campus-promo';
export type PhotoSectionKey = 'achievements' | 'seminars' | 'tours' | 'personal';

export interface RawVideoContentItem {
  id: string;
  title: string;
  videoUrl: string;
  platform?: string;
  description: string;
  thumbnail?: string;
  publishDate?: string;
  displayOrder?: number;
  published?: boolean;
  badge?: string;
  tools?: string;
}

export interface RawPhotoContentItem {
  id: string;
  image: string;
  title: string;
  description?: string;
  publishDate?: string;
  displayOrder?: number;
  published?: boolean;
  badge?: string;
  tools?: string;
}

export interface RawSectionConfig<T> {
  sectionId: string;
  title: string;
  filterLabel?: string;
  badge: string;
  summary: string;
  defaultTools: string;
  items: T[];
}

export interface ContentJsonSchema {
  videoSections: Record<VideoSectionKey, RawSectionConfig<RawVideoContentItem>>;
  photoSections: Record<PhotoSectionKey, RawSectionConfig<RawPhotoContentItem>>;
}

export interface HighlightStripItem {
  id: string;
  title: string;
  subtitle: string;
  accentColor: 'indigo' | 'emerald' | 'purple' | 'sky';
}

export interface RoleCredentialItem {
  id: string;
  title: string;
  org: string;
  category: string;
  period: string;
  summary: string;
  bullets: string[];
  isPrimary?: boolean;
}

export interface ClubLeadershipCardItem {
  id: string;
  org: string;
  period: string;
  title: string;
  summary: string;
  bullets: string[];
  accentTone: 'indigo' | 'sky' | 'teal';
}

export interface OrganizedEventItem {
  id: string;
  title: string;
  tag: string;
  desc: string;
  accentTone: 'indigo' | 'violet' | 'teal' | 'navy';
}

export interface WorkExperienceCardItem {
  id: string;
  org: string;
  period: string;
  title: string;
  summary: string;
  accentTone: 'teal' | 'indigo';
}

export interface CertifiedTrainingItem {
  id: string;
  periodBadge: string;
  title: string;
  skills: string;
  accentTone: 'teal' | 'indigo';
}

export interface ExtraCurricularItem {
  name: string;
  type: string;
  accentTone: 'indigo' | 'navy' | 'teal' | 'violet';
}

export interface IndustrialVisitItem {
  company: string;
  year: string;
  focus: string;
}

export interface StrengthItem {
  id: string;
  title: string;
  detail: string;
}

export interface AlbumItem {
  id: string;
  category: Exclude<AlbumCategory, 'all'>;
  subCategory?: string;
  mediaType: 'video' | 'photo';
  accentTheme: 'indigo' | 'violet' | 'rose' | 'amber' | 'emerald' | 'sky' | 'teal';
  badge: string;
  title: string;
  description: string;
  tools: string;
  mediaUrl: string;
  posterUrl: string;
  platformLabel?: string;
  publishDate?: string;
  displayOrder?: number;
  published?: boolean;
}

export interface ProjectItem {
  id: string;
  category: string;
  title: string;
  summary: string;
  tags: string[];
  deliverables: string[];
  impact: string;
  image?: string;
  link?: string;
}

export interface PortfolioData {
  hero: {
    badgeText: string;
    greeting: string;
    name: string;
    taglinePart1: string;
    highlight1: string;
    taglinePart2: string;
    highlight2: string;
    coverImage: string;
    cvFileUrl: string;
  };
  highlightStrip: HighlightStripItem[];
  about: {
    kicker: string;
    headline: string;
    paragraph: string;
    extendedNarrative: string;
    fullName: string;
    academicBase: string;
    coreFocus: string;
    location: string;
    availability: string;
    strengths: StrengthItem[];
  };
  albums: AlbumItem[];
  cv: {
    leadership: RoleCredentialItem[];
    clubRoles?: ClubLeadershipCardItem[];
    organizedEvents?: OrganizedEventItem[];
    workExperience?: WorkExperienceCardItem[];
    certifiedTrainings?: CertifiedTrainingItem[];
    extraCurriculars?: ExtraCurricularItem[];
    industrialVisits?: IndustrialVisitItem[];
    education: {
      degree: string;
      institution: string;
      status: string;
      summary: string;
      modules: string[];
      researchFocus: string;
    };
    creativeSkills: string[];
    engineeringSkills: string[];
  };
  projects: ProjectItem[];
  contact: {
    kicker: string;
    headline: string;
    description: string;
    email: string;
    whatsappUrl: string;
    linkedinUrl: string;
    facebookUrl: string;
    instagramUrl?: string;
    formspreeUrl: string;
  };
}

/**
 * Default 3D Studio Artwork & Hero Portrait paths
 */
export const STUDIO_ARTWORK = {
  cover: '/assets/aistudio/Screenshot_2026-10-23_at_12.45.51_AM_2367259b.png',
  bookReviews: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
      <defs>
        <linearGradient id="brBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#EEF2FF"/>
          <stop offset="50%" stop-color="#E0E7FF"/>
          <stop offset="100%" stop-color="#ECFDF5"/>
        </linearGradient>
        <linearGradient id="brL" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4F46E5"/>
          <stop offset="100%" stop-color="#312E81"/>
        </linearGradient>
        <linearGradient id="brR" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#818CF8"/>
          <stop offset="100%" stop-color="#4F46E5"/>
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#brBg)"/>
      <circle cx="400" cy="225" r="190" fill="#4F46E5" opacity="0.08"/>
      <ellipse cx="400" cy="340" rx="135" ry="30" fill="#4F46E5" opacity="0.14"/>
      <ellipse cx="400" cy="225" rx="180" ry="68" fill="none" stroke="#6366F1" stroke-width="2" stroke-dasharray="8 6" opacity="0.55"/>
      <g transform="translate(300, 95)">
        <polygon points="100,20 195,65 100,110 5,65" fill="#FFFFFF" stroke="#4F46E5" stroke-width="2.5"/>
        <polygon points="5,65 100,110 100,210 5,165" fill="url(#brL)"/>
        <polygon points="195,65 100,110 100,210 195,165" fill="url(#brR)"/>
        <polygon points="100,42 162,72 100,102 38,72" fill="#E0E7FF"/>
        <line x1="100" y1="110" x2="100" y2="210" stroke="#FFFFFF" stroke-width="3"/>
      </g>
    </svg>
  `)}`,
  insights: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
      <defs>
        <linearGradient id="inBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F5F3FF"/>
          <stop offset="50%" stop-color="#EDE9FE"/>
          <stop offset="100%" stop-color="#ECFEFF"/>
        </linearGradient>
        <linearGradient id="inL" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#7C3AED"/>
          <stop offset="100%" stop-color="#4C1D95"/>
        </linearGradient>
        <linearGradient id="inR" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#06B6D4"/>
          <stop offset="100%" stop-color="#4F46E5"/>
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#inBg)"/>
      <circle cx="400" cy="225" r="190" fill="#7C3AED" opacity="0.08"/>
      <ellipse cx="400" cy="345" rx="130" ry="28" fill="#7C3AED" opacity="0.14"/>
      <ellipse cx="400" cy="225" rx="185" ry="70" fill="none" stroke="#8B5CF6" stroke-width="2" stroke-dasharray="7 5" opacity="0.6"/>
      <g transform="translate(300, 90)">
        <polygon points="100,15 185,115 100,155" fill="url(#inR)"/>
        <polygon points="100,15 15,115 100,155" fill="url(#inL)"/>
        <polygon points="15,115 100,220 100,155" fill="#5B21B6"/>
        <polygon points="185,115 100,220 100,155" fill="#0284C7"/>
        <circle cx="100" cy="15" r="7" fill="#FFFFFF"/>
        <circle cx="185" cy="115" r="6" fill="#38BDF8"/>
        <circle cx="15" cy="115" r="6" fill="#C4B5FD"/>
      </g>
    </svg>
  `)}`,
  campusPromo: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
      <defs>
        <linearGradient id="cpBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFF1F2"/>
          <stop offset="50%" stop-color="#FFE4E6"/>
          <stop offset="100%" stop-color="#EEF2FF"/>
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#cpBg)"/>
      <circle cx="400" cy="225" r="190" fill="#E11D48" opacity="0.07"/>
      <ellipse cx="400" cy="340" rx="135" ry="28" fill="#E11D48" opacity="0.14"/>
      <ellipse cx="400" cy="225" rx="180" ry="66" fill="none" stroke="#F43F5E" stroke-width="2" stroke-dasharray="8 6" opacity="0.5"/>
      <g transform="translate(300, 95)">
        <polygon points="100,25 190,70 100,115 10,70" fill="#FFFFFF" stroke="#E11D48" stroke-width="2.5"/>
        <polygon points="10,70 100,115 100,205 10,160" fill="#BE123C"/>
        <polygon points="190,70 100,115 100,205 190,160" fill="#4F46E5"/>
        <polygon points="86,54 126,70 86,86" fill="#E11D48"/>
      </g>
    </svg>
  `)}`,
  achievements: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
      <defs>
        <linearGradient id="acBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFFBEB"/>
          <stop offset="50%" stop-color="#FEF3C7"/>
          <stop offset="100%" stop-color="#EEF2FF"/>
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#acBg)"/>
      <circle cx="400" cy="225" r="185" fill="#D97706" opacity="0.08"/>
      <ellipse cx="400" cy="345" rx="130" ry="28" fill="#D97706" opacity="0.16"/>
      <g transform="translate(300, 90)">
        <polygon points="100,125 182,162 100,198 18,162" fill="#FDE68A" stroke="#D97706" stroke-width="2"/>
        <polygon points="18,162 100,198 100,235 18,198" fill="#B45309"/>
        <polygon points="182,162 100,198 100,235 182,198" fill="#F59E0B"/>
        <polygon points="100,18 120,58 164,65 132,96 140,140 100,118 60,140 68,96 36,65 80,58" fill="#F59E0B" stroke="#FFFFFF" stroke-width="3"/>
      </g>
    </svg>
  `)}`,
  seminars: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
      <defs>
        <linearGradient id="smBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ECFDF5"/>
          <stop offset="50%" stop-color="#D1FAE5"/>
          <stop offset="100%" stop-color="#EEF2FF"/>
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#smBg)"/>
      <circle cx="400" cy="225" r="185" fill="#059669" opacity="0.08"/>
      <ellipse cx="400" cy="345" rx="135" ry="28" fill="#059669" opacity="0.15"/>
      <g transform="translate(300, 90)">
        <polygon points="100,140 190,178 100,215 10,178" fill="#A7F3D0" stroke="#059669" stroke-width="2"/>
        <polygon points="62,36 100,54 62,72 24,54" fill="#6EE7B7"/>
        <polygon points="24,54 62,72 62,172 24,154" fill="#047857"/>
        <polygon points="100,54 62,72 62,172 100,154" fill="#10B981"/>
        <polygon points="138,60 176,78 138,96 100,78" fill="#C7D2FE"/>
        <polygon points="100,78 138,96 138,178 100,160" fill="#4338CA"/>
        <polygon points="176,78 138,96 138,178 176,160" fill="#6366F1"/>
      </g>
    </svg>
  `)}`,
  tours: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
      <defs>
        <linearGradient id="trBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F0F9FF"/>
          <stop offset="50%" stop-color="#E0F2FE"/>
          <stop offset="100%" stop-color="#ECFDF5"/>
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#trBg)"/>
      <circle cx="400" cy="225" r="185" fill="#0284C7" opacity="0.08"/>
      <ellipse cx="400" cy="345" rx="135" ry="28" fill="#0284C7" opacity="0.15"/>
      <g transform="translate(300, 90)">
        <polygon points="100,150 192,186 100,220 8,186" fill="#BAE6FD" stroke="#0284C7" stroke-width="2"/>
        <polygon points="72,38 135,172 12,172" fill="#0284C7"/>
        <polygon points="72,38 135,172 72,172" fill="#38BDF8"/>
        <polygon points="135,68 188,172 82,172" fill="#0D9488"/>
        <polygon points="135,68 188,172 135,172" fill="#2DD4BF"/>
        <circle cx="156" cy="44" r="18" fill="#FBBF24"/>
      </g>
    </svg>
  `)}`,
  personal: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
      <defs>
        <linearGradient id="peBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F0FDFA"/>
          <stop offset="50%" stop-color="#CCFBF1"/>
          <stop offset="100%" stop-color="#EEF2FF"/>
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#peBg)"/>
      <circle cx="400" cy="225" r="185" fill="#0D9488" opacity="0.08"/>
      <ellipse cx="400" cy="345" rx="135" ry="28" fill="#0D9488" opacity="0.15"/>
      <g transform="translate(300, 90)">
        <rect x="24" y="42" width="120" height="135" rx="22" transform="rotate(-8 84 110)" fill="#E0E7FF" stroke="#4F46E5" stroke-width="2.5"/>
        <rect x="52" y="36" width="124" height="140" rx="22" transform="rotate(6 114 106)" fill="#FFFFFF" stroke="#0D9488" stroke-width="2.5"/>
        <circle cx="114" cy="106" r="36" fill="#0F766E"/>
        <circle cx="114" cy="106" r="18" fill="#5EEAD4"/>
        <circle cx="125" cy="95" r="6" fill="#FFFFFF"/>
      </g>
    </svg>
  `)}`,
};

const contentJson = rawContentJson as ContentJsonSchema;

/**
 * Category Metadata for the 3 Video Categories & 4 Photo Album Categories
 * Synchronized with `src/data/content.json`.
 */
export const CATEGORY_METADATA: Record<
  Exclude<AlbumCategory, 'all'>,
  {
    label: string;
    badge: string;
    summary: string;
    defaultMediaType: 'video' | 'photo';
    accentTheme: AlbumItem['accentTheme'];
    defaultTools: string;
    defaultPoster: string;
    defaultSubCategories: string[];
  }
> = {
  insights: {
    label: contentJson.videoSections.insights.title,
    badge: contentJson.videoSections.insights.badge,
    summary: contentJson.videoSections.insights.summary,
    defaultMediaType: 'video',
    accentTheme: 'violet',
    defaultTools: contentJson.videoSections.insights.defaultTools,
    defaultPoster: STUDIO_ARTWORK.insights,
    defaultSubCategories: ['Career & Skills', 'Storytelling', 'Analytical Insights'],
  },
  'book-reviews': {
    label: contentJson.videoSections['book-reviews'].title,
    badge: contentJson.videoSections['book-reviews'].badge,
    summary: contentJson.videoSections['book-reviews'].summary,
    defaultMediaType: 'video',
    accentTheme: 'indigo',
    defaultTools: contentJson.videoSections['book-reviews'].defaultTools,
    defaultPoster: STUDIO_ARTWORK.bookReviews,
    defaultSubCategories: ['Book Review Reels', 'Self-Improvement', 'Habit & Productivity'],
  },
  'campus-promo': {
    label: contentJson.videoSections['campus-promo'].title,
    badge: contentJson.videoSections['campus-promo'].badge,
    summary: contentJson.videoSections['campus-promo'].summary,
    defaultMediaType: 'video',
    accentTheme: 'rose',
    defaultTools: contentJson.videoSections['campus-promo'].defaultTools,
    defaultPoster: STUDIO_ARTWORK.campusPromo,
    defaultSubCategories: ['Event Trailers', 'Career Club BTEC', 'Campus Highlights'],
  },
  achievements: {
    label: contentJson.photoSections.achievements.title,
    badge: contentJson.photoSections.achievements.badge,
    summary: contentJson.photoSections.achievements.summary,
    defaultMediaType: 'photo',
    accentTheme: 'amber',
    defaultTools: contentJson.photoSections.achievements.defaultTools,
    defaultPoster: STUDIO_ARTWORK.achievements,
    defaultSubCategories: [
      'Crests & Honors',
      'Certificates',
      'Executive Recognition',
      'Competition Trophies',
    ],
  },
  seminars: {
    label: contentJson.photoSections.seminars.title,
    badge: contentJson.photoSections.seminars.badge,
    summary: contentJson.photoSections.seminars.summary,
    defaultMediaType: 'photo',
    accentTheme: 'emerald',
    defaultTools: contentJson.photoSections.seminars.defaultTools,
    defaultPoster: STUDIO_ARTWORK.seminars,
    defaultSubCategories: [
      'BGMEA Bhaban',
      'BTEC Workshops',
      'National Conferences',
      'Youth Forums',
    ],
  },
  tours: {
    label: contentJson.photoSections.tours.title,
    badge: contentJson.photoSections.tours.badge,
    summary: contentJson.photoSections.tours.summary,
    defaultMediaType: 'photo',
    accentTheme: 'sky',
    defaultTools: contentJson.photoSections.tours.defaultTools,
    defaultPoster: STUDIO_ARTWORK.tours,
    defaultSubCategories: [
      'Group Expeditions',
      'Industrial Tours',
      'Nature & Travel',
      'Club Outings',
    ],
  },
  personal: {
    label: contentJson.photoSections.personal.title,
    badge: contentJson.photoSections.personal.badge,
    summary: contentJson.photoSections.personal.summary,
    defaultMediaType: 'photo',
    accentTheme: 'teal',
    defaultTools: contentJson.photoSections.personal.defaultTools,
    defaultPoster: STUDIO_ARTWORK.personal,
    defaultSubCategories: [
      'Portraits',
      'Creative Workspace',
      'Campus Life',
      'Candid Moments',
    ],
  },
};

/**
 * Sorts section items consistently:
 * 1. If both items have an explicit numeric `displayOrder` and they differ, sort by `displayOrder` ascending.
 * 2. Otherwise (when adding new items with `publishDate` or when `displayOrder` is omitted/equal),
 *    sort by `publishDate` descending (newest first).
 */
export function sortSectionItems<
  T extends { displayOrder?: number; publishDate?: string }
>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const aHasOrder = typeof a.displayOrder === 'number' && Number.isFinite(a.displayOrder);
    const bHasOrder = typeof b.displayOrder === 'number' && Number.isFinite(b.displayOrder);

    if (aHasOrder && bHasOrder && a.displayOrder !== b.displayOrder) {
      return (a.displayOrder as number) - (b.displayOrder as number);
    }

    const aDate = a.publishDate ? Date.parse(a.publishDate) : NaN;
    const bDate = b.publishDate ? Date.parse(b.publishDate) : NaN;
    const aValidDate = !Number.isNaN(aDate);
    const bValidDate = !Number.isNaN(bDate);

    if (aValidDate && bValidDate && aDate !== bDate) {
      return bDate - aDate;
    }

    if (aHasOrder && !bHasOrder) return 1;
    if (!aHasOrder && bHasOrder) return -1;
    return 0;
  });
}

/**
 * Converts the structured `src/data/content.json` object into the normalized `AlbumItem[]`
 * list rendered by all 3 video sections and all 4 photo sections.
 */
export function buildAlbumsFromContentJson(schema: ContentJsonSchema): AlbumItem[] {
  const result: AlbumItem[] = [];

  const videoOrder: {
    key: VideoSectionKey;
    accentTheme: AlbumItem['accentTheme'];
    defaultPoster: string;
  }[] = [
    { key: 'insights', accentTheme: 'violet', defaultPoster: STUDIO_ARTWORK.insights },
    { key: 'book-reviews', accentTheme: 'indigo', defaultPoster: STUDIO_ARTWORK.bookReviews },
    { key: 'campus-promo', accentTheme: 'rose', defaultPoster: STUDIO_ARTWORK.campusPromo },
  ];

  for (const { key, accentTheme, defaultPoster } of videoOrder) {
    const section = schema.videoSections[key];
    if (!section || !Array.isArray(section.items)) continue;

    const publishedItems = section.items.filter((item) => item.published !== false);
    const sortedItems = sortSectionItems(publishedItems);

    sortedItems.forEach((item, index) => {
      const numLabel = String(index + 1).padStart(2, '0');
      result.push({
        id: item.id,
        category: key,
        mediaType: 'video',
        accentTheme,
        badge: item.badge || `${section.badge} · #${numLabel}`,
        title: item.title,
        description: item.description,
        tools: item.tools || section.defaultTools,
        mediaUrl: (item.videoUrl || '').trim(),
        posterUrl: (item.thumbnail || '').trim() || defaultPoster,
        platformLabel: item.platform || undefined,
        publishDate: item.publishDate,
        displayOrder: item.displayOrder,
        published: item.published ?? true,
      });
    });
  }

  const photoOrder: {
    key: PhotoSectionKey;
    accentTheme: AlbumItem['accentTheme'];
    defaultPoster: string;
  }[] = [
    { key: 'achievements', accentTheme: 'amber', defaultPoster: STUDIO_ARTWORK.achievements },
    { key: 'seminars', accentTheme: 'emerald', defaultPoster: STUDIO_ARTWORK.seminars },
    { key: 'tours', accentTheme: 'sky', defaultPoster: STUDIO_ARTWORK.tours },
    { key: 'personal', accentTheme: 'teal', defaultPoster: STUDIO_ARTWORK.personal },
  ];

  for (const { key, accentTheme, defaultPoster } of photoOrder) {
    const section = schema.photoSections[key];
    if (!section || !Array.isArray(section.items)) continue;

    const publishedItems = section.items.filter((item) => item.published !== false);
    const sortedItems = sortSectionItems(publishedItems);

    sortedItems.forEach((item, index) => {
      const numLabel = String(index + 1).padStart(2, '0');
      result.push({
        id: item.id,
        category: key,
        mediaType: 'photo',
        accentTheme,
        badge: item.badge || `${section.badge} · #${numLabel}`,
        title: item.title,
        description: item.description || '',
        tools: item.tools || section.defaultTools,
        mediaUrl: '',
        posterUrl: (item.image || '').trim() || defaultPoster,
        publishDate: item.publishDate,
        displayOrder: item.displayOrder,
        published: item.published ?? true,
      });
    });
  }

  return result;
}

/**
 * Main Portfolio Data Object
 * All 3 Video Sections and 4 Photo Sections are populated directly from `src/data/content.json`.
 */
export const PORTFOLIO_DATA: PortfolioData = {
  // 1. HERO SECTION & BANNER IMAGE
  hero: {
    badgeText: 'Available for Brand & Textile Collaborations',
    greeting: "Hi, I'm",
    name: 'Md. Tarikul Islam',
    taglinePart1: 'Bridging analytical precision in',
    highlight1: 'Wet Process Engineering',
    taglinePart2: 'with high-impact',
    highlight2: 'Content Creation, Video Production, and Creative Direction',
    coverImage: STUDIO_ARTWORK.cover,
    cvFileUrl: '/assets/aistudio/cv_775afd60.pdf',
  },

  // 2. FLOATING 4-COLUMN HIGHLIGHT STRIP
  highlightStrip: [
    {
      id: 'hl-1',
      title: 'Undergraduate',
      subtitle: 'Wet Process Eng. (BTEC)',
      accentColor: 'indigo',
    },
    {
      id: 'hl-2',
      title: 'Content Creator',
      subtitle: 'Self Improvement & Insights',
      accentColor: 'emerald',
    },
    {
      id: 'hl-3',
      title: 'Senior Executive',
      subtitle: 'Creative Affairs Wing · Career Club BTEC',
      accentColor: 'purple',
    },
    {
      id: 'hl-4',
      title: 'Campus Ambassador',
      subtitle: 'Textile Engineers Association',
      accentColor: 'sky',
    },
  ],

  // 3. ABOUT & ACADEMIC INFORMATION
  about: {
    kicker: 'Academics Narrative',
    headline: 'About My Academics Details',
    paragraph:
      'I am an undergraduate student specializing in Wet Process Engineering at Barishal Textile Engineering College (BTEC) and a dedicated Content Creator focusing on self-improvement, book reviews, and practical skills. Alongside technical laboratory research, I lead graphic communications and edit high-retention video content.',
    extendedNarrative:
      'By combining rigorous textile chemical processing foundations with digital storytelling and creative direction, I approach every visual project with structured engineering discipline—from high-retention Final Cut Pro video essays to organizational campaign systems.',
    fullName: 'Md. Tarikul Islam',
    academicBase: 'BTEC, Barishal',
    coreFocus: 'Content, Video & Textiles',
    location: 'Bangladesh',
    availability: 'Open to Projects',
    strengths: [
      {
        id: 'str-1',
        title: 'Content Creation & Visual Storytelling',
        detail:
          'Scripting and producing insightful videos on self-improvement, book reviews, and skill development with high audience retention.',
      },
      {
        id: 'str-4',
        title: 'Textile Wet Processing & Tech Docs',
        detail:
          'Pretreatment, dyeing & printing analysis, sustainable chemical processing, and automated technical PDF generation with Python WeasyPrint.',
      },
    ],
  },

  // 4. VIDEO REELS & PHOTO ALBUMS (LOADED DIRECTLY FROM `src/data/content.json`)
  albums: buildAlbumsFromContentJson(contentJson),

  // 5. CV, LEADERSHIP, WORK EXPERIENCE, WORKSHOPS & INDUSTRIAL VISITS
  cv: {
    leadership: [
      {
        id: 'role-ccb',
        title: 'Senior Executive at CCB — Creative Affairs Wing (Sr. Executive)',
        org: 'Career Club BTEC - CCB',
        category: 'Co-Curricular Leadership',
        period: '2026 – Present',
        summary:
          'Leading creative direction, event branding, poster & banner design, and organizing flagship campus workshops and competitions under the Creative Affairs Wing at Career Club BTEC (CCB).',
        bullets: [
          'Contributed in Organizing CCB Event: Textile Olympiad 2.0',
          'Contributed in Organizing CCB Event: Textile Presentation Competition 2025 & 2026',
          'Contributed in Organizing CCB Event: From BTEC to World Workshop',
          'Contributed in Organizing CCB Workshops: CV Writing Workshop, Anchoring Workshop & IT Skill Workshop',
        ],
        isPrimary: true,
      },
      {
        id: 'role-tea',
        title: 'Campus Ambassador & Asst. Co-ordinator of IT',
        org: 'Textile Engineers Association (TEA)',
        category: 'Co-Curricular Leadership',
        period: '2026 – Present',
        summary:
          'Serving as Campus Ambassador and Asst. Co-ordinator of IT, managing digital communications and technical outreach for the Textile Engineers Association (TEA) at Barishal Textile Engineering College.',
        bullets: [
          'Represent BTEC as Campus Ambassador for national TEA seminars, olympiads, and networking sessions.',
          'Manage digital communication channels, IT skill support, and online event infrastructure.',
        ],
      },
      {
        id: 'role-debate',
        title: 'Asst. Training & Workshop Secretary',
        org: 'BTEC Debating Club',
        category: 'Co-Curricular Leadership',
        period: '2026 – Present',
        summary:
          'Organizing public speaking, debate training sessions, and constructive communication workshops for campus debaters and students at BTEC.',
        bullets: [
          'Facilitate structured debate workshops, public speaking drills, and anchoring training sessions.',
          'Mentor students in logical argumentation, stage presence, and presentation skills.',
        ],
      },
      {
        id: 'role-eduledge',
        title: 'Founder & Physics Instructor',
        org: 'Eduledge (Academic Initiative)',
        category: 'Work Experience & Initiative',
        period: '2023 – 2025',
        summary:
          'Founded and led Eduledge, delivering structured Physics instruction, academic mentorship, and educational content for students.',
        bullets: [
          'Founded and managed academic operations, curriculum planning, and student mentoring.',
          'Conducted interactive Physics classes and analytical problem-solving sessions.',
        ],
      },
      {
        id: 'role-polytechnic',
        title: 'Physics Instructor - NonTech (Part Time)',
        org: 'Barishal Govt. Polytechnic Institute',
        category: 'Work Experience',
        period: '2025',
        summary:
          'Served as Part-Time Physics Instructor (Non-Tech Department) at Barishal Govt. Polytechnic Institute, teaching core physics concepts and laboratory applications.',
        bullets: [
          'Delivered lectures and practical demonstrations in Physics for diploma engineering students.',
          'Guided student assessments, analytical problem solving, and technical comprehension.',
        ],
      },
    ],
    clubRoles: [
      {
        id: 'role-ccb',
        org: 'Career Club BTEC - CCB',
        period: '2026 – Present',
        title: 'Sr. Executive — Creative Affairs Wing',
        summary:
          "Spearheading creative affairs, event visual identity, promotional banners, and workshop coordination for BTEC's premier career development organization.",
        bullets: [
          'Lead visual direction and promotional banner systems for flagship CCB events and workshops.',
          'Contributed in organizing Textile Olympiad 2.0, Presentation Competitions (2025 & 2026), and skill workshops.',
        ],
        accentTone: 'indigo',
      },
      {
        id: 'role-tea',
        org: 'Textile Engineers Association (TEA)',
        period: '2026 – Present',
        title: 'Campus Ambassador & Asst. Co-ordinator of IT',
        summary:
          'Serving as Campus Ambassador and Asst. Co-ordinator of IT, managing digital outreach, IT coordination, and technical event systems connecting BTEC students with national textile engineering networks.',
        bullets: [
          'Represent BTEC as Campus Ambassador across national textile engineering seminars and programs.',
          'Coordinate IT operations, digital communication channels, and online event workflows.',
        ],
        accentTone: 'sky',
      },
      {
        id: 'role-debate',
        org: 'BTEC Debating Club',
        period: '2026 – Present',
        title: 'Asst. Training & Workshop Secretary',
        summary:
          'Organizing debate workshops, public speaking training sessions, and constructive communication drills for campus speakers and debaters.',
        bullets: [
          'Arrange structured debate workshops, anchoring sessions, and public speaking training.',
          'Guide students in logical argumentation, stage presentation, and constructive communication.',
        ],
        accentTone: 'teal',
      },
    ],
    organizedEvents: [
      {
        id: 'ev-1',
        title: 'Textile Olympiad 2.0',
        tag: 'National Olympiad',
        desc: 'Flagship textile knowledge competition, student registration campaign & campus showcase.',
        accentTone: 'indigo',
      },
      {
        id: 'ev-2',
        title: 'Textile Presentation Competition 2025 & 2026',
        tag: '2025 & 2026',
        desc: 'Consecutive annual presentation, slide design & public speaking championship at BTEC.',
        accentTone: 'violet',
      },
      {
        id: 'ev-3',
        title: 'From BTEC to World Workshop',
        tag: 'Global Career',
        desc: 'Higher study, international scholarship & global textile career pathway seminar.',
        accentTone: 'teal',
      },
      {
        id: 'ev-4',
        title: 'CV Writing Workshop',
        tag: 'Career Readiness',
        desc: 'Practical resume building, ATS formatting & corporate profile structuring workshop.',
        accentTone: 'navy',
      },
      {
        id: 'ev-5',
        title: 'Anchoring Workshop',
        tag: 'Stage & Voice',
        desc: 'Stage hosting, script delivery, vocal modulation & audience engagement training.',
        accentTone: 'violet',
      },
      {
        id: 'ev-6',
        title: 'IT Skill Workshop',
        tag: 'Digital Literacy',
        desc: 'Essential software, presentation design & digital productivity workflow training.',
        accentTone: 'teal',
      },
    ],
    workExperience: [
      {
        id: 'work-eduledge',
        org: 'Eduledge · Academic Initiative',
        period: '2023 – 2025',
        title: 'Founder & Physics Instructor',
        summary:
          'Founded and directed Eduledge, designing structured curriculum, mentoring students, and delivering clear, concept-driven Physics instruction.',
        accentTone: 'teal',
      },
      {
        id: 'work-polytechnic',
        org: 'Barishal Govt. Polytechnic Institute',
        period: '2025',
        title: 'Physics Instructor — NonTech (Part Time)',
        summary:
          'Instructed diploma engineering cohorts in core Physics principles, analytical problem-solving, and practical laboratory sessions.',
        accentTone: 'indigo',
      },
    ],
    certifiedTrainings: [
      {
        id: 'train-spoken',
        periodBadge: '2026 · 3 Months Course',
        title: "Adult Spoken Course — Kabbo's English Point",
        skills: 'Skills: Fluency in Speaking, Public Speaking',
        accentTone: 'teal',
      },
      {
        id: 'train-edge',
        periodBadge: '2025 · 60 Hours Course',
        title: 'Graphic Design Course — EDGE',
        skills: 'Skills: Graphic Design, Poster & Banner Design',
        accentTone: 'indigo',
      },
    ],
    extraCurriculars: [
      { name: 'Public Speaking', type: 'Stage & Oratory', accentTone: 'indigo' },
      { name: 'Anchoring', type: 'Event Hosting', accentTone: 'navy' },
      { name: 'Volunteer', type: 'Community Service', accentTone: 'teal' },
      { name: 'Humanitarian Work', type: 'Social Impact', accentTone: 'teal' },
      { name: 'Content Writing', type: 'Creative Media', accentTone: 'violet' },
      { name: 'Chess', type: 'Strategy Mind Sport', accentTone: 'indigo' },
      { name: 'Carrom', type: 'Indoor Sport', accentTone: 'navy' },
      { name: 'Badminton', type: 'Outdoor / Court', accentTone: 'indigo' },
    ],
    industrialVisits: [
      { company: 'NZ DENIM LIMITED', year: '2026', focus: 'Denim Wet Processing' },
      { company: 'Zaber & Zubair Fabrics Ltd.', year: '2025', focus: 'Dyeing & Finishing' },
      { company: 'Masco Group', year: '2024', focus: 'Knit Composite Floor' },
      { company: 'Mamun Group, Faridpur', year: '2024', focus: 'Spinning Operations' },
    ],
    education: {
      degree: 'B.Sc. in Textile Engineering (Wet Process)',
      institution: 'Barishal Textile Engineering College (BTEC), Barishal',
      status: '2023 – Present · CGPA 3.61 / 4.00 (Till 3rd Semester)',
      summary:
        'Pursuing B.Sc. in Textile Engineering at Barishal Textile Engineering College (CGPA 3.61/4.00 till 3rd Semester), backed by HSC (GPA 4.83/5.00, 2023) and SSC (GPA 5.00/5.00, 2020) from Gaokhali Secondary School and College.',
      modules: [
        'B.Sc. in Textile Engineering — Barishal Textile Engineering College (CGPA: 3.61 / 4.00)',
        'Higher Secondary School Certificate (HSC, 2023) — Gaokhali Secondary School & College (GPA: 4.83 / 5.00)',
        'Secondary School Certificate (SSC, 2020) — Gaokhali Secondary School & College (GPA: 5.00 / 5.00)',
        'Wet Processing, Pretreatment, Dyeing & Coloration Technology',
      ],
      researchFocus:
        'Industrial exposure across NZ DENIM LIMITED (2026), Zaber & Zubair Fabrics Ltd. (2025), Masco Group (2024), and Mamun Group, Faridpur (2024).',
    },
    creativeSkills: [
      'Public Speaking & Anchoring',
      'Graphic, Poster & Banner Design (EDGE)',
      'Canva Design & Visual Branding',
      'Content Writing & Video Production',
    ],
    engineeringSkills: [
      'Constructive Communication & Leadership',
      'Strategic Thinking & Solution Building',
      'Time, Event & Teamwork Management',
      'MS Word, Excel & PowerPoint',
    ],
  },

  // 6. PROJECTS
  projects: [
    {
      id: 'proj-content',
      category: 'Content Creation & Video Production',
      title: 'Self-Improvement, Book Reviews & Insights Series',
      summary:
        'Conceptualized, scripted, and produced a dedicated digital content series covering personal growth, actionable book reviews, and career skills—complete with custom Final Cut Pro motion graphics and cohesive visual branding.',
      tags: ['Content Strategy', 'Final Cut Pro', 'Visual Storytelling'],
      deliverables: [
        'High-Retention Video Essays on Self-Improvement & Productivity',
        'In-Depth Book Review Breakdowns & Visual Summaries',
        'Custom Motion Graphics Templates & Audio Mastering in Final Cut Pro',
        'Cohesive Social Media Cover & Thumbnail Design System',
      ],
      impact:
        'Built an engaging educational archive empowering students and young professionals with practical skills and insights.',
    },
    {
      id: 'proj-ccb',
      category: 'Event Marketing & Funnels',
      title: 'Career Club BTEC Event Campaigns',
      summary:
        'Designed digital registration forms, visual posters, and social media captions for campus-wide initiatives including the Textile Blitz writing competition and LinkedIn professional masterclasses.',
      tags: ['Campaign Copywriting', 'Visual Direction', 'Registration Funnels'],
      deliverables: [
        'Key Visual Posters & Social Banners for "Textile Blitz"',
        'Promotional Suite & Registration Funnel for "Mastering LinkedIn"',
        'Event Teaser Trailers & Countdown Motion Graphics',
        'Structured Google Workspace Registration & Participant Tracking',
      ],
      impact:
        'Elevated visual consistency and streamlined student registration across Career Club BTEC flagship events.',
    },
  ],

  // 7. CONTACT & SOCIAL MEDIA LINKS
  contact: {
    kicker: 'Direct Reachout',
    headline: "Let's build something exceptional.",
    description:
      'Whether you need content creation, high-tempo video editing, brand identity design, or a textile engineering collaboration—reach out anytime.',
    email: 'md.tarikulislam.engr@gmail.com',
    whatsappUrl: 'https://wa.me/8801319521982',
    linkedinUrl: 'https://linkedin.com',
    facebookUrl: 'https://www.facebook.com/tarik827a',
    instagramUrl: 'https://www.instagram.com/tarik827a',
    formspreeUrl: 'https://formspree.io/f/mnppazpq',
  },
};
