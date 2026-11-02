import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navigation, SystemView } from './components/Navigation';
import { MainView } from './views/MainView';
import { PresskitView } from './views/PresskitView';
import { DiscoveryMeshView } from './views/DiscoveryMeshView';
import { StoriesVisualGameView } from './views/StoriesVisualGameView';
import { MediaStudioView } from './views/MediaStudioView';
import { AiCultureReportsView } from './views/AiCultureReportsView';
import { McpStudioView } from './views/McpStudioView';
import { LiveReturnView } from './views/LiveReturnView';
import { ControlPlaneView } from './views/ControlPlaneView';
import { EdwingRegistryView } from './views/EdwingRegistryView';
import { HistoricalRem618View } from './views/HistoricalRem618View';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<SystemView>(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view') as SystemView;
    if (viewParam) return viewParam;

    const hash = window.location.hash.replace('#', '');
    if (hash === 'presskit') return 'presskit';
    if (hash === 'discovery') return 'discovery';
    if (hash === 'stories') return 'stories';
    if (hash === 'studio') return 'studio';
    if (hash === 'reports') return 'reports';
    if (hash === 'mcp') return 'mcp';
    if (hash === 'live-return' || hash === 'live') return 'live';
    if (hash === 'console') return 'console';
    if (hash === 'registry' || hash === 'field') return 'registry';
    if (hash === 'historical' || hash === 'rem618') return 'rem618';

    const path = window.location.pathname;
    if (path.includes('/artist/111/live')) return 'live';
    if (path.includes('/artist')) return 'stories';
    if (path.includes('/console')) return 'console';
    if (path.includes('/edwing-registry')) return 'registry';
    if (path.includes('/historical')) return 'rem618';
    if (path.includes('/presskit')) return 'presskit';

    return 'index';
  });

  const [phase, setPhase] = useState<string>('QUE NO');

  // Sync browser URL when switching view
  const handleSelectView = (view: SystemView) => {
    setCurrentView(view);
    const url = new URL(window.location.href);
    if (view === 'index') {
      url.searchParams.delete('view');
    } else {
      url.searchParams.set('view', view);
    }
    window.history.pushState({}, '', url.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      const v = (params.get('view') as SystemView) || 'index';
      setCurrentView(v);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return (
    <AuthProvider>
      <div className={`kxtxr-app view-${currentView}`}>
        <Navigation
          currentView={currentView}
          onSelectView={handleSelectView}
          phase={phase}
        />

        <main className="kxtxr-viewport-content">
          {currentView === 'index' && (
            <MainView
              onNavigateToView={handleSelectView}
              onPhaseChange={setPhase}
            />
          )}

          {currentView === 'presskit' && (
            <PresskitView onNavigateToView={handleSelectView} />
          )}

          {currentView === 'discovery' && (
            <DiscoveryMeshView onNavigateToView={handleSelectView} />
          )}

          {(currentView === 'stories' || currentView === 'artist') && (
            <StoriesVisualGameView onNavigateToView={handleSelectView} />
          )}

          {currentView === 'studio' && (
            <MediaStudioView onNavigateToView={handleSelectView} />
          )}

          {currentView === 'reports' && (
            <AiCultureReportsView onNavigateToView={handleSelectView} />
          )}

          {currentView === 'mcp' && (
            <McpStudioView onNavigateToView={handleSelectView} />
          )}

          {currentView === 'live' && (
            <LiveReturnView onNavigateToView={handleSelectView} />
          )}

          {currentView === 'console' && (
            <ControlPlaneView onNavigateToView={handleSelectView} />
          )}

          {currentView === 'registry' && (
            <EdwingRegistryView onNavigateToView={handleSelectView} />
          )}

          {currentView === 'rem618' && (
            <HistoricalRem618View onNavigateToView={handleSelectView} />
          )}
        </main>
      </div>
    </AuthProvider>
  );
};
