import {Component, StrictMode, type ReactNode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  declare props: Readonly<{ children: ReactNode }>;
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: '100vh', padding: '2rem', background: '#000204', color: '#e2e8f0' }}>
          <h1 style={{ color: '#d4af37' }}>页面加载失败</h1>
          <p>{this.state.error.message}</p>
          <p style={{ color: '#94a3b8' }}>请刷新页面，或检查浏览器控制台中的错误信息。</p>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
