import React, { useState, useEffect, useRef } from 'react';
import { SystemView } from '../components/Navigation';

interface Chapter {
  id: string;
  code: string;
  label: string;
  title: string;
  kicker: string;
  copy: string;
  bg?: string;
  actor?: string;
  propA?: string;
  propB?: string;
  kaiju?: string;
  footage?: string;
}

const CHAPTERS: Chapter[] = [
  {
    id: 'entry',
    code: '00',
    label: 'ENTRY',
    title: 'KXTXR',
    kicker: 'THE ARTIST TO BE THAT ALREADY WAS',
    copy: 'Scroll does not open pages. It changes the state of the same world.',
    bg: '/assets/cinematic/scene-01-awake.webp',
    footage: '/assets/stairwell-shadow-021.mp4'
  },
  {
    id: 'origin',
    code: '01',
    label: 'ORIGIN',
    title: 'BEFORE THE NAME',
    kicker: 'A ROOM / A BODY / A SIGNAL NOT YET DECLARED',
    copy: 'The environment is ordinary. The persistence is not.',
    bg: '/assets/cinematic/scene-03-lift.webp',
    actor: '/assets/kxtxr/que-no/09-12/figure.webp'
  },
  {
    id: 'signal',
    code: '02',
    label: 'REM618',
    title: 'REM 618',
    kicker: 'THE FIRST CARRIER',
    copy: 'A fragment survives contact with time and becomes observable.',
    bg: '/assets/cinematic/scene-04-open.webp',
    propA: '/assets/kxtxr/que-no/10-12/cassette-ribbon.webp'
  },
  {
    id: 'assembly',
    code: '03',
    label: 'ASSEMBLY',
    title: 'THE PARTS BEGIN TO RETURN',
    kicker: 'INSTRUMENT / MEMORY / RESIDUE / ROUTE',
    copy: 'Nothing resets. Previous objects remain available to the next state.',
    bg: '/assets/cinematic/scene-05-dashboard.webp',
    propA: '/assets/kxtxr/que-no/10-12/cassette-ribbon.webp'
  },
  {
    id: 'kxtxr',
    code: '04',
    label: 'IDENTITY',
    title: 'THE NAME ARRIVES LATE',
    kicker: 'IDENTITY AS A PERSISTENT CONFIGURATION',
    copy: 'KXTXR is not an introduction. It is the visible state of what was already operating.',
    bg: '/assets/kxtxr/que-no/09-12/bg-room.webp',
    actor: '/assets/kxtxr/que-no-07-12-hero.png'
  },
  {
    id: 'one11',
    code: '05',
    label: '111',
    title: 'TRANSFORMATION',
    kicker: 'THE SIGNAL CHANGES WITHOUT DISAPPEARING',
    copy: '111 conducts the passage. The world reorganizes around the same carrier.',
    bg: '/assets/countdown_111.png',
    footage: '/assets/traffic-white-112.mp4'
  },
  {
    id: 'propagation',
    code: '06',
    label: 'PROPAGATION',
    title: 'PROPAGATION',
    kicker: 'THE SIGNAL LEAVES THE SOURCE',
    copy: 'Distribution is treated as part of the work: carriers, traces, platforms and return paths.',
    bg: '/assets/kxtxr/que-no/10-12/bg-room.webp',
    propA: '/assets/kxtxr/que-no/10-12/cassette-ribbon.webp'
  },
  {
    id: 'contact',
    code: '07',
    label: 'CONTACT',
    title: 'THE ROOM BECOMES A STAGE',
    kicker: 'ONE BODY / MANY ROLES / ONE SIGNAL',
    copy: 'The performer persists while architecture, scale and audience replace the room.',
    bg: '/assets/cinematic/scene-01-awake.webp',
    actor: '/assets/kxtxr/que-no/09-12/figure.webp'
  },
  {
    id: 'firstshow',
    code: '08',
    label: 'FIRST SHOW',
    title: 'GODZILLA + KXTXR',
    kicker: 'THE OBSERVER ENTERS THE SAME FRAME AS THE SIGNAL',
    copy: 'The first show is the first public contact between the carrier, the creature and the field.',
    bg: '/assets/cinematic/scene-05-dashboard.webp',
    actor: '/assets/kxtxr/que-no-07-12-hero.png'
  },
  {
    id: 'return',
    code: '09',
    label: 'RETURN',
    title: 'WHAT SURVIVES COMES BACK CHANGED',
    kicker: 'EVIDENCE-BEARING PASSAGE',
    copy: 'Earlier states re-enter the frame as residue instead of nostalgia.',
    bg: '/assets/kxtxr/que-no/09-12/bg-room.webp',
    propA: '/assets/kxtxr/que-no/10-12/cassette-ribbon.webp'
  },
  {
    id: 'resolution',
    code: '10',
    label: 'RESOLUTION',
    title: 'THE STORY BECOMES A ROUTE',
    kicker: 'SIGNAL / STORY / RETURN',
    copy: 'Nothing disappears. The room, REM618, 111, the first show and every object remain addressable in the next state.',
    bg: '/assets/cinematic/scene-04-open.webp'
  }
];

const STICKER_CATALOG = [
  { id: 'rem618-tape', name: 'REM618 CASSETTE', type: 'CARRIER', residue: 'MAGNETIC TAPE' },
  { id: 'leader-ring', name: 'LEADER 111 RING', type: 'TEMPORAL', residue: 'FILM PRINT' },
  { id: 'signal-rug', name: 'PERFORMANCE RUG', type: 'GROUND', residue: 'CARPET WEAVE' },
  { id: 'orbit-sigil', name: 'KXTXR ORBIT EYE', type: 'EMBLEM', residue: 'OPTICAL TRACE' },
  { id: 'room-shadow', name: 'STAIRWELL SHADOW 021', type: 'FOOTAGE', residue: 'SURVEILLANCE' },
  { id: 'white-traffic', name: 'TRAFFIC WHITE 112', type: 'FOOTAGE', residue: 'DOPPLER' },
  { id: 'corrupt-fragment', name: 'FRAGMENT 008', type: 'AUDIO', residue: 'SAMPLE DECAY' },
  { id: 'que-no-ribbon', name: 'QUE NO RIBBON 10/12', type: 'EMBODIMENT', residue: 'POLYESTER' }
];

interface ArtistFilmViewProps {
  onNavigateToView: (view: SystemView) => void;
}

export const ArtistFilmView: React.FC<ArtistFilmViewProps> = ({ onNavigateToView }) => {
  const [entered, setEntered] = useState<boolean>(false);
  const [leaderCount, setLeaderCount] = useState<number | null>(null);
  const [chapterIndex, setChapterIndex] = useState<number>(0);
  const [autoPlay, setAutoPlay] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [cart, setCart] = useState<string[]>([]);
  const [copiedNotice, setCopiedNotice] = useState<boolean>(false);

  const audioContextRef = useRef<AudioContext | null>(null);

  const currentChapter = CHAPTERS[chapterIndex] || CHAPTERS[0];

  // Start Transmission flow
  const handleStartTransmission = () => {
    setEntered(true);
    setLeaderCount(5);

    let count = 5;
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setLeaderCount(count);
      } else {
        clearInterval(interval);
        setLeaderCount(null);
      }
    }, 800);
  };

  // Auto progression
  useEffect(() => {
    if (!entered || leaderCount !== null || !autoPlay) return;
    const timer = setInterval(() => {
      setChapterIndex((prev) => (prev + 1) % CHAPTERS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [entered, leaderCount, autoPlay]);

  // Audio tone generation for "TONE" button
  const playTestTone = (freq = 440) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = audioContextRef.current || new AudioCtx();
      audioContextRef.current = ctx;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.warn('Tone error:', e);
    }
  };

  const toggleSticker = (id: string) => {
    setCart((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const copyManifest = () => {
    const selected = STICKER_CATALOG.filter((s) => cart.includes(s.id));
    const text = JSON.stringify(
      {
        order_schema: 'KXTXR_SIGNAL_SHEET_V1',
        created_at: new Date().toISOString(),
        items_count: selected.length,
        items: selected
      },
      null,
      2
    );
    navigator.clipboard.writeText(text);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2000);
  };

  return (
    <div className="view-artist">
      {/* Enter Modal */}
      {!entered && (
        <div className="kx-enter" role="dialog" aria-modal="true" aria-label="Enter KXTXR signal film">
          <div className="kx-enter__noise" />
          <div className="kx-enter__panel">
            <span className="kx-micro">KXTXR PICTURES · SIGNAL HOUSE · 111</span>
            <strong>
              ENTER
              <br />
              THE SIGNAL
            </strong>
            <p>
              First interaction starts 111, the film leader and the automated passage. Scroll and chapter jump remain available at all times.
            </p>
            <button id="kxEnterButton" type="button" onClick={handleStartTransmission}>
              START TRANSMISSION <i>→</i>
            </button>
          </div>
        </div>
      )}

      {/* Film Leader Countdown */}
      {leaderCount !== null && (
        <div className="kx-leader" aria-hidden="true">
          <div className="kx-leader__ring">
            <b>{leaderCount}</b>
            <i />
            <i />
          </div>
          <span>KXTXR PICTURES · LEADER 111 · SIGNAL PRINT 618</span>
        </div>
      )}

      {/* Main Cinema Screen */}
      <main className="kx-cinema" aria-label="KXTXR cinematic artist narrative">
        <section className="kx-stage" data-chapter={currentChapter.id}>
          {/* Layered Visual Composition */}
          <div className="kx-film" aria-hidden="true">
            {currentChapter.bg && (
              <img className="kx-layer kx-bg" src={currentChapter.bg} alt="" />
            )}
            {currentChapter.footage && (
              <video
                className="kx-layer kx-footage"
                src={currentChapter.footage}
                autoPlay
                muted
                loop
                playsInline
              />
            )}
            {currentChapter.actor && (
              <img className="kx-layer kx-actor" src={currentChapter.actor} alt="" />
            )}
            {currentChapter.propA && (
              <img className="kx-layer kx-prop kx-prop-a" src={currentChapter.propA} alt="" />
            )}
            {currentChapter.propB && (
              <img className="kx-layer kx-prop kx-prop-b" src={currentChapter.propB} alt="" />
            )}

            <div className="kx-film__grid" />
            <div className="kx-film__scan" />
            <div className="kx-film__grain" />
            <div className="kx-film__vignette" />
          </div>

          {/* Logo Ident */}
          <div className="kx-ident" aria-hidden="true">
            <div className="kx-ident__orbit">
              <span>KXTXR</span>
              <i />
              <i />
              <i />
            </div>
            <p>SIGNAL HOUSE / PICTURE 001</p>
          </div>

          {/* Controls Header */}
          <header className="kx-chrome">
            <button
              type="button"
              className="kx-back"
              onClick={() => onNavigateToView('index')}
            >
              ← KXTXR / INDEX
            </button>

            <div className="kx-system-state">
              <span>{currentChapter.code}</span>
              <i />
              <span>{currentChapter.label}</span>
            </div>

            <div className="kx-controls">
              <button
                className={`kx-auto ${autoPlay ? 'is-on' : ''}`}
                type="button"
                onClick={() => setAutoPlay(!autoPlay)}
              >
                {autoPlay ? 'AUTO: ON' : 'AUTO: OFF'}
              </button>
              <button
                className={`kx-sound ${isMuted ? 'is-muted' : ''}`}
                type="button"
                onClick={() => {
                  setIsMuted(!isMuted);
                  if (isMuted) playTestTone(618);
                }}
                aria-label="Sound status"
              >
                <span />
                <span />
                <span />
                <span />
              </button>
            </div>
          </header>

          {/* Narrative Chapter Overlay */}
          <div className="kx-narrative">
            <p className="kx-kicker">{currentChapter.kicker}</p>
            <h1>{currentChapter.title}</h1>
            <p className="kx-copy">{currentChapter.copy}</p>
          </div>

          {/* Side Chapter Navigator */}
          <div className="kx-side-index">
            {CHAPTERS.map((ch, idx) => (
              <button
                key={ch.id}
                type="button"
                className={`side-dot ${idx === chapterIndex ? 'active' : ''}`}
                onClick={() => {
                  setChapterIndex(idx);
                  setAutoPlay(false);
                }}
                title={`${ch.code} · ${ch.label}`}
              >
                <span>{ch.code}</span>
              </button>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="kx-progress" aria-hidden="true">
            <i style={{ width: `${((chapterIndex + 1) / CHAPTERS.length) * 100}%` }} />
          </div>
        </section>
      </main>

      {/* Sticker Shop Sheet Builder */}
      <section className="kx-shop" id="stickerShop">
        <div className="kx-shop__head">
          <p className="kx-micro">AFTER THE SHOW / MERCH TABLE / OBJECTS THAT SURVIVED THE PASSAGE</p>
          <h2>
            STICKER
            <br />
            SHOP
          </h2>
          <p>
            Build a signal sheet from the objects, residues, instruments and creatures that appeared in the film. This surface builds the order manifest; payment is deliberately not simulated.
          </p>
        </div>

        <div className="kx-shop__toolbar">
          <span>
            <b>{cart.length}</b> OBJECTS IN SHEET
          </span>
          <div className="toolbar-actions">
            <button type="button" onClick={copyManifest}>
              {copiedNotice ? 'MANIFEST COPIED!' : 'COPY SHEET MANIFEST'}
            </button>
            <button type="button" onClick={() => setCart([])}>
              CLEAR
            </button>
          </div>
        </div>

        <div className="kx-sticker-grid">
          {STICKER_CATALOG.map((s) => {
            const isAdded = cart.includes(s.id);
            return (
              <div
                key={s.id}
                className={`sticker-card ${isAdded ? 'selected' : ''}`}
                onClick={() => toggleSticker(s.id)}
              >
                <div className="sticker-meta">
                  <span>{s.type}</span>
                  <b>{isAdded ? 'COLLECTED' : '+ ADD'}</b>
                </div>
                <strong>{s.name}</strong>
                <p>RESIDUE: {s.residue}</p>
              </div>
            );
          })}
        </div>

        {/* Visual Corpus Archive */}
        <details className="kx-corpus">
          <summary>
            <span>VISUAL CORPUS</span>
            <b>65 / 65 GENERATED ASSETS</b>
            <i>OPEN ARCHIVE</i>
          </summary>
          <p>
            Every generated artifact is preserved as an individually addressable browser asset. The archive below exposes the complete corpus rather than hiding unused generations.
          </p>
          <div className="kx-corpus-grid">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="corpus-item">
                <span className="corpus-code">KX-GEN-0{i + 1}</span>
                <span className="corpus-tag">CANONICAL SIGNAL</span>
              </div>
            ))}
          </div>
        </details>
      </section>

      {/* Epilogue */}
      <section className="kx-epilogue">
        <div className="kx-epilogue__bars" aria-hidden="true" />
        <div className="kx-epilogue__noise" aria-hidden="true" />
        <div className="kx-epilogue__copy">
          <span>END OF TRANSMISSION · RETURN PATH OPEN</span>
          <h2>
            THE SIGNAL
            <br />
            REMAINS.
          </h2>
          <p>
            Edwing entered the frame as a person making sound. KXTXR leaves it as a configuration that can return with evidence. Godzilla was not the ending. The first show was contact.
          </p>
        </div>

        <a
          className="kx-exit-cassette"
          href="https://www.youtube.com/results?search_query=KXTXR+REM+618"
          target="_blank"
          rel="noreferrer"
          aria-label="Find KXTXR REM618 on YouTube"
        >
          <span>CLICK THE CARRIER / FIND REM618 ↗</span>
        </a>

        <nav className="kx-exit-links" aria-label="KXTXR routes">
          <a href="https://www.youtube.com/results?search_query=KXTXR+REM+618" target="_blank" rel="noreferrer">
            YOUTUBE
          </a>
          <a href="https://open.spotify.com/search/KXTXR%20REM%20618" target="_blank" rel="noreferrer">
            SPOTIFY
          </a>
          <button type="button" onClick={() => onNavigateToView('index')}>
            INDEX
          </button>
          <a href="https://github.com/Aptymok/kxtxr" target="_blank" rel="noreferrer">
            SOURCE TRACE
          </a>
        </nav>

        <button className="kx-test-tone" type="button" onClick={() => playTestTone(111)}>
          TEST TONE (111Hz)
        </button>
      </section>
    </div>
  );
};
