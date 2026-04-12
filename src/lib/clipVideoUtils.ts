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

/**
 * Structured playback instruction for any component that needs to play a clip.
 */
export type PlaybackInstruction =
  | { mode: 'standalone'; src: string }
  | { mode: 'clipped'; src: string; clipStart: number; clipEnd: number }
  | { mode: 'blocked' };

export const getPlaybackInstruction = (action: {
  video_url?: string | null;
  clip_start?: number | null;
  clip_end?: number | null;
}): PlaybackInstruction => {
  if (!action.video_url) return { mode: 'blocked' };

  if (isStandaloneTrimmedClip(action.video_url)) {
    return { mode: 'standalone', src: action.video_url };
  }

  const hasBounds = action.clip_start != null && action.clip_end != null
    && action.clip_end > action.clip_start;
  if (hasBounds) {
    return { mode: 'clipped', src: action.video_url, clipStart: action.clip_start!, clipEnd: action.clip_end! };
  }

  if (isFullMatchUrl(action.video_url)) return { mode: 'blocked' };

  return { mode: 'standalone', src: action.video_url };
};

/**
 * Resolve the correct playback URL for edit-mode components.
 * @deprecated Use getPlaybackInstruction instead for strict boundary enforcement
 */
export const getEditPlaybackUrl = (action: {
  video_url?: string | null;
  clip_start?: number | null;
  clip_end?: number | null;
}): string | null => {
  if (!action.video_url) return null;
  if (isStandaloneTrimmedClip(action.video_url)) return action.video_url;
  const hasBounds = action.clip_start != null && action.clip_end != null
    && action.clip_end > action.clip_start;
  if (hasBounds && isFullMatchUrl(action.video_url)) {
    return `${action.video_url}#t=${action.clip_start},${action.clip_end}`;
  }
  if (isFullMatchUrl(action.video_url)) return null;
  return action.video_url;
};