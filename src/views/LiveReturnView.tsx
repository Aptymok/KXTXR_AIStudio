import React, { useState, useEffect } from 'react';
import { SystemView } from '../components/Navigation';

interface LiveReturnViewProps {
  onNavigateToView: (view: SystemView) => void;
}

const SCHEDULE = {
  signal: '111',
  timezone: 'America/Mexico_City',
  activationAt: '2026-08-24T20:11:00-06:00',
  releaseAt: '2026-08-25T01:11:00-06:00',
  cycleMs: 60 * 60 * 1000,
  unitsPerCycle: 111,
  youtubeVideoId: 'HFO5jd4HcqM'
};

export const LiveReturnView: React.FC<LiveReturnViewProps> = ({ onNavigateToView }) => {
  const [viewMode, setViewMode] = useState<'standard' | 'clean' | 'obs'>('standard');
  const [showVideo, setShowVideo] = useState<boolean>(false);
  const [now, setNow] = useState<number>(Date.now());
  const [pulseType, setPulseType] = useState<'step' | 'cycle' | null>(null);

  // Manual cycle override for testing/inspecting
  const [manualOverride, setManualOverride] = useState<boolean>(false);
  const [overrideCycle, setOverrideCycle] = useState<number>(5);

  const activationMs = Date.parse(SCHEDULE.activationAt);
  const releaseMs = Date.parse(SCHEDULE.releaseAt);
  const totalCycles = Math.round((releaseMs - activationMs) / SCHEDULE.cycleMs);
  const unitMs = SCHEDULE.cycleMs / SCHEDULE.unitsPerCycle;

  // Real-time tick
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (value: number, width = 3) => String(Math.max(0, value)).padStart(width, '0');

  function duration(ms: number) {
    const total = Math.ceil(Math.max(0, ms) / 1000);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return `${pad(h, 2)}:${pad(m, 2)}:${pad(s, 2)}`;
  }

  // Derive transmission values
  const derive = () => {
    if (manualOverride) {
      const cycle = overrideCycle;
      const isFinal = cycle === 1;
      const isReleased = cycle === 0;
      return {
        state: isReleased ? 'released' : isFinal ? 'final' : 'active',
        cycle: isReleased ? 0 : cycle,
        value: isReleased ? 111 : 111 - ((5 - cycle) * 22),
        label: isReleased ? 'RELEASED' : isFinal ? 'FINAL CYCLE' : 'PRE-RELEASE',
        phase: isReleased ? 'RETURN COMPLETE' : isFinal ? 'FINAL RETURN SEQUENCE' : 'COUNTDOWN ACTIVE',
        remaining: isReleased ? 0 : cycle * 3600000,
        unitProgress: 0.42
      };
    }

    if (now < activationMs) {
      return {
        state: 'standby',
        cycle: totalCycles,
        value: 111,
        label: 'STANDBY',
        phase: 'SIGNAL STANDBY',
        remaining: activationMs - now,
        unitProgress: 0.1
      };
    }
    if (now >= releaseMs) {
      return {
        state: 'released',
        cycle: 0,
        value: 111,
        label: 'RELEASED',
        phase: 'RETURN COMPLETE',
        remaining: 0,
        unitProgress: 1.0
      };
    }

    const elapsed = now - activationMs;
    const completedCycles = Math.floor(elapsed / SCHEDULE.cycleMs);
    const cycle = Math.max(1, totalCycles - completedCycles);
    const withinCycle = elapsed % SCHEDULE.cycleMs;
    const completedUnits = Math.min(110, Math.floor(withinCycle / unitMs));
    const value = 111 - completedUnits;
    const isFinal = cycle === 1;

    return {
      state: isFinal ? 'final' : 'active',
      cycle,
      value,
      label: isFinal ? 'FINAL CYCLE' : 'PRE-RELEASE',
      phase: isFinal ? 'FINAL RETURN SEQUENCE' : 'COUNTDOWN ACTIVE',
      remaining: releaseMs - now,
      unitProgress: Math.max(0, Math.min(1, (withinCycle % unitMs) / unitMs))
    };
  };

  const current = derive();

  // Clock formatters
  const clockFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: SCHEDULE.timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const currentTimeStr = clockFormatter.format(new Date(now));

  const triggerPulse = (type: 'step' | 'cycle') => {
    setPulseType(type);
    setTimeout(() => setPulseType(null), 400);
  };

  return (
    <div className={`view-live ${viewMode !== 'standard' ? `view-mode-${viewMode}` : ''}`}>
      {/* Surface switcher bar */}
      <div className="live-top-toolbar">
        <button type="button" className="live-nav-btn" onClick={() => onNavigateToView('index')}>
          ← INDEX
        </button>
        <span className="live-title-badge">KXTXR · 111 / LIVE RETURN</span>
        <div className="live-view-toggles">
          <button
            type="button"
            className={viewMode === 'standard' ? 'active' : ''}
            onClick={() => setViewMode('standard')}
          >
            STANDARD
          </button>
          <button
            type="button"
            className={viewMode === 'clean' ? 'active' : ''}
            onClick={() => setViewMode('clean')}
          >
            CLEAN
          </button>
          <button
            type="button"
            className={viewMode === 'obs' ? 'active' : ''}
            onClick={() => setViewMode('obs')}
          >
            OBS
          </button>
          <button
            type="button"
            className={`video-release-toggle ${showVideo ? 'on' : ''}`}
            onClick={() => setShowVideo(!showVideo)}
          >
            {showVideo ? 'VIDEO: HELD' : 'TEST VIDEO RELEASE'}
          </button>
        </div>
      </div>

      <main className={`kx-live ${showVideo ? 'is-video-release' : ''} ${pulseType ? `is-${pulseType}` : ''}`}>
        <div className="ambient ambient--noise" aria-hidden="true" />
        <div className="ambient ambient--lines" aria-hidden="true" />
        <div className="ambient ambient--beam" aria-hidden="true" />
        <div className="ambient ambient--glitch" aria-hidden="true" />

        <section className="artboard" id="artboard" aria-label="KXTXR 111 live transmission">
          <img
            className="artboard__image"
            src="/assets/countdown_111.png"
            alt="KXTXR 111 live transmission panel"
          />
          <div className="artboard__glitch artboard__glitch--a" aria-hidden="true" />
          <div className="artboard__glitch artboard__glitch--b" aria-hidden="true" />
          <div className="artboard__scan" aria-hidden="true" />

          {/* Cycle Panel */}
          <section className="cycle-panel" aria-label="Cycle and state">
            <div className="cycle-panel__primary">
              <span className="micro-label">CYCLE</span>
              <strong>{pad(current.cycle)}</strong>
            </div>
            <div className="cycle-panel__state">
              <span className="micro-label">STATE</span>
              <strong>{current.label}</strong>
            </div>
            <div className="cycle-panel__trace">
              <span>{pad(current.cycle)} / 111</span>
              <span>SYNCED</span>
            </div>
          </section>

          {/* Signal Window */}
          <section className="signal-window" aria-label="Primary live countdown">
            <div className="screen-static" aria-hidden="true" />
            <div className="screen-lines" aria-hidden="true" />
            <div className="screen-sweep" aria-hidden="true" />
            <div className="screen-wave" aria-hidden="true">
              {Array.from({ length: 24 }).map((_, i) => (
                <i key={i} />
              ))}
            </div>

            <div className="count-stage">
              <div className="count-cycle">
                <span>CYCLE</span>
                <b>{pad(current.cycle)}</b>
              </div>
              <div className="count-value" data-value={current.value}>
                {current.value}
              </div>
              <div className="count-caption">{current.phase}</div>
              <div className="count-remaining">{duration(current.remaining)}</div>
              <div className="unit-track">
                <i style={{ transform: `scaleX(${current.unitProgress})` }} />
              </div>
              <div className="count-meta">
                <span>{currentTimeStr}</span>
                <span>25 AUG 2026 · 01:11</span>
              </div>
            </div>

            {/* Release Video Player */}
            {showVideo && (
              <div className="release-video" aria-label="KXTXR 111 official video">
                <iframe
                  className="release-video__player"
                  src={`https://www.youtube.com/embed/${SCHEDULE.youtubeVideoId}?autoplay=1&mute=0`}
                  title="KXTXR 111 Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <div className="release-video__mark">111 / RETURN</div>
              </div>
            )}
          </section>

          {/* Archive Data Telemetry */}
          <section className="archive-data" aria-label="Archive live data">
            <span className="archive-value archive-value--date">25.08.26</span>
            <span className="archive-value archive-value--time">{currentTimeStr}</span>
            <span className="archive-value archive-value--duration">{duration(current.remaining)}</span>
            <span className="archive-value archive-value--source">KXTXR / LIVE</span>
            <span className="archive-value archive-value--content">111</span>
            <span className="archive-value archive-value--notes">CYCLE {pad(current.cycle)} / {current.label}</span>
          </section>

          <div className="pulse-flash" aria-hidden="true" />
        </section>
      </main>

      {/* Manual Transmission Controls */}
      <footer className="live-controls-footer">
        <label>
          <input
            type="checkbox"
            checked={manualOverride}
            onChange={(e) => setManualOverride(e.target.checked)}
          />
          CYCLE SIMULATOR
        </label>
        {manualOverride && (
          <div className="cycle-selector">
            {[5, 4, 3, 2, 1, 0].map((c) => (
              <button
                key={c}
                type="button"
                className={overrideCycle === c ? 'active' : ''}
                onClick={() => {
                  setOverrideCycle(c);
                  triggerPulse(c === 1 ? 'cycle' : 'step');
                }}
              >
                C-{pad(c)}
              </button>
            ))}
          </div>
        )}
      </footer>
    </div>
  );
};
