import type { CSSProperties } from 'react';

export type DoorId = 'about' | 'work' | 'library' | 'garden';
export type DoorMood = 'day' | 'night';
export type DoorInteraction = 'preview' | 'enter';

export interface DoorGalleryProps {
  /** Omit to show all four. One or two doors also work on their own. */
  doors?: readonly DoorId[];
  mood?: DoorMood;
  /** Defaults to enter when onEnter is provided, otherwise preview. */
  interaction?: DoorInteraction;
  /** Called once, after the doorway fills the view and the veil is opaque. */
  onEnter?: (door: DoorId) => void | Promise<void>;
  /** A router can preload the destination here while the animation plays. */
  onEnterStart?: (door: DoorId) => void;
  onError?: (error: Error) => void;
  /** Undefined follows the visitor's system setting. */
  reducedMotion?: boolean;
  sound?: boolean;
  maxPixelRatio?: number;
  /** Change to restore the closed gallery when keeping it mounted across routes. */
  resetKey?: string | number;
  className?: string;
  style?: CSSProperties;
}

export interface DoorGalleryHandle { reset: () => void }

export interface DoorEntranceProps extends DoorGalleryProps {
  title?: string;
  subtitle?: string;
  initialMood?: DoorMood;
  onMoodChange?: (mood: DoorMood) => void;
  showControls?: boolean;
}

export interface DoorProps extends Omit<DoorGalleryProps, 'doors'> { door: DoorId }
