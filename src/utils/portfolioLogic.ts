import {
  AlbumCategory,
  HighlightStripItem,
  RoleCredentialItem,
  StrengthItem,
  AlbumItem,
  ProjectItem,
  PortfolioData,
  ContentJsonSchema,
  STUDIO_ARTWORK,
  CATEGORY_METADATA,
  PORTFOLIO_DATA,
  buildAlbumsFromContentJson,
  sortSectionItems,
} from '../data/portfolio';

export type {
  AlbumCategory,
  HighlightStripItem,
  RoleCredentialItem,
  StrengthItem,
  AlbumItem,
  ProjectItem,
  PortfolioData,
  ContentJsonSchema,
};

export {
  STUDIO_ARTWORK,
  CATEGORY_METADATA,
  PORTFOLIO_DATA,
  buildAlbumsFromContentJson,
  sortSectionItems,
};

export const DEFAULT_PORTFOLIO_DATA: PortfolioData = PORTFOLIO_DATA;

export type SocialPlatform = 'youtube' | 'facebook' | 'instagram' | 'direct-video' | 'none';

export interface ParsedSocialVideo {
  platform: SocialPlatform;
  embedUrl: string;
  thumbnailUrl?: string;
  originalUrl: string;
}

/**
 * Parses Facebook, YouTube, Instagram, or direct video links into embeddable URLs.
 */
export function parseSocialVideoUrl(rawUrl: string): ParsedSocialVideo {
  const url = (rawUrl || '').trim();
  if (!url) {
    return { platform: 'none', embedUrl: '', originalUrl: '' };
  }

  // 1. YouTube (watch?v=, youtu.be/, shorts/, embed/)
  const ytRegex =
    /(?:youtube\.com\/(?:watch\?.*v=|shorts\/|embed\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/i;
  const ytMatch = url.match(ytRegex);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      platform: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      originalUrl: url,
    };
  }

  // 2. Instagram (reel/, p/, tv/)
  const igRegex = /instagram\.com\/(reel|reels|p|tv)\/([A-Za-z0-9_-]+)/i;
  const igMatch = url.match(igRegex);
  if (igMatch && igMatch[2]) {
    const type = igMatch[1].toLowerCase() === 'reels' ? 'reel' : igMatch[1].toLowerCase();
    const shortcode = igMatch[2];
    return {
      platform: 'instagram',
      embedUrl: `https://www.instagram.com/${type}/${shortcode}/embed`,
      originalUrl: url,
    };
  }

  // 3. Facebook (facebook.com/.../videos/..., facebook.com/reel/..., facebook.com/watch, fb.watch/...)
  if (/(?:facebook\.com|fb\.watch)\//i.test(url)) {
    if (url.includes('facebook.com/plugins/video.php')) {
      return {
        platform: 'facebook',
        embedUrl: url,
        originalUrl: url,
      };
    }
    return {
      platform: 'facebook',
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
        url
      )}&show_text=false&width=560`,
      originalUrl: url,
    };
  }

  // 4. Direct video file or data URL
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url) || url.startsWith('data:video/')) {
    return {
      platform: 'direct-video',
      embedUrl: url,
      originalUrl: url,
    };
  }

  // Fallback if user pastes another https URL in a video item
  if (/^https?:\/\//i.test(url)) {
    if (url.includes('youtube') || url.includes('youtu.be')) {
      return { platform: 'youtube', embedUrl: url, originalUrl: url };
    }
    if (url.includes('instagram')) {
      return { platform: 'instagram', embedUrl: url, originalUrl: url };
    }
    if (url.includes('facebook') || url.includes('fb.watch')) {
      return {
        platform: 'facebook',
        embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
          url
        )}&show_text=false&width=560`,
        originalUrl: url,
      };
    }
    return {
      platform: 'direct-video',
      embedUrl: url,
      originalUrl: url,
    };
  }

  return { platform: 'none', embedUrl: '', originalUrl: url };
}

export function filterAlbumItems(items: AlbumItem[], category: AlbumCategory): AlbumItem[] {
  if (category === 'all') {
    return items;
  }
  return items.filter((item) => item.category === category);
}

export function updatePortfolioSection<K extends keyof PortfolioData>(
  data: PortfolioData,
  section: K,
  updatedValue: PortfolioData[K]
): PortfolioData {
  return {
    ...data,
    [section]: updatedValue,
  };
}

export interface ContactSubmissionInput {
  name: string;
  email: string;
  message: string;
}

export function validateContactSubmission(input: ContactSubmissionInput): {
  valid: boolean;
  error?: string;
} {
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();

  if (!name) {
    return { valid: false, error: 'Please enter your name.' };
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { valid: false, error: 'Please enter a valid email address.' };
  }
  if (!message || message.length < 5) {
    return { valid: false, error: 'Please write a message (at least 5 characters).' };
  }
  return { valid: true };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Generates the complete, standalone index.html file with a clean professional white background,
 * smooth cool gradients, the 4-column Quick Highlight Strip (with Content Creator),
 * and the bold expandable "Senior Executive at CCB" card in the CV section.
 */
export function generateStandaloneHtml(data: PortfolioData): string {
  const primaryRole = data.cv.leadership[0];
  const secondaryRoles = data.cv.leadership.slice(1);

  const colorMap: Record<HighlightStripItem['accentColor'], string> = {
    indigo: 'text-indigo-600',
    emerald: 'text-emerald-600',
    purple: 'text-violet-600',
    sky: 'text-sky-600',
  };

  const highlightStripHtml = data.highlightStrip
    .map(
      (item, idx) => `
      <div class="p-2 ${idx >= 2 ? 'pt-4 lg:pt-2' : ''}">
        <span class="block font-display font-extrabold text-lg md:text-2xl ${colorMap[item.accentColor]}">${escapeHtml(item.title)}</span>
        <span class="text-xs text-slate-500 mt-1 block font-medium">${escapeHtml(item.subtitle)}</span>
      </div>`
    )
    .join('\n');

  const secondaryRolesHtml = secondaryRoles
    .map(
      (role) => `
          <div class="rounded-2xl bg-slate-50/90 p-5 border border-slate-200/80">
            <div class="flex items-center justify-between text-xs text-indigo-600 font-semibold mb-1">
              <span>${escapeHtml(role.org)}</span>
              <span>${escapeHtml(role.category)} · ${escapeHtml(role.period)}</span>
            </div>
            <h4 class="font-display font-bold text-slate-900 text-base">${escapeHtml(role.title)}</h4>
            <p class="text-slate-600 text-xs mt-2 leading-relaxed">${escapeHtml(role.summary)}</p>
          </div>`
    )
    .join('\n');

  const albumsHtml = data.albums
    .map((item) => {
      if (item.mediaType === 'video') {
        const parsed = parseSocialVideoUrl(item.mediaUrl);
        let mediaFrameHtml = `<img src="${escapeHtml(item.posterUrl)}" alt="${escapeHtml(item.title)}" class="w-full h-full object-cover" />`;
        if (
          parsed.platform === 'youtube' ||
          parsed.platform === 'facebook' ||
          parsed.platform === 'instagram'
        ) {
          mediaFrameHtml = `<iframe src="${escapeHtml(parsed.embedUrl)}" title="${escapeHtml(item.title)}" class="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
        } else if (parsed.platform === 'direct-video') {
          mediaFrameHtml = `<video controls class="w-full h-full object-cover" poster="${escapeHtml(item.posterUrl)}"><source src="${escapeHtml(parsed.embedUrl)}" type="video/mp4"></video>`;
        }
        return `
        <div class="album-item bento-card rounded-3xl overflow-hidden flex flex-col justify-between" data-category="${escapeHtml(item.category)}">
          <div>
            <div class="relative aspect-video bg-slate-100 overflow-hidden">
              ${mediaFrameHtml}
            </div>
            <div class="p-5">
              <span class="text-xs font-semibold text-indigo-600">${escapeHtml(item.badge)}</span>
              <h3 class="font-display font-bold text-slate-900 text-base mt-1">${escapeHtml(item.title)}</h3>
              <p class="text-slate-600 text-xs mt-1">${escapeHtml(item.description)}</p>
            </div>
          </div>
          <div class="px-5 py-3 border-t border-slate-100 bg-slate-50/70 text-[11px] font-medium text-slate-500">
            ${escapeHtml(item.tools)}
          </div>
        </div>`;
      }
      return `
        <div class="album-item bento-card rounded-3xl overflow-hidden flex flex-col justify-between group cursor-pointer" data-category="${escapeHtml(item.category)}" onclick="openLightbox(this.querySelector('img').src, '${escapeHtml(item.title)}')">
          <div>
            <div class="relative aspect-video overflow-hidden bg-slate-100">
              <img src="${escapeHtml(item.posterUrl)}" alt="${escapeHtml(item.title)}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <div class="p-5">
              <span class="text-xs font-semibold text-indigo-600">${escapeHtml(item.badge)}</span>
              <h3 class="font-display font-bold text-slate-900 text-base mt-1">${escapeHtml(item.title)}</h3>
              <p class="text-slate-600 text-xs mt-1">${escapeHtml(item.description)}</p>
            </div>
          </div>
          <div class="px-5 py-3 border-t border-slate-100 bg-slate-50/70 text-[11px] font-medium text-slate-500">
            ${escapeHtml(item.tools)}
          </div>
        </div>`;
    })
    .join('\n');

  const projectsHtml = data.projects
    .map(
      (proj, idx) => `
        <div class="bento-card rounded-3xl p-7 flex flex-col justify-between cursor-pointer" onclick="toggleSectionDetail('proj-detail-${idx}', 'proj-chevron-${idx}')">
          <div>
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs font-semibold text-indigo-600">${escapeHtml(proj.category)}</span>
              <span class="text-xs text-slate-500 flex items-center gap-1 font-medium">Click for deliverables <i id="proj-chevron-${idx}" data-lucide="chevron-down" class="w-4 h-4 transition-transform duration-300"></i></span>
            </div>
            <h3 class="font-display text-xl font-bold text-slate-900 mt-3 mb-2">${escapeHtml(proj.title)}</h3>
            <p class="text-slate-600 text-sm leading-relaxed">${escapeHtml(proj.summary)}</p>
            <div id="proj-detail-${idx}" class="hidden mt-4 pt-4 border-t border-slate-200/80 space-y-2 text-xs text-slate-700">
              <p class="font-semibold text-slate-900">Key Deliverables &amp; Impact:</p>
              <ul class="list-disc pl-4 space-y-1 text-slate-600">
                ${proj.deliverables.map((d) => `<li>${escapeHtml(d)}</li>`).join('')}
              </ul>
              <p class="text-emerald-700 font-medium pt-1">${escapeHtml(proj.impact)}</p>
            </div>
          </div>
          <div class="mt-6 pt-4 border-t border-slate-200/70 flex flex-wrap gap-2 text-xs text-slate-500">
            ${proj.tags.map((t) => `<span>· ${escapeHtml(t)}</span>`).join(' ')}
          </div>
        </div>`
    )
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(data.hero.name)} | Portfolio, CV & Visual Archive</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
  <script src="https://unpkg.com/lucide@latest"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['DM Sans', 'sans-serif'],
            display: ['Plus Jakarta Sans', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <style>
    body {
      background-color: #FFFFFF;
      background-image:
        radial-gradient(circle at 50% 0%, rgba(248, 250, 252, 0.9) 0%, rgba(255, 255, 255, 1) 70%),
        radial-gradient(rgba(15, 23, 42, 0.045) 1px, transparent 1px),
        linear-gradient(to right, rgba(15, 23, 42, 0.022) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(15, 23, 42, 0.022) 1px, transparent 1px);
      background-size: 100% 100%, 28px 28px, 112px 112px, 112px 112px;
      color: #0F172A;
      overflow-x: hidden;
    }
    .glass-nav {
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif;
      letter-spacing: -0.014em;
      -webkit-font-smoothing: antialiased;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.72) 0%, rgba(255, 255, 255, 0.56) 100%);
      backdrop-filter: blur(14px) saturate(190%) contrast(104%);
      -webkit-backdrop-filter: blur(14px) saturate(190%) contrast(104%);
      border: 1px solid rgba(15, 23, 42, 0.09);
      box-shadow: 0 10px 30px -10px rgba(15, 23, 42, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.95), inset 0 -0.5px 0 0 rgba(255, 255, 255, 0.6);
    }
    .nav-link { position: relative; letter-spacing: -0.012em; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); white-space: nowrap; z-index: 1; }
    .nav-link::before {
      content: ''; position: absolute; inset: 0; border-radius: 9999px;
      background: rgba(15, 23, 42, 0.05);
      border: 1px solid rgba(15, 23, 42, 0.08);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
      opacity: 0; transform: scale(0.92); transition: all 0.2s ease; z-index: -1;
    }
    .nav-link:hover::before { opacity: 1; transform: scale(1); }
    .nav-link:hover { color: #1D1D1F; transform: translateY(-0.5px); }
    .bento-card {
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.96) 100%);
      border: 1px solid rgba(15, 23, 42, 0.08);
      box-shadow: 0 10px 30px -12px rgba(15, 23, 42, 0.06);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .bento-card:hover { transform: translateY(-4px); border-color: rgba(79, 70, 229, 0.35); box-shadow: 0 20px 40px -15px rgba(79, 70, 229, 0.14); }
  </style>
</head>
<body class="antialiased selection:bg-indigo-600 selection:text-white">

  <!-- FLOATING NAVBAR (APPLE EVENT ULTRA-CLEAR CRYSTAL GLASS) -->
  <header class="fixed top-3.5 inset-x-0 z-50 flex justify-center px-3">
    <nav class="glass-nav relative overflow-hidden rounded-full px-5 sm:px-7 py-2.5 flex flex-wrap items-center justify-between gap-3 sm:gap-8 max-w-4xl w-full">
      <span aria-hidden="true" class="pointer-events-none absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"></span>
      <a href="#home" class="text-[13px] md:text-[14px] font-semibold text-[#1D1D1F] hover:text-indigo-600 tracking-[-0.016em] whitespace-nowrap shrink-0">
        Home
      </a>
      <div class="flex items-center flex-wrap justify-center gap-1 sm:gap-3 text-[12.5px] md:text-[13.5px] text-[#1D1D1F]/80 font-medium tracking-[-0.012em]">
        <a href="#about" class="nav-link px-3 py-1 rounded-full">About</a>
        <a href="#cv" class="nav-link px-3 py-1 rounded-full">CV &amp; Resume</a>
        <a href="#albums" class="nav-link px-3 py-1 rounded-full">Albums &amp; Videos</a>
        <a href="#projects" class="nav-link px-3 py-1 rounded-full">Projects</a>
      </div>
      <a href="#contact" class="bg-[#1D1D1F] hover:bg-indigo-600 text-white text-[12.5px] md:text-[13px] font-medium tracking-[-0.012em] px-4 py-1.5 rounded-full transition shadow-sm whitespace-nowrap shrink-0">
        Let's Talk
      </a>
    </nav>
  </header>

  <!-- 1. FULL-WIDTH COVER BANNER WITH HERO TEXT OVERLAID DIRECTLY ON TOP OF THE LEFT SIDE -->
  <section id="home" class="relative z-10 w-full">
    <div class="relative w-full overflow-hidden bg-[#141824] min-h-[480px] sm:min-h-[520px] lg:min-h-[550px] flex items-center">
      <img src="cover.jpg" onerror="this.src='profile.jpg'" alt="${escapeHtml(data.hero.name)} Cover Banner" class="absolute inset-0 w-full h-full object-cover object-right-top" />
      <div class="absolute inset-0 bg-gradient-to-r from-[#111522]/85 via-[#151A2A]/50 to-transparent pointer-events-none"></div>
      <div class="absolute inset-x-0 bottom-0 h-16 sm:h-24 bg-gradient-to-t from-white via-white/40 to-transparent pointer-events-none"></div>

      <div class="relative z-20 max-w-6xl mx-auto w-full px-5 sm:px-8 pt-24 pb-16">
        <div class="max-w-2xl text-left">
          <p class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-indigo-300 tracking-wide mb-3">${escapeHtml(data.hero.badgeText)}</p>
          <h1 class="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.12] drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]">
            ${escapeHtml(data.hero.greeting)} <span class="bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">${escapeHtml(data.hero.name)}</span>
          </h1>
          <p class="mt-4 text-slate-200/95 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed">
            ${escapeHtml(data.hero.taglinePart1)} <span class="text-emerald-400 font-semibold underline decoration-emerald-400/50 decoration-2 underline-offset-4">${escapeHtml(data.hero.highlight1)}</span> ${escapeHtml(data.hero.taglinePart2)} <span class="text-indigo-300 font-semibold underline decoration-indigo-400/50 decoration-2 underline-offset-4">${escapeHtml(data.hero.highlight2)}</span>.
          </p>
          <div class="mt-7 flex flex-wrap items-center gap-3">
            <a href="#albums" class="px-6 py-3.5 rounded-xl bg-white text-slate-900 font-bold text-xs sm:text-sm hover:bg-indigo-50 transition flex items-center gap-2 shadow-lg">
              <i data-lucide="play-circle" class="w-4 h-4 text-indigo-600"></i> Explore Work &amp; Albums
            </a>
            <a href="${escapeHtml(data.hero.cvFileUrl)}" download class="px-5 py-3.5 rounded-xl bg-indigo-600/90 hover:bg-indigo-500 border border-indigo-400/40 text-white font-semibold text-xs sm:text-sm transition flex items-center gap-2 shadow-lg">
              <i data-lucide="download" class="w-4 h-4"></i> Download Full CV
            </a>
            <a href="#contact" class="px-5 py-3.5 rounded-xl bg-white/12 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white font-semibold text-xs sm:text-sm transition flex items-center gap-2">
              <i data-lucide="mail" class="w-4 h-4 text-emerald-400"></i> Contact
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- QUICK HIGHLIGHT STRIP (GLOSSY GLASS BOX) -->
  <section class="relative z-20 max-w-6xl mx-auto px-5 -mt-10 mb-12">
    <div class="relative overflow-hidden rounded-3xl p-4 md:p-6 bg-white/75 backdrop-blur-2xl border border-white/95 shadow-[0_24px_54px_-12px_rgba(15,23,42,0.14),inset_0_2px_2px_rgba(255,255,255,1)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
      ${highlightStripHtml}
    </div>
  </section>

  <main class="relative z-10 max-w-6xl mx-auto px-5 pb-24">
    <!-- 2. ABOUT BENTO GRID -->
    <section id="about" class="py-10">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div class="md:col-span-2 bento-card rounded-3xl p-7 md:p-8 flex flex-col justify-between">
          <div>
            <span class="text-indigo-600 text-xs font-semibold tracking-wide block mb-2">${escapeHtml(data.about.kicker)}</span>
            <h2 class="font-display text-2xl md:text-3xl font-bold text-slate-900 mb-4">${escapeHtml(data.about.headline)}</h2>
            <p class="text-slate-600 leading-relaxed text-sm md:text-base">${escapeHtml(data.about.paragraph)}</p>
          </div>
        </div>
        <div class="bento-card rounded-3xl p-7 md:p-8 flex flex-col justify-between">
          <div>
            <span class="text-emerald-600 text-xs font-semibold tracking-wide block mb-2">Signature Strengths</span>
            <h3 class="font-display text-xl font-bold text-slate-900 mb-4">What Sets Me Apart</h3>
            <ul class="space-y-3 text-sm text-slate-600">
              ${data.about.strengths.map((s) => `<li class="font-semibold text-slate-900">${escapeHtml(s.title)}<span class="block text-xs text-slate-500 font-normal mt-0.5">${escapeHtml(s.detail)}</span></li>`).join('')}
            </ul>
          </div>
          <div class="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
            <span>${escapeHtml(data.about.location)}</span>
            <span class="text-emerald-600 font-semibold">${escapeHtml(data.about.availability)}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. INTERACTIVE PHOTO & VIDEO ALBUMS -->
    <section id="albums" class="py-12">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span class="text-indigo-600 text-xs font-semibold tracking-wide">Visual Gallery</span>
          <h2 class="font-display text-2xl md:text-3xl font-bold text-slate-900 mt-1">Curated Albums &amp; Video Reels</h2>
        </div>
        <div class="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 self-start">
          <button onclick="filterAlbum('all')" id="tab-all" class="album-tab px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white transition">All 7 Galleries</button>
          <button onclick="filterAlbum('book-reviews')" id="tab-book-reviews" class="album-tab px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 transition">Book Reviews</button>
          <button onclick="filterAlbum('insights')" id="tab-insights" class="album-tab px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 transition">Insight Videos</button>
          <button onclick="filterAlbum('campus-promo')" id="tab-campus-promo" class="album-tab px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 transition">Campus Promo</button>
          <button onclick="filterAlbum('achievements')" id="tab-achievements" class="album-tab px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 transition">Achievements</button>
          <button onclick="filterAlbum('seminars')" id="tab-seminars" class="album-tab px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 transition">Seminars</button>
          <button onclick="filterAlbum('tours')" id="tab-tours" class="album-tab px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 transition">Tours</button>
          <button onclick="filterAlbum('personal')" id="tab-personal" class="album-tab px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 transition">Personal</button>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${albumsHtml}
      </div>
    </section>

    <!-- 4. COMPLETE CV & RESUME (SENIOR EXECUTIVE AT CCB BOLD & EXPANDABLE) -->
    <section id="cv" class="py-12">
      <div class="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span class="text-indigo-600 text-xs font-semibold tracking-wide">Curriculum Vitae</span>
          <h2 class="font-display text-2xl md:text-3xl font-bold text-slate-900 mt-1">Professional &amp; Academic Records</h2>
        </div>
        <a href="${escapeHtml(data.hero.cvFileUrl)}" download class="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-500">
          <i data-lucide="file-text" class="w-4 h-4"></i> Download Full Resume (PDF)
        </a>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <h3 class="font-display font-bold text-lg text-slate-900 mb-3">Leadership &amp; Organizational Impact</h3>
          <div class="bento-card rounded-3xl p-6 md:p-8 border-2 border-indigo-500/25 cursor-pointer" onclick="toggleSectionDetail('cv-leadership-more', 'cv-leadership-chevron')">
            <div class="flex items-center justify-between text-xs text-indigo-600 font-semibold mb-2">
              <span>${escapeHtml(primaryRole.org)} · ${escapeHtml(primaryRole.category)}</span>
              <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">Click to expand all roles <i id="cv-leadership-chevron" data-lucide="chevron-down" class="w-4 h-4 transition-transform duration-300"></i></span>
            </div>
            <h4 class="font-display font-extrabold text-slate-900 text-2xl md:text-3xl tracking-tight">${escapeHtml(primaryRole.title)}</h4>
            <p class="text-slate-600 text-sm mt-2.5 leading-relaxed">${escapeHtml(primaryRole.summary)}</p>
            <div id="cv-leadership-more" class="hidden mt-6 pt-6 border-t border-slate-200/80 space-y-4">
              <ul class="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
                ${primaryRole.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}
              </ul>
              <p class="text-xs font-bold text-indigo-600 pt-2">Other Leadership &amp; Volunteering Roles:</p>
              <div class="space-y-3">
                ${secondaryRolesHtml}
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <h3 class="font-display font-bold text-lg text-slate-900 mb-3">Education &amp; Technical Toolkit</h3>
          <div class="bento-card rounded-3xl p-6 md:p-7">
            <div class="text-xs text-emerald-600 font-semibold mb-1">${escapeHtml(data.cv.education.status)}</div>
            <h4 class="font-display font-extrabold text-slate-900 text-xl">${escapeHtml(data.cv.education.degree)}</h4>
            <p class="text-indigo-600 font-medium text-sm mt-1">${escapeHtml(data.cv.education.institution)}</p>
            <p class="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">${escapeHtml(data.cv.education.summary)}</p>
          </div>
          <div class="bento-card rounded-3xl p-6 md:p-7 space-y-4">
            <h4 class="font-display font-bold text-slate-900 text-base">Software &amp; Engineering Stack</h4>
            <p class="text-xs sm:text-sm text-slate-600"><strong class="text-indigo-600">Creative &amp; Motion:</strong> ${data.cv.creativeSkills.map(escapeHtml).join(' · ')}</p>
            <p class="text-xs sm:text-sm text-slate-600"><strong class="text-emerald-600">Engineering &amp; Workflow:</strong> ${data.cv.engineeringSkills.map(escapeHtml).join(' · ')}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. FEATURED PROJECTS -->
    <section id="projects" class="py-10">
      <div class="mb-8">
        <span class="text-indigo-600 text-xs font-semibold tracking-wide">Spotlight</span>
        <h2 class="font-display text-2xl md:text-3xl font-bold text-slate-900 mt-1">Highlighted Ventures &amp; Campaigns</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${projectsHtml}
      </div>
    </section>

    <!-- 6. CONTACT HUB -->
    <section id="contact" class="pt-12 pb-6">
      <div class="bento-card rounded-3xl p-8 md:p-12">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <span class="text-indigo-600 text-xs font-semibold tracking-wide">${escapeHtml(data.contact.kicker)}</span>
            <h2 class="font-display text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">${escapeHtml(data.contact.headline)}</h2>
            <p class="text-slate-600 text-sm md:text-base mb-6 leading-relaxed">${escapeHtml(data.contact.description)}</p>
            <div class="flex flex-wrap gap-3">
              <a href="mailto:${escapeHtml(data.contact.email)}" class="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition shadow-md shadow-indigo-500/20">Email Me</a>
              <a href="${escapeHtml(data.contact.whatsappUrl)}" target="_blank" class="px-5 py-3 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-600 text-emerald-700 hover:text-white font-medium text-sm transition">WhatsApp</a>
              <a href="${escapeHtml(data.contact.linkedinUrl)}" target="_blank" class="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm transition">LinkedIn</a>
              <a href="${escapeHtml(data.contact.facebookUrl)}" target="_blank" class="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm transition">Facebook</a>
            </div>
          </div>
          <form action="${escapeHtml(data.contact.formspreeUrl)}" method="POST" class="space-y-4 bg-slate-50/80 p-6 rounded-2xl border border-slate-200/80">
            <h3 class="font-display font-bold text-slate-900 text-base mb-2">Send a Direct Message</h3>
            <input type="text" name="name" placeholder="Your Name" required class="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-indigo-500" />
            <input type="email" name="email" placeholder="Your Email Address" required class="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-indigo-500" />
            <textarea name="message" rows="3" placeholder="Write your message here..." required class="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-indigo-500"></textarea>
            <button type="submit" class="w-full py-3.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-semibold text-sm transition">Send Message</button>
          </form>
        </div>
      </div>
      <footer class="mt-12 text-center text-xs text-slate-500">
        <p>© 2026 ${escapeHtml(data.hero.name)}. Crafted with modern UI &amp; precision.</p>
      </footer>
    </section>
  </main>

  <div id="lightbox" class="fixed inset-0 z-50 hidden glass-nav flex items-center justify-center p-4" onclick="closeLightbox()">
    <div class="max-w-3xl w-full text-center">
      <img id="lightbox-img" src="" alt="Preview" class="max-h-[80vh] mx-auto rounded-2xl shadow-2xl border border-slate-200" />
      <p id="lightbox-caption" class="mt-4 font-display font-semibold text-slate-900 text-lg"></p>
      <span class="text-xs text-slate-500 mt-1 block">Click anywhere to close</span>
    </div>
  </div>

  <script>
    lucide.createIcons();
    function toggleSectionDetail(contentId, chevronId) {
      const el = document.getElementById(contentId);
      const chev = document.getElementById(chevronId);
      if (!el) return;
      el.classList.toggle('hidden');
      if (chev) chev.classList.toggle('rotate-180');
    }
    function filterAlbum(category) {
      const items = document.querySelectorAll('.album-item');
      const tabs = document.querySelectorAll('.album-tab');
      tabs.forEach(tab => {
        tab.classList.remove('bg-indigo-600', 'text-white');
        tab.classList.add('text-slate-600');
      });
      const activeTab = document.getElementById('tab-' + category);
      if (activeTab) {
        activeTab.classList.add('bg-indigo-600', 'text-white');
        activeTab.classList.remove('text-slate-600');
      }
      items.forEach(item => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    }
    function openLightbox(src, caption) {
      document.getElementById('lightbox-img').src = src;
      document.getElementById('lightbox-caption').innerText = caption;
      document.getElementById('lightbox').classList.remove('hidden');
    }
    function closeLightbox() {
      document.getElementById('lightbox').classList.add('hidden');
    }
  </script>
</body>
</html>`;
}
