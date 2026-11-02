import React, { useState, useRef } from 'react';
import { SystemView } from '../components/Navigation';

interface HistoricalRem618ViewProps {
  onNavigateToView: (view: SystemView) => void;
}

export const HistoricalRem618View: React.FC<HistoricalRem618ViewProps> = ({ onNavigateToView }) => {
  const [density, setDensity] = useState(0.18);
  const [friction, setFriction] = useState(0.12);
  const [residue, setResidue] = useState(0.22);
  const [observability, setObservability] = useState(0.35);
  const [isOverlayCollapsed, setIsOverlayCollapsed] = useState(false);
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playFragment = (src: string, trackName: string) => {
    if (playingTrack === trackName) {
      audioRef.current?.pause();
      setPlayingTrack(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = src;
        audioRef.current.play();
        setPlayingTrack(trackName);
      }
    }
  };

  return (
    <div
      className="view-historical"
      style={{
        // @ts-ignore
        '--sfi-density': density,
        '--sfi-friction': friction,
        '--sfi-residue': residue,
        '--sfi-observability': observability
      }}
    >
      {/* Historical Top Bar */}
      <div className="historical-top-bar">
        <button
          type="button"
          className="btn-return"
          onClick={() => onNavigateToView('index')}
        >
          ← INDEX
        </button>
        <div className="historical-title-tag">
          <span>ARCHIVE_NODE // 618-HISTORICAL-LOG</span>
          <span className="dot-green" />
        </div>
        <button
          type="button"
          className="btn-registry-link"
          onClick={() => onNavigateToView('registry')}
        >
          QUE NO FIELD →
        </button>
      </div>

      <div className="historical-main-container">
        {/* Central Anomaly Visor Screen */}
        <div className="visor-screen evidence-grid">
          <div className="visor-content drift-layer">
            <span className="visor-id">ARCHIVE_NODE // INITIAL_EMISSION</span>
            <h1>REM618</h1>
            <p className="visor-quote">
              "LO OBSERVADO NO REQUIERE PERMISO PARA TRANSFORMAR EL CAMPO."
            </p>

            <div className="audio-fragments-panel">
              <span className="frag-label">ANALOG FRAGMENT PLAYBACK:</span>
              <div className="frag-buttons-row">
                <button
                  type="button"
                  className={`frag-btn ${playingTrack === 'corrupt' ? 'active' : ''}`}
                  onClick={() =>
                    playFragment('/assets/rem618-corrupt-618.mp3.mpeg', 'corrupt')
                  }
                >
                  {playingTrack === 'corrupt' ? 'PAUSE ❚❚' : 'PLAY CORRUPT 618 ▶'}
                </button>
                <button
                  type="button"
                  className={`frag-btn ${playingTrack === 'fragment' ? 'active' : ''}`}
                  onClick={() =>
                    playFragment('/assets/rem618-fragment-008.mp3.mpeg', 'fragment')
                  }
                >
                  {playingTrack === 'fragment' ? 'PAUSE ❚❚' : 'PLAY FRAGMENT 008 ▶'}
                </button>
              </div>
            </div>
          </div>
          <audio ref={audioRef} onEnded={() => setPlayingTrack(null)} />
        </div>

        {/* SFI Operative Overlay */}
        <div
          className={`sfi-operative-overlay ${isOverlayCollapsed ? 'collapsed' : ''}`}
        >
          <div
            className="sfi-overlay-header"
            onClick={() => setIsOverlayCollapsed(!isOverlayCollapsed)}
          >
            <span>SFI OPERATIVE MATRIX // CALIBRATION</span>
            <span>{isOverlayCollapsed ? '▲ EXPAND' : '▼ COLLAPSE'}</span>
          </div>

          {!isOverlayCollapsed && (
            <div className="sfi-overlay-body">
              <div className="slider-row">
                <div className="slider-label">
                  <span>DENSITY</span>
                  <b>{density.toFixed(2)}</b>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.8"
                  step="0.01"
                  value={density}
                  onChange={(e) => setDensity(Number(e.target.value))}
                />
              </div>

              <div className="slider-row">
                <div className="slider-label">
                  <span>FRICTION</span>
                  <b>{friction.toFixed(2)}</b>
                </div>
                <input
                  type="range"
                  min="0.02"
                  max="0.6"
                  step="0.01"
                  value={friction}
                  onChange={(e) => setFriction(Number(e.target.value))}
                />
              </div>

              <div className="slider-row">
                <div className="slider-label">
                  <span>RESIDUE</span>
                  <b>{residue.toFixed(2)}</b>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.75"
                  step="0.01"
                  value={residue}
                  onChange={(e) => setResidue(Number(e.target.value))}
                />
              </div>

              <div className="slider-row">
                <div className="slider-label">
                  <span>OBSERVABILITY</span>
                  <b>{observability.toFixed(2)}</b>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.9"
                  step="0.01"
                  value={observability}
                  onChange={(e) => setObservability(Number(e.target.value))}
                />
              </div>

              <div className="historical-log">
                <span className="log-heading">PERSISTENT INCIDENT LOG:</span>
                <article>
                  <b>11.06.26</b> — Opening emission of REM618 recorded.
                </article>
                <article>
                  <b>17.08.26</b> — SFI RETURN certificate calibrated.
                </article>
                <article>
                  <b>24.08.26</b> — 111 Live transmission initiated in Mexico City.
                </article>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
