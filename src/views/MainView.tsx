import React, { useEffect, useRef, useState } from 'react';
import { SignalFieldCanvas } from '../components/SignalFieldCanvas';
import { SystemView } from '../components/Navigation';
import {
  QueNoPiece,
  RepresentationEngineConfig,
  ReleaseItem,
  ContactData,
  RiderData,
  MediaManifestData,
  LedgerData,
  LogbookEntry
} from '../types';

interface MainViewProps {
  onNavigateToView: (view: SystemView) => void;
  onPhaseChange?: (phase: string) => void;
}

export const MainView: React.FC<MainViewProps> = ({ onNavigateToView, onPhaseChange }) => {
  // Campaign & pieces state
  const [campaignConfig, setCampaignConfig] = useState<RepresentationEngineConfig | null>(null);
  const [activePiece, setActivePiece] = useState<string>('07/12');
  const [selectedPieceData, setSelectedPieceData] = useState<QueNoPiece | null>(null);

  // Releases, Contact, Rider, Media, Ledger state
  const [releases, setReleases] = useState<ReleaseItem[]>([]);
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [riderData, setRiderData] = useState<RiderData | null>(null);
  const [mediaData, setMediaData] = useState<MediaManifestData | null>(null);
  const [ledgerData, setLedgerData] = useState<LedgerData | null>(null);
  const [logbookEntries, setLogbookEntries] = useState<LogbookEntry[]>([]);
  const [gpuState, setGpuState] = useState<string>('SIGNAL FIELD / ARMING');
  const [canonState, setCanonState] = useState<string>('CANON / LOADING');

  // Audio player state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<{ title: string; src: string; subtitle: string }>({
    title: 'REM618',
    src: '/assets/KXTXR - REM 618 master final.wav',
    subtitle: 'MASTER EN REPOSITORIO'
  });
  const [audioLevel, setAudioLevel] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Parallax mouse position
  const [mousePos, setMousePos] = useState<{ cx: number; cy: number }>({ cx: 0, cy: 0 });

  // Load backend / JSON manifests
  useEffect(() => {
    async function fetchManifests() {
      try {
        const [
          campaignRes,
          releasesRes,
          contactRes,
          riderRes,
          mediaRes,
          ledgerRes,
          logbookRes
        ] = await Promise.allSettled([
          fetch('/campaigns/que-no/representation-engine.json').then((r) => r.json()),
          fetch('/data/releases.json').then((r) => r.json()),
          fetch('/data/contact.json').then((r) => r.json()),
          fetch('/data/rider.json').then((r) => r.json()),
          fetch('/data/media-manifest.json').then((r) => r.json()),
          fetch('/grimoire/ledger.json').then((r) => r.json()),
          fetch('/grimoire/logbook.json').then((r) => r.json())
        ]);

        if (campaignRes.status === 'fulfilled' && campaignRes.value) {
          const cfg = campaignRes.value as RepresentationEngineConfig;
          setCampaignConfig(cfg);
          const initialPiece = cfg.runtime_state?.active_piece || cfg.current_piece || cfg.pieces?.[0]?.piece || '07/12';
          setActivePiece(initialPiece);
          const hit = cfg.pieces?.find((p) => p.piece === initialPiece) || cfg.pieces?.[0] || null;
          setSelectedPieceData(hit);
        }

        if (releasesRes.status === 'fulfilled' && releasesRes.value?.releases) {
          setReleases(releasesRes.value.releases);
        }

        if (contactRes.status === 'fulfilled' && contactRes.value) {
          setContactData(contactRes.value);
        }

        if (riderRes.status === 'fulfilled' && riderRes.value) {
          setRiderData(riderRes.value);
        }

        if (mediaRes.status === 'fulfilled' && mediaRes.value) {
          setMediaData(mediaRes.value);
        }

        if (ledgerRes.status === 'fulfilled' && ledgerRes.value) {
          const led = ledgerRes.value as LedgerData;
          setLedgerData(led);
          if (led.phase) onPhaseChange?.(led.phase.replace(/_/g, ' '));
          else if (led.current_state) onPhaseChange?.(led.current_state.replace(/_/g, ' '));
          setCanonState('CANON / PERSISTENT / MANIFEST-BACKED');
        }

        if (logbookRes.status === 'fulfilled' && logbookRes.value) {
          const raw = logbookRes.value;
          const entries = Array.isArray(raw) ? raw : raw?.entries || raw?.logbook || [];
          setLogbookEntries(entries.slice(-6).reverse());
        }
      } catch (err) {
        console.warn('Manifest load error:', err);
        setCanonState('CANON / SOURCE PARTIAL');
      }
    }

    fetchManifests();
  }, [onPhaseChange]);

  // Audio Reactive Setup
  const setupAudioReactive = async () => {
    if (analyserRef.current || !audioRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.78;
      analyserRef.current = analyser;

      const source = ctx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(ctx.destination);
    } catch (e) {
      console.warn('Audio Context error:', e);
    }
  };

  const measureAudio = () => {
    const analyser = analyserRef.current;
    if (!analyser) {
      setAudioLevel((prev) => prev * 0.92);
      return;
    }

    const freq = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(freq);
    let sum = 0;
    const limit = Math.min(freq.length, 72);
    for (let i = 2; i < limit; i++) {
      sum += freq[i];
    }
    const raw = sum / (70 * 255);
    const target = Math.min(1, raw * 2.1);
    setAudioLevel((prev) => {
      const next = prev + (target - prev) * 0.22;
      document.documentElement.style.setProperty('--audio', next.toFixed(3));
      return next;
    });
  };

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      await setupAudioReactive();
      if (audioContextRef.current?.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      try {
        await audio.play();
        setIsPlaying(true);
        setCurrentTrack((prev) => ({ ...prev, subtitle: 'REPRODUCIENDO / SIGNAL FIELD ACTIVE' }));
        document.body.dataset.audioActive = '1';
      } catch (e) {
        setCurrentTrack((prev) => ({ ...prev, subtitle: 'PLAYBACK BLOQUEADO POR EL NAVEGADOR' }));
      }
    } else {
      audio.pause();
      setIsPlaying(false);
      setCurrentTrack((prev) => ({ ...prev, subtitle: 'MASTER EN REPOSITORIO' }));
      document.body.dataset.audioActive = '0';
    }
  };

  const playSpecificTrack = async (title: string, src: string) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.src !== src) {
      audio.src = src;
      setCurrentTrack({ title, src, subtitle: 'CARGANDO TRACK...' });
    }
    await setupAudioReactive();
    if (audioContextRef.current?.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    try {
      await audio.play();
      setIsPlaying(true);
      setCurrentTrack({ title, src, subtitle: 'REPRODUCIENDO / SIGNAL FIELD ACTIVE' });
      document.body.dataset.audioActive = '1';
    } catch {
      setCurrentTrack({ title, src, subtitle: 'PLAYBACK BLOQUEADO' });
    }
  };

  // Continuous animation frame for audio reactivity and mouse drift
  useEffect(() => {
    let animId: number;
    const loop = () => {
      if (isPlaying) {
        measureAudio();
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  // Pointer drift tracking
  useEffect(() => {
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const handlePointerMove = (e: MouseEvent) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    let driftId: number;
    const drift = () => {
      cx += (tx - cx) * 0.045;
      cy += (ty - cy) * 0.045;
      setMousePos({ cx, cy });

      const r = document.documentElement.style;
      r.setProperty('--mx-back', `${(cx * -10).toFixed(2)}px`);
      r.setProperty('--my-back', `${(cy * -7).toFixed(2)}px`);
      r.setProperty('--mx-actor', `${(cx * 14).toFixed(2)}px`);
      r.setProperty('--my-actor', `${(cy * 8).toFixed(2)}px`);
      r.setProperty('--mx-echo', `${(cx * 30).toFixed(2)}px`);
      r.setProperty('--my-echo', `${(cy * 16).toFixed(2)}px`);

      driftId = requestAnimationFrame(drift);
    };

    driftId = requestAnimationFrame(drift);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(driftId);
    };
  }, []);

  const handlePieceSelect = (pieceId: string) => {
    setActivePiece(pieceId);
    const hit = campaignConfig?.pieces?.find((p) => p.piece === pieceId);
    if (hit) setSelectedPieceData(hit);
  };

  const pieces = campaignConfig?.pieces || [
    { piece: '07/12', state: 'MEMORY', objective: 'identification + transmission', status: 'READY' },
    { piece: '08/12', state: 'RETURN', objective: 'let observed reception modify the field', status: 'WAIT_RETURN_07' },
    { piece: '09/12', state: 'EMITTER', objective: 'associate work → KXTXR', status: 'CONDITIONAL' },
    { piece: '10/12', state: 'EMBODIMENT', objective: 'voice + body + performance', status: 'CONDITIONAL' },
    { piece: '11/12', state: 'INVOCATION', objective: 'desire for access + sound recognition', status: 'CONDITIONAL' },
    { piece: '12/12', state: 'APERTURA', objective: 'listen + save + transmit', status: 'CONDITIONAL' }
  ];

  const currentPieceHit = selectedPieceData || pieces.find((p) => p.piece === activePiece) || pieces[0];

  return (
    <div className="view-index">
      {/* Decorative Overlays */}
      <div className="grain" aria-hidden="true" />
      <div className="edge" aria-hidden="true" />

      {/* Hero Section */}
      <section id="inicio" className="scene hero" data-nav="INICIO" data-source="/data/visual-system.json">
        <SignalFieldCanvas audioLevel={audioLevel} onGpuStateChange={setGpuState} />
        <div className="hero-architecture" aria-hidden="true" />
        <div className="hero-ambient" aria-hidden="true" />
        <div className="hero-portrait-echo" aria-hidden="true" />

        <figure className="hero-portrait-shell">
          <img
            className="hero-portrait"
            src="/assets/kxtxr/que-no-07-12-hero.png"
            width={1080}
            height={1350}
            alt="KXTXR · representación 07/12 de QUE NO"
            decoding="async"
          />
        </figure>

        <div className="photo-wash" aria-hidden="true" />
        <div className="signal-orbit" aria-hidden="true">
          <span>618</span>
          <i />
          <b>111</b>
        </div>

        <aside className="left-rail">
          <span>KXTXR / SIGNAL HOUSE / 2026</span>
          <i />
          <img
            className="kx-logo"
            src="/assets/kxtxr/kxtxr-logo-transparent.png"
            alt="KXTXR"
            decoding="async"
          />
          <p>MÚSICA EN SITUACIONES REALES</p>
          <i />
          <p>
            PAST.
            <br />
            PRESENT.
            <br />
            RETURN.
            <br />
            SAME SIGNAL.
          </p>
        </aside>

        <aside className="right-rail">
          <p>
            SIGNAL
            <br />
            MEMORY
            <br />
            RETURN.
          </p>
          <i />
          <b className="cross">†</b>
          <p>
            MUSIC
            <br />
            CONTEXT
            <br />
            ADAPTATION
            <br />
            MEMORY
            <br />
            PERSISTENCE
          </p>
          <i />
          <p>
            IDENTITY
            <br />
            THROUGH
            <br />
            TRANSFORMATION.
          </p>
          <div className="texture-block" />
        </aside>

        <div className="hero-status">
          <span>CURRENT FIELD</span>
          <b>QUE NO</b>
          <small id="heroPiece">
            {currentPieceHit.piece} · {currentPieceHit.state}
          </small>
          <em id="gpuState">{gpuState}</em>
        </div>

        {/* Hero Audio Player */}
        <div className="player">
          <button
            id="play"
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pausar' : 'Reproducir REM618'}
          >
            <span>{isPlaying ? 'Ⅱ' : '▶'}</span>
          </button>
          <div>
            <b id="nowTitle">{currentTrack.title}</b>
            <small id="nowState">{currentTrack.subtitle}</small>
          </div>
          <div className="wave" id="wave" style={{ opacity: isPlaying ? 1 : 0.45 }}>
            {Array.from({ length: 54 }).map((_, i) => (
              <i
                key={i}
                style={{
                  height: `${7 + Math.abs(Math.sin(i * 0.71)) * 29}px`,
                  animationDelay: `${-i * 0.035}s`
                }}
              />
            ))}
          </div>
          <audio
            ref={audioRef}
            preload="metadata"
            src={currentTrack.src}
            onEnded={() => {
              setIsPlaying(false);
              setCurrentTrack((prev) => ({ ...prev, subtitle: 'MASTER EN REPOSITORIO' }));
            }}
          />
        </div>

        <footer className="hero-foot">
          <span>
            KXTXR
            <br />
            SIGNAL / PRESS
          </span>
          <span>01 / 08</span>
          <span>
            HUMAN / DIGITAL / PERSISTENT
            <br />
            THE SIGNAL PERSISTS.
          </span>
        </footer>
      </section>

      {/* Música / Lineage Section */}
      <section id="musica" className="scene panel" data-nav="MÚSICA" data-source="/data/releases.json">
        <div className="source-stamp">BACKED BY /data/releases.json</div>
        <div className="eyebrow">02 · MÚSICA / LINEAGE</div>
        <h2>
          ESCUCHA.
          <br />
          EXPLORA.
          <br />
          SIGUE.
        </h2>

        <div className="release-list" id="releaseList">
          <article className="track" data-hydrated="1">
            <span>01</span>
            <h3>REM618</h3>
            <p>OPENING SIGNAL · MASTER EN REPOSITORIO</p>
            <button
              type="button"
              className="track-play"
              onClick={() => playSpecificTrack('REM618', '/assets/KXTXR - REM 618 master final.wav')}
            >
              REPRODUCIR →
            </button>
            <button
              type="button"
              className="text-link"
              onClick={() => onNavigateToView('rem618')}
            >
              ARCHIVO →
            </button>
          </article>

          <article data-hydrated="1">
            <span>02</span>
            <h3>111</h3>
            <p>MEMORY / CALIBRATION / TRANSFORMATION</p>
            <button
              type="button"
              className="text-link"
              onClick={() => onNavigateToView('artist')}
            >
              ENTRAR AL FILM →
            </button>
          </article>

          <article className="is-current" data-hydrated="1">
            <span>03</span>
            <h3>QUE NO</h3>
            <p>REPRESENTATION FIELD · 07/12–12/12</p>
            <a href="#queno">CAMPO ACTIVO →</a>
          </article>
        </div>
      </section>

      {/* QUE NO Representation Engine */}
      <section id="queno" className="scene que-no" data-nav="QUE NO" data-source="/campaigns/que-no/representation-engine.json">
        <img className="que-no-topology" src="/assets/system/que-no-topology.svg" alt="" aria-hidden="true" />
        <div className="que-no-bg" aria-hidden="true">
          NO
        </div>

        <div className="que-no-grid">
          <div className="que-no-copy reveal is-visible">
            <div className="source-stamp">BACKED BY /campaigns/que-no/representation-engine.json</div>
            <div className="eyebrow">03 · CURRENT FIELD / QUE NO</div>
            <h2>
              NO ES
              <br />
              UN POST.
              <br />
              ES UNA
              <br />
              SECUENCIA.
            </h2>
            <p>
              Seis representaciones. Una identidad. Cada pieza cambia sólo cuando el RETURN lo justifica.
            </p>
            <button
              type="button"
              className="field-cta"
              onClick={() => onNavigateToView('registry')}
            >
              ABRIR REPRESENTATION FIELD →
            </button>
          </div>

          <div className="field-console reveal is-visible">
            <div className="field-console-head">
              <span>REPRESENTATION ENGINE</span>
              <span id="fieldConfig">GIT-BACKED / {currentPieceHit.piece}</span>
            </div>

            <div className="current-field">
              <span id="currentPiece">{currentPieceHit.piece}</span>
              <div>
                <b id="currentState">{currentPieceHit.state}</b>
                <p id="currentObjective">{currentPieceHit.objective}</p>
              </div>
            </div>

            <div className="series" id="queNoSeries" aria-label="Serie QUE NO 07/12 a 12/12">
              {pieces.map((p) => {
                const isSelected = p.piece === activePiece;
                return (
                  <button
                    key={p.piece}
                    type="button"
                    className={isSelected ? 'is-active' : ''}
                    onClick={() => handlePieceSelect(p.piece)}
                  >
                    <span>{p.piece.split('/')[0]}</span>
                    <b>{p.state}</b>
                    <small>{p.status.replace('WAIT_RETURN_07', 'WAIT').replace('CONDITIONAL', 'COND.')}</small>
                  </button>
                );
              })}
            </div>

            <div className="field-rule">
              <span>CANON ≠ EXPERIMENT</span>
              <span>KRY ≠ PLATFORM ALGORITHM</span>
            </div>
          </div>
        </div>
      </section>

      {/* Parallax Scene 09/12 */}
      <section
        id="queno-09"
        className="scene qn-parallax-scene qn-parallax-09"
        data-nav="QUE NO"
        data-piece="09/12"
      >
        <img
          className="qn-parallax-layer qn-parallax-bg"
          src="/assets/kxtxr/que-no/09-12/bg-room.webp"
          alt=""
          aria-hidden="true"
          style={{
            transform: `translate(${(mousePos.cx * 9.2).toFixed(1)}px, ${(mousePos.cy * 3.6).toFixed(1)}px)`
          }}
        />
        <div className="qn-parallax-shade" aria-hidden="true" />
        <img
          className="qn-parallax-layer qn-09-figure"
          src="/assets/kxtxr/que-no/09-12/figure.webp"
          alt="KXTXR · representación 09/12 de QUE NO"
          style={{
            transform: `translate(${(mousePos.cx * 38.6).toFixed(1)}px, ${(mousePos.cy * 15.1).toFixed(1)}px)`
          }}
        />
        <div className="qn-parallax-copy qn-copy-09">
          <span>KXTXR · 09/12</span>
          <h2>QUE NO</h2>
          <p className="qn-subtitle">ENTRE TÚ Y MIL MARES</p>
          <p className="qn-fragment">
            LO QUE SE PIERDE
            <br />
            TAMBIÉN TRANSFORMA.
          </p>
        </div>
        <div className="qn-parallax-index">09 / 12</div>
      </section>

      {/* Parallax Scene 10/12 */}
      <section
        id="queno-10"
        className="scene qn-parallax-scene qn-parallax-10"
        data-nav="QUE NO"
        data-piece="10/12"
      >
        <img
          className="qn-parallax-layer qn-parallax-bg"
          src="/assets/kxtxr/que-no/10-12/bg-room.webp"
          alt=""
          aria-hidden="true"
          style={{
            transform: `translate(${(mousePos.cx * 7.3).toFixed(1)}px, ${(mousePos.cy * 2.8).toFixed(1)}px)`
          }}
        />
        <div className="qn-parallax-shade" aria-hidden="true" />
        <img
          className="qn-parallax-layer qn-10-cassette qn-10-cassette-glow"
          src="/assets/kxtxr/que-no/10-12/cassette-ribbon.webp"
          alt=""
          aria-hidden="true"
          style={{
            transform: `translate(${(mousePos.cx * 60.7).toFixed(1)}px, ${(mousePos.cy * 23.7).toFixed(1)}px)`
          }}
        />
        <img
          className="qn-parallax-layer qn-10-cassette"
          src="/assets/kxtxr/que-no/10-12/cassette-ribbon.webp"
          alt="Casete y cinta · representación 10/12 de QUE NO"
          style={{
            transform: `translate(${(mousePos.cx * 42.3).toFixed(1)}px, ${(mousePos.cy * 16.5).toFixed(1)}px)`
          }}
        />
        <div className="qn-parallax-copy qn-copy-10">
          <span>KXTXR · 10/12</span>
          <h2>QUE NO</h2>
          <p className="qn-subtitle">FRAGMENTOS</p>
          <p className="qn-fragment">
            LA MISMA CANCIÓN
            <br />
            OTRA VEZ,
            <br />
            PERO DISTINTA.
          </p>
        </div>
        <div className="qn-parallax-index">10 / 12</div>
      </section>

      {/* Live / Presence Section */}
      <section id="live" className="scene panel live-panel" data-nav="LIVE" data-source="/data/media-manifest.json">
        <div className="source-stamp">BACKED BY /data/media-manifest.json</div>
        <div className="eyebrow">04 · LIVE / PRESENCE</div>
        <div>
          <h2>LIVE</h2>
          <p className="lead">PRESENCIA Y MATERIAL DE CAMPO.</p>
        </div>

        <div className="media-grid">
          <figure>
            <video
              controls
              preload="metadata"
              playsInline
              src="/assets/stairwell-shadow-021.mp4"
            />
            <figcaption>FIELD VIDEO · stairwell-shadow-021</figcaption>
          </figure>
          <figure>
            <video
              controls
              preload="metadata"
              playsInline
              src="/assets/traffic-white-112.mp4"
            />
            <figcaption>FIELD VIDEO · traffic-white-112</figcaption>
          </figure>
        </div>

        <p className="closing" id="mediaBoundary">
          {mediaData?.live?.some((x) => x.metadata_status !== 'VERIFIED')
            ? 'MEDIA PRESENT · DATE / VENUE / PERSON ATTRIBUTION REMAINS LIMITED UNTIL VERIFIED METADATA EXISTS.'
            : 'MEDIA METADATA VERIFIED.'}
        </p>
      </section>

      {/* Proyecto / Persistence Section */}
      <section id="proyecto" className="scene panel project" data-nav="PROYECTO" data-source="/grimoire/experiment.json">
        <div className="source-stamp">BACKED BY /grimoire/experiment.json</div>
        <div className="eyebrow">05 · PROJECT / PERSISTENCE</div>
        <h2>
          UN MISMO SISTEMA.
          <br />
          DISTINTOS CONTEXTOS.
        </h2>

        <div className="project-grid">
          <p>KXTXR permanece reconocible mientras cada objeto cambia de estado, medio, densidad y significado.</p>
          <div className="sequence">
            <span>SIGNAL</span>
            <i>→</i>
            <span>SILENCE</span>
            <i>→</i>
            <span>TRACE</span>
            <i>→</i>
            <span>MEMORY</span>
            <i>→</i>
            <span>TRANSFORMATION</span>
            <i>→</i>
            <span>RETURN</span>
            <i>→</i>
            <span>NEW SIGNAL</span>
          </div>
        </div>
      </section>

      {/* Archivo / Ledger Section */}
      <section id="archivo" className="scene panel field" data-nav="ARCHIVO" data-source="/grimoire/ledger.json">
        <div className="source-stamp">BACKED BY /grimoire/ledger.json + discovery mesh</div>
        <div className="eyebrow">06 · ARCHIVE / RETURN</div>
        <h2>
          LO QUE
          <br />
          PERMANECE.
        </h2>

        <div className="archive-links">
          <button type="button" className="text-link" onClick={() => onNavigateToView('rem618')}>
            REM618 · HISTORICAL →
          </button>
          <button type="button" className="text-link" onClick={() => onNavigateToView('artist')}>
            ARTIST · SIGNAL FILM →
          </button>
          <button type="button" className="text-link" onClick={() => onNavigateToView('live')}>
            111 · LIVE RETURN →
          </button>
          <button type="button" className="text-link" onClick={() => onNavigateToView('console')}>
            CONTROL PLANE →
          </button>
          <button type="button" className="text-link" onClick={() => onNavigateToView('registry')}>
            REPRESENTATION REGISTRY →
          </button>
        </div>

        <div id="fieldData" className="field-data">
          {logbookEntries.length > 0 ? (
            logbookEntries.map((e, idx) => (
              <article key={idx}>
                <b>{e.title || e.event || e.type || e.id || 'RETURN'}</b>
                <p>{e.date || e.timestamp || e.at || e.note || ''}</p>
              </article>
            ))
          ) : (
            <p>NO PUBLIC RETURN PROMOTED WITHOUT CANONICAL DATA.</p>
          )}
        </div>

        <p className="doctrine">
          PUBLICATION ≠ EVIDENCE · ENGAGEMENT ≠ CAUSALITY · MISSING REMAINS MISSING
        </p>
      </section>

      {/* Rider / Technical Boundary */}
      <section id="rider" className="scene panel rider" data-nav="RIDER" data-source="/data/rider.json">
        <div className="source-stamp dark">BACKED BY /data/rider.json</div>
        <div className="eyebrow">07 · RIDER / TECHNICAL BOUNDARY</div>
        <h2>
          DATOS TÉCNICOS:
          <br />
          NO PUBLICADOS SIN VERIFICACIÓN.
        </h2>

        <div className="rider-grid">
          <article>
            <b id="riderStatus">{riderData?.status ? riderData.status.replace(/_/g, ' ') : 'ESTADO'}</b>
            <p>
              No existe en main un rider técnico verificado que permita publicar input list, backline o stage plot sin inferencia.
            </p>
          </article>
          <article>
            <b>REGLA</b>
            <p>La superficie no fabrica requisitos técnicos.</p>
          </article>
          <article>
            <b>ACTUALIZACIÓN</b>
            <p>Cuando exista un rider canónico, esta vista lo consumirá como dato persistente.</p>
          </article>
        </div>
      </section>

      {/* Contacto / Exit */}
      <section id="contacto" className="scene panel contact" data-nav="CONTACTO" data-source="/data/contact.json">
        <div className="source-stamp">BACKED BY /data/contact.json</div>
        <div className="eyebrow">08 · CONTACT / EXIT</div>
        <img
          className="contact-logo"
          src="/assets/kxtxr/kxtxr-logo-transparent.png"
          alt="KXTXR"
        />
        <p>BOOKING · PROGRAMACIÓN · COLABORACIÓN · PRODUCCIÓN</p>
        <p className="contact-state" id="contactState">
          {contactData?.public_email
            ? 'PUBLIC CONTACT / VERIFIED'
            : 'CONTACTO PÚBLICO VERIFICADO: NO PRESENTE EN EL REPOSITORIO.'}
        </p>

        <div className="contact-routes" id="contactRoutes">
          {contactData?.routes?.map((r, idx) => (
            <a key={idx} href={r.url} target="_blank" rel="noreferrer">
              {r.label.toUpperCase()} ↗
            </a>
          )) || (
            <>
              <a href="https://open.spotify.com/artist/5Iwk9h7kNRB8GPNGeiRKGh" target="_blank" rel="noreferrer">
                SPOTIFY ↗
              </a>
              <a href="https://music.apple.com/mx/artist/kxtxr/6772383279" target="_blank" rel="noreferrer">
                APPLE MUSIC ↗
              </a>
              <a href="https://www.youtube.com/@kxtxrsignal" target="_blank" rel="noreferrer">
                YOUTUBE ↗
              </a>
            </>
          )}
        </div>

        <footer>
          <span id="canon">{canonState}</span>
          <span>NO OPTIMICES. REGISTRA.</span>
        </footer>
      </section>
    </div>
  );
};
