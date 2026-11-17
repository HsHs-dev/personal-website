export const rooms = [
  { id: 'about', name: 'About', caption: 'The person behind the door', number: '01' },
  { id: 'work', name: 'Work', caption: 'Things I build', number: '02' },
  { id: 'library', name: 'Library', caption: 'A shelf to linger by', number: '03' },
  { id: 'garden', name: 'Garden', caption: 'Ideas with room to grow', number: '04' },
];
export const projects = [
  { slug: 'memory-sequence', title: 'Memory Sequence', kind: 'Published application', category: 'Interfaces', tech: ['React', 'State machines', 'Web Audio'], description: 'A small game about paying attention. A sequence grows, one illuminated square at a time.', challenge: 'Coordinating playback, user input, and feedback without losing track of which state the game is in.', source: 'https://github.com/HsHs-dev/react-memory-game', live: 'https://hshs-dev.github.io/react-memory-game/', visual: 'memory' },
  { slug: 'gitlet', title: 'Gitlet', kind: 'Coursework · CS61B', category: 'Systems', tech: ['Java', 'Persistence', 'Data structures'], description: 'A Git-like version-control system. Snapshots, branches, and the decisions that connect them.', challenge: 'Representing persistent history while keeping working files, staging, and branch references consistent.', source: 'https://github.com/HsHs-dev/gitlet', live: '', visual: 'git' },
  { slug: 'assembly-server', title: 'An HTTP server, close to the metal', kind: 'Educational project', category: 'Systems', tech: ['x86-64', 'Linux', 'HTTP'], description: 'A concurrent web server written in assembly, using Linux system calls directly.', challenge: 'Following a request from a socket to file I/O and back, with explicit process and resource management.', source: 'https://github.com/HsHs-dev/x86-64-webserver', live: '', visual: 'server' },
  { slug: 'typescript-applications', title: 'Learning the whole stack', kind: 'Developing coursework', category: 'Applications', tech: ['TypeScript', 'APIs', 'Testing'], description: 'Application studies connecting typed interfaces, backend boundaries, and automated checks.', challenge: 'Making invalid states and failure paths as explicit as the successful ones.', source: 'https://github.com/HsHs-dev/Typescript-Full-Stack-Open', live: '', visual: 'types' },
];
export const books = [
  { slug: 'crime-and-punishment', title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', color: '#884958', ink: '#f4ecdd', ornament: '◇', group: 'Fiction' },
  { slug: 'seven-habits', title: 'The 7 Habits of Highly Effective Teens', author: 'Sean Covey', color: '#c6a15b', ink: '#343b39', ornament: '7', group: 'Personal growth' },
  { slug: 'atomic-habits', title: 'Atomic Habits', author: 'James Clear', color: '#ead5ac', ink: '#49392f', ornament: '•••', group: 'Personal growth' },
  { slug: 'so-good', title: 'So Good They Can’t Ignore You', author: 'Cal Newport', color: '#355e5b', ink: '#f4ecdd', ornament: '✳', group: 'Making & work' },
  { slug: 'deep-work', title: 'Deep Work', author: 'Cal Newport', color: '#486c7b', ink: '#f4ecdd', ornament: '∿', group: 'Making & work' },
  { slug: 'steal-like-an-artist', title: 'Steal Like an Artist', author: 'Austin Kleon', color: '#343b39', ink: '#ead5ac', ornament: '↗', group: 'Making & work' },
];
export type NoteKind = 'Note' | 'Essay' | 'Recipe' | 'Film' | 'Game';
export const notes: {slug:string;title:string;kind:NoteKind;stage:string;topic:string;summary:string;minutes:number}[] = [
  { slug: 'learning-by-making', title: 'The distance between understanding and making', kind: 'Essay', stage: 'Growing', topic: 'Learning', summary: 'What changes when an idea has to survive contact with a real program?', minutes: 4 },
  { slug: 'small-software', title: 'A case for small, personal software', kind: 'Note', stage: 'Seedling', topic: 'Making', summary: 'Tools can begin with a single person and a very ordinary problem.', minutes: 2 },
  { slug: 'tea-after-rain', title: 'Tea after the rain', kind: 'Recipe', stage: 'Growing', topic: 'Everyday life', summary: 'A simple recipe layout for the things worth slowing down for.', minutes: 2 },
  { slug: 'quiet-in-film', title: 'What a quiet scene leaves behind', kind: 'Film', stage: 'Seedling', topic: 'Films & games', summary: 'A place for observations about atmosphere, silence, and the spaces between events.', minutes: 3 },
  { slug: 'places-in-games', title: 'The places we remember in games', kind: 'Game', stage: 'Growing', topic: 'Films & games', summary: 'Sometimes a room stays with us longer than the objective we were given.', minutes: 3 },
];
export const pageIndex = [
  ['/', 'Home', 'The four doors'], ['/about', 'About', 'Notebook & memories'], ['/work', 'Work', 'Selected projects'], ['/work/gitlet', 'Project detail', 'Decisions & evidence'], ['/library', 'Library', 'The dimensional bookshelf'], ['/library/deep-work', 'Book record', 'A quiet reading sheet'], ['/garden', 'Garden', 'Notes beside the pond'], ['/garden/learning-by-making', 'Essay', 'Long-form reading'], ['/garden/small-software', 'Seedling', 'An unfinished thought'], ['/garden/tea-after-rain', 'Recipe', 'Ingredients & steps'], ['/garden/quiet-in-film', 'Film note', 'A spoiler disclosure'], ['/garden/places-in-games', 'Game note', 'Environmental storytelling'], ['/garden/topics/learning', 'Topic path', 'Connected ideas'], ['/contact', 'Contact', 'Email & social links'], ['/search', 'Search', 'The house index'], ['/colophon', 'Colophon', 'Materials & credits'], ['/accessibility', 'Accessibility', 'Ways to explore'], ['/loading', 'Loading', 'Arrival state study'], ['/error', 'Load failure', 'Recovery state study'], ['/missing', '404', 'A door without a room'], ['/system', 'Design system', 'Colors, type & components'],
];
export const routeHref = (path: string) => path === '/' ? '#' : `#${path.replace(/^\//, '')}`;
