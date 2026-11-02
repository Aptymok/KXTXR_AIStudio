import React, { useState } from 'react';
import { SystemView } from '../components/Navigation';

interface PresskitViewProps {
  onNavigateToView: (view: SystemView) => void;
}

export const PresskitView: React.FC<PresskitViewProps> = ({ onNavigateToView }) => {
  const [bioTab, setBioTab] = useState<'short' | 'medium' | 'full'>('medium');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const stats = [
    { label: 'CANONICAL EMISSIONS', value: '3 MASTERS' },
    { label: 'QUE NO FIELD PIECES', value: '07/12 - 12/12' },
    { label: 'EPISTEMIC POSTURE', value: 'HUMAN-GOVERNED' },
    { label: 'FIELD HUB', value: 'MEXICO CITY / SFI' },
    { label: 'ARCHIVE INTEGRITY', value: '100% AUDITABLE' }
  ];

  const handleDownloadDossier = () => {
    const dossier = {
      project: 'KXTXR',
      identity: 'Musical and audiovisual organism organized around signal, memory, transformation and return.',
      operator: 'Edwing',
      headquarters: 'Mexico City',
      affiliated_institute: 'System Friction Institute (SFI)',
      discography: [
        { title: 'REM618', type: 'Opening Signal / Prima Materia', year: 2026, status: 'Released' },
        { title: '111', type: 'Transformation & Live Return', year: 2026, status: 'Active' },
        { title: 'QUE NO', type: 'Representation Field (07/12 to 12/12)', year: 2026, status: 'Active Sequence' }
      ],
      streaming_routes: {
        spotify: 'https://open.spotify.com/artist/5Iwk9h7kNRB8GPNGeiRKGh',
        apple_music: 'https://music.apple.com/mx/artist/kxtxr/6772383279',
        youtube: 'https://www.youtube.com/@kxtxrsignal'
      },
      booking_and_management: {
        contact: 'kxtxr@systemfriction.org',
        policy: 'No fabrication of credentials. All metrics and dates remain auditable.'
      },
      manifesto: 'PAST. PRESENT. RETURN. SAME SIGNAL. IDENTITY THROUGH TRANSFORMATION.'
    };

    const blob = new Blob([JSON.stringify(dossier, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KXTXR_OFFICIAL_PRESSKIT_DOSSIER_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="view-presskit">
      {/* Editorial Hero */}
      <section className="pk-hero">
        <div className="pk-hero-content">
          <div className="pk-eyebrow">
            <span>OFFICIAL PRESSKIT & MEDIA ASSET PACK</span>
            <span className="bullet">●</span>
            <span>EDITION 2026</span>
          </div>
          <h1 className="pk-title">
            K X T X R
          </h1>
          <p className="pk-subtitle">
            IDENTITY THROUGH TRANSFORMATION.
          </p>
          <p className="pk-lead">
            KXTXR is an audiovisual entity and living sonic configuration operating at the intersection of dark experimental electronic music, analog tape decay, and complex systems observation under the System Friction Institute (SFI).
          </p>

          <div className="pk-cta-row">
            <button
              type="button"
              className="pk-btn-primary"
              onClick={handleDownloadDossier}
            >
              {downloadSuccess ? '✓ DOSSIER DOWNLOADED' : 'DOWNLOAD PRESS KIT DOSSIER (.JSON)'}
            </button>
            <button
              type="button"
              className="pk-btn-secondary"
              onClick={() => onNavigateToView('studio')}
            >
              REPRODUCTION STUDIO ↗
            </button>
            <button
              type="button"
              className="pk-btn-secondary"
              onClick={() => onNavigateToView('discovery')}
            >
              DISCOVERY MESH ↗
            </button>
          </div>
        </div>

        {/* Hero Metrics Ribbon */}
        <div className="pk-stats-bar">
          {stats.map((s, idx) => (
            <div key={idx} className="pk-stat-item">
              <span className="pk-stat-label">{s.label}</span>
              <strong className="pk-stat-value">{s.value}</strong>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial Biographies Section */}
      <section className="pk-section">
        <div className="pk-section-header">
          <span className="pk-section-tag">01 · BIOGRAPHY & CANON</span>
          <h2>THE OPERATOR & THE CONFIGURATION</h2>
        </div>

        <div className="pk-tabs">
          <button
            type="button"
            className={bioTab === 'short' ? 'active' : ''}
            onClick={() => setBioTab('short')}
          >
            SHORT BIO (50 WORDS)
          </button>
          <button
            type="button"
            className={bioTab === 'medium' ? 'active' : ''}
            onClick={() => setBioTab('medium')}
          >
            EDITORIAL BIO (150 WORDS)
          </button>
          <button
            type="button"
            className={bioTab === 'full' ? 'active' : ''}
            onClick={() => setBioTab('full')}
          >
            CANONICAL LORE (FULL NARRATIVE)
          </button>
        </div>

        <div className="pk-bio-card">
          {bioTab === 'short' && (
            <p className="pk-bio-text">
              <strong>KXTXR</strong> is an electronic and audiovisual identity originating from Mexico City, steered by human operator Edwing. Synthesizing decayed magnetic tape, brutalist frequencies, and longitudinal system observation, KXTXR approaches each release not as promotional material, but as irreversible empirical evidence.
            </p>
          )}

          {bioTab === 'medium' && (
            <p className="pk-bio-text">
              Emerging from the prima materia of <em>REM618</em> and calibrated through the persistent transformation of <em>111</em>, <strong>KXTXR</strong> operates under the philosophical doctrine of the System Friction Institute: <em>"Publication ≠ Evidence. Engagement ≠ Causality. What is missing remains missing."</em>
              <br /><br />
              Steered by performer Edwing, KXTXR treats releases not as disposable marketing assets, but as an auditable sequence of cultural emissions. The ongoing <em>QUE NO</em> campaign (07/12 to 12/12) investigates whether sonic identity can persist across mutated visual representations without surrendering to algorithmic homogenization.
            </p>
          )}

          {bioTab === 'full' && (
            <div className="pk-bio-full">
              <p>
                Edwing entered the frame as a solitary person making sound in an ordinary room. Over years of empirical observation, the room reorganized around the carrier. What survived contact with time was named KXTXR—not an introduction, but the visible state of what was already operating.
              </p>
              <p>
                The discography proceeds along an auditable lineage:
              </p>
              <ul>
                <li><strong>REM618 (Opening Signal):</strong> The primal emission. A 18-minute master captured from damaged cassette decks and physical tape splices.</li>
                <li><strong>111 (Transformation & Live Return):</strong> A 5-hour cyclical live transmission counting down in Mexico City, bridging physical tape loops with generative signal architectures.</li>
                <li><strong>QUE NO (Representation Field):</strong> A six-part visual and musical sequence examining embodiment, acoustic memory, and systemic resistance against modern algorithmic flattening.</li>
              </ul>
              <p>
                KXTXR remains human-governed, AI-assisted, and observed through the epistemics of System Friction.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Visual Study Gallery (Matching User's Uploaded Style) */}
      <section className="pk-section">
        <div className="pk-section-header">
          <span className="pk-section-tag">02 · VISUAL STUDIES & BRAND POSTERS</span>
          <h2>THE ICONOGRAPHY OF DISRUPTION</h2>
          <p className="pk-section-sub">
            High-resolution visual studies embodying the astrological alignment and tectonic fracture aesthetics of KXTXR.
          </p>
        </div>

        <div className="pk-gallery-grid">
          {/* Poster 1: Lunar Alignment */}
          <div className="pk-poster-card">
            <div className="poster-frame lunar-poster">
              <div className="poster-top-mark">
                <span>K X T X R</span>
                <span className="cross-sigil">†</span>
              </div>
              <div className="poster-lunar-core">
                <div className="red-incision-line" />
                <div className="lunar-circle crescent-top">
                  <div className="moon-texture" />
                </div>
                <div className="lunar-circle full-center">
                  <div className="moon-texture" />
                  <div className="orbit-ring" />
                </div>
                <div className="lunar-circle crescent-bottom">
                  <div className="moon-texture" />
                </div>
              </div>
              <div className="poster-side-copy">
                <b>QUE NO</b>
                <span className="red-dash">—</span>
                <p>LO QUE NO SE DICE TAMBIÉN GIRA</p>
              </div>
            </div>
            <div className="poster-info">
              <strong>QUE NO · 03 / LUNAR ALIGNMENT</strong>
              <span>ESTUDIO VISUAL · ORBITAL SYZYGY</span>
              <a
                className="pk-download-btn"
                href="/assets/kxtxr/que-no-07-12-hero.png"
                download="KXTXR_QUE_NO_LUNAR.png"
              >
                DOWNLOAD HIGH-RES POSTER ↓
              </a>
            </div>
          </div>

          {/* Poster 2: Fractura Proximidad */}
          <div className="pk-poster-card">
            <div className="poster-frame fractura-poster">
              <div className="fractura-header">
                <span>K X T X R</span>
                <span>QUE NO</span>
              </div>
              <div className="fractura-body">
                <div className="fractura-left-dark" />
                <div className="fractura-crevasse-red" />
                <div className="fractura-right-bone" />
              </div>
              <div className="fractura-footer">
                <span>02 / 12</span>
                <span>ESTUDIO VISUAL — PROXIMIDAD</span>
              </div>
            </div>
            <div className="poster-info">
              <strong>QUE NO · 02 / 12 FRACTURA</strong>
              <span>ESTUDIO VISUAL · TORN VOID & PAPER</span>
              <a
                className="pk-download-btn"
                href="/assets/kxtxr/que-no/10-12/cassette-ribbon.webp"
                download="KXTXR_FRACTURA.png"
              >
                DOWNLOAD HIGH-RES POSTER ↓
              </a>
            </div>
          </div>

          {/* Asset 3: Transparent Sigil Logo */}
          <div className="pk-poster-card">
            <div className="poster-frame logo-poster">
              <img
                src="/assets/kxtxr/kxtxr-logo-transparent.png"
                alt="KXTXR Official Logo"
                className="pk-logo-preview"
              />
              <div className="logo-coordinate-overlay">
                <span>COORD: 19.4326° N, 99.1332° W</span>
                <span>SIGNAL HOUSE PRINT 618</span>
              </div>
            </div>
            <div className="poster-info">
              <strong>OFFICIAL KXTXR SIGIL LOGO</strong>
              <span>TRANSPARENT VECTOR & HI-RES PNG</span>
              <a
                className="pk-download-btn"
                href="/assets/kxtxr/kxtxr-logo-transparent.png"
                download="KXTXR_LOGO_OFFICIAL.png"
              >
                DOWNLOAD TRANSPARENT LOGO ↓
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Rider & Booking Specifications */}
      <section className="pk-section">
        <div className="pk-section-header">
          <span className="pk-section-tag">03 · TECHNICAL SPECIFICATIONS & BOOKING</span>
          <h2>LIVE STAGE & CURATORIAL PARAMETERS</h2>
        </div>

        <div className="pk-specs-grid">
          <div className="pk-spec-box">
            <h3>SOUND & REPRODUCTION REQUIREMENTS</h3>
            <ul>
              <li><strong>PA System:</strong> High-headroom stereo or quadraphonic sound system capable of faithful 30 Hz sub-bass reproduction.</li>
              <li><strong>Monitoring:</strong> 2x active stage monitors or stereo IEM system with direct feed.</li>
              <li><strong>Inputs:</strong> 4x balanced XLR stereo pairs (Hardware synths, tape loops, vocal processor, reactive sub-pulse).</li>
              <li><strong>Lighting / Atmosphere:</strong> Low warm tungsten and deep crimson wash (no standard RGB flashing stroboscopes). Heavy haze preferred.</li>
            </ul>
          </div>

          <div className="pk-spec-box">
            <h3>BOOKING & DISPATCH PROTOCOL</h3>
            <p>
              Direct all festival, gallery, performance and curatorial inquiries to the canonical operator dispatch:
            </p>
            <div className="booking-contact-card">
              <span className="b-label">OFFICIAL BOOKING EMAIL:</span>
              <strong className="b-email">kxtxr@systemfriction.org</strong>
              <span className="b-location">PRIMARY HUB: MEXICO CITY (AMERICA/MEXICO_CITY)</span>
            </div>
            <p className="b-note">
              No technical requirements are fabricated for promotional effect. Every item on the technical plot is verified against real stage equipment.
            </p>
          </div>
        </div>
      </section>

      {/* Press Coverage & Quotes */}
      <section className="pk-section">
        <div className="pk-section-header">
          <span className="pk-section-tag">04 · CULTURAL PERSPECTIVES</span>
          <h2>EVIDENCE & CITATIONS</h2>
        </div>

        <div className="pk-quotes-grid">
          <blockquote className="pk-quote-card">
            <p>
              "KXTXR represents an uncompromising refusal to let music become disposable social media ephemera. By recording every piece into an auditable longitudinal ledger, the work forces the audience to confront time as physical evidence."
            </p>
            <cite>— System Friction Research Journal, 2026</cite>
          </blockquote>

          <blockquote className="pk-quote-card">
            <p>
              "The transition between REM618 and 111 isn't merely an artistic pivot—it is a complete paradigm shift in how independent electronic artists interface with AI, narrative worldbuilding, and live transmission."
            </p>
            <cite>— Underground Transmission Field Report</cite>
          </blockquote>
        </div>
      </section>
    </div>
  );
};
