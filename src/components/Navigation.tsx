import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GoogleAuthModal } from './GoogleAuthModal';

export type SystemView =
  | 'index'
  | 'artist'
  | 'presskit'
  | 'discovery'
  | 'stories'
  | 'studio'
  | 'reports'
  | 'mcp'
  | 'live'
  | 'console'
  | 'registry'
  | 'rem618';

interface NavigationProps {
  currentView: SystemView;
  onSelectView: (view: SystemView) => void;
  activeSection?: string;
  phase?: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onSelectView,
  activeSection = 'inicio',
  phase = 'QUE NO'
}) => {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const sections = [
    { id: 'inicio', label: 'INICIO' },
    { id: 'musica', label: 'MÚSICA' },
    { id: 'queno', label: 'QUE NO' },
    { id: 'live', label: 'LIVE' },
    { id: 'proyecto', label: 'PROYECTO' },
    { id: 'archivo', label: 'ARCHIVO' },
    { id: 'rider', label: 'RIDER' },
    { id: 'contacto', label: 'CONTACTO' },
  ];

  const primarySurfaces: Array<{ id: SystemView; label: string; badge: string }> = [
    { id: 'index', label: 'INDEX', badge: 'PUBLIC' },
    { id: 'presskit', label: 'PRESSKIT', badge: 'MEDIA' },
    { id: 'discovery', label: 'DISCOVERY MESH', badge: 'GRAPH' },
    { id: 'stories', label: 'STORIES / GAME', badge: 'LORE' },
    { id: 'studio', label: 'REPRODUCTION STUDIO', badge: 'AUDIO/VIDEO' },
    { id: 'reports', label: 'AI & CULTURE', badge: 'INTELLIGENCE' },
    { id: 'mcp', label: 'MCP CONNECTIONS', badge: 'AGENTS' },
    { id: 'live', label: '111 LIVE', badge: 'TRANSMISSION' },
    { id: 'console', label: 'CONTROL PLANE', badge: 'OPERATOR' },
    { id: 'registry', label: 'QUE NO FIELD', badge: 'REGISTRY' },
    { id: 'rem618', label: 'REM618', badge: 'HISTORICAL' },
  ];

  const handleSectionClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (currentView !== 'index') {
      onSelectView('index');
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="nav">
        <a
          className="sigil"
          href="#inicio"
          onClick={(e) => {
            e.preventDefault();
            if (currentView !== 'index') onSelectView('index');
            else window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          aria-label="KXTXR inicio"
        >
          KXTXR
        </a>

        {/* Dynamic Navigation Bar: Shows Section anchors on index, or Surface quick-links */}
        <nav aria-label="Navegación principal" className="nav-desktop-links">
          {currentView === 'index' ? (
            sections.slice(0, 5).map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={activeSection === s.id ? 'active' : ''}
                onClick={(e) => handleSectionClick(e, s.id)}
              >
                {s.label}
              </a>
            ))
          ) : (
            <div className="nav-surface-breadcrumbs">
              <button
                type="button"
                className="crumb-index"
                onClick={() => onSelectView('index')}
              >
                INDEX
              </button>
              <span className="crumb-sep">/</span>
              <span className="crumb-current">
                {primarySurfaces.find((s) => s.id === currentView)?.label || currentView.toUpperCase()}
              </span>
            </div>
          )}

          {/* Key Feature Tabs directly visible */}
          <button
            type="button"
            className={`nav-tab-btn ${currentView === 'presskit' ? 'active' : ''}`}
            onClick={() => onSelectView('presskit')}
          >
            PRESSKIT
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${currentView === 'discovery' ? 'active' : ''}`}
            onClick={() => onSelectView('discovery')}
          >
            DISCOVERY
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${currentView === 'stories' ? 'active' : ''}`}
            onClick={() => onSelectView('stories')}
          >
            STORIES
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${currentView === 'studio' ? 'active' : ''}`}
            onClick={() => onSelectView('studio')}
          >
            STUDIO
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${currentView === 'reports' ? 'active' : ''}`}
            onClick={() => onSelectView('reports')}
          >
            AI CULTURE
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${currentView === 'mcp' ? 'active' : ''}`}
            onClick={() => onSelectView('mcp')}
          >
            MCP
          </button>
        </nav>

        {/* Right Controls: Google Sign-In & Systems Menu */}
        <div className="nav-right-controls">
          {/* Google Sign-in Button */}
          {user ? (
            <button
              type="button"
              className="google-user-badge"
              onClick={() => setAuthModalOpen(true)}
              title={`Authenticated as ${user.email}`}
            >
              <span className="user-dot-verified" />
              <span className="user-email-text">{user.email}</span>
            </button>
          ) : (
            <button
              type="button"
              className="google-signin-nav-btn"
              onClick={() => setAuthModalOpen(true)}
            >
              <svg className="google-tiny-icon" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              <span>SIGN IN</span>
            </button>
          )}

          {/* Systems Matrix Switcher */}
          <button
            type="button"
            className="system-switcher-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            title="Open KXTXR Surface Matrix"
          >
            <span>SURFACES</span>
            <span className="dot-red">●</span>
          </button>
        </div>
      </header>

      {/* Systems Drawer / Switcher Modal */}
      {menuOpen && (
        <div className="system-menu-backdrop" onClick={() => setMenuOpen(false)}>
          <div className="system-menu" onClick={(e) => e.stopPropagation()}>
            <div className="system-menu-header">
              <span>KXTXR SYSTEM SURFACE MATRIX // 11 NODES</span>
              <button
                type="button"
                className="close-menu-btn"
                onClick={() => setMenuOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="system-menu-grid">
              {primarySurfaces.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  className={`system-menu-item ${currentView === v.id ? 'active' : ''}`}
                  onClick={() => {
                    onSelectView(v.id);
                    setMenuOpen(false);
                  }}
                >
                  <div className="item-meta">
                    <span className="item-badge">{v.badge}</span>
                    {currentView === v.id && <span className="active-pill">ACTIVE</span>}
                  </div>
                  <strong>{v.label}</strong>
                  <span className="item-route">
                    {v.id === 'index' && '/'}
                    {v.id === 'presskit' && '/presskit/'}
                    {v.id === 'discovery' && '/discovery/'}
                    {v.id === 'stories' && '/stories/'}
                    {v.id === 'studio' && '/studio/'}
                    {v.id === 'reports' && '/reports/'}
                    {v.id === 'mcp' && '/mcp/'}
                    {v.id === 'live' && '/artist/111/live/'}
                    {v.id === 'console' && '/console/'}
                    {v.id === 'registry' && '/edwing-registry/'}
                    {v.id === 'rem618' && '/historical/rem618/'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Google Authentication Dialog */}
      <GoogleAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
};
