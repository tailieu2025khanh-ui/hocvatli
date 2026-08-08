/**
 * Helper to convert various video links (YouTube, Vimeo, MP4) into embeddable iframe/player URLs.
 */

export interface ParsedVideo {
  type: 'YOUTUBE' | 'VIMEO' | 'DIRECT_MP4' | 'IFRAME';
  embedUrl: string;
  thumbnailUrl?: string;
  originalUrl: string;
}

export function parseVideoLink(url: string): ParsedVideo {
  if (!url || typeof url !== 'string') {
    return {
      type: 'IFRAME',
      embedUrl: '',
      originalUrl: url || ''
    };
  }

  const trimmed = url.trim();

  // 1. YouTube Watch URL or Shortened URL
  // e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ
  // e.g. https://youtu.be/dQw4w9WgXcQ
  // e.g. https://www.youtube.com/shorts/dQw4w9WgXcQ
  const ytRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const ytMatch = trimmed.match(ytRegExp);

  if (ytMatch && ytMatch[2].length === 11) {
    const videoId = ytMatch[2];
    return {
      type: 'YOUTUBE',
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      originalUrl: trimmed
    };
  }

  // 2. Vimeo URL
  // e.g. https://vimeo.com/76979871
  const vimeoRegExp = /(?:vimeo\.com\/|^)(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
  const vimeoMatch = trimmed.match(vimeoRegExp);

  if (vimeoMatch && vimeoMatch[1]) {
    const vimeoId = vimeoMatch[1];
    return {
      type: 'VIMEO',
      embedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=1`,
      originalUrl: trimmed
    };
  }

  // 3. Direct MP4 / WebM video file
  if (trimmed.endsWith('.mp4') || trimmed.endsWith('.webm') || trimmed.endsWith('.ogg')) {
    return {
      type: 'DIRECT_MP4',
      embedUrl: trimmed,
      originalUrl: trimmed
    };
  }

  // 4. Fallback: treat as generic embeddable iframe URL
  return {
    type: 'IFRAME',
    embedUrl: trimmed,
    originalUrl: trimmed
  };
}
