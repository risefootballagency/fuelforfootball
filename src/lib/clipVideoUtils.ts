/**
 * Utilities for determining whether a video URL is a standalone trimmed clip
 * vs a full match video that requires clip_start/clip_end boundaries.
 */

/** Returns true if the URL is a full match video (not a standalone trimmed clip) */
export const isFullMatchUrl = (url: string): boolean => {
  if (!url) return false;
  if (url.includes('/analysis-videos/clips/')) return false;
  if (url.includes('/analysis-videos/')) return true;
  return false;
};

/** Returns true if the URL is a standalone trimmed clip that can be played directly */
export const isStandaloneTrimmedClip = (url: string): boolean => {
  if (!url) return false;
  if (url.includes('/action-clips/')) return true;
  if (url.includes('/analysis-videos/clips/')) return true;
  return false;
};

/**
 * Determine if an action has a playable clip.
 */
export const hasPlayableClip = (action: {
  video_url?: string | null;
  clip_start?: number | null;
  clip_end?: number | null;
}): boolean => {
  if (!action.video_url) return false;
  const hasTimeBounds = action.clip_start != null && action.clip_end != null && action.clip_end > action.clip_start;
  if (hasTimeBounds) return true;
  if (isStandaloneTrimmedClip(action.video_url)) return true;
  return false;
};

/**
 * For a given action, determine the playback mode.
 */
export const getPlaybackMode = (action: {
  video_url?: string | null;
  clip_start?: number | null;
  clip_end?: number | null;
}): 'clipped' | 'standalone' | 'blocked' => {
  if (!action.video_url) return 'blocked';
  const hasTimeBounds = action.clip_start != null && action.clip_end != null && action.clip_end > action.clip_start;
  if (hasTimeBounds) return 'clipped';
  if (isStandaloneTrimmedClip(action.video_url)) return 'standalone';
  return 'blocked';
};