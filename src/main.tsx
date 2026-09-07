import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootEl = document.getElementById('root');
console.log('main.tsx: root element found?', !!rootEl);

try {
  createRoot(rootEl!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  console.log('main.tsx: App rendered successfully');
} catch (err) {
  console.error('main.tsx: render error', err);
  if (rootEl) {
    rootEl.innerHTML = `<pre style="color:crimson">Render error: ${String(err)}</pre>`;
  }
}
