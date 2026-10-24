/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PlayCircle,
  Download,
  Mail,
  ChevronDown,
  Video,
  Camera,
  Briefcase,
  FileText,
  PhoneCall,
  Linkedin,
  Facebook,
  Instagram,
  Send,
  CheckCircle2,
  X,
  Film,
  Sparkles,
  Award,
  GraduationCap,
  BookOpen,
  Lightbulb,
  Compass,
  Users,
  Layers,
  ExternalLink,
} from 'lucide-react';
import {
  PORTFOLIO_DATA,
  CATEGORY_METADATA,
  AlbumCategory,
  AlbumItem,
  HighlightStripItem,
} from './data/portfolio';
import {
  filterAlbumItems,
  parseSocialVideoUrl,
  validateContactSubmission,
} from './utils/portfolioLogic';

const HIGHLIGHT_COLOR_CLASSES: Record<HighlightStripItem['accentColor'], string> = {
  indigo: 'bg-[linear-gradient(135deg,#4F46E5_0%,#7C3AED_48%,#22D3EE_100%)] bg-clip-text text-transparent',
  emerald: 'bg-[linear-gradient(135deg,#0F766E_0%,#14B8A6_55%,#22D3EE_100%)] bg-clip-text text-transparent',
  purple: 'bg-[linear-gradient(135deg,#4F46E5_0%,#7C3AED_55%,#06B6D4_100%)] bg-clip-text text-transparent',
  sky: 'bg-[linear-gradient(110deg,#4F46E5_0%,#6366F1_45%,#06B6D4_100%)] bg-clip-text text-transparent',
};

export default function App() {
  // Fixed static read-only portfolio data from centralized src/data/portfolio.ts
  const data = PORTFOLIO_DATA;

  // Progressive Disclosure States (Clean UI — expand details on click)
  const [aboutAcademicsExpanded, setAboutAcademicsExpanded] = useState(false);
  const [expandedStrengthId, setExpandedStrengthId] = useState<string | null>(null);
  const [cvLeadershipExpanded, setCvLeadershipExpanded] = useState(false);
  const [expandedRoleId, setExpandedRoleId] = useState<string | null>(null);
  const [expandedCcbEventId, setExpandedCcbEventId] = useState<string | null>(null);
  const [expandedWorkId, setExpandedWorkId] = useState<string | null>(null);
  const [cvPreviewModalOpen, setCvPreviewModalOpen] = useState(false);

  // Read-only Album Category & Lightbox States
  const [albumCategory, setAlbumCategory] = useState<AlbumCategory>('all');
  const [lightboxItem, setLightboxItem] = useState<AlbumItem | null>(null);

  // Scroll-aware Apple Crystal Glass state (clear over dark banner, crisp over white page)
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setNavScrolled(window.scrollY > 280);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactError, setContactError] = useState<string | null>(null);
  const [submittedMessages, setSubmittedMessages] = useState<
    { id: string; name: string; email: string; message: string; timestamp: string }[]
  >([]);

  const primaryLeadershipRole = data.cv.leadership[0];
  const secondaryLeadershipRoles = data.cv.leadership.slice(1);

  const selectAlbumCategory = (cat: AlbumCategory) => {
    setAlbumCategory(cat);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateContactSubmission(contactForm);
    if (!validation.valid) {
      setContactError(validation.error || 'Please check your input.');
      return;
    }
    setContactError(null);
    setSubmittedMessages((prev) => [
      {
        id: String(Date.now()),
        name: contactForm.name.trim(),
        email: contactForm.email.trim(),
        message: contactForm.message.trim(),
        timestamp: 'Just now',
      },
      ...prev,
    ]);
    setContactForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="creative-studio-bg relative min-h-screen text-[#111827] selection:bg-[#4F46E5] selection:text-white overflow-x-hidden">
      {/* FLOATING NAVBAR (Dark Glass over Midnight Hero, Translucent White over Light Surfaces) */}
      <header className="fixed top-3.5 inset-x-0 z-40 flex justify-center px-3">
        <nav
          aria-label="Primary Navigation"
          className={`glass-nav ${
            navScrolled ? 'glass-nav-scrolled' : ''
          } relative overflow-hidden rounded-full px-5 sm:px-7 py-2.5 flex items-center justify-between gap-4 sm:gap-8 max-w-4xl w-full`}
        >
          {/* Specular Top Edge Lens Reflection */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent"
          />

          {/* Zone 1: Home Link */}
          <a
            href="#home"
            className={`text-[13px] md:text-[14px] font-semibold tracking-[-0.016em] transition-colors whitespace-nowrap shrink-0 ${
              navScrolled
                ? 'text-[#111827] hover:text-[#4F46E5]'
                : 'text-[#F8FAFC] hover:text-[#22D3EE] drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]'
            }`}
          >
            Home
          </a>

          {/* Zone 2: 4 Concise Single-Line Nav Links */}
          <div
            className={`flex items-center gap-1 sm:gap-3 text-[12.5px] md:text-[13.5px] font-medium tracking-[-0.012em] overflow-x-auto ${
              navScrolled
                ? 'text-[#475569]'
                : 'text-[#F8FAFC]/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]'
            }`}
          >
            <a
              href="#about"
              className={`nav-link px-3 py-1 rounded-full whitespace-nowrap shrink-0 ${
                navScrolled ? 'hover:text-[#4F46E5]' : 'hover:text-white'
              }`}
            >
              About
            </a>
            <a
              href="#albums"
              className={`nav-link px-3 py-1 rounded-full whitespace-nowrap shrink-0 ${
                navScrolled ? 'hover:text-[#4F46E5]' : 'hover:text-white'
              }`}
            >
              Albums &amp; Videos
            </a>
            <a
              href="#cv"
              className={`nav-link px-3 py-1 rounded-full whitespace-nowrap shrink-0 ${
                navScrolled ? 'hover:text-[#4F46E5]' : 'hover:text-white'
              }`}
            >
              CV &amp; Resume
            </a>
          </div>

          {/* Zone 3: Pill CTA */}
          <a
            href="#contact"
            className={`text-[12.5px] md:text-[13px] font-medium tracking-[-0.012em] px-4 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap shrink-0 ${
              navScrolled
                ? 'bg-indigo-cyan hover:brightness-110 text-white shadow-sm'
                : 'bg-white/95 hover:bg-white text-[#0B1020] shadow-[0_2px_10px_rgba(11,16,32,0.28)]'
            }`}
          >
            Let&apos;s Talk
          </a>
        </nav>
      </header>

      {/* 1. FULL-WIDTH EDGE-TO-EDGE COVER BANNER WITH HERO TEXT OVERLAID DIRECTLY ON TOP OF THE LEFT SIDE */}
      <section id="home" className="relative z-10 w-full">
        <div className="relative w-full overflow-hidden bg-midnight-cinematic min-h-[480px] sm:min-h-[520px] lg:min-h-[550px] flex items-center">
          {/* Full-Width Cover Image from Left Edge to Right Edge */}
          <img
            src={data.hero.coverImage}
            alt={`${data.hero.name} Cover Banner`}
            referrerPolicy="no-referrer"
            className={
              data.hero.coverImage.startsWith('data:')
                ? 'absolute inset-0 w-full h-full object-cover object-right-top'
                : 'absolute inset-x-0 top-0 w-full h-[134.5%] object-cover object-right-top'
            }
          />

          {/* Left-Side Text Readability Fade (stops before the portrait so the photo remains 100% crystal clear) */}
          {!data.hero.coverImage.startsWith('data:') && (
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(90deg,#0B1020_0%,#14213D_50%,transparent_62%)] pointer-events-none"
            />
          )}
          {data.hero.coverImage.startsWith('data:') && (
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,16,32,0.78)_0%,rgba(20,33,61,0.38)_44%,transparent_60%)] pointer-events-none"
            />
          )}

          {/* Subtle top-center mask over the screenshot's old embedded navbar */}
          {!data.hero.coverImage.startsWith('data:') && (
            <div
              aria-hidden="true"
              className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-[45%] h-[12%] rounded-b-3xl bg-gradient-to-b from-[#0B1020] via-[#14213D]/95 to-transparent pointer-events-none"
            />
          )}

          {/* Soft Bottom Fade into the Cool White Page Background */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-16 sm:h-24 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/40 to-transparent pointer-events-none"
          />

          {/* HERO TEXT OVERLAID DIRECTLY ON TOP OF THE COVER BANNER (LEFT SIDE) */}
          <div className="relative z-20 max-w-6xl mx-auto w-full px-5 sm:px-8 pt-24 pb-16">
            <div className="max-w-2xl text-left">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[linear-gradient(135deg,rgba(255,255,255,0.14),rgba(148,163,184,0.05))] backdrop-blur-md border border-white/20 text-xs font-semibold text-[#EEF2FF] tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-[#22D3EE] shadow-[0_0_8px_#22D3EE]" />
                  {data.hero.badgeText}
                </span>
              </div>

              <h1
                style={{ textWrap: 'balance' }}
                className="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.12] drop-shadow-[0_2px_12px_rgba(11,16,32,0.45)]"
              >
                {data.hero.greeting}{' '}
                <span className="bg-[linear-gradient(135deg,#818CF8_0%,#A78BFA_48%,#22D3EE_100%)] bg-clip-text text-transparent">
                  {data.hero.name}
                </span>
              </h1>

              <p className="mt-4 text-[#F8FAFC]/92 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed drop-shadow-[0_1px_4px_rgba(11,16,32,0.45)]">
                {data.hero.taglinePart1}{' '}
                <span className="text-[#22D3EE] font-semibold underline decoration-[#22D3EE]/50 decoration-2 underline-offset-4">
                  {data.hero.highlight1}
                </span>{' '}
                {data.hero.taglinePart2}{' '}
                <span className="text-[#C7D2FE] font-semibold underline decoration-[#818CF8]/50 decoration-2 underline-offset-4">
                  {data.hero.highlight2}
                </span>
                .
              </p>

              {/* Hero Action Buttons Overlaid on the Banner */}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href="#albums"
                  className="px-6 py-3.5 rounded-xl bg-white text-[#0B1020] font-bold text-xs sm:text-sm hover:bg-[#EEF2FF] transition flex items-center gap-2 shadow-lg whitespace-nowrap shrink-0"
                >
                  <PlayCircle className="w-4 h-4 text-[#4F46E5]" />
                  Explore Work &amp; Albums
                </a>
                <a
                  href={data.hero.cvFileUrl}
                  download
                  className="px-5 py-3.5 rounded-xl bg-indigo-cyan hover:brightness-110 border border-[#22D3EE]/35 text-white font-semibold text-xs sm:text-sm transition flex items-center gap-2 shadow-lg shadow-[#4F46E5]/25 whitespace-nowrap shrink-0"
                >
                  <Download className="w-4 h-4" />
                  Download Full CV
                </a>
                <a
                  href="#contact"
                  className="px-5 py-3.5 rounded-xl bg-[linear-gradient(135deg,rgba(255,255,255,0.14),rgba(148,163,184,0.05))] hover:bg-white/20 backdrop-blur-md border border-white/25 text-white font-semibold text-xs sm:text-sm transition flex items-center gap-2 whitespace-nowrap shrink-0"
                >
                  <Mail className="w-4 h-4 text-[#22D3EE]" />
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK HIGHLIGHT STRIP (PROPER VISUAL GLOSSY GLASS BOX) */}
      <section
        aria-label="Key Credentials Highlight Strip"
        className="relative z-20 max-w-6xl mx-auto px-5 -mt-10 mb-12"
      >

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="glossy-glass-box relative overflow-hidden rounded-3xl p-4 sm:p-5 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 text-center"
        >
          {/* Specular Top Edge Glossy Reflection */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-10 top-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent"
          />
          {/* Diagonal Glossy Surface Sheen */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/50 blur-2xl"
          />

          {data.highlightStrip.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="glossy-glass-tile relative overflow-hidden rounded-2xl px-4 py-4 sm:py-5 flex flex-col items-center justify-center"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"
              />
              <span
                className={`block font-display font-extrabold text-lg md:text-[1.35rem] leading-tight tracking-tight ${
                  HIGHLIGHT_COLOR_CLASSES[item.accentColor]
                }`}
              >
                {item.title}
              </span>
              <span className="text-xs text-slate-600 font-semibold mt-1.5 block leading-snug">
                {item.subtitle}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* MAIN CONTAINER FOR CONTENT */}
      <main className="relative z-10 max-w-6xl mx-auto px-5 pb-24">
        {/* 2. ABOUT BENTO GRID (With Clean Progressive Disclosure) */}
        <section id="about" className="py-10">

          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-5 ${
              aboutAcademicsExpanded || expandedStrengthId ? 'items-start' : 'items-stretch'
            }`}
          >
            {/* Academics Narrative Bento Card — Equal Size Box with 3D Stage & Highlighted Toggle Button */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="h-full bento-card relative overflow-hidden rounded-3xl p-5 sm:p-6 flex flex-col justify-between border border-[#E2E8F0] shadow-[0_14px_35px_-15px_rgba(79,70,229,0.10)]"
            >
              {/* Top Specular Glossy Accent Line */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-aurora-signature opacity-95"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 -right-24 w-56 h-56 rounded-full bg-gradient-to-br from-[#EEF2FF]/90 via-violet-50/60 to-[#ECFEFF]/80 blur-2xl"
              />

              <div className="relative z-10 flex-1 flex flex-col">
                {/* Compact Animated Academics Narrative Badge */}
                <div className="flex items-center justify-start mb-2.5">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.94 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.03, y: -1 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-soft-lavender-glow border border-[#E2E8F0] shadow-[0_4px_12px_-4px_rgba(79,70,229,0.12),inset_0_1px_0_rgba(255,255,255,1)]"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4F46E5] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-cyan" />
                    </span>
                    <span className="font-display text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.08em] text-aurora-signature">
                      {data.about.kicker}
                    </span>
                  </motion.div>
                </div>

                {/* Bold Heading ("About My Academics Details") + Highlighted Action Button Right Next to It */}
                <div className="flex items-center justify-between gap-3 mb-3.5">
                  <h2
                    onClick={() => setAboutAcademicsExpanded((prev) => !prev)}
                    style={{ textWrap: 'balance' }}
                    className="font-display text-xl sm:text-2xl font-extrabold text-[#111827] hover:text-[#4F46E5] transition-colors tracking-tight leading-[1.2] cursor-pointer"
                  >
                    {data.about.headline}
                  </h2>

                  <motion.button
                    type="button"
                    aria-label="Toggle Academic Details"
                    aria-expanded={aboutAcademicsExpanded}
                    whileHover={{ scale: 1.06, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setAboutAcademicsExpanded((prev) => !prev)}
                    className={`relative inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-2xl shrink-0 cursor-pointer transition-all duration-300 border ${
                      aboutAcademicsExpanded
                        ? 'bg-teal-aurora text-white border-[#22D3EE]/60 ring-4 ring-[#14B8A6]/20 shadow-[0_8px_20px_-4px_rgba(20,184,166,0.45)]'
                        : 'bg-aurora-signature text-white border-[#818CF8]/60 ring-4 ring-[#4F46E5]/20 shadow-[0_8px_20px_-4px_rgba(79,70,229,0.45)] hover:shadow-[0_10px_24px_-4px_rgba(79,70,229,0.6)]'
                    }`}
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-85" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                    </span>
                    <GraduationCap className="w-4 h-4 text-white shrink-0" />
                    <ChevronDown
                      className={`w-4 h-4 text-white transition-transform duration-300 ${
                        aboutAcademicsExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </motion.button>
                </div>

                {/* Interactive 3D Isometric Crystal & Orbital Showcase (Matches Height of Signature Strengths) */}
                <motion.div
                  role="button"
                  tabIndex={0}
                  aria-label="Interactive 3D Academic Prism Stage"
                  onClick={() => setAboutAcademicsExpanded((prev) => !prev)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setAboutAcademicsExpanded((prev) => !prev);
                    }
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  style={{ perspective: '900px' }}
                  className="group relative overflow-hidden rounded-2xl flex-1 min-h-[102px] flex items-center justify-between px-4 sm:px-6 py-2.5 backdrop-blur-xl bg-gradient-to-r from-indigo-500/12 via-white/80 to-emerald-500/12 border border-white/95 ring-1 ring-indigo-300/65 shadow-[0_10px_24px_-8px_rgba(79,70,229,0.18),inset_0_1.5px_1px_rgba(255,255,255,1)] cursor-pointer select-none transition-all duration-300 hover:ring-indigo-400/85 hover:shadow-[0_14px_30px_-6px_rgba(79,70,229,0.26),inset_0_1.5px_1px_rgba(255,255,255,1)]"
                >
                  {/* Specular Top Glass Edge Reflection */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-4 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent opacity-95"
                  />
                  {/* Luminous Left Color Bar Matching What Sets Me Apart */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-indigo-600 via-violet-500 to-emerald-500 shadow-[0_0_12px_rgba(79,70,229,0.5)]"
                  />

                  {/* 3D Perspective Isometric Floor Grid */}
                  <div
                    aria-hidden="true"
                    style={{
                      transform: 'rotateX(66deg) translateZ(-16px)',
                      transformStyle: 'preserve-3d',
                      backgroundImage:
                        'linear-gradient(to right, rgba(99,102,241,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,185,129,0.22) 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                    }}
                    className="pointer-events-none absolute inset-x-6 -bottom-6 h-24 rounded-full opacity-75 [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_80%)]"
                  />

                  {/* Ambient 3D Refraction Glows */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/4 top-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-indigo-400/25 blur-2xl group-hover:scale-125 transition-transform duration-500"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-1/4 top-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-emerald-400/25 blur-2xl group-hover:scale-125 transition-transform duration-500"
                  />

                  {/* Left 3D Floating Isometric Stacked Glass Planes */}
                  <motion.div
                    animate={{ y: [-2.5, 2.5, -2.5], rotateZ: [-1.5, 1.5, -1.5] }}
                    transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="relative z-10 flex items-center justify-center w-20 h-20 shrink-0"
                  >
                    <svg
                      viewBox="0 0 100 100"
                      className="w-18 h-18 sm:w-20 sm:h-20 drop-shadow-[0_10px_14px_rgba(79,70,229,0.24)]"
                      aria-hidden="true"
                    >
                      <defs>
                        <linearGradient id="isoLayerTop" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.92" />
                          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.95" />
                        </linearGradient>
                        <linearGradient id="isoLayerMid" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.85" />
                          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.88" />
                        </linearGradient>
                        <linearGradient id="isoLayerBot" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#34d399" stopOpacity="0.85" />
                          <stop offset="100%" stopColor="#059669" stopOpacity="0.9" />
                        </linearGradient>
                      </defs>
                      {/* Base Shadow */}
                      <ellipse cx="50" cy="84" rx="28" ry="8" fill="rgba(79,70,229,0.16)" />
                      {/* Bottom 3D Extruded Plate */}
                      <polygon
                        points="50,52 84,66 50,80 16,66"
                        fill="url(#isoLayerBot)"
                        stroke="rgba(255,255,255,0.85)"
                        strokeWidth="1.2"
                      />
                      <polygon points="16,66 50,80 50,85 16,71" fill="#047857" opacity="0.85" />
                      <polygon points="84,66 50,80 50,85 84,71" fill="#10b981" opacity="0.75" />
                      {/* Middle 3D Extruded Glass Plate */}
                      <polygon
                        points="50,35 84,49 50,63 16,49"
                        fill="url(#isoLayerMid)"
                        stroke="rgba(255,255,255,0.9)"
                        strokeWidth="1.2"
                      />
                      <polygon points="16,49 50,63 50,68 16,54" fill="#4338ca" opacity="0.85" />
                      <polygon points="84,49 50,63 50,68 84,54" fill="#7c3aed" opacity="0.75" />
                      {/* Top 3D Extruded Crystal Plate */}
                      <polygon
                        points="50,18 84,32 50,46 16,32"
                        fill="url(#isoLayerTop)"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                      <polygon points="16,32 50,46 50,51 16,37" fill="#3730a3" opacity="0.9" />
                      <polygon points="84,32 50,46 50,51 84,37" fill="#6366f1" opacity="0.85" />
                      {/* Inner Specular Diamond */}
                      <polygon
                        points="50,23 72,32 50,41 28,32"
                        fill="none"
                        stroke="rgba(255,255,255,0.75)"
                        strokeWidth="1"
                      />
                    </svg>
                  </motion.div>

                  {/* Centerpiece 3D Isometric Crystal Cube & Orbital Gyroscope */}
                  <div
                    style={{ transformStyle: 'preserve-3d' }}
                    className="relative z-10 flex items-center justify-center flex-1 h-20"
                  >
                    {/* Outer Tilted 3D Orbital Ring 1 */}
                    <motion.div
                      animate={{ rotateZ: [0, 360] }}
                      transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                      style={{ transform: 'rotateX(68deg) rotateY(-22deg)' }}
                      className="pointer-events-none absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full border-[1.5px] border-dashed border-indigo-400/70 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                    >
                      <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 shadow-[0_0_10px_rgba(79,70,229,0.9)]" />
                    </motion.div>

                    {/* Outer Tilted 3D Orbital Ring 2 */}
                    <motion.div
                      animate={{ rotateZ: [360, 0] }}
                      transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                      style={{ transform: 'rotateX(68deg) rotateY(28deg)' }}
                      className="pointer-events-none absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full border-[1.5px] border-emerald-400/65 shadow-[0_0_15px_rgba(16,185,129,0.28)]"
                    >
                      <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 shadow-[0_0_10px_rgba(16,185,129,0.9)]" />
                    </motion.div>

                    {/* Floating 3D Multi-Faceted Isometric Crystal Cube */}
                    <motion.div
                      animate={{
                        y: [-4, 4, -4],
                        rotateZ: [-2, 2, -2],
                      }}
                      transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
                      className="relative z-20"
                    >
                      <svg
                        viewBox="0 0 120 120"
                        className="w-20 h-20 sm:w-22 sm:h-22 drop-shadow-[0_14px_20px_rgba(79,70,229,0.35)] group-hover:scale-110 transition-transform duration-300"
                        aria-hidden="true"
                      >
                        <defs>
                          <linearGradient id="cubeTopFace" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ffffff" />
                            <stop offset="50%" stopColor="#e0e7ff" />
                            <stop offset="100%" stopColor="#c7d2fe" />
                          </linearGradient>
                          <linearGradient id="cubeLeftFace" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#3730a3" />
                          </linearGradient>
                          <linearGradient id="cubeRightFace" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#0f766e" />
                          </linearGradient>
                          <linearGradient id="innerCore" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#818cf8" />
                            <stop offset="100%" stopColor="#34d399" />
                          </linearGradient>
                        </defs>

                        {/* 3D Floor Shadow */}
                        <ellipse cx="60" cy="104" rx="26" ry="7" fill="rgba(49,46,129,0.22)" />

                        {/* Outer Translucent 3D Crystal Cube */}
                        {/* Top Face */}
                        <polygon
                          points="60,18 98,38 60,58 22,38"
                          fill="url(#cubeTopFace)"
                          stroke="#ffffff"
                          strokeWidth="1.8"
                        />
                        {/* Left Face */}
                        <polygon
                          points="22,38 60,58 60,96 22,76"
                          fill="url(#cubeLeftFace)"
                          fillOpacity="0.92"
                          stroke="#e0e7ff"
                          strokeWidth="1.4"
                        />
                        {/* Right Face */}
                        <polygon
                          points="98,38 60,58 60,96 98,76"
                          fill="url(#cubeRightFace)"
                          fillOpacity="0.9"
                          stroke="#d1fae5"
                          strokeWidth="1.4"
                        />

                        {/* Inner Floating 3D Graduation Prism Core */}
                        <polygon
                          points="60,28 82,40 60,52 38,40"
                          fill="url(#innerCore)"
                          stroke="#ffffff"
                          strokeWidth="1.2"
                        />
                        {/* Specular 3D Edge Highlights */}
                        <line
                          x1="60"
                          y1="58"
                          x2="60"
                          y2="96"
                          stroke="#ffffff"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <circle cx="60" cy="40" r="3.5" fill="#ffffff" />
                        <circle cx="60" cy="58" r="2.5" fill="#ffffff" />
                      </svg>
                    </motion.div>
                  </div>

                  {/* Right 3D Floating Isometric Stepped Pillars */}
                  <motion.div
                    animate={{ y: [2.5, -2.5, 2.5], rotateZ: [1.5, -1.5, 1.5] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="relative z-10 flex items-center justify-center w-20 h-20 shrink-0"
                  >
                    <svg
                      viewBox="0 0 100 100"
                      className="w-18 h-18 sm:w-20 sm:h-20 drop-shadow-[0_10px_14px_rgba(16,185,129,0.24)]"
                      aria-hidden="true"
                    >
                      {/* Base Isometric Platform */}
                      <ellipse cx="50" cy="84" rx="28" ry="8" fill="rgba(16,185,129,0.16)" />
                      <polygon
                        points="50,64 84,76 50,88 16,76"
                        fill="rgba(255,255,255,0.85)"
                        stroke="#a7f3d0"
                        strokeWidth="1.2"
                      />

                      {/* Left 3D Pillar (Indigo) */}
                      <polygon points="28,42 40,48 28,54 16,48" fill="#c7d2fe" stroke="#ffffff" strokeWidth="1" />
                      <polygon points="16,48 28,54 28,76 16,70" fill="#4f46e5" />
                      <polygon points="40,48 28,54 28,76 40,70" fill="#6366f1" />

                      {/* Center Tall 3D Pillar (Violet-Indigo) */}
                      <polygon points="50,24 62,30 50,36 38,30" fill="#ede9fe" stroke="#ffffff" strokeWidth="1" />
                      <polygon points="38,30 50,36 50,72 38,66" fill="#6d28d9" />
                      <polygon points="62,30 50,36 50,72 62,66" fill="#8b5cf6" />

                      {/* Right 3D Pillar (Emerald-Teal) */}
                      <polygon points="72,34 84,40 72,46 60,40" fill="#a7f3d0" stroke="#ffffff" strokeWidth="1" />
                      <polygon points="60,40 72,46 72,76 60,70" fill="#059669" />
                      <polygon points="84,40 72,46 72,76 84,70" fill="#10b981" />
                    </svg>
                  </motion.div>
                </motion.div>

                {/* Single-Click Organized Academics Details Panel (Smooth Framer Motion Reveal) */}
                <AnimatePresence initial={false}>
                  {aboutAcademicsExpanded && (
                    <motion.div
                      key="about-academics-details"
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="relative overflow-hidden mt-5 rounded-3xl bg-gradient-to-br from-indigo-100/55 via-slate-50/70 to-emerald-100/55 border border-white/90 ring-1 ring-indigo-200/75 p-5 sm:p-6 shadow-[0_20px_45px_-15px_rgba(79,70,229,0.18),inset_0_1px_1px_rgba(255,255,255,0.95)] space-y-5">
                        {/* Ambient Color Orbs Behind Clear Glass Boxes for Authentic Refraction */}
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute -top-12 left-8 w-56 h-56 rounded-full bg-indigo-400/25 blur-3xl"
                        />
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute top-1/3 right-4 w-60 h-60 rounded-full bg-violet-400/20 blur-3xl"
                        />
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute -bottom-12 left-1/4 w-64 h-64 rounded-full bg-emerald-400/25 blur-3xl"
                        />

                        {/* Part 1: Degree, Institution & Academic Status */}
                        <div className="relative z-10 flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-indigo-200/60">
                          <div>
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50/90 backdrop-blur-md border border-emerald-200/90 px-3 py-1 rounded-full shadow-2xs">
                              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                              {data.cv.education.status}
                            </span>
                            <h3 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 mt-2.5">
                              {data.cv.education.degree}
                            </h3>
                            <p className="text-indigo-700 font-bold text-sm sm:text-base mt-0.5">
                              {data.cv.education.institution}
                            </p>
                          </div>
                          <span className="px-3.5 py-1.5 rounded-xl bg-white/75 backdrop-blur-md border border-white/90 ring-1 ring-indigo-200/80 text-xs font-bold text-indigo-700 shadow-xs">
                            Department: Wet Process Engineering
                          </span>
                        </div>

                        {/* Part 2: Academic Overview (Crystal-Clear Glass Box with Indigo-Violet Color Glow) */}
                        <p className="relative z-10 overflow-hidden pl-5 py-3.5 pr-4 rounded-2xl bg-gradient-to-r from-white/65 via-indigo-50/45 to-violet-100/40 backdrop-blur-xl border border-white/90 ring-1 ring-indigo-300/60 border-l-4 border-l-indigo-600 text-slate-900 text-sm sm:text-[15px] font-semibold leading-[1.8] shadow-[0_12px_28px_-8px_rgba(79,70,229,0.20),inset_0_1.5px_1px_rgba(255,255,255,0.98),inset_0_-1px_2px_rgba(79,70,229,0.10)]">
                          {data.cv.education.summary}
                        </p>

                        {/* Part 3: Core Wet Process Engineering Modules Grid */}
                        <div className="relative z-10">
                          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 text-white text-xs sm:text-[12.5px] font-extrabold uppercase tracking-wider mb-3.5 shadow-sm shadow-indigo-500/25">
                            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                            <span>Core Wet Process Engineering Modules &amp; Lab Focus</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {data.cv.education.modules.map((mod, idx) => (
                              <motion.div
                                key={mod}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -3, scale: 1.015 }}
                                transition={{
                                  duration: 0.3,
                                  delay: idx * 0.06,
                                  ease: [0.16, 1, 0.3, 1],
                                }}
                                className="group relative overflow-hidden flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-br from-white/70 via-indigo-50/35 to-emerald-50/40 backdrop-blur-xl border border-white/95 ring-1 ring-indigo-300/60 hover:ring-indigo-400/90 text-xs sm:text-[14px] font-bold text-slate-900 shadow-[0_12px_28px_-8px_rgba(79,70,229,0.22),0_4px_12px_-2px_rgba(16,185,129,0.12),inset_0_1.5px_1.5px_rgba(255,255,255,1),inset_0_-1px_2px_rgba(99,102,241,0.14)] hover:shadow-[0_16px_34px_-6px_rgba(79,70,229,0.32),inset_0_1.5px_2px_rgba(255,255,255,1)] transition-all duration-300"
                              >
                                {/* Specular Top Glass Edge Reflection */}
                                <span
                                  aria-hidden="true"
                                  className="pointer-events-none absolute inset-x-4 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent opacity-95"
                                />
                                {/* Soft Ambient Color Refraction Inside Glass */}
                                <span
                                  aria-hidden="true"
                                  className="pointer-events-none absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400/25 via-violet-400/20 to-emerald-400/25 blur-xl group-hover:scale-125 transition-transform duration-500"
                                />
                                {/* Luminous Left Color Bar */}
                                <span
                                  aria-hidden="true"
                                  className="pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-indigo-500 via-violet-500 to-emerald-500 shadow-[0_0_12px_rgba(99,102,241,0.5)]"
                                />
                                <span className="relative z-10 w-6 h-6 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-[0_4px_10px_-2px_rgba(16,185,129,0.55),inset_0_1px_0.5px_rgba(255,255,255,0.6)] mt-0.5">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                </span>
                                <span className="relative z-10 leading-snug">{mod}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Part 4: Research Focus & Academic Narrative (Clear Glass Callout Cards with Color Glow) */}
                        <div className="relative z-10 grid grid-cols-1 gap-3.5 pt-1">
                          <div className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-500/15 via-white/65 to-violet-500/15 backdrop-blur-xl border border-white/95 ring-1 ring-indigo-300/75 text-xs sm:text-sm text-slate-900 leading-relaxed shadow-[0_14px_30px_-10px_rgba(79,70,229,0.24),inset_0_1.5px_1.5px_rgba(255,255,255,1),inset_0_-1px_2px_rgba(79,70,229,0.14)]">
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute inset-x-6 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent opacity-95"
                            />
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-indigo-400/20 blur-2xl"
                            />
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-indigo-600 via-violet-600 to-indigo-500 shadow-[0_0_12px_rgba(79,70,229,0.55)]"
                            />
                            <span className="relative z-10 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-extrabold text-[11px] uppercase tracking-wider mb-1.5 mr-2 shadow-[0_4px_10px_-2px_rgba(79,70,229,0.45),inset_0_1px_0.5px_rgba(255,255,255,0.5)]">
                              Research &amp; Lab Focus
                            </span>
                            <span className="relative z-10 font-semibold text-slate-900 block sm:inline">
                              {data.cv.education.researchFocus}
                            </span>
                          </div>
                          <div className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-white/65 to-teal-500/15 backdrop-blur-xl border border-white/95 ring-1 ring-emerald-300/75 text-xs sm:text-sm text-slate-900 leading-relaxed shadow-[0_14px_30px_-10px_rgba(16,185,129,0.24),inset_0_1.5px_1.5px_rgba(255,255,255,1),inset_0_-1px_2px_rgba(16,185,129,0.14)]">
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute inset-x-6 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent opacity-95"
                            />
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-emerald-400/20 blur-2xl"
                            />
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-emerald-500 via-teal-500 to-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.55)]"
                            />
                            <span className="relative z-10 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-[11px] uppercase tracking-wider mb-1.5 mr-2 shadow-[0_4px_10px_-2px_rgba(16,185,129,0.45),inset_0_1px_0.5px_rgba(255,255,255,0.5)]">
                              Academic &amp; Creative Integration
                            </span>
                            <span className="relative z-10 font-semibold text-slate-900 block sm:inline">
                              {data.about.extendedNarrative}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Compact Signature Strengths Card — Equal Size Box Matching Academics Narrative Card */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="h-full bento-card relative overflow-hidden rounded-3xl p-5 sm:p-6 flex flex-col justify-between border border-emerald-100/90 shadow-[0_14px_35px_-15px_rgba(16,185,129,0.12)]"
            >
              {/* Top Specular Glossy Accent Line */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 opacity-90"
              />
              {/* Ambient Color Orbs Behind Clear Glass Strength Boxes */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-20 -right-20 w-48 h-48 rounded-full bg-gradient-to-br from-emerald-200/40 via-teal-100/30 to-indigo-200/40 blur-2xl"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-16 -left-16 w-44 h-44 rounded-full bg-gradient-to-tr from-indigo-200/35 to-emerald-200/35 blur-2xl"
              />

              <div className="relative z-10 flex-1 flex flex-col">
                {/* Compact Signature Strengths Badge */}
                <div className="flex items-center justify-start mb-2.5">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.94 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.03, y: -1 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-soft-lavender-glow border border-[#E2E8F0] shadow-[0_4px_12px_-4px_rgba(20,184,166,0.14),inset_0_1px_0_rgba(255,255,255,1)]"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14B8A6] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-aurora" />
                    </span>
                    <span className="font-display text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.08em] text-teal-aurora">
                      Signature Strengths
                    </span>
                  </motion.div>
                </div>

                {/* Bold Heading ("What Sets Me Apart") + Highlighted Action Button Right Next to It */}
                <div className="flex items-center justify-between gap-3 mb-3.5">
                  <h3
                    onClick={() =>
                      setExpandedStrengthId((prev) => (prev === 'all' ? null : 'all'))
                    }
                    className="font-display text-xl sm:text-2xl font-extrabold text-[#111827] hover:text-[#0F766E] transition-colors tracking-tight leading-[1.2] cursor-pointer"
                  >
                    What Sets Me Apart
                  </h3>

                  <motion.button
                    type="button"
                    aria-label="Toggle All Signature Strengths"
                    aria-expanded={expandedStrengthId !== null}
                    whileHover={{ scale: 1.06, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      setExpandedStrengthId((prev) => (prev === 'all' ? null : 'all'))
                    }
                    className={`relative inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-2xl shrink-0 cursor-pointer transition-all duration-300 border ${
                      expandedStrengthId !== null
                        ? 'bg-indigo-cyan text-white border-[#818CF8]/60 ring-4 ring-[#4F46E5]/20 shadow-[0_8px_20px_-4px_rgba(79,70,229,0.45)]'
                        : 'bg-teal-aurora text-white border-[#22D3EE]/60 ring-4 ring-[#14B8A6]/20 shadow-[0_8px_20px_-4px_rgba(20,184,166,0.45)] hover:shadow-[0_10px_24px_-4px_rgba(20,184,166,0.6)]'
                    }`}
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-85" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                    </span>
                    <Sparkles className="w-4 h-4 text-white shrink-0" />
                    <ChevronDown
                      className={`w-4 h-4 text-white transition-transform duration-300 ${
                        expandedStrengthId !== null ? 'rotate-180' : ''
                      }`}
                    />
                  </motion.button>
                </div>

                {/* Compact Clear-Glass Strength Boxes (Only the 2 Core Strengths) */}
                <div className="space-y-2.5">
                  {data.about.strengths.map((item, idx) => {
                    const isOpen =
                      expandedStrengthId === 'all' || expandedStrengthId === item.id;
                    const isIndigo = idx === 0;
                    return (
                      <div
                        key={item.id}
                        className={`relative overflow-hidden rounded-2xl backdrop-blur-xl border border-white/95 transition-all duration-300 ${
                          isIndigo
                            ? 'bg-gradient-to-r from-[#EEF2FF]/90 via-white/85 to-[#F5F3FF]/85 ring-1 ring-[#E2E8F0] hover:ring-[#4F46E5]/45 shadow-[0_10px_24px_-8px_rgba(79,70,229,0.12),inset_0_1.5px_1px_rgba(255,255,255,1)]'
                            : 'bg-gradient-to-r from-[#ECFEFF]/90 via-white/85 to-[#EEF2FF]/85 ring-1 ring-[#E2E8F0] hover:ring-[#14B8A6]/45 shadow-[0_10px_24px_-8px_rgba(20,184,166,0.12),inset_0_1.5px_1px_rgba(255,255,255,1)]'
                        }`}
                      >
                        {/* Specular Top Glass Edge Reflection */}
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-x-4 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent opacity-95"
                        />
                        {/* Luminous Left Color Bar */}
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none absolute inset-y-0 left-0 w-1.5 ${
                            isIndigo
                              ? 'bg-aurora-signature shadow-[0_0_10px_rgba(79,70,229,0.45)]'
                              : 'bg-teal-aurora shadow-[0_0_10px_rgba(20,184,166,0.45)]'
                          }`}
                        />

                        <button
                          type="button"
                          aria-expanded={isOpen}
                          onClick={() =>
                            setExpandedStrengthId((prev) =>
                              prev === item.id ? null : item.id
                            )
                          }
                          className="relative z-10 w-full pl-4 pr-3.5 py-2.5 text-left flex items-center justify-between gap-2 text-xs sm:text-[13.5px] font-bold text-[#111827] hover:text-[#4F46E5] transition cursor-pointer"
                        >
                          <span className="leading-snug">{item.title}</span>
                          <span
                            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                              isIndigo
                                ? 'bg-[#EEF2FF] text-[#4F46E5]'
                                : 'bg-[#ECFEFF] text-[#0F766E]'
                            }`}
                          >
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform duration-300 ${
                                isOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </span>
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="relative z-10 pl-4 pr-3.5 pb-3 pt-2 text-xs text-[#475569] font-medium leading-relaxed border-t border-[#E2E8F0]/80 bg-white/65">
                                {item.detail}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3. CLEAN 3D CONTENT CREATION & PHOTO GALLERY (WITH MANUAL FB/YOUTUBE/IG VIDEO LINK & PHOTO UPLOAD) */}
        <section id="albums" className="py-12">
          {/* Clean Header + Direct "+ Add Video / Photo" Action + 7 Category Filter Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 space-y-5"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-soft-lavender-glow border border-[#E2E8F0] shadow-[0_4px_12px_-4px_rgba(79,70,229,0.12)] mb-2.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4F46E5] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-aurora-signature" />
                  </span>
                  <span className="font-display text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.08em] text-aurora-signature">
                    Content Creation &amp; Visual Gallery
                  </span>
                </div>

                <h2
                  style={{ textWrap: 'balance' }}
                  className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111827] tracking-tight"
                >
                  Video Reels &amp;{' '}
                  <span className="text-aurora-signature">
                    Curated Photo Albums
                  </span>
                </h2>
                <p className="text-[#475569] text-xs sm:text-sm mt-1">
                  Explore curated video reels, perspective insights, promotional stories, and photography albums.
                </p>
              </div>
            </div>

            {/* Clean 7-Category Filter Bar */}
            <div
              role="tablist"
              aria-label="Album Categories"
              className="flex flex-wrap items-center gap-2 pt-1"
            >
              {[
                {
                  key: 'all' as AlbumCategory,
                  label: 'All Categories',
                  icon: Layers,
                  activeClass:
                    'bg-[#0B1020] text-white border-[#0B1020] shadow-[0_8px_18px_-4px_rgba(11,16,32,0.3)]',
                  iconColor: 'text-[#4F46E5]',
                },
                {
                  key: 'insights' as AlbumCategory,
                  label: 'Insight Videos',
                  icon: Lightbulb,
                  activeClass:
                    'bg-aurora-signature text-white border-[#7C3AED] shadow-[0_8px_18px_-4px_rgba(124,58,237,0.38)]',
                  iconColor: 'text-[#7C3AED]',
                },
                {
                  key: 'book-reviews' as AlbumCategory,
                  label: 'Self-Improvement & Book Review',
                  icon: BookOpen,
                  activeClass:
                    'bg-aurora-signature text-white border-[#4F46E5] shadow-[0_8px_18px_-4px_rgba(79,70,229,0.38)]',
                  iconColor: 'text-[#4F46E5]',
                },
                {
                  key: 'campus-promo' as AlbumCategory,
                  label: 'Promotional Story',
                  icon: Film,
                  activeClass:
                    'bg-indigo-cyan text-white border-[#4F46E5] shadow-[0_8px_18px_-4px_rgba(79,70,229,0.38)]',
                  iconColor: 'text-[#06B6D4]',
                },
                {
                  key: 'achievements' as AlbumCategory,
                  label: 'My Achievements',
                  icon: Award,
                  activeClass:
                    'bg-aurora-signature text-white border-[#4F46E5] shadow-[0_8px_18px_-4px_rgba(79,70,229,0.38)]',
                  iconColor: 'text-[#4F46E5]',
                },
                {
                  key: 'seminars' as AlbumCategory,
                  label: 'Different Seminars',
                  icon: Users,
                  activeClass:
                    'bg-teal-aurora text-white border-[#14B8A6] shadow-[0_8px_18px_-4px_rgba(20,184,166,0.38)]',
                  iconColor: 'text-[#14B8A6]',
                },
                {
                  key: 'tours' as AlbumCategory,
                  label: 'Tours & Expeditions',
                  icon: Compass,
                  activeClass:
                    'bg-indigo-cyan text-white border-[#06B6D4] shadow-[0_8px_18px_-4px_rgba(6,182,212,0.38)]',
                  iconColor: 'text-[#06B6D4]',
                },
                {
                  key: 'personal' as AlbumCategory,
                  label: 'Personal Photos',
                  icon: Camera,
                  activeClass:
                    'bg-teal-aurora text-white border-[#14B8A6] shadow-[0_8px_18px_-4px_rgba(20,184,166,0.38)]',
                  iconColor: 'text-[#7C3AED]',
                },
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isActive = albumCategory === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => selectAlbumCategory(tab.key)}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer border ${
                      isActive
                        ? tab.activeClass
                        : 'bg-white hover:bg-[#EEF2FF]/70 text-[#475569] hover:text-[#111827] border-[#E2E8F0] shadow-2xs hover:-translate-y-0.5'
                    }`}
                  >
                    <IconComponent
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isActive ? 'text-white' : tab.iconColor
                      }`}
                    />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {albumCategory === 'all' ? (
            <div className="space-y-10">
              {/* ROW 1: 3 VIDEO CATEGORY DECKS IN 1 ROW */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-4 px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-aurora-signature" />
                    <h3 className="font-display text-sm sm:text-base font-extrabold text-[#111827] uppercase tracking-wider">
                      Video Reel Categories (3 in a Row · Click Any Category to Open All Videos)
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-[#4F46E5] hidden sm:inline">
                    Select a category to view all videos →
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                  {(
                    [
                      {
                        key: 'insights' as const,
                        icon: Lightbulb,
                        ring: 'ring-[#E2E8F0] hover:ring-[#7C3AED]/50 border-[#E2E8F0]',
                        bar: 'from-[#7C3AED] via-[#4F46E5] to-[#22D3EE]',
                        badgeClass: 'text-[#7C3AED] bg-[#EEF2FF] border-[#E2E8F0]',
                        stackBack1: 'from-violet-100/80 via-[#EEF2FF] to-white border-[#E2E8F0]',
                        stackBack2: 'from-[#ECFEFF] via-[#EEF2FF] to-white border-[#E2E8F0]',
                      },
                      {
                        key: 'book-reviews' as const,
                        icon: BookOpen,
                        ring: 'ring-[#E2E8F0] hover:ring-[#4F46E5]/50 border-[#E2E8F0]',
                        bar: 'from-[#4F46E5] via-[#7C3AED] to-[#22D3EE]',
                        badgeClass: 'text-[#4F46E5] bg-[#EEF2FF] border-[#E2E8F0]',
                        stackBack1: 'from-[#EEF2FF] via-indigo-100/70 to-white border-[#E2E8F0]',
                        stackBack2: 'from-violet-100/80 via-[#EEF2FF] to-white border-[#E2E8F0]',
                      },
                      {
                        key: 'campus-promo' as const,
                        icon: Film,
                        ring: 'ring-[#E2E8F0] hover:ring-[#06B6D4]/50 border-[#E2E8F0]',
                        bar: 'from-[#4F46E5] via-[#6366F1] to-[#06B6D4]',
                        badgeClass: 'text-[#14213D] bg-[#ECFEFF] border-[#E2E8F0]',
                        stackBack1: 'from-[#ECFEFF] via-[#EEF2FF] to-white border-[#E2E8F0]',
                        stackBack2: 'from-[#EEF2FF] via-cyan-50 to-white border-[#E2E8F0]',
                      },
                    ] as const
                  ).map((cat, idx) => {
                    const meta = CATEGORY_METADATA[cat.key];
                    const catItems = filterAlbumItems(data.albums, cat.key);
                    const latestItem = catItems[0];
                    const secondItem = catItems[1] || latestItem;
                    const thirdItem = catItems[2] || latestItem;
                    const CatIcon = cat.icon;

                    return (
                      <motion.div
                        key={cat.key}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.12 }}
                        whileHover={{ y: -6 }}
                        transition={{ duration: 0.45, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
                        onClick={() => selectAlbumCategory(cat.key)}
                        className={`album-item group relative rounded-3xl overflow-hidden flex flex-col justify-between bg-white/95 backdrop-blur-xl border ring-1 ${cat.ring} shadow-[0_18px_38px_-14px_rgba(15,23,42,0.12),inset_0_1.5px_1px_rgba(255,255,255,1)] cursor-pointer transition-all duration-300`}
                      >
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${cat.bar}`}
                        />

                        <div>
                          {/* 3D STACKED VIDEO DECK STAGE (2-3 Corners Peeking Out with Floating Animation) */}
                          <div className="relative pt-7 px-6 pb-3">
                            {/* Back Peeking Corner Card #3 (Top-Left Tilted Corner) */}
                            <motion.div
                              aria-hidden="true"
                              animate={{ rotate: [-6.5, -8, -6.5], y: [-2, -5, -2] }}
                              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                              className={`pointer-events-none absolute inset-x-7 top-4 aspect-video rounded-2xl bg-gradient-to-br ${cat.stackBack2} border-2 shadow-md overflow-hidden origin-bottom-left -translate-x-2.5 -translate-y-2 group-hover:-rotate-11 group-hover:-translate-x-4 group-hover:-translate-y-3 transition-transform duration-300`}
                            >
                              {thirdItem && (
                                <img
                                  src={thirdItem.posterUrl}
                                  alt=""
                                  className="w-full h-full object-cover opacity-55"
                                />
                              )}
                            </motion.div>

                            {/* Back Peeking Corner Card #2 (Top-Right Tilted Corner) */}
                            <motion.div
                              aria-hidden="true"
                              animate={{ rotate: [6, 7.5, 6], y: [-1.5, -4.5, -1.5] }}
                              transition={{
                                duration: 3.8,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: 0.4,
                              }}
                              className={`pointer-events-none absolute inset-x-7 top-4 aspect-video rounded-2xl bg-gradient-to-br ${cat.stackBack1} border-2 shadow-md overflow-hidden origin-bottom-right translate-x-2.5 -translate-y-1.5 group-hover:rotate-10 group-hover:translate-x-4 group-hover:-translate-y-2.5 transition-transform duration-300`}
                            >
                              {secondItem && (
                                <img
                                  src={secondItem.posterUrl}
                                  alt=""
                                  className="w-full h-full object-cover opacity-65"
                                />
                              )}
                            </motion.div>

                            {/* Main Front Cover Frame (Shows Category 3D Visualization or Latest Video Thumbnail) */}
                            <div className="relative z-20 w-full aspect-video rounded-2xl overflow-hidden bg-slate-950/5 border-2 border-white ring-1 ring-slate-200/90 shadow-[0_14px_28px_-10px_rgba(15,23,42,0.22)]">
                              <img
                                src={latestItem?.posterUrl || meta.defaultPoster}
                                alt={meta.label}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                              />

                              {/* Top-Left Count Badge */}
                              <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between gap-2">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-white text-[10.5px] font-extrabold shadow-sm">
                                  <Video className="w-3 h-3 text-indigo-300" />
                                  <span>{catItems.length} Videos Inside</span>
                                </span>
                              </div>

                              {/* Bottom Overlay: Latest Video Indicator & "Open Category" Prompt */}
                              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/75 via-slate-950/25 to-transparent p-3 flex items-end justify-between gap-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/95 backdrop-blur-md text-slate-900 text-[11px] font-extrabold shadow-md group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                  <PlayCircle className="w-3.5 h-3.5" />
                                  <span>Open All {catItems.length} Videos</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Card Body: Category Title, Description & Sub-Category Pills */}
                          <div className="px-5 pt-2 pb-4">
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border text-[10.5px] font-bold ${cat.badgeClass}`}
                              >
                                <CatIcon className="w-3 h-3" />
                                <span>{meta.badge}</span>
                              </span>
                              {latestItem && (
                                <span className="text-[10.5px] font-bold text-slate-500 truncate max-w-[140px]">
                                  Latest: {latestItem.title}
                                </span>
                              )}
                            </div>

                            <h4 className="font-display font-extrabold text-slate-900 text-base sm:text-lg group-hover:text-indigo-600 transition leading-snug">
                              {meta.label}
                            </h4>

                            <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                              {meta.summary}
                            </p>
                          </div>
                        </div>

                        {/* Preserved Bottom Craft / Tools Bar */}
                        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-2 text-[11px] text-slate-600 font-semibold">
                          <span className="truncate">{meta.defaultTools}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* ROW 2: 4 PHOTO CATEGORY ALBUMS IN 1 ROW (WITH 2-3 PEEKING PHOTO CORNERS ANIMATION) */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-4 px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-aurora" />
                    <h3 className="font-display text-sm sm:text-base font-extrabold text-[#111827] uppercase tracking-wider">
                      Curated Photo Albums (4 in a Row · Click Any Album to Open All Photos)
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-[#0F766E] hidden sm:inline">
                    Click an album to view all photos →
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
                  {(
                    [
                      {
                        key: 'achievements' as const,
                        icon: Award,
                        ring: 'ring-[#E2E8F0] hover:ring-[#4F46E5]/50 border-[#E2E8F0]',
                        bar: 'from-[#4F46E5] via-[#7C3AED] to-[#22D3EE]',
                        badgeClass: 'text-[#4F46E5] bg-[#EEF2FF] border-[#E2E8F0]',
                        btnBg: 'bg-aurora-signature hover:brightness-110 text-white',
                        stackBack1: 'from-[#EEF2FF] via-indigo-100/70 to-white border-[#E2E8F0]',
                        stackBack2: 'from-violet-100/70 via-[#EEF2FF] to-white border-[#E2E8F0]',
                      },
                      {
                        key: 'seminars' as const,
                        icon: Users,
                        ring: 'ring-[#E2E8F0] hover:ring-[#14B8A6]/50 border-[#E2E8F0]',
                        bar: 'from-[#0F766E] via-[#14B8A6] to-[#22D3EE]',
                        badgeClass: 'text-[#0F766E] bg-[#ECFEFF] border-[#E2E8F0]',
                        btnBg: 'bg-teal-aurora hover:brightness-110 text-white',
                        stackBack1: 'from-[#ECFEFF] via-teal-100/60 to-white border-[#E2E8F0]',
                        stackBack2: 'from-cyan-100/60 via-[#ECFEFF] to-white border-[#E2E8F0]',
                      },
                      {
                        key: 'tours' as const,
                        icon: Compass,
                        ring: 'ring-[#E2E8F0] hover:ring-[#06B6D4]/50 border-[#E2E8F0]',
                        bar: 'from-[#4F46E5] via-[#6366F1] to-[#06B6D4]',
                        badgeClass: 'text-[#14213D] bg-[#ECFEFF] border-[#E2E8F0]',
                        btnBg: 'bg-indigo-cyan hover:brightness-110 text-white',
                        stackBack1: 'from-[#ECFEFF] via-[#EEF2FF] to-white border-[#E2E8F0]',
                        stackBack2: 'from-[#EEF2FF] via-cyan-50 to-white border-[#E2E8F0]',
                      },
                      {
                        key: 'personal' as const,
                        icon: Camera,
                        ring: 'ring-[#E2E8F0] hover:ring-[#7C3AED]/50 border-[#E2E8F0]',
                        bar: 'from-[#7C3AED] via-[#4F46E5] to-[#14B8A6]',
                        badgeClass: 'text-[#7C3AED] bg-[#EEF2FF] border-[#E2E8F0]',
                        btnBg: 'bg-aurora-signature hover:brightness-110 text-white',
                        stackBack1: 'from-violet-100/70 via-[#EEF2FF] to-white border-[#E2E8F0]',
                        stackBack2: 'from-[#ECFEFF] via-[#EEF2FF] to-white border-[#E2E8F0]',
                      },
                    ] as const
                  ).map((cat, idx) => {
                    const meta = CATEGORY_METADATA[cat.key];
                    const catItems = filterAlbumItems(data.albums, cat.key);
                    const latestItem = catItems[0];
                    const secondItem = catItems[1] || latestItem;
                    const thirdItem = catItems[2] || latestItem;
                    const CatIcon = cat.icon;

                    return (
                      <motion.div
                        key={cat.key}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.12 }}
                        whileHover={{ y: -6 }}
                        transition={{ duration: 0.45, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                        onClick={() => selectAlbumCategory(cat.key)}
                        className={`album-item group relative rounded-3xl overflow-hidden flex flex-col justify-between bg-white/95 backdrop-blur-xl border ring-1 ${cat.ring} shadow-[0_16px_34px_-14px_rgba(15,23,42,0.12),inset_0_1.5px_1px_rgba(255,255,255,1)] cursor-pointer transition-all duration-300`}
                      >
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${cat.bar}`}
                        />

                        <div>
                          {/* 3D STACKED PHOTO GALLERY STAGE (2-3 Photo Corners Peeking Out with Floating Animation) */}
                          <div className="relative pt-7 px-5 pb-2.5">
                            {/* Peeking Photo Corner #3 (Tilted Left Stack Card) */}
                            <motion.div
                              aria-hidden="true"
                              animate={{ rotate: [-7.5, -9.5, -7.5], y: [-2, -5, -2] }}
                              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                              className={`pointer-events-none absolute inset-x-6 top-4 aspect-video rounded-xl bg-gradient-to-br ${cat.stackBack2} border-2 border-white ring-1 ring-slate-300/80 shadow-md overflow-hidden origin-bottom-left -translate-x-2.5 -translate-y-2 group-hover:-rotate-12 group-hover:-translate-x-4 group-hover:-translate-y-3 transition-transform duration-300`}
                            >
                              {thirdItem && (
                                <img
                                  src={thirdItem.posterUrl}
                                  alt=""
                                  className="w-full h-full object-cover opacity-65"
                                />
                              )}
                            </motion.div>

                            {/* Peeking Photo Corner #2 (Tilted Right Stack Card) */}
                            <motion.div
                              aria-hidden="true"
                              animate={{ rotate: [7, 9, 7], y: [-1.5, -4.5, -1.5] }}
                              transition={{
                                duration: 3.6,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: 0.35,
                              }}
                              className={`pointer-events-none absolute inset-x-6 top-4 aspect-video rounded-xl bg-gradient-to-br ${cat.stackBack1} border-2 border-white ring-1 ring-slate-300/80 shadow-md overflow-hidden origin-bottom-right translate-x-2.5 -translate-y-1.5 group-hover:rotate-12 group-hover:translate-x-4 group-hover:-translate-y-2.5 transition-transform duration-300`}
                            >
                              {secondItem && (
                                <img
                                  src={secondItem.posterUrl}
                                  alt=""
                                  className="w-full h-full object-cover opacity-75"
                                />
                              )}
                            </motion.div>

                            {/* Front Cover Photo of the Stack */}
                            <div className="relative z-20 w-full aspect-video rounded-xl overflow-hidden bg-slate-950/5 border-2 border-white ring-1 ring-slate-200/90 shadow-[0_12px_24px_-8px_rgba(15,23,42,0.2)]">
                              <img
                                src={latestItem?.posterUrl || meta.defaultPoster}
                                alt={meta.label}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                              />

                              {/* Top-Left Photo Count Badge */}
                              <div className="absolute top-2 inset-x-2 flex items-center justify-between gap-1.5">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-extrabold shadow-sm">
                                  <Camera className="w-3 h-3 text-emerald-300" />
                                  <span>{catItems.length} Photos</span>
                                </span>
                              </div>

                              {/* Bottom Overlay: Open Album Button */}
                              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent p-2.5 flex items-end justify-between">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-md text-slate-900 text-[10.5px] font-extrabold shadow-md group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                  <Layers className="w-3 h-3" />
                                  <span>Open Album ({catItems.length})</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Card Body: Album Title, Summary & Sub-Categories */}
                          <div className="px-4 pt-2 pb-3.5">
                            <div className="flex items-center justify-between gap-1.5 mb-1">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-bold ${cat.badgeClass}`}
                              >
                                <CatIcon className="w-3 h-3" />
                                <span>{meta.badge}</span>
                              </span>
                            </div>

                            <h4 className="font-display font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-indigo-600 transition leading-snug">
                              {meta.label}
                            </h4>

                            <p className="text-slate-600 text-[11.5px] mt-1 leading-relaxed">
                              {meta.summary}
                            </p>
                          </div>
                        </div>

                        {/* Preserved Bottom Craft / Tools Bar */}
                        <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-2 text-[10.5px] text-slate-600 font-semibold">
                          <span className="truncate">{meta.defaultTools}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* =====================================================================
               INSIDE CATEGORY VIEW (OPENED WHEN CLICKING ANY OF THE 7 CATEGORIES)
               - Shows "← Back to All 7 Categories" button
               - Shows Sub-Category Filter Tabs ("ei categoryr moddhe abar category")
               - Shows all Videos (3 in a row) or all Photos (4 in a row) inside!
               - Allows adding unlimited new Videos or Photos to this category!
               ===================================================================== */
            (() => {
              const currentMeta = CATEGORY_METADATA[albumCategory];
              const isVideoCat = currentMeta.defaultMediaType === 'video';
              const allCategoryItems = filterAlbumItems(data.albums, albumCategory);
              const visibleItems = allCategoryItems;

              return (
                <motion.div
                  key={albumCategory}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-3xl bg-white/85 backdrop-blur-xl border border-slate-200/90 p-5 sm:p-7 shadow-[0_18px_40px_-16px_rgba(15,23,42,0.1)]"
                >
                  {/* Top Bar: Back Button + Category Title */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 mb-6 border-b border-[#E2E8F0]">
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => selectAlbumCategory('all')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#0B1020] hover:bg-[#4F46E5] text-white text-xs font-extrabold transition cursor-pointer shadow-xs"
                      >
                        <span>← Back to All 7 Categories</span>
                      </button>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-display text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">
                            {currentMeta.label}
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full bg-[#EEF2FF] border border-[#E2E8F0] text-[#4F46E5] text-xs font-extrabold">
                            {allCategoryItems.length}{' '}
                            {isVideoCat ? 'Videos Inside' : 'Photos Inside'}
                          </span>
                        </div>
                        <p className="text-xs text-[#475569] font-medium mt-0.5">
                          {currentMeta.summary}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* INSIDE CATEGORY GRID: 3 IN A ROW FOR VIDEOS · 4 IN A ROW FOR PHOTOS */}
                  <div
                    className={
                      isVideoCat
                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch'
                        : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch'
                    }
                  >
                    {visibleItems.map((item, idx) => {
                      const parsedVideo =
                        item.mediaType === 'video'
                          ? parseSocialVideoUrl(item.mediaUrl)
                          : { platform: 'none' as const, embedUrl: '', originalUrl: '' };

                      const hasVideoLink =
                        item.mediaType === 'video' && parsedVideo.platform !== 'none';

                      const themeStyle =
                        item.accentTheme === 'indigo' || item.accentTheme === 'amber'
                          ? {
                              ring: 'ring-[#E2E8F0] hover:ring-[#4F46E5]/50 border-[#E2E8F0]',
                              bar: 'from-[#4F46E5] via-[#7C3AED] to-[#22D3EE]',
                              badge: 'text-[#4F46E5] bg-[#EEF2FF] border-[#E2E8F0]',
                            }
                          : item.accentTheme === 'violet'
                            ? {
                                ring: 'ring-[#E2E8F0] hover:ring-[#7C3AED]/50 border-[#E2E8F0]',
                                bar: 'from-[#7C3AED] via-[#4F46E5] to-[#22D3EE]',
                                badge: 'text-[#7C3AED] bg-[#EEF2FF] border-[#E2E8F0]',
                              }
                            : item.accentTheme === 'rose' || item.accentTheme === 'sky'
                              ? {
                                  ring: 'ring-[#E2E8F0] hover:ring-[#06B6D4]/50 border-[#E2E8F0]',
                                  bar: 'from-[#4F46E5] via-[#6366F1] to-[#06B6D4]',
                                  badge: 'text-[#14213D] bg-[#ECFEFF] border-[#E2E8F0]',
                                }
                              : {
                                  ring: 'ring-[#E2E8F0] hover:ring-[#14B8A6]/50 border-[#E2E8F0]',
                                  bar: 'from-[#0F766E] via-[#14B8A6] to-[#22D3EE]',
                                  badge: 'text-[#0F766E] bg-[#ECFEFF] border-[#E2E8F0]',
                                };

                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 18 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ y: -4 }}
                          transition={{
                            duration: 0.35,
                            delay: idx * 0.04,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className={`album-item group relative rounded-2xl overflow-hidden flex flex-col justify-between bg-white/95 backdrop-blur-xl border ring-1 ${themeStyle.ring} shadow-[0_12px_28px_-12px_rgba(15,23,42,0.12),inset_0_1.5px_1px_rgba(255,255,255,1)] transition-all duration-300`}
                        >
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${themeStyle.bar}`}
                          />

                          <div>
                            <div className="relative pt-3.5 px-3.5 pb-1.5">
                              <div className="relative z-10 w-full aspect-video rounded-xl overflow-hidden bg-slate-950/5 border border-slate-200/90 shadow-[0_10px_20px_-8px_rgba(15,23,42,0.14)]">
                                {hasVideoLink ? (
                                  parsedVideo.platform === 'direct-video' ? (
                                    <video
                                      controls
                                      poster={item.posterUrl || parsedVideo.thumbnailUrl}
                                      className="w-full h-full object-cover bg-slate-950"
                                    >
                                      <source src={parsedVideo.embedUrl} type="video/mp4" />
                                    </video>
                                  ) : (
                                    <div className="relative w-full h-full bg-slate-950">
                                      {/* Clickable Thumbnail Fallback Layer Behind Iframe in Case Platform Blocks Embed */}
                                      <a
                                        href={parsedVideo.originalUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="absolute inset-0 flex items-center justify-center overflow-hidden"
                                        aria-label={`Watch ${item.title} on ${item.platformLabel || parsedVideo.platform}`}
                                      >
                                        <img
                                          src={
                                            item.posterUrl ||
                                            parsedVideo.thumbnailUrl ||
                                            currentMeta.defaultPoster
                                          }
                                          alt={item.title}
                                          referrerPolicy="no-referrer"
                                          className="w-full h-full object-cover opacity-55"
                                        />
                                      </a>
                                      <iframe
                                        src={parsedVideo.embedUrl}
                                        title={item.title}
                                        className="relative z-10 w-full h-full border-0 bg-transparent"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                      />
                                    </div>
                                  )
                                ) : (
                                  <div
                                    onClick={() => setLightboxItem(item)}
                                    className="relative w-full h-full cursor-pointer"
                                  >
                                    <img
                                      src={item.posterUrl || currentMeta.defaultPoster}
                                      alt={item.title}
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent flex items-end justify-between p-2.5">
                                      {item.mediaType === 'video' ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-md text-indigo-700 text-[10.5px] font-extrabold shadow-md group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                          <PlayCircle className="w-3 h-3" />
                                          <span>Preview Video</span>
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-md text-slate-800 text-[10.5px] font-extrabold shadow-md group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                          <Camera className="w-3 h-3" />
                                          <span>View Photo</span>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="px-4 pt-2 pb-3.5">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span
                                  className={`px-2 py-0.5 rounded-md border text-[10px] font-bold truncate ${themeStyle.badge}`}
                                >
                                  {item.badge}
                                </span>

                                {hasVideoLink && (
                                  <a
                                    href={parsedVideo.originalUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-[10.5px] font-bold text-indigo-600 hover:text-indigo-800 shrink-0"
                                  >
                                    <span className="capitalize">
                                      {item.platformLabel || parsedVideo.platform}
                                    </span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </div>

                              <h4
                                onClick={() => setLightboxItem(item)}
                                className="font-display font-extrabold text-slate-900 text-sm sm:text-[15px] group-hover:text-indigo-600 transition cursor-pointer leading-snug"
                              >
                                {item.title}
                              </h4>

                              <p className="text-slate-600 text-[11.5px] mt-1 leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                          </div>

                          <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/75 flex items-center justify-between gap-2 text-[10.5px] text-slate-600 font-semibold">
                            <span className="truncate">{item.tools}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })()
          )}
        </section>

        {/* 4. COMPLETE CV, LEADERSHIP & CO-CURRICULAR ACTIVITIES (PREMIUM AURORA LIGHT THEME) */}
        <section id="cv" className="py-14 relative">
          {/* Gradient C — Soft Lavender Glow Ambient Background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 rounded-[2.5rem] bg-soft-lavender-glow opacity-80 border border-[#E2E8F0] shadow-[0_24px_60px_-20px_rgba(79,70,229,0.09)]"
          />

          <div className="px-4 sm:px-8 py-4">
            {/* Section Header + Luxury Glass CV Preview & Download Dock */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8 flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b border-[#E2E8F0]"
            >
              <div>
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111827] tracking-tight">
                  Leadership,{' '}
                  <span className="text-aurora-signature">
                    Co-Curricular &amp; Extra-Curricular
                  </span>{' '}
                  Activities
                </h2>
              </div>

              {/* Premium Crystal-Glass CV Preview & Download Pod */}
              <div className="relative group/cvpod shrink-0">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#4F46E5]/20 via-[#7C3AED]/18 to-[#22D3EE]/20 blur-lg opacity-80 group-hover/cvpod:opacity-100 transition duration-300"
                />
                <div className="relative flex flex-col sm:flex-row sm:items-center gap-3 p-2.5 sm:pl-4 sm:pr-3 rounded-2xl bg-white/95 backdrop-blur-xl border border-[#E2E8F0] shadow-[0_14px_34px_-12px_rgba(79,70,229,0.14)]">
                  {/* Left Document Identity Badge */}
                  <div className="flex items-center gap-3 pr-2">
                    <div className="w-10 h-10 rounded-xl bg-aurora-signature text-white flex items-center justify-center shadow-md shadow-[#4F46E5]/25 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-display font-extrabold text-[#111827] text-xs sm:text-sm">
                          Official Curriculum Vitae
                        </span>
                        <span className="px-1.5 py-0.5 rounded-md bg-[#ECFEFF] text-[#0F766E] border border-[#22D3EE]/40 text-[10px] font-bold uppercase">
                          PDF
                        </span>
                      </div>
                      <span className="text-[11px] text-[#475569] block">
                        Md. Tarikul Islam · Updated 2026
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons: Interactive Preview + Direct PDF Download */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCvPreviewModalOpen(true)}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#EEF2FF] hover:bg-indigo-100/80 text-[#4F46E5] border border-[#E2E8F0] text-xs font-bold shadow-xs transition cursor-pointer whitespace-nowrap"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#4F46E5]" />
                      Preview CV
                    </button>
                    <a
                      href={data.hero.cvFileUrl}
                      download="Md_Tarikul_Islam_CV.pdf"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-cyan hover:brightness-110 text-white text-xs font-bold shadow-md shadow-[#4F46E5]/25 hover:shadow-lg transition whitespace-nowrap"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download CV
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* SEGMENT 1 & SEGMENT 2: CO-CURRICULAR LEADERSHIP + ORGANIZED CCB EVENTS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-6">
              {/* Segment 01: Co-Curricular Activities & Leadership (6 Cols) */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.55 }}
                className="lg:col-span-6 rounded-3xl p-6 sm:p-7 bg-white/95 backdrop-blur-xl border border-[#E2E8F0] shadow-[0_14px_34px_-14px_rgba(20,33,61,0.08)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-aurora-signature text-white flex items-center justify-center shadow-sm">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#4F46E5] block">
                          Segment 01 · Co-Curricular Leadership (2026 – Present)
                        </span>
                        <h3 className="font-display font-extrabold text-lg sm:text-xl text-[#111827]">
                          Campus Clubs &amp; Executive Leadership Roles
                        </h3>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-[#4F46E5] bg-[#EEF2FF] border border-[#E2E8F0] px-2.5 py-1 rounded-full">
                      Click any role for details
                    </span>
                  </div>

                  {/* 3 Core Club Leadership Cards (Click to Expand Details) */}
                  <div className="space-y-3">
                    {(data.cv.clubRoles || []).map((roleItem) => {
                      const item =
                        roleItem.accentTone === 'indigo'
                          ? {
                              ...roleItem,
                              cardStyle:
                                'bg-gradient-to-r from-indigo-600/[0.08] via-sky-500/[0.06] to-white/95 border-2 border-indigo-400/40 hover:border-indigo-500/60',
                              badgeStyle: 'bg-indigo-600 text-white',
                              periodStyle: 'text-indigo-700 bg-indigo-100/80 border-0 border-dashed',
                              chevronStyle:
                                'text-indigo-700 bg-indigo-100/70 group-hover:bg-indigo-600 group-hover:text-white',
                              detailsBoxStyle: 'border-indigo-200/70 bg-indigo-50/40 text-indigo-950',
                            }
                          : roleItem.accentTone === 'sky'
                            ? {
                                ...roleItem,
                                cardStyle:
                                  'bg-white/90 hover:bg-sky-50/50 border border-sky-200/90 hover:border-sky-400/70',
                                badgeStyle: 'bg-sky-100 text-sky-800 border border-sky-200',
                                periodStyle: 'text-sky-700 bg-sky-50 border-0 border-dashed',
                                chevronStyle:
                                  'text-sky-700 bg-sky-100/70 group-hover:bg-sky-600 group-hover:text-white',
                                detailsBoxStyle: 'border-sky-200/70 bg-sky-50/40 text-sky-950',
                              }
                            : {
                                ...roleItem,
                                cardStyle:
                                  'bg-white/90 hover:bg-teal-50/50 border border-teal-200/90 hover:border-teal-400/70',
                                badgeStyle: 'bg-teal-100 text-teal-800 border border-teal-200',
                                periodStyle: 'text-teal-700 bg-teal-50 border border-teal-200/80',
                                chevronStyle:
                                  'text-teal-700 bg-teal-100/70 group-hover:bg-teal-600 group-hover:text-white',
                                detailsBoxStyle: 'border-teal-200/70 bg-teal-50/40 text-teal-950',
                              };
                      const isOpen = expandedRoleId === item.id;
                      return (
                        <div
                          key={item.id}
                          className={`rounded-2xl p-4 transition-all duration-200 shadow-sm ${item.cardStyle}`}
                        >
                          <button
                            type="button"
                            aria-expanded={isOpen}
                            onClick={() =>
                              setExpandedRoleId((prev) => (prev === item.id ? null : item.id))
                            }
                            className="w-full text-left group focus:outline-none"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold ${item.badgeStyle}`}
                              >
                                {item.org}
                              </span>
                              <span
                                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${item.periodStyle}`}
                              >
                                {item.period}
                              </span>
                            </div>

                            <div className="flex items-center justify-between gap-3 mt-1">
                              <h4 className="font-display font-extrabold text-slate-900 text-base sm:text-lg leading-snug">
                                {item.title}
                              </h4>
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition ${item.chevronStyle}`}
                              >
                                {isOpen ? 'Hide' : 'Details'}
                                <ChevronDown
                                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                    isOpen ? 'rotate-180' : ''
                                  }`}
                                />
                              </span>
                            </div>
                          </button>

                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                                className="overflow-hidden"
                              >
                                <div
                                  className={`mt-3 pt-3 border-t rounded-xl p-3 text-xs space-y-2 ${item.detailsBoxStyle}`}
                                >
                                  <p className="text-slate-700 leading-relaxed">{item.summary}</p>
                                  <ul className="list-disc pl-4 space-y-1 text-slate-600">
                                    {item.bullets.map((b, idx) => (
                                      <li key={idx}>{b}</li>
                                    ))}
                                  </ul>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

              {/* Segment 02: Contributed in Organizing CCB Events (6 Cols, Click to Expand Event Details) */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.55, delay: 0.08 }}
                className="lg:col-span-6 rounded-3xl p-6 sm:p-7 bg-white/95 backdrop-blur-xl border border-[#E2E8F0] shadow-[0_14px_34px_-14px_rgba(20,33,61,0.08)] flex flex-col"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-indigo-cyan text-white flex items-center justify-center shadow-sm">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#4F46E5] block">
                          Segment 02 · Event Management (2023 – Present)
                        </span>
                        <h3 className="font-display font-extrabold text-lg sm:text-xl text-[#111827]">
                          Contributed in Organizing CCB Events
                        </h3>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-[#4F46E5] bg-[#EEF2FF] border border-[#E2E8F0] px-2.5 py-1 rounded-full">
                      Click event for details
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(data.cv.organizedEvents || []).map((evItem, index) => {
                      const badgeBg =
                        evItem.accentTone === 'indigo'
                          ? 'bg-[#EEF2FF] text-[#4F46E5] border-[#E2E8F0]'
                          : evItem.accentTone === 'violet'
                            ? 'bg-[#EEF2FF] text-[#7C3AED] border-[#E2E8F0]'
                            : evItem.accentTone === 'teal'
                              ? 'bg-[#ECFEFF] text-[#0F766E] border-[#E2E8F0]'
                              : 'bg-[#ECFEFF] text-[#14213D] border-[#E2E8F0]';
                      const evOpen = expandedCcbEventId === evItem.id;
                      return (
                        <div
                          key={evItem.id}
                          className="p-4 rounded-2xl bg-[#F8FAFC] hover:bg-[#EEF2FF]/60 border border-[#E2E8F0] hover:border-[#4F46E5]/40 transition shadow-xs"
                        >
                          <button
                            type="button"
                            aria-expanded={evOpen}
                            onClick={() =>
                              setExpandedCcbEventId((prev) =>
                                prev === evItem.id ? null : evItem.id
                              )
                            }
                            className="w-full text-left flex flex-col justify-between gap-2 focus:outline-none group"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="w-6 h-6 rounded-lg bg-[#EEF2FF] text-[#4F46E5] font-display font-bold text-xs flex items-center justify-center shrink-0">
                                0{index + 1}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${badgeBg}`}
                                >
                                  {evItem.tag}
                                </span>
                                <ChevronDown
                                  className={`w-3.5 h-3.5 text-[#4F46E5] transition-transform duration-200 ${
                                    evOpen ? 'rotate-180' : ''
                                  }`}
                                />
                              </div>
                            </div>
                            <h4 className="font-display font-bold text-[#111827] text-xs sm:text-sm leading-snug group-hover:text-[#4F46E5] transition">
                              {evItem.title}
                            </h4>
                          </button>

                          <AnimatePresence initial={false}>
                            {evOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.22 }}
                                className="overflow-hidden"
                              >
                                <p className="text-[11px] text-[#475569] mt-2 pt-2 border-t border-[#E2E8F0] leading-relaxed">
                                  {evItem.desc}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* SEGMENT 3 & SEGMENT 4: SYMMETRICAL 6+6 GRID FOR WORK EXPERIENCE, TRAINING & EXTRA-CURRICULAR */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Segment 03: Work Experience & Certified Training (6 Cols, Click to Expand) */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.55 }}
                className="lg:col-span-6 rounded-3xl p-6 sm:p-7 bg-white/95 backdrop-blur-xl border border-[#E2E8F0] shadow-[0_14px_34px_-14px_rgba(20,33,61,0.08)] flex flex-col space-y-5"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-teal-aurora text-white flex items-center justify-center shadow-sm">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F766E] block">
                          Segment 03 · Work &amp; Teaching Experience
                        </span>
                        <h3 className="font-display font-extrabold text-lg sm:text-xl text-[#111827]">
                          Academic Leadership &amp; Instruction
                        </h3>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-[#0F766E] bg-[#ECFEFF] border border-[#E2E8F0] px-2.5 py-1 rounded-full">
                      Click role for details
                    </span>
                  </div>

                  <div className="space-y-3">
                    {(data.cv.workExperience || []).map((workItem) => {
                      const work =
                        workItem.accentTone === 'teal'
                          ? {
                              ...workItem,
                              badgeBg: 'bg-teal-aurora text-white',
                              periodBg: 'text-[#0F766E] bg-[#ECFEFF] border border-[#E2E8F0]',
                              cardBorder: 'border-[#E2E8F0] hover:border-[#14B8A6]/60',
                              chevronStyle:
                                'text-[#0F766E] bg-[#ECFEFF] group-hover:bg-[#0F766E] group-hover:text-white',
                            }
                          : {
                              ...workItem,
                              badgeBg: 'bg-indigo-cyan text-white',
                              periodBg: 'text-[#4F46E5] bg-[#EEF2FF] border border-[#E2E8F0]',
                              cardBorder: 'border-[#E2E8F0] hover:border-[#4F46E5]/60',
                              chevronStyle:
                                'text-[#4F46E5] bg-[#EEF2FF] group-hover:bg-[#4F46E5] group-hover:text-white',
                            };
                      const isWorkOpen = expandedWorkId === work.id;
                      return (
                        <div
                          key={work.id}
                          className={`p-4 rounded-2xl bg-[#F8FAFC] border transition shadow-xs ${work.cardBorder}`}
                        >
                          <button
                            type="button"
                            aria-expanded={isWorkOpen}
                            onClick={() =>
                              setExpandedWorkId((prev) => (prev === work.id ? null : work.id))
                            }
                            className="w-full text-left group focus:outline-none"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                              <span
                                className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${work.badgeBg}`}
                              >
                                {work.org}
                              </span>
                              <span
                                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${work.periodBg}`}
                              >
                                {work.period}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-3 mt-1">
                              <h4 className="font-display font-extrabold text-[#111827] text-base sm:text-lg leading-snug">
                                {work.title}
                              </h4>
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition ${work.chevronStyle}`}
                              >
                                {isWorkOpen ? 'Hide' : 'Details'}
                                <ChevronDown
                                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                    isWorkOpen ? 'rotate-180' : ''
                                  }`}
                                />
                              </span>
                            </div>
                          </button>

                          <AnimatePresence initial={false}>
                            {isWorkOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.22 }}
                                className="overflow-hidden"
                              >
                                <p className="text-[#475569] text-xs mt-2.5 pt-2.5 border-t border-[#E2E8F0] leading-relaxed">
                                  {work.summary}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Specialized Training & Certifications inside Segment 03 bottom */}
                <div className="mt-5 pt-4 border-t border-[#E2E8F0]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F766E] block mb-2.5">
                    Certified Training &amp; Skill Workshops
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(data.cv.certifiedTrainings || []).map((train) => (
                      <div
                        key={train.id}
                        className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-xs"
                      >
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#E2E8F0] inline-block ${
                            train.accentTone === 'teal'
                              ? 'text-[#0F766E] bg-[#ECFEFF]'
                              : 'text-[#4F46E5] bg-[#EEF2FF]'
                          }`}
                        >
                          {train.periodBadge}
                        </span>
                        <p className="font-display font-bold text-[#111827] text-xs sm:text-sm mt-1.5">
                          {train.title}
                        </p>
                        <span className="text-[11px] text-[#475569] block mt-0.5">
                          {train.skills}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Segment 04: Extra-Curricular Activities & Industrial Exposure (6 Cols) */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="lg:col-span-6 rounded-3xl p-6 sm:p-7 bg-white/95 backdrop-blur-xl border border-[#E2E8F0] shadow-[0_14px_34px_-14px_rgba(20,33,61,0.08)] flex flex-col justify-between space-y-5"
              >
                {/* Extra-Curricular Activities */}
                <div>
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-aurora-signature text-white flex items-center justify-center shadow-sm">
                      <Compass className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#7C3AED] block">
                        Segment 04 · Extra-Curricular Activities &amp; Industrial Exposure
                      </span>
                      <h3 className="font-display font-extrabold text-lg sm:text-xl text-[#111827]">
                        Extra-Curricular Pursuits &amp; Textile Mill Visits
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-xs">
                    <span className="text-xs font-bold text-[#14213D] block mb-2.5">
                      Extra-Curricular Activities (Stage, Volunteering &amp; Sports):
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(data.cv.extraCurriculars || []).map((act) => {
                        const tone =
                          act.accentTone === 'indigo'
                            ? 'bg-[#EEF2FF] text-[#4F46E5] border-[#E2E8F0]'
                            : act.accentTone === 'navy'
                              ? 'bg-[#ECFEFF] text-[#14213D] border-[#E2E8F0]'
                              : act.accentTone === 'teal'
                                ? 'bg-[#ECFEFF] text-[#0F766E] border-[#E2E8F0]'
                                : 'bg-[#EEF2FF] text-[#7C3AED] border-[#E2E8F0]';
                        return (
                          <div
                            key={act.name}
                            className={`p-2.5 rounded-xl border ${tone} flex flex-col justify-between`}
                          >
                            <span className="font-display font-bold text-xs">{act.name}</span>
                            <span className="text-[10px] opacity-80 mt-0.5">{act.type}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Industry Visits (4 Mills from CV) */}
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-xs">
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-xs font-bold text-[#14213D]">
                      Industrial Exposure &amp; Textile Factory Visits (2024 – 2026):
                    </span>
                    <span className="text-[11px] font-semibold text-[#0F766E]">
                      {(data.cv.industrialVisits || []).length} Major Plants
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(data.cv.industrialVisits || []).map((visit) => (
                      <div
                        key={visit.company}
                        className="p-2.5 rounded-xl bg-soft-lavender-glow border border-[#E2E8F0] flex items-center justify-between gap-2"
                      >
                        <div>
                          <h5 className="font-display font-bold text-[#111827] text-xs">
                            {visit.company}
                          </h5>
                          <p className="text-[10px] text-[#475569]">{visit.focus}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-teal-aurora text-white text-[10px] font-bold shrink-0">
                          {visit.year}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Interactive In-App CV PDF Preview Modal */}
            <AnimatePresence>
              {cvPreviewModalOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
                  onClick={() => setCvPreviewModalOpen(false)}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 12 }}
                    transition={{ duration: 0.25 }}
                    className="w-full max-w-4xl h-[85vh] rounded-3xl bg-white border border-sky-200 shadow-2xl overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="px-5 py-4 bg-gradient-to-r from-sky-50 via-indigo-50 to-teal-50 border-b border-sky-200/80 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-600 to-indigo-600 text-white flex items-center justify-center shadow-sm">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-display font-extrabold text-slate-900 text-sm sm:text-base">
                            Md. Tarikul Islam — Official Curriculum Vitae
                          </h4>
                          <span className="text-xs text-slate-600">
                            Verified PDF Preview · Ready to Download
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={data.hero.cvFileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold transition"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Open in New Tab
                        </a>
                        <a
                          href={data.hero.cvFileUrl}
                          download="Md_Tarikul_Islam_CV.pdf"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold shadow-sm transition"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download PDF
                        </a>
                        <button
                          type="button"
                          onClick={() => setCvPreviewModalOpen(false)}
                          className="p-2 rounded-xl bg-white/80 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 transition"
                          aria-label="Close CV Preview"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 bg-slate-100">
                      <iframe
                        src={data.hero.cvFileUrl}
                        title="Md. Tarikul Islam CV Preview"
                        className="w-full h-full border-0"
                      />
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* 6. EASY CONTACT HUB */}
        <section id="contact" className="pt-12 pb-6">

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#FFFFFF_0%,#EEF2FF_55%,#ECFEFF_100%)] backdrop-blur-2xl border border-[#E2E8F0] shadow-[0_28px_80px_-24px_rgba(20,33,61,0.12)] p-7 sm:p-10 lg:p-12"
          >
            {/* Ambient Lavender-to-Cyan Background Glows & Grid Mesh */}
            <div className="pointer-events-none absolute -top-28 -left-24 w-96 h-96 rounded-full bg-gradient-to-br from-[#4F46E5]/12 via-[#7C3AED]/10 to-transparent blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 -right-24 w-96 h-96 rounded-full bg-gradient-to-tr from-[#22D3EE]/14 via-[#14B8A6]/10 to-[#4F46E5]/10 blur-3xl" />
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #14213D 1px, transparent 1px), linear-gradient(to bottom, #14213D 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left Column: High-Graphic Visual Header & Interactive Social/Contact Channels (7 cols) */}
              <div className="lg:col-span-7 space-y-7">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#E2E8F0] shadow-xs mb-3.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14B8A6] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#14B8A6]" />
                      </span>
                      <span className="text-[#4F46E5] text-xs font-bold tracking-wider uppercase">
                        {data.contact.kicker}
                      </span>
                    </div>

                    <h2
                      style={{ textWrap: 'balance' }}
                      className="font-display text-3xl sm:text-4xl font-bold text-[#111827] tracking-tight leading-tight"
                    >
                      {data.contact.headline}
                    </h2>
                    <p className="text-[#475569] text-sm sm:text-base mt-3 leading-relaxed">
                      {data.contact.description}
                    </p>
                  </div>

                  {/* High-Graphic Animated 3D Orbital Signal Hub SVG Visualization */}
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative shrink-0 self-start sm:self-center w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-midnight-cinematic p-3 shadow-xl shadow-[#0B1020]/20 border border-[#4F46E5]/30 flex items-center justify-center overflow-hidden"
                    aria-hidden="true"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,0.26),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(124,58,237,0.26),transparent_55%)]" />
                    <svg viewBox="0 0 120 120" className="w-full h-full relative z-10 overflow-visible">
                      <defs>
                        <linearGradient id="contactOrbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.95" />
                          <stop offset="50%" stopColor="#7C3AED" stopOpacity="0.9" />
                          <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.95" />
                        </linearGradient>
                        <linearGradient id="contactCoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#4F46E5" />
                          <stop offset="50%" stopColor="#7C3AED" />
                          <stop offset="100%" stopColor="#22D3EE" />
                        </linearGradient>
                      </defs>

                      {/* Outer & Inner Animated Orbital Rings */}
                      <motion.circle
                        cx="60"
                        cy="60"
                        r="46"
                        fill="none"
                        stroke="url(#contactOrbitGrad)"
                        strokeWidth="1.25"
                        strokeDasharray="6 6"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                        style={{ transformOrigin: '60px 60px' }}
                      />
                      <motion.ellipse
                        cx="60"
                        cy="60"
                        rx="36"
                        ry="20"
                        fill="none"
                        stroke="#22D3EE"
                        strokeOpacity="0.5"
                        strokeWidth="1.2"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                        style={{ transformOrigin: '60px 60px' }}
                      />
                      <motion.ellipse
                        cx="60"
                        cy="60"
                        rx="20"
                        ry="36"
                        fill="none"
                        stroke="#7C3AED"
                        strokeOpacity="0.5"
                        strokeWidth="1.2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                        style={{ transformOrigin: '60px 60px' }}
                      />

                      {/* Orbiting Signal Nodes */}
                      <motion.circle
                        cx="60"
                        cy="14"
                        r="4"
                        fill="#22D3EE"
                        animate={{ scale: [1, 1.35, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                      />
                      <motion.circle
                        cx="102"
                        cy="68"
                        r="3.5"
                        fill="#818CF8"
                        animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                      />
                      <motion.circle
                        cx="22"
                        cy="76"
                        r="3.5"
                        fill="#14B8A6"
                        animate={{ scale: [1, 1.35, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 1.1 }}
                      />

                      {/* Central 3D Prism Core */}
                      <rect
                        x="40"
                        y="40"
                        width="40"
                        height="40"
                        rx="12"
                        fill="url(#contactCoreGrad)"
                      />
                      <path
                        d="M49 53L60 61L71 53M49 67H71V53H49V67Z"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                </div>

                {/* High-Graphic Interactive Channel Cards Grid (Email, WhatsApp, Instagram, Facebook, LinkedIn) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Email Card */}
                  <motion.a
                    whileHover={{ y: -3, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    href={`mailto:${data.contact.email}`}
                    className="group relative overflow-hidden rounded-2xl p-4 bg-indigo-cyan text-white shadow-lg shadow-[#4F46E5]/20 border border-[#4F46E5]/30 flex items-center justify-between gap-2.5 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shrink-0">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-[#EEF2FF]">
                          Direct Inbox
                        </span>
                        <span className="block font-display font-bold text-sm sm:text-base text-white">
                          Email Me
                        </span>
                        <span className="block text-[10.5px] text-[#EEF2FF]/95 whitespace-nowrap">
                          {data.contact.email}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition shrink-0" />
                  </motion.a>

                  {/* WhatsApp Card */}
                  <motion.a
                    whileHover={{ y: -3, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    href={data.contact.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative overflow-hidden rounded-2xl p-4 bg-white hover:bg-[#ECFEFF]/60 border border-[#E2E8F0] hover:border-[#14B8A6]/60 shadow-sm hover:shadow-md flex items-center justify-between gap-2.5 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-teal-aurora text-white shadow-md shadow-[#14B8A6]/25 flex items-center justify-center shrink-0">
                        <PhoneCall className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-[#0F766E]">
                          Instant Chat
                        </span>
                        <span className="block font-display font-bold text-sm sm:text-base text-[#111827]">
                          WhatsApp
                        </span>
                        <span className="block text-[11px] text-[#475569]">
                          Fast voice &amp; text reply
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#475569] group-hover:text-[#0F766E] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition shrink-0" />
                  </motion.a>
                </div>

                {/* Social Channels Row: Instagram, Facebook, LinkedIn */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Instagram */}
                  <motion.a
                    whileHover={{ y: -3, scale: 1.015 }}
                    whileTap={{ scale: 0.99 }}
                    href={data.contact.instagramUrl || 'https://www.instagram.com/tarik827a'}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative overflow-hidden rounded-2xl p-3.5 bg-white hover:bg-[#EEF2FF]/65 border border-[#E2E8F0] hover:border-[#7C3AED]/45 shadow-xs hover:shadow-md flex items-center justify-between gap-2 transition"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-aurora-signature text-white shadow-md shadow-[#7C3AED]/20 flex items-center justify-center shrink-0">
                        <Instagram className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <span className="block font-display font-bold text-sm text-[#111827] group-hover:text-[#7C3AED] transition">
                          Instagram
                        </span>
                        <span className="block text-[11px] font-medium text-[#475569]">
                          @tarik827a
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#475569] group-hover:text-[#7C3AED] transition shrink-0" />
                  </motion.a>

                  {/* Facebook */}
                  <motion.a
                    whileHover={{ y: -3, scale: 1.015 }}
                    whileTap={{ scale: 0.99 }}
                    href={data.contact.facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative overflow-hidden rounded-2xl p-3.5 bg-white hover:bg-[#EEF2FF]/65 border border-[#E2E8F0] hover:border-[#4F46E5]/45 shadow-xs hover:shadow-md flex items-center justify-between gap-2 transition"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#14213D] text-white shadow-md shadow-[#4F46E5]/20 flex items-center justify-center shrink-0">
                        <Facebook className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <span className="block font-display font-bold text-sm text-[#111827] group-hover:text-[#4F46E5] transition">
                          Facebook
                        </span>
                        <span className="block text-[11px] font-medium text-[#475569]">
                          Social Feed
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#475569] group-hover:text-[#4F46E5] transition shrink-0" />
                  </motion.a>

                  {/* LinkedIn */}
                  <motion.a
                    whileHover={{ y: -3, scale: 1.015 }}
                    whileTap={{ scale: 0.99 }}
                    href={data.contact.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative overflow-hidden rounded-2xl p-3.5 bg-white hover:bg-[#ECFEFF]/65 border border-[#E2E8F0] hover:border-[#06B6D4]/45 shadow-xs hover:shadow-md flex items-center justify-between gap-2 transition"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-indigo-cyan text-white shadow-md shadow-[#06B6D4]/20 flex items-center justify-center shrink-0">
                        <Linkedin className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <span className="block font-display font-bold text-sm text-[#111827] group-hover:text-[#4F46E5] transition">
                          LinkedIn
                        </span>
                        <span className="block text-[11px] font-medium text-[#475569]">
                          Network
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#475569] group-hover:text-[#4F46E5] transition shrink-0" />
                  </motion.a>
                </div>
              </div>

              {/* Right Column: Pure White Direct Message Form Card (5 cols) */}
              <div className="lg:col-span-5">
                <div className="relative rounded-3xl bg-white p-6 sm:p-7 border border-[#E2E8F0] shadow-[0_18px_50px_-15px_rgba(20,33,61,0.09)]">
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#4F46E5]">
                        Quick Dispatch
                      </span>
                      <h3 className="font-display font-bold text-[#111827] text-lg">
                        Send a Direct Message
                      </h3>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-[#EEF2FF] border border-[#E2E8F0] flex items-center justify-center text-[#4F46E5] shrink-0">
                      <Send className="w-4 h-4" />
                    </div>
                  </div>

                  <form onSubmit={handleContactSubmit} noValidate className="space-y-4">
                    {contactError && (
                      <div
                        role="alert"
                        className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium"
                      >
                        {contactError}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                        Your Name
                        <input
                          type="text"
                          name="name"
                          placeholder="Your Name"
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className="mt-1.5 w-full px-4 py-3 rounded-xl bg-[#F8FAFC] focus:bg-white border border-[#E2E8F0] text-[#111827] text-sm transition focus:outline-none focus:border-[#4F46E5] focus:ring-3 focus:ring-[#4F46E5]/10"
                        />
                      </label>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                        Your Email Address
                        <input
                          type="email"
                          name="email"
                          placeholder="Your Email Address"
                          value={contactForm.email}
                          onChange={(e) =>
                            setContactForm({
                              ...contactForm,
                              name: contactForm.name,
                              email: e.target.value,
                            })
                          }
                          className="mt-1.5 w-full px-4 py-3 rounded-xl bg-[#F8FAFC] focus:bg-white border border-[#E2E8F0] text-[#111827] text-sm transition focus:outline-none focus:border-[#4F46E5] focus:ring-3 focus:ring-[#4F46E5]/10"
                        />
                      </label>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                        Message
                        <textarea
                          name="message"
                          rows={3}
                          placeholder="Write your message here..."
                          value={contactForm.message}
                          onChange={(e) =>
                            setContactForm({ ...contactForm, message: e.target.value })
                          }
                          className="mt-1.5 w-full px-4 py-3 rounded-xl bg-[#F8FAFC] focus:bg-white border border-[#E2E8F0] text-[#111827] text-sm transition focus:outline-none focus:border-[#4F46E5] focus:ring-3 focus:ring-[#4F46E5]/10"
                        />
                      </label>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="submit"
                      className="w-full py-3.5 px-5 rounded-xl bg-aurora-signature hover:brightness-105 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-[#4F46E5]/25 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </motion.button>
                  </form>

                  {submittedMessages.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-[#E2E8F0] space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0F766E]">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Message Recorded ({submittedMessages.length})</span>
                      </div>
                      {submittedMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#475569]"
                        >
                          <p className="font-semibold text-[#111827]">
                            {msg.name} ({msg.email})
                          </p>
                          <p className="text-[#475569] mt-1">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          <footer className="mt-12 rounded-2xl bg-midnight-cinematic border border-indigo-400/20 px-6 py-5 text-center text-xs text-[#F8FAFC]/85 shadow-lg shadow-[#0B1020]/15">
            <p>
              © 2026 <span className="font-semibold text-[#22D3EE]">{data.hero.name}</span>. Crafted with modern UI &amp; precision.
            </p>
          </footer>
        </section>
      </main>

      {/* FULLSCREEN READ-ONLY PHOTO & VIDEO LIGHTBOX MODAL */}
      {lightboxItem &&
        (() => {
          const parsedLightboxVideo =
            lightboxItem.mediaType === 'video'
              ? parseSocialVideoUrl(lightboxItem.mediaUrl)
              : { platform: 'none' as const, embedUrl: '', originalUrl: '' };
          const hasLightboxVideo =
            lightboxItem.mediaType === 'video' && parsedLightboxVideo.platform !== 'none';

          return (
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="lightbox-modal-title"
              className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setLightboxItem(null)}
            >
              <div
                className="max-w-3xl w-full bg-white/95 backdrop-blur-2xl border border-white rounded-3xl overflow-hidden shadow-2xl p-6 text-center relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setLightboxItem(null)}
                  aria-label="Close Lightbox"
                  className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                {hasLightboxVideo ? (
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-950">
                    {parsedLightboxVideo.platform === 'direct-video' ? (
                      <video
                        controls
                        poster={lightboxItem.posterUrl || parsedLightboxVideo.thumbnailUrl}
                        className="w-full h-full object-contain bg-slate-950"
                      >
                        <source src={parsedLightboxVideo.embedUrl} type="video/mp4" />
                      </video>
                    ) : (
                      <>
                        {/* Clickable Thumbnail Fallback Behind Iframe */}
                        <a
                          href={parsedLightboxVideo.originalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="absolute inset-0 flex items-center justify-center overflow-hidden"
                        >
                          <img
                            src={lightboxItem.posterUrl || parsedLightboxVideo.thumbnailUrl}
                            alt={lightboxItem.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover opacity-55"
                          />
                        </a>
                        <iframe
                          src={parsedLightboxVideo.embedUrl}
                          title={lightboxItem.title}
                          className="relative z-10 w-full h-full border-0 bg-transparent"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </>
                    )}
                  </div>
                ) : (
                  <img
                    src={lightboxItem.posterUrl}
                    alt={lightboxItem.title}
                    referrerPolicy="no-referrer"
                    className="max-h-[56vh] w-full object-contain mx-auto rounded-2xl border border-slate-200/80 bg-slate-50"
                  />
                )}

                <div className="mt-5 text-left space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-indigo-600">
                    <span>
                      {lightboxItem.badge} · {lightboxItem.tools}
                    </span>
                    {hasLightboxVideo && (
                      <a
                        href={parsedLightboxVideo.originalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EEF2FF] hover:bg-indigo-100 text-[#4F46E5] border border-[#E2E8F0] text-xs font-bold transition"
                      >
                        <span>
                          Watch on{' '}
                          {lightboxItem.platformLabel ||
                            parsedLightboxVideo.platform.charAt(0).toUpperCase() +
                              parsedLightboxVideo.platform.slice(1)}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <h3
                    id="lightbox-modal-title"
                    className="font-display font-extrabold text-slate-900 text-xl"
                  >
                    {lightboxItem.title}
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {lightboxItem.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
