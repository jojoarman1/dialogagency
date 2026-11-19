// The cover box's proportions (905×660, like bymonolog.com) and the reel's share of its width before it grows
export const COVER_ASPECT_RATIO = 905 / 660
export const REEL_WIDTH_SHARE = 0.45

export interface ProjectMetric {
  // The number itself; its caption is in the dictionaries
  value: string
}

// The hover video: 1280px wide, 30 fps, no sound (ffmpeg -crf 26–30, +faststart), and its first
// frame as a poster so the box isn't empty while the video loads
export interface ProjectReel {
  video: string
  poster: string
  // The video's own width / height, so the box shows all of it without cropping
  aspectRatio: number
}

// The SVG's own size, so the image box has the logo's proportions before it loads
export interface ProjectLogo {
  src: string
  width: number
  height: number
}

export interface Project {
  slug: string
  url?: string
  metric?: ProjectMetric
  // In public/projects/<slug>/; 875×576 in the design, so ~1750px wide stays sharp on retina
  cover: string
  // The client's logo, centred over the cover; its colour doesn't matter (shown inverted)
  logo?: ProjectLogo
  reel: ProjectReel
}

// Titles, descriptions and metric captions are in the dictionaries, by slug
export const PROJECTS = [
  {
    slug: 'viceseason-undercover',
    url: 'https://viceseason.com',
    metric: { value: '42%' },
    cover: '/projects/viceseason-undercover/cover.webp',
    logo: { src: '/projects/viceseason-undercover/logo.svg', width: 802, height: 802 },
    reel: {
      video: '/projects/viceseason-undercover/reel.mp4',
      poster: '/projects/viceseason-undercover/reel-poster.jpg',
      aspectRatio: 1280 / 696
    }
  },
  {
    slug: 'saliystudio',
    url: 'https://saliyclothes.com',
    cover: '/projects/saliystudio/cover.webp',
    logo: { src: '/projects/saliystudio/logo.svg', width: 92, height: 38 },
    reel: {
      video: '/projects/saliystudio/reel.mp4',
      poster: '/projects/saliystudio/reel-poster.jpg',
      aspectRatio: 1280 / 696
    }
  },
  {
    slug: 'sushist',
    url: 'https://sushist74.ru',
    cover: '/projects/sushist/cover.webp',
    reel: {
      video: '/projects/sushist/reel.mp4',
      poster: '/projects/sushist/reel-poster.jpg',
      aspectRatio: 1280 / 696
    }
  }
] as const satisfies readonly Project[]

export type ProjectSlug = (typeof PROJECTS)[number]['slug']
