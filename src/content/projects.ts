export interface Project {
  slug: string;
  title: string;
  tagline: string;
  href: string;
}

export const projects: Array<Project> = [
  {
    slug: "memory-sequence-game",
    title: "Memory Sequence Game",
    tagline:
      "A fast-paced memory game with smooth animations, immersive sound, and a global leaderboard.",
    href: "https://hshs-dev.github.io/react-memory-game/",
  },
  {
    slug: "brutal-tomato",
    title: "Brutal Tomato",
    tagline:
      "A bold, neobrutalist Pomodoro interface designed to make productivity more playful.",
    href: "https://brutal-tomato.netlify.app/",
  },
  {
    slug: "frontend-mentor-gallery",
    title: "Frontend Mentor Challenges Gallery",
    tagline:
      "A collection of responsive web interfaces built from real-world design challenges.",
    href: "https://hshs-dev.github.io/frontend-mentors-challenges-gallery/",
  },
];
