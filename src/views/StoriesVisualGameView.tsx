import React, { useState, useRef } from 'react';
import { SystemView } from '../components/Navigation';

interface StoryChapter {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  axiom: string;
  narrative: string;
  mechanicType: 'fracture' | 'lunar' | 'tape' | 'threshold';
  unlockedClue: string;
}

const CHAPTERS: StoryChapter[] = [
  {
    id: 'fractura',
    code: '02 / 12',
    title: 'ESTUDIO VISUAL — PROXIMIDAD',
    subtitle: 'THE TECTONIC RIFT OF QUE NO',
    axiom: 'SEPARAR LA SEÑAL DEL SILENCIO NO DISMINUYE LA DENSIDAD.',
    narrative: 'Dos superficies de materia incompatible se aproximan en el vacío. A la izquierda, la densidad del carbón y la cinta magnética. A la derecha, la aridez del papel de archivo. Entre ambas, una falla carmesí de menos de un milímetro que sangra sin romperse.',
    mechanicType: 'fracture',
    unlockedClue: 'FRACTURE_COORDINATE_19.4326_VERIFIED'
  },
  {
    id: 'lunar',
    code: '03 / 12',
    title: 'LUNAR ALIGNMENT / SYZYGY',
    subtitle: 'LO QUE NO SE DICE TAMBIÉN GIRA',
    axiom: 'TRES CUERPOS EN LÍNEA NO REVELAN SU REVERSO.',
    narrative: 'Tres lunas lunares se alinean verticalmente atravesadas por una incisión de sangre viva. Las coordenadas orbitales miden el tiempo en que la audiencia no responde. El silencio no es ausencia; es un cuerpo celeste con gravedad propia.',
    mechanicType: 'lunar',
    unlockedClue: 'LUNAR_SYZYGY_618_CALIBRATED'
  },
  {
    id: 'passage',
    code: '00 / ORIGIN',
    title: 'EL PASAJE DE EDWING',
    subtitle: 'BEFORE THE DECLARATION OF KXTXR',
    axiom: 'LA PERSONA ENTRA A LA HABITACIÓN; LA CONFIGURACIÓN REGRESA.',
    narrative: 'Edwing no inventó una máscara. Instaló dos reproductores de cinta en bucle en una mesa de madera y dejó que el desgaste del cabezal acumulara capas de polvo. Cuando la cinta se detuvo, el nombre ya no era necesario.',
    mechanicType: 'tape',
    unlockedClue: 'ORIGIN_CABEZAL_DECAY_OBSERVED'
  },
  {
    id: 'kaiju',
    code: '08 / CONTACT',
    title: 'GODZILLA + EL PRIMER SHOW',
    subtitle: 'THE OBSERVER ENTERS THE SAME FRAME',
    axiom: 'EL PRIMER CONCIERTO NO FUE UN ESPECTÁCULO. FUE CONTACTO.',
    narrative: 'En el primer show, la criatura gigantesca y el ejecutante compartieron la misma escala. No hubo victoria ni destrucción; sólo la evidencia de que dos sistemas abiertos pueden escucharse sin devorarse.',
    mechanicType: 'threshold',
    unlockedClue: 'KAIJU_WITNESS_SEAL_08'
  }
];

interface StoriesVisualGameViewProps {
  onNavigateToView: (view: SystemView) => void;
}

export const StoriesVisualGameView: React.FC<StoriesVisualGameViewProps> = ({ onNavigateToView }) => {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [riftGap, setRiftGap] = useState(50); // percentage for fracture mechanic
  const [lunarAngle, setLunarAngle] = useState(0); // degrees for lunar mechanic
  const [unlockedClues, setUnlockedClues] = useState<string[]>([]);
  const [soundActive, setSoundActive] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const chapter = CHAPTERS[activeChapterIndex];

  // Synthesize dynamic sound when interacting with the visual game
  const playInteractionTone = (freq = 220) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioCtx();
      audioCtxRef.current = ctx;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {}
  };

  const handleUnlockClue = (clue: string) => {
    if (!unlockedClues.includes(clue)) {
      setUnlockedClues([...unlockedClues, clue]);
      playInteractionTone(528);
    }
  };

  return (
    <div className="view-stories-game">
      {/* Top Banner */}
      <div className="game-top-bar">
        <div>
          <span className="game-tag">VISUAL GAME & REPOSITORY · ESTUDIO KXTXR</span>
          <h2>STORIES & TECTONIC CHRONICLES</h2>
        </div>
        <div className="clues-counter">
          <span>EVIDENCE TOKENS UNLOCKED:</span>
          <b>{unlockedClues.length} / {CHAPTERS.length}</b>
        </div>
      </div>

      <div className="game-layout">
        {/* Left: Interactive Visual Canvas (Aesthetic of User's Uploaded Images) */}
        <div className="game-canvas-panel">
          {/* Chapter 01: Fractura Mechanic */}
          {chapter.mechanicType === 'fracture' && (
            <div className="visual-stage-fractura">
              <div className="canvas-header-marks">
                <span className="mark-kxtxr">K X T X R</span>
                <span className="mark-title">QUE NO</span>
              </div>

              <div className="fractura-interactive-container">
                {/* Left Dark Carbon Plate */}
                <div
                  className="fractura-plate plate-dark"
                  style={{ width: `${riftGap}%` }}
                >
                  <div className="plate-texture dark-noise" />
                  <div className="plate-torn-edge edge-right" />
                </div>

                {/* Center Crimson Blood Incision Fissure */}
                <div
                  className="fractura-fissure-line"
                  style={{ left: `${riftGap}%` }}
                  onClick={() => {
                    handleUnlockClue(chapter.unlockedClue);
                    playInteractionTone(618);
                  }}
                  title="Click to calibrate fissure"
                >
                  <div className="fissure-glow" />
                </div>

                {/* Right Pale Paper Plate */}
                <div
                  className="fractura-plate plate-light"
                  style={{ width: `${100 - riftGap}%` }}
                >
                  <div className="plate-texture bone-creases" />
                  <div className="plate-torn-edge edge-left" />
                </div>
              </div>

              {/* Tectonic Crosshair Controls */}
              <div className="fractura-control-bar">
                <span>ADJUST PROXIMITY TENSION:</span>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={riftGap}
                  onChange={(e) => {
                    setRiftGap(Number(e.target.value));
                    playInteractionTone(150 + Number(e.target.value) * 3);
                  }}
                />
                <button
                  type="button"
                  className="fissure-action-btn"
                  onClick={() => handleUnlockClue(chapter.unlockedClue)}
                >
                  {unlockedClues.includes(chapter.unlockedClue) ? '✓ RIFT CALIBRATED' : 'PROVE CONTACT'}
                </button>
              </div>

              <div className="canvas-footer-marks">
                <span>02 / 12</span>
                <span>ESTUDIO VISUAL — PROXIMIDAD</span>
              </div>
            </div>
          )}

          {/* Chapter 02: Lunar Syzygy Mechanic */}
          {chapter.mechanicType === 'lunar' && (
            <div className="visual-stage-lunar">
              <div className="lunar-header-marks">
                <span>K X T X R</span>
                <span className="cross-sigil">†</span>
              </div>

              <div className="lunar-syzygy-chamber">
                {/* Central Crimson Bleed Vector */}
                <div className="lunar-blood-line" />

                {/* Astronomical Orbit Guide Rings */}
                <svg className="orbital-guide-svg" viewBox="0 0 400 600">
                  <circle cx="200" cy="300" r="160" stroke="rgba(236,231,220,0.12)" strokeDasharray="3 4" fill="none" />
                  <circle cx="200" cy="300" r="110" stroke="rgba(184,45,50,0.2)" fill="none" />
                  <line x1="200" y1="20" x2="200" y2="580" stroke="#b82d32" strokeWidth="2.5" />
                  <line x1="40" y1="300" x2="360" y2="300" stroke="rgba(236,231,220,0.1)" strokeWidth="0.8" />
                  <circle cx="200" cy="140" r="5" fill="#ece7dc" opacity="0.6" />
                  <circle cx="200" cy="460" r="5" fill="#ece7dc" opacity="0.6" />
                </svg>

                {/* 3 Lunar Spheres */}
                <div
                  className="lunar-sphere moon-top"
                  style={{ transform: `scale(0.9) rotate(${lunarAngle * 0.5}deg)` }}
                >
                  <div className="crescent-shadow" />
                </div>

                <div
                  className="lunar-sphere moon-center"
                  style={{ transform: `rotate(${lunarAngle}deg)` }}
                  onClick={() => {
                    handleUnlockClue(chapter.unlockedClue);
                    playInteractionTone(440);
                  }}
                >
                  <div className="moon-full-crater-texture" />
                  <div className="syzygy-ring" />
                </div>

                <div
                  className="lunar-sphere moon-bottom"
                  style={{ transform: `scale(0.9) rotate(${lunarAngle * -0.5}deg)` }}
                >
                  <div className="crescent-shadow-inverted" />
                </div>

                {/* Right Side Inscription */}
                <div className="lunar-side-inscription">
                  <b>QUE NO</b>
                  <div className="red-tick" />
                  <p>LO QUE<br />NO SE DICE<br />TAMBIÉN<br />GIRA</p>
                </div>
              </div>

              {/* Lunar Rotation Control */}
              <div className="lunar-control-bar">
                <span>ROTATE CELESTIAL ALIGNMENT:</span>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={lunarAngle}
                  onChange={(e) => {
                    setLunarAngle(Number(e.target.value));
                    playInteractionTone(220 + Number(e.target.value));
                  }}
                />
                <button
                  type="button"
                  className="fissure-action-btn"
                  onClick={() => handleUnlockClue(chapter.unlockedClue)}
                >
                  {unlockedClues.includes(chapter.unlockedClue) ? '✓ SYZYGY LOCKED' : 'ALIGN MOONS'}
                </button>
              </div>
            </div>
          )}

          {/* Chapter 03 & 04: Tape Decay & Threshold */}
          {(chapter.mechanicType === 'tape' || chapter.mechanicType === 'threshold') && (
            <div className="visual-stage-generic">
              <div className="generic-inner">
                <span className="stage-code">{chapter.code}</span>
                <h3>{chapter.title}</h3>
                <div className="tape-visualizer">
                  <div className="reel reel-left" />
                  <div className="magnetic-tape-span" />
                  <div className="reel reel-right" />
                </div>
                <button
                  type="button"
                  className="fissure-action-btn"
                  onClick={() => handleUnlockClue(chapter.unlockedClue)}
                >
                  {unlockedClues.includes(chapter.unlockedClue) ? '✓ RECORDED' : 'ENGAGE TAPE PASSAGE'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Narrative Lore & Chapter Selection */}
        <div className="game-narrative-panel">
          <div className="chapter-selector-strip">
            {CHAPTERS.map((ch, idx) => (
              <button
                key={ch.id}
                type="button"
                className={`chapter-step-btn ${idx === activeChapterIndex ? 'active' : ''}`}
                onClick={() => setActiveChapterIndex(idx)}
              >
                <span>{ch.code}</span>
                <b>{ch.title.split('—')[0]}</b>
              </button>
            ))}
          </div>

          <div className="story-card-detailed">
            <div className="story-meta-header">
              <span className="ch-code">{chapter.code}</span>
              <span className="ch-subtitle">{chapter.subtitle}</span>
            </div>

            <h2 className="story-headline">{chapter.title}</h2>

            <div className="story-axiom-box">
              <span className="axiom-label">AXIOM // CANONICAL PRINCIPLE</span>
              <p className="axiom-text">"{chapter.axiom}"</p>
            </div>

            <div className="story-narrative-body">
              <p>{chapter.narrative}</p>
            </div>

            <div className="unlocked-token-badge">
              <span>EVIDENCE RECORD:</span>
              <code>
                {unlockedClues.includes(chapter.unlockedClue)
                  ? chapter.unlockedClue
                  : 'LOCKED · INTERACT WITH THE VISUAL FIELD TO HARVEST'}
              </code>
            </div>

            <div className="story-actions-footer">
              <button
                type="button"
                className="btn primary"
                onClick={() =>
                  setActiveChapterIndex((prev) => (prev + 1) % CHAPTERS.length)
                }
              >
                NEXT CHRONICLE →
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => onNavigateToView('studio')}
              >
                AUDIT AUDIO COUNTERPART ↗
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
