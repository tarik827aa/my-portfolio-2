import test from 'node:test';
import assert from 'node:assert/strict';
import rawContentJson from '../data/content.json';
import {
  DEFAULT_PORTFOLIO_DATA,
  ContentJsonSchema,
  buildAlbumsFromContentJson,
  filterAlbumItems,
  parseSocialVideoUrl,
  updatePortfolioSection,
  validateContactSubmission,
  generateStandaloneHtml,
} from './portfolioLogic';

test('filterAlbumItems returns all 25 items for "all", 3 videos per video category, and 4 photos per photo category', () => {
  const all = filterAlbumItems(DEFAULT_PORTFOLIO_DATA.albums, 'all');
  assert.equal(all.length, 25);

  const videoCategories = ['book-reviews', 'insights', 'campus-promo'] as const;
  for (const cat of videoCategories) {
    const filtered = filterAlbumItems(DEFAULT_PORTFOLIO_DATA.albums, cat);
    assert.equal(filtered.length, 3);
    assert.equal(filtered[0].category, cat);
    assert.equal(filtered[0].mediaType, 'video');
    assert.ok(filtered[0].tools.length > 0);
  }

  const photoCategories = ['achievements', 'seminars', 'tours', 'personal'] as const;
  for (const cat of photoCategories) {
    const filtered = filterAlbumItems(DEFAULT_PORTFOLIO_DATA.albums, cat);
    assert.equal(filtered.length, 4);
    assert.equal(filtered[0].category, cat);
    assert.equal(filtered[0].mediaType, 'photo');
    assert.ok(filtered[0].tools.length > 0);
  }
});

test('buildAlbumsFromContentJson adds new video & photo items without replacing existing items, filters published:false, and sorts newest first', () => {
  const clone: ContentJsonSchema = JSON.parse(JSON.stringify(rawContentJson));

  // 1. Add a new published video to "insights" with a newer publishDate (no displayOrder needed)
  clone.videoSections.insights.items.push({
    id: 'album-insights-new',
    title: 'New GitHub Workflow Insight Video',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    platform: 'YouTube',
    description: 'Added directly via src/data/content.json on GitHub.',
    thumbnail: '/uploads/thumbnails/new-insight.jpg',
    publishDate: '2026-10-24',
    published: true,
  });

  // 2. Add an unpublished video to "insights" (should be excluded)
  clone.videoSections.insights.items.push({
    id: 'album-insights-draft',
    title: 'Hidden Draft Video',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    platform: 'YouTube',
    description: 'Should not appear when published is false.',
    thumbnail: '',
    publishDate: '2026-10-25',
    published: false,
  });

  // 3. Add a new published photo to "achievements" with displayOrder: 1 (explicit first position)
  clone.photoSections.achievements.items.push({
    id: 'album-achievements-new',
    image: '/uploads/photos/achievements/champion-crest.jpg',
    title: 'National Textile Award 2026',
    description: 'Added via GitHub web interface.',
    publishDate: '2026-10-24',
    displayOrder: 0,
    published: true,
  });

  const built = buildAlbumsFromContentJson(clone);
  const insights = filterAlbumItems(built, 'insights');
  assert.equal(insights.length, 4);
  assert.equal(insights[0].id, 'album-insights-new');
  assert.equal(insights[0].posterUrl, '/uploads/thumbnails/new-insight.jpg');
  assert.equal(
    insights.some((i) => i.id === 'album-insights-draft'),
    false
  );

  const achievements = filterAlbumItems(built, 'achievements');
  assert.equal(achievements.length, 5);
  assert.equal(achievements[0].id, 'album-achievements-new');
  assert.equal(achievements[0].posterUrl, '/uploads/photos/achievements/champion-crest.jpg');
});

test('parseSocialVideoUrl converts YouTube, Facebook, and Instagram links into embed URLs', () => {
  const yt = parseSocialVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  assert.equal(yt.platform, 'youtube');
  assert.equal(yt.embedUrl, 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0');
  assert.equal(yt.thumbnailUrl, 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg');

  const ytShort = parseSocialVideoUrl('https://youtube.com/shorts/dQw4w9WgXcQ');
  assert.equal(ytShort.platform, 'youtube');
  assert.equal(ytShort.embedUrl, 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0');

  const fb = parseSocialVideoUrl('https://www.facebook.com/reel/123456789');
  assert.equal(fb.platform, 'facebook');
  assert.ok(fb.embedUrl.includes('https://www.facebook.com/plugins/video.php'));

  const ig = parseSocialVideoUrl('https://www.instagram.com/reel/C8abc123xyz/');
  assert.equal(ig.platform, 'instagram');
  assert.equal(ig.embedUrl, 'https://www.instagram.com/reel/C8abc123xyz/embed');

  const empty = parseSocialVideoUrl('');
  assert.equal(empty.platform, 'none');
  assert.equal(empty.embedUrl, '');
});

test('highlightStrip has 4 items (Undergraduate, Content Creator, Senior Executive, Campus Ambassador) and zero Monsoon references anywhere', () => {
  assert.equal(DEFAULT_PORTFOLIO_DATA.highlightStrip.length, 4);
  assert.equal(DEFAULT_PORTFOLIO_DATA.highlightStrip[0].title, 'Undergraduate');
  assert.equal(DEFAULT_PORTFOLIO_DATA.highlightStrip[1].title, 'Content Creator');
  assert.equal(DEFAULT_PORTFOLIO_DATA.highlightStrip[2].title, 'Senior Executive');
  assert.equal(DEFAULT_PORTFOLIO_DATA.highlightStrip[3].title, 'Campus Ambassador');

  const serializedData = JSON.stringify(DEFAULT_PORTFOLIO_DATA).toLowerCase();
  assert.equal(serializedData.includes('monsoon'), false);

  const html = generateStandaloneHtml(DEFAULT_PORTFOLIO_DATA);
  assert.equal(html.toLowerCase().includes('monsoon'), false);
});

test('updatePortfolioSection updates only the targeted section immutably', () => {
  const nextStrip = [...DEFAULT_PORTFOLIO_DATA.highlightStrip];
  nextStrip[0] = { ...nextStrip[0], title: 'Lead Content Creator' };

  const updated = updatePortfolioSection(DEFAULT_PORTFOLIO_DATA, 'highlightStrip', nextStrip);
  assert.equal(updated.highlightStrip[0].title, 'Lead Content Creator');
  assert.equal(DEFAULT_PORTFOLIO_DATA.highlightStrip[0].title, 'Undergraduate');
});

test('validateContactSubmission enforces required fields and email format', () => {
  assert.equal(
    validateContactSubmission({ name: '', email: 'test@example.com', message: 'Hello world' })
      .valid,
    false
  );
  assert.equal(
    validateContactSubmission({ name: 'Tarikul', email: 'invalid-email', message: 'Hello world' })
      .valid,
    false
  );
  assert.equal(
    validateContactSubmission({ name: 'Tarikul', email: 'test@example.com', message: 'Hi' }).valid,
    false
  );
  assert.equal(
    validateContactSubmission({
      name: 'Tarikul',
      email: 'test@example.com',
      message: 'Let us collaborate on a brand project!',
    }).valid,
    true
  );
});

test('generateStandaloneHtml outputs complete valid HTML with white theme, Content Creator, and CCB role', () => {
  const html = generateStandaloneHtml(DEFAULT_PORTFOLIO_DATA);
  assert.ok(html.includes('<!DOCTYPE html>'));
  assert.ok(html.includes('Tarikul Islam'));
  assert.ok(html.includes('Content Creator'));
  assert.ok(html.includes('Senior Executive at CCB'));
  assert.ok(html.includes('#FFFFFF'));
});

