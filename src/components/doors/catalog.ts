import type { DoorId } from './types';

export const DOOR_IDS = ['about', 'work', 'library', 'garden'] as const;
export const DOOR_DETAILS: Record<DoorId, { name: string; description: string; invitation: string; glimpse: string }> = {
  about: { name: 'About', description: 'The person behind the door', invitation: 'Come say hello', glimpse: 'Childhood treasures and a desk full of ideas.' },
  work: { name: 'Work', description: 'Things I’ve put into the world', invitation: 'Take a look', glimpse: 'A quiet desk and room to make something meaningful.' },
  library: { name: 'Library', description: 'A good book. A slower moment.', invitation: 'Stay a little', glimpse: 'An amber lamp, a comfortable chair, and rain at the window.' },
  garden: { name: 'Garden', description: 'Thoughts with room to grow', invitation: 'Wander in', glimpse: 'A leafy path and a patch of water. Some ideas are still growing.' },
};
