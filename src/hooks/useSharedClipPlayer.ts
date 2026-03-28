import { useRef, useState, useCallback, useEffect, useMemo } from 'react';

export interface ClipWindow {
  videoUrl: string;
  clipStart: number;
  clipEnd: number;
}

export interface SharedClipPlayerState {
  videoRef: React.RefObject<HTMLVideoElement>;
  isPlaying: boolean;
  isClipReady: boolean;
  clipError: string | null;
  progress: number;
  currentClip: ClipWindow | null;
  playClip: (clip: ClipWindow) => void;
  togglePlayPause: () => void;
  seekToRatio: (ratio: number) => void;
  stop: () => void;
  /** Attach to <video ref={videoRefCallback}> so playClip fires after mount */
  videoRefCallback: (el: HTMLVideoElement | null) => void;
}

/**
 * Shared clip player: one <video> element, many clip windows.
 * Load the source once per unique URL, then seek for each clip.
 */
export const useSharedClipPlayer = (): SharedClipPlayerState => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const loadedSourceRef = useRef<string | null>(null);
  const currentClipRef = useRef<ClipWindow | null>(null);
  const intervalRef = useRef<number | null>(null);
  const seekTimeoutRef = useRef<number | null>(null);
  const playRequestRef = useRef(0);
  const pendingClipRef = useRef<ClipWindow | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isClipReady, setIsClipReady] = useState(false);
  const [clipError, setClipError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentClip, setCurrentClip] = useState<ClipWindow | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (seekTimeoutRef.current) clearTimeout(seekTimeoutRef.current);
    };
  }, []);

  const clearSeekTimeout = useCallback(() => {
    if (seekTimeoutRef.current) {
      clearTimeout(seekTimeoutRef.current);
      seekTimeoutRef.current = null;
    }
  }, []);

  const failClosed = useCallback((message: string) => {
    const vid = videoRef.current;
    if (vid) {
      vid.pause();
      vid.removeAttribute('src');
      vid.load();
    }
    loadedSourceRef.current = null;
    currentClipRef.current = null;
    setCurrentClip(null);
    setIsPlaying(false);
    setIsClipReady(false);
    setProgress(0);
    setClipError(message);
    clearSeekTimeout();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [clearSeekTimeout]);

  const startBoundaryEnforcement = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      const vid = videoRef.current;
      const clip = currentClipRef.current;
      if (!vid || !clip) return;
      const { clipStart, clipEnd } = clip;
      const duration = clipEnd - clipStart;
      if (vid.currentTime < clipStart - 0.5 || vid.currentTime > clipEnd + 0.5) {
        failClosed('Clip unavailable. Full match playback has been blocked.');
        return;
      }
      if (vid.currentTime >= clipEnd) {
        vid.pause();
        vid.currentTime = clipStart;
        setIsPlaying(false);
        setProgress(1);
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }
      if (vid.currentTime < clipStart) {
        vid.currentTime = clipStart;
      }
      setProgress(Math.min(1, (vid.currentTime - clipStart) / duration));
    }, 100);
  }, [failClosed]);

  const playClip = useCallback((clip: ClipWindow) => {
    const vid = videoRef.current;
    if (!vid) {
      pendingClipRef.current = clip;
      currentClipRef.current = clip;
      setCurrentClip(clip);
      setProgress(0);
      setIsClipReady(false);
      setClipError(null);
      return;
    }
    pendingClipRef.current = null;
    const requestId = ++playRequestRef.current;
    if (!clip.videoUrl || clip.clipEnd <= clip.clipStart || clip.clipStart < 0) {
      failClosed('Clip unavailable. Full match playback has been blocked.');
      return;
    }
    currentClipRef.current = clip;
    setCurrentClip(clip);
    setProgress(0);
    setIsClipReady(false);
    setClipError(null);
    clearSeekTimeout();
    vid.pause();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const verifyAndPlay = () => {
      if (playRequestRef.current !== requestId) return;
      const activeClip = currentClipRef.current;
      if (!activeClip) {
        failClosed('Clip unavailable. Full match playback has been blocked.');
        return;
      }
      const landedInsideClip =
        vid.currentTime >= activeClip.clipStart - 0.5 &&
        vid.currentTime <= activeClip.clipEnd + 0.5;
      if (!landedInsideClip) {
        failClosed('Clip unavailable. Full match playback has been blocked.');
        return;
      }
      setIsClipReady(true);
      setClipError(null);
      vid.play().then(() => {
        if (playRequestRef.current !== requestId) {
          vid.pause();
          return;
        }
        setIsPlaying(true);
        startBoundaryEnforcement();
      }).catch(() => {
        failClosed('Clip unavailable. Full match playback has been blocked.');
      });
    };
    const seekAndPlay = () => {
      const onSeeked = () => {
        clearSeekTimeout();
        verifyAndPlay();
      };
      seekTimeoutRef.current = window.setTimeout(() => {
        if (playRequestRef.current === requestId) {
          failClosed('Clip unavailable. Full match playback has been blocked.');
        }
      }, 15000);
      if (Math.abs(vid.currentTime - clip.clipStart) < 0.5) {
        clearSeekTimeout();
        verifyAndPlay();
      } else {
        vid.addEventListener('seeked', onSeeked, { once: true });
        vid.currentTime = clip.clipStart;
      }
    };
    if (loadedSourceRef.current === clip.videoUrl && vid.readyState >= 1) {
      seekAndPlay();
      return;
    }
    loadedSourceRef.current = clip.videoUrl;
    vid.src = clip.videoUrl;
    vid.addEventListener('loadedmetadata', () => {
      seekAndPlay();
    }, { once: true });
    vid.load();
  }, [clearSeekTimeout, failClosed, startBoundaryEnforcement]);

  const videoRefCallback = useCallback((el: HTMLVideoElement | null) => {
    (videoRef as React.MutableRefObject<HTMLVideoElement | null>).current = el;
    if (el && pendingClipRef.current) {
      const pending = pendingClipRef.current;
      pendingClipRef.current = null;
      requestAnimationFrame(() => {
        playClip(pending);
      });
    }
  }, [playClip]);

  const togglePlayPause = useCallback(() => {
    const vid = videoRef.current;
    const clip = currentClipRef.current;
    if (!vid || !clip) return;
    if (vid.paused) {
      if (vid.currentTime >= clip.clipEnd || vid.currentTime < clip.clipStart) {
        vid.currentTime = clip.clipStart;
      }
      vid.play().then(() => {
        setIsPlaying(true);
        startBoundaryEnforcement();
      }).catch(() => {
        failClosed('Clip unavailable. Full match playback has been blocked.');
      });
    } else {
      vid.pause();
      setIsPlaying(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [failClosed, startBoundaryEnforcement]);

  const seekToRatio = useCallback((ratio: number) => {
    const vid = videoRef.current;
    const clip = currentClipRef.current;
    if (!vid || !clip) return;
    const clamped = Math.max(0, Math.min(1, ratio));
    const duration = clip.clipEnd - clip.clipStart;
    vid.currentTime = clip.clipStart + clamped * duration;
    setProgress(clamped);
  }, []);

  const stop = useCallback(() => {
    const vid = videoRef.current;
    if (vid) vid.pause();
    if (intervalRef.current) clearInterval(intervalRef.current);
    clearSeekTimeout();
    pendingClipRef.current = null;
    setIsPlaying(false);
    setIsClipReady(false);
    setClipError(null);
    setProgress(0);
    currentClipRef.current = null;
    setCurrentClip(null);
  }, [clearSeekTimeout]);

  return useMemo(() => ({
    videoRef,
    isPlaying,
    isClipReady,
    clipError,
    progress,
    currentClip,
    playClip,
    togglePlayPause,
    seekToRatio,
    stop,
    videoRefCallback,
  }), [isPlaying, isClipReady, clipError, progress, currentClip, playClip, togglePlayPause, seekToRatio, stop, videoRefCallback]);
};
