import React, { useState, useRef, useEffect } from 'react';
import { SystemView } from '../components/Navigation';

interface MediaStudioViewProps {
  onNavigateToView: (view: SystemView) => void;
}

interface AudioTrack {
  id: string;
  name: string;
  role: string;
  src: string;
  format: string;
  duration: string;
}

const TRACKS: AudioTrack[] = [
  {
    id: 'rem618-master',
    name: 'REM618 (FULL MASTER)',
    role: 'CANONICAL EMISSION / PRIMA MATERIA',
    src: '/assets/KXTXR - REM 618 master final.wav',
    format: 'WAV 48kHz / 24-bit',
    duration: '18:18'
  },
  {
    id: 'corrupt-618',
    name: 'CORRUPT 618 (TAPE SPLICE)',
    role: 'ANALOG DECAY / NOISE CARRIER',
    src: '/assets/rem618-corrupt-618.mp3.mpeg',
    format: 'MPEG / RESIDUE',
    duration: '04:12'
  },
  {
    id: 'fragment-008',
    name: 'FRAGMENT 008 (MAGNETIC LOOP)',
    role: 'ISOLATED SYNTHESIS & DRIFT',
    src: '/assets/rem618-fragment-008.mp3.mpeg',
    format: 'MPEG / FRAGMENT',
    duration: '03:45'
  }
];

export const MediaStudioView: React.FC<MediaStudioViewProps> = ({ onNavigateToView }) => {
  const [selectedTrack, setSelectedTrack] = useState<AudioTrack>(TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.85);
  const [activeVideo, setActiveVideo] = useState<'stairwell' | 'traffic'>('stairwell');
  const [saturationFilter, setSaturationFilter] = useState<boolean>(false);
  const [subBoost, setSubBoost] = useState<boolean>(true);

  // Audio Context & Analyser
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const setupWebAudio = () => {
    if (analyserRef.current || !audioRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyserRef.current = analyser;

      const source = ctx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(ctx.destination);
    } catch (e) {
      console.warn('Audio Init Error:', e);
    }
  };

  const handlePlayToggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      setupWebAudio();
      if (audioCtxRef.current?.state === 'suspended') {
        await audioCtxRef.current.resume();
      }
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn('Playback error:', err);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleTrackChange = async (t: AudioTrack) => {
    setSelectedTrack(t);
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = t.src;
    setupWebAudio();
    if (audioCtxRef.current?.state === 'suspended') {
      await audioCtxRef.current.resume();
    }
    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  // Canvas Oscilloscope / Spectrum Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const draw = () => {
      animId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background grid lines
      ctx.strokeStyle = 'rgba(236, 231, 220, 0.05)';
      ctx.lineWidth = 1;
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      const analyser = analyserRef.current;
      if (!analyser || !isPlaying) {
        // Flat baseline
        ctx.strokeStyle = 'rgba(184, 45, 50, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
        return;
      }

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      const barWidth = (canvas.width / bufferLength) * 1.8;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.85;

        // Gradient from crimson to bone
        const grad = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        grad.addColorStop(0, '#b82d32');
        grad.addColorStop(1, 'rgba(236, 231, 220, 0.15)');

        ctx.fillStyle = grad;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);

        x += barWidth;
      }
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  return (
    <div className="view-studio">
      {/* Studio Header */}
      <div className="studio-header">
        <div>
          <span className="studio-tag">ACOUSTIC EVIDENCE & REPRODUCTION LAB</span>
          <h1>MEDIA REPRODUCTION STUDIO</h1>
          <p className="studio-sub">
            High-fidelity master reproduction, stem separation, real-time frequency scoping, and synchronized surveillance field video.
          </p>
        </div>

        <div className="studio-master-status">
          <span className="dot-red" />
          <span>SIGNAL FIELD: {isPlaying ? 'ACTIVE // STREAMING' : 'STANDBY'}</span>
        </div>
      </div>

      <div className="studio-main-grid">
        {/* Left Column: Frequency Analyzer & Stems */}
        <div className="studio-control-deck">
          {/* Visualizer Scope */}
          <div className="visualizer-card">
            <div className="scope-header">
              <span>REAL-TIME FREQUENCY SPECTRUM (30Hz - 16kHz)</span>
              <span className="scope-mode">{saturationFilter ? 'SATURATED TAPE' : 'TRANSPARENT PASS'}</span>
            </div>
            <canvas ref={canvasRef} width={640} height={180} className="scope-canvas" />
          </div>

          {/* Master Transport Bar */}
          <div className="transport-bar">
            <button
              type="button"
              className="transport-play-btn"
              onClick={handlePlayToggle}
            >
              {isPlaying ? 'PAUSE ❚❚' : 'PLAY MASTER ▶'}
            </button>

            <div className="transport-track-info">
              <strong>{selectedTrack.name}</strong>
              <small>{selectedTrack.role} · {selectedTrack.format}</small>
            </div>

            <div className="transport-volume">
              <span>VOL</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setVolume(val);
                  if (audioRef.current) audioRef.current.volume = val;
                }}
              />
            </div>
          </div>

          <audio
            ref={audioRef}
            src={selectedTrack.src}
            onEnded={() => setIsPlaying(false)}
          />

          {/* Stem & Master Track Selection */}
          <div className="stems-section">
            <span className="stems-label">AVAILABLE MASTERS & RESIDUE TRACKS:</span>
            <div className="stems-list">
              {TRACKS.map((t) => (
                <div
                  key={t.id}
                  className={`stem-row ${selectedTrack.id === t.id ? 'active' : ''}`}
                  onClick={() => handleTrackChange(t)}
                >
                  <div className="stem-info">
                    <b>{t.name}</b>
                    <span>{t.role}</span>
                  </div>
                  <div className="stem-meta">
                    <span className="stem-format">{t.format}</span>
                    <span className="stem-dur">{t.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Signal Sculpting Filters */}
          <div className="dsp-filters-grid">
            <button
              type="button"
              className={`dsp-btn ${saturationFilter ? 'active' : ''}`}
              onClick={() => setSaturationFilter(!saturationFilter)}
            >
              <span>ANALOG TAPE SATURATION</span>
              <b>{saturationFilter ? 'ENGAGED' : 'BYPASS'}</b>
            </button>
            <button
              type="button"
              className={`dsp-btn ${subBoost ? 'active' : ''}`}
              onClick={() => setSubBoost(!subBoost)}
            >
              <span>SUB-BASS HARMONIC RESONANCE (111Hz)</span>
              <b>{subBoost ? 'CALIBRATED' : 'FLAT'}</b>
            </button>
          </div>
        </div>

        {/* Right Column: Synchronized Field Video Surveillance */}
        <div className="studio-video-deck">
          <div className="field-video-card">
            <div className="video-card-header">
              <span>SYNCHRONIZED FIELD EVIDENCE FOOTAGE</span>
              <div className="video-selector-pills">
                <button
                  type="button"
                  className={activeVideo === 'stairwell' ? 'active' : ''}
                  onClick={() => setActiveVideo('stairwell')}
                >
                  STAIRWELL-021
                </button>
                <button
                  type="button"
                  className={activeVideo === 'traffic' ? 'active' : ''}
                  onClick={() => setActiveVideo('traffic')}
                >
                  TRAFFIC-112
                </button>
              </div>
            </div>

            <div className="video-viewport-wrapper">
              <video
                key={activeVideo}
                className="studio-video-element"
                src={
                  activeVideo === 'stairwell'
                    ? '/assets/stairwell-shadow-021.mp4'
                    : '/assets/traffic-white-112.mp4'
                }
                autoPlay
                loop
                muted
                playsInline
              />
              <div className="video-rec-badge">
                <span className="rec-dot" />
                <span>REC // FIELD PERSISTENCE</span>
              </div>
            </div>

            <div className="video-notes">
              <p>
                <strong>ATTRIBUTION INTEGRITY:</strong> The video above represents raw camera surveillance tape collected during nocturnal recording sessions in Mexico City. No actors or venues are falsely attributed without cryptographic proof.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
