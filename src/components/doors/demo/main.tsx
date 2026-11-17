import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Preview } from './Preview';

const root = createRoot(document.getElementById('root')!);
root.render(<StrictMode><Preview /></StrictMode>);
if (import.meta.hot) import.meta.hot.dispose(() => root.unmount());
