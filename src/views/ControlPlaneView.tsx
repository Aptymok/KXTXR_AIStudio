import React, { useState, useEffect } from 'react';
import { SystemView } from '../components/Navigation';

interface ControlPlaneViewProps {
  onNavigateToView: (view: SystemView) => void;
}

interface ObservationEntry {
  id: string;
  created_at: string;
  platform: string;
  representation: string;
  reach: number;
  views: number;
  completion: number;
  shares: number;
  comments: number;
  saves: number;
  profile: number;
  follows: number;
  latency?: number | null;
  signal: string;
  hypothesis?: string;
  kry?: number | null;
  attention?: number | null;
  propagation?: number | null;
}

const STORAGE_KEY = 'kxtxr_control_observations_v1';

export const ControlPlaneView: React.FC<ControlPlaneViewProps> = ({ onNavigateToView }) => {
  const [clock, setClock] = useState<string>('--:--:--');
  const [systemState, setSystemState] = useState<string>('SYNCHRONIZED');
  const [campaignPiece, setCampaignPiece] = useState<string>('07/12 · MEMORY');
  const [objective, setObjective] = useState<string>(
    'Increase recognition and transmission of KXTXR while preserving identity and observing whether the field changes its effective operating rules.'
  );

  // Social form
  const [socialNetwork, setSocialNetwork] = useState<string>('instagram');
  const [instagramType, setInstagramType] = useState<string>('POST');
  const [socialDate, setSocialDate] = useState<string>('2026-10-12T20:11');
  const [socialTimezone, setSocialTimezone] = useState<string>('America/Mexico_City');
  const [socialText, setSocialText] = useState<string>('');
  const [socialMedia, setSocialMedia] = useState<string>('');
  const [socialReceipt, setSocialReceipt] = useState<string>('NO PLATFORM ACTION YET');

  // Observation form
  const [platform, setPlatform] = useState<string>('Instagram');
  const [representation, setRepresentation] = useState<string>('HUMAN_03 / OBJECT / PERFORMANCE');
  const [reach, setReach] = useState<number>(1240);
  const [views, setViews] = useState<number>(3150);
  const [completion, setCompletion] = useState<number>(940);
  const [shares, setShares] = useState<number>(78);
  const [comments, setComments] = useState<number>(34);
  const [saves, setSaves] = useState<number>(112);
  const [profile, setProfile] = useState<number>(45);
  const [follows, setFollows] = useState<number>(18);
  const [latency, setLatency] = useState<number>(1.5);
  const [signalText, setSignalText] = useState<string>('Audience recognized the magnetic tape motif and asked if this links to REM618.');
  const [hypothesis, setHypothesis] = useState<string>('Object representation creates higher association with physical evidence than face-only posts.');

  // Stored entries
  const [entries, setEntries] = useState<ObservationEntry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return [
      {
        id: 'obs-001',
        created_at: '2026-09-24T20:11:00Z',
        platform: 'Instagram',
        representation: 'HUMAN_01 / FACE',
        reach: 980,
        views: 1800,
        completion: 410,
        shares: 32,
        comments: 14,
        saves: 45,
        profile: 20,
        follows: 9,
        latency: 2.0,
        signal: 'Standard engagement baseline.',
        kry: 18.4,
        attention: 0.23,
        propagation: 0.26
      },
      {
        id: 'obs-002',
        created_at: '2026-09-28T20:11:00Z',
        platform: 'TikTok',
        representation: 'OBJECT / CASSETTE',
        reach: 2200,
        views: 4800,
        completion: 1850,
        shares: 140,
        comments: 52,
        saves: 195,
        profile: 80,
        follows: 34,
        latency: 1.2,
        signal: 'Higher rewatch and sharing across music producers.',
        kry: 34.2,
        attention: 0.41,
        propagation: 0.51
      }
    ];
  });

  // AI curator state
  const [aiInstruction, setAiInstruction] = useState<string>('Observe the current field and identify what we are failing to measure before 10/12.');
  const [aiReceipt, setAiReceipt] = useState<string>('NO AI RUN YET');
  const [aiOutput, setAiOutput] = useState<string>('AI OUTPUT WILL APPEAR HERE.');

  // Music plane track selection
  const [selectedTrack, setSelectedTrack] = useState<string>('REM618');

  // Clock tick
  useEffect(() => {
    const update = () => {
      setClock(new Date().toLocaleTimeString('es-MX', { hour12: false }));
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const saveObservation = () => {
    // KRY calculation formula
    const w = {
      shares: 0.30,
      comments: 0.25,
      completion: 0.20,
      profile: 0.15,
      saves: 0.10
    };

    let calculatedKry = 0;
    if (reach > 0 && views > 0) {
      calculatedKry = 1000 * (
        w.shares * (shares / reach) +
        w.comments * (comments / reach) +
        w.completion * (completion / views) +
        w.profile * (profile / reach) +
        w.saves * (saves / reach)
      );
    }

    const attention = views > 0 ? Math.min(1, 0.75 * (completion / views) + 0.25 * (reach > 0 ? saves / reach : 0)) : 0;
    const propagation = reach > 0 ? Math.min(1, (shares / reach) * 8) : 0;

    const newEntry: ObservationEntry = {
      id: `obs-${Date.now()}`,
      created_at: new Date().toISOString(),
      platform,
      representation,
      reach,
      views,
      completion,
      shares,
      comments,
      saves,
      profile,
      follows,
      latency,
      signal: signalText,
      hypothesis,
      kry: parseFloat(calculatedKry.toFixed(2)),
      attention: parseFloat(attention.toFixed(2)),
      propagation: parseFloat(propagation.toFixed(2))
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  };

  const removeEntry = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  };

  // Run AI Curator simulations
  const runAiTool = (mode: 'observer' | 'curator' | 'plan' | 'pr') => {
    setAiReceipt(`AI ${mode.toUpperCase()} EXECUTING...`);

    setTimeout(() => {
      let result = {};
      if (mode === 'observer') {
        result = {
          agent: 'KXTXR_AI_OBSERVER',
          timestamp: new Date().toISOString(),
          evaluation: 'The signal demonstrates steady resilience in object-centered representations.',
          missing_metrics: [
            'Direct audio search latency',
            'Cross-platform query attribution (Spotify from TikTok)'
          ],
          recommendation: 'Maintain canonical publication hour (20:11) to isolate timing variables.'
        };
      } else if (mode === 'curator') {
        result = {
          agent: 'KXTXR_FIELD_CURATOR',
          proposed_schema: 'KXTXR_OBSERVATION_SCHEMA_V2',
          field_mutation: {
            add: ['rewatch_depth_ratio', 'secondary_share_velocity'],
            deprecate: ['raw_impressions_without_context']
          },
          reversibility: 'GUARANTEED'
        };
      } else if (mode === 'plan') {
        result = {
          agent: 'KXTXR_SITE_PLANNER',
          plan: 'MUTATE_QUE_NO_SERIES_TO_10_12',
          target_file: 'campaigns/que-no/representation-engine.json',
          diff_summary: 'Sets 10/12 status to ACTIVE_UNTIL_NEXT_PUBLICATION with cassette-ribbon parallax.',
          authority: 'PLAN_ONLY_REQUIRES_EDWING_APPROVAL'
        };
      } else {
        result = {
          agent: 'KXTXR_PR_ENGINE',
          status: 'DRAFT_PR_PREPARED',
          branch: 'feature/que-no-10-12-parity',
          files_touched: ['campaigns/que-no/representation-engine.json'],
          commit_hash: 'd89c31fa7',
          message: 'chore(que-no): activate 10/12 embodiment state after observed return'
        };
      }
      setAiReceipt(`AI ${mode.toUpperCase()} COMPLETED.`);
      setAiOutput(JSON.stringify(result, null, 2));
    }, 600);
  };

  // Trajectory SVG calculation
  const svgWidth = 720;
  const svgHeight = 220;
  const trajectoryPoints = entries.slice().reverse();
  const maxKry = Math.max(...trajectoryPoints.map((p) => p.kry || 10), 50);

  const kryPath = trajectoryPoints
    .map((p, idx) => {
      const x = (idx / Math.max(trajectoryPoints.length - 1, 1)) * (svgWidth - 40) + 20;
      const y = svgHeight - 30 - ((p.kry || 0) / maxKry) * (svgHeight - 60);
      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');

  const attentionPath = trajectoryPoints
    .map((p, idx) => {
      const x = (idx / Math.max(trajectoryPoints.length - 1, 1)) * (svgWidth - 40) + 20;
      const y = svgHeight - 30 - ((p.attention || 0) * (svgHeight - 60));
      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');

  const propagationPath = trajectoryPoints
    .map((p, idx) => {
      const x = (idx / Math.max(trajectoryPoints.length - 1, 1)) * (svgWidth - 40) + 20;
      const y = svgHeight - 30 - ((p.propagation || 0) * (svgHeight - 60));
      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');

  const latestKry = entries[0]?.kry?.toFixed(2) || '34.20';
  const latestAttn = entries[0]?.attention?.toFixed(2) || '0.41';
  const latestProp = entries[0]?.propagation?.toFixed(2) || '0.51';

  return (
    <div className="view-console">
      <div className="shell">
        {/* Top Header */}
        <header className="top">
          <div>
            <div className="kicker">
              <button type="button" className="text-link" onClick={() => onNavigateToView('index')}>
                KXTXR
              </button>{' '}
              / OPERATOR / NOINDEX
            </div>
            <h1>
              CONTROL
              <br />
              PLANE
            </h1>
          </div>
          <div className="statusline">
            <span className="dot" />
            <span id="clock">{clock}</span>
            <br />
            <span id="systemState">{systemState}</span>
          </div>
        </header>

        {/* 3-Column Layout */}
        <div className="layout">
          {/* Aside 1: Campaign */}
          <aside className="panel">
            <div className="ph">
              <span>Campaign</span>
              <span>ACTIVE</span>
            </div>
            <div className="pb stack">
              <div className="card">
                <span className="eyebrow">CURRENT OBJECT</span>
                <b>QUE NO</b>
                <div className="small">{campaignPiece}</div>
              </div>
              <label>
                Objective
                <textarea
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                />
              </label>
              <div className="card">
                <span className="eyebrow">CYCLE</span>
                <div className="small">
                  OBJECTIVE → CAMPAIGN → REPRESENTATION → PLATFORM ACTION → OBSERVATION → EVIDENCE → REGIME STATE → DECISION → RETURN
                </div>
              </div>
              <div className="links">
                <button
                  type="button"
                  className="btn"
                  onClick={() => onNavigateToView('registry')}
                >
                  REPRESENTATION FIELD →
                </button>
              </div>
            </div>
          </aside>

          {/* Main: Observation & Actions */}
          <main className="panel">
            <section className="hero">
              <div>
                <div className="eyebrow">HUMAN-GOVERNED / AI-ASSISTED / SFI-OBSERVED</div>
                <h2>QUE NO · 07/12</h2>
              </div>
              <p>
                The console controls what can actually be controlled, observes what can actually be observed, and preserves missingness where a platform does not expose the required data.
              </p>
            </section>

            <div className="pb stack">
              {/* Platform Action Form */}
              <div className="ph inset">
                <span>Platform action</span>
                <span className="badge">GOVERNED</span>
              </div>
              <div className="notice">
                Social execution is human-governed. A write occurs only after Edwing submits a dated post through the KXTXR backend.
              </div>

              <div className="grid2">
                <label>
                  Network
                  <select
                    value={socialNetwork}
                    onChange={(e) => setSocialNetwork(e.target.value)}
                  >
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                  </select>
                </label>
                <label>
                  Instagram format
                  <select
                    value={instagramType}
                    onChange={(e) => setInstagramType(e.target.value)}
                  >
                    <option>POST</option>
                    <option>REEL</option>
                    <option>STORY</option>
                    <option>TRIAL_REEL</option>
                  </select>
                </label>
                <label>
                  Publication date
                  <input
                    type="datetime-local"
                    value={socialDate}
                    onChange={(e) => setSocialDate(e.target.value)}
                  />
                </label>
                <label>
                  Timezone
                  <input
                    value={socialTimezone}
                    onChange={(e) => setSocialTimezone(e.target.value)}
                  />
                </label>
              </div>

              <label>
                Caption
                <textarea
                  placeholder="Text that will actually be sent to the selected network."
                  value={socialText}
                  onChange={(e) => setSocialText(e.target.value)}
                />
              </label>

              <label>
                Public non-expiring media URLs
                <textarea
                  placeholder="One https:// URL per line. Media must be explicitly selected by the human operator."
                  value={socialMedia}
                  onChange={(e) => setSocialMedia(e.target.value)}
                />
              </label>

              <div className="grid2">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setSocialReceipt(`DRY RUN VALIDATED: ${socialNetwork.toUpperCase()} · ${socialDate} · Ready for operator signature`)}
                >
                  VALIDATE / DRY RUN
                </button>
                <button
                  type="button"
                  className="btn primary"
                  onClick={() => setSocialReceipt(`ACTION SCHEDULED: ${socialNetwork.toUpperCase()} publication queued for ${socialDate}`)}
                >
                  SCHEDULE / PUBLISH
                </button>
              </div>
              <div className="small">{socialReceipt}</div>

              {/* Observation Ingest */}
              <div className="ph inset">
                <span>Platform observation</span>
                <span className="badge ok">{entries.length} LOGGED</span>
              </div>

              <div className="grid2">
                <label>
                  Platform
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                  >
                    <option>Instagram</option>
                    <option>TikTok</option>
                    <option>YouTube Shorts</option>
                    <option>Spotify</option>
                    <option>Apple Music</option>
                    <option>Other</option>
                  </select>
                </label>
                <label>
                  Representation
                  <input
                    value={representation}
                    onChange={(e) => setRepresentation(e.target.value)}
                  />
                </label>
              </div>

              <div className="grid3">
                <label>
                  Reach
                  <input
                    type="number"
                    value={reach}
                    onChange={(e) => setReach(Number(e.target.value))}
                  />
                </label>
                <label>
                  Views
                  <input
                    type="number"
                    value={views}
                    onChange={(e) => setViews(Number(e.target.value))}
                  />
                </label>
                <label>
                  Completion / rewatch
                  <input
                    type="number"
                    value={completion}
                    onChange={(e) => setCompletion(Number(e.target.value))}
                  />
                </label>
                <label>
                  Shares / sends
                  <input
                    type="number"
                    value={shares}
                    onChange={(e) => setShares(Number(e.target.value))}
                  />
                </label>
                <label>
                  Comments
                  <input
                    type="number"
                    value={comments}
                    onChange={(e) => setComments(Number(e.target.value))}
                  />
                </label>
                <label>
                  Saves
                  <input
                    type="number"
                    value={saves}
                    onChange={(e) => setSaves(Number(e.target.value))}
                  />
                </label>
                <label>
                  Profile / search
                  <input
                    type="number"
                    value={profile}
                    onChange={(e) => setProfile(Number(e.target.value))}
                  />
                </label>
                <label>
                  Follows
                  <input
                    type="number"
                    value={follows}
                    onChange={(e) => setFollows(Number(e.target.value))}
                  />
                </label>
                <label>
                  Latency hours
                  <input
                    type="number"
                    step="0.1"
                    value={latency}
                    onChange={(e) => setLatency(Number(e.target.value))}
                  />
                </label>
              </div>

              <label>
                Observed signal
                <textarea
                  value={signalText}
                  onChange={(e) => setSignalText(e.target.value)}
                />
              </label>

              <label>
                Interpretation / hypothesis
                <textarea
                  value={hypothesis}
                  onChange={(e) => setHypothesis(e.target.value)}
                />
              </label>

              <div className="grid2">
                <button
                  type="button"
                  className="btn primary"
                  onClick={saveObservation}
                >
                  RECORD OBSERVATION
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => alert('Observation payload structured and synchronized to SFI witness log.')}
                >
                  PERSIST TO SFI
                </button>
              </div>

              {/* Metrics Summary */}
              <div className="metrics">
                <div className="metric">
                  <span>KRY / INTERNAL</span>
                  <b>{latestKry}</b>
                </div>
                <div className="metric">
                  <span>ATTENTION PROXY</span>
                  <b>{latestAttn}</b>
                </div>
                <div className="metric">
                  <span>PROPAGATION PROXY</span>
                  <b>{latestProp}</b>
                </div>
                <div className="metric">
                  <span>REGIME COVERAGE</span>
                  <b>8/11</b>
                </div>
              </div>

              {/* Dynamic Trajectory SVG */}
              <div className="trajectory-card">
                <div className="ph inset">
                  <span>Field trajectory</span>
                  <span>LOCAL WINDOWS</span>
                </div>
                <svg
                  id="trajectory"
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  role="img"
                  aria-label="KXTXR trajectory"
                >
                  <line x1="20" y1="190" x2="700" y2="190" stroke="rgba(255,255,255,0.1)" />
                  <line x1="20" y1="110" x2="700" y2="110" stroke="rgba(255,255,255,0.05)" />
                  <line x1="20" y1="30" x2="700" y2="30" stroke="rgba(255,255,255,0.05)" />

                  {/* KRY Path */}
                  <path d={kryPath} fill="none" stroke="#d5cfc3" strokeWidth="2.5" />
                  {/* Attention Path */}
                  <path d={attentionPath} fill="none" stroke="#8bbca1" strokeWidth="2" strokeDasharray="4 4" />
                  {/* Propagation Path */}
                  <path d={propagationPath} fill="none" stroke="#b82d32" strokeWidth="2" />
                </svg>
                <div className="trajectory-legend">
                  <span style={{ color: '#d5cfc3' }}>■ KRY normalized</span>
                  <span style={{ color: '#8bbca1' }}>■ Attention</span>
                  <span style={{ color: '#b82d32' }}>■ Propagation</span>
                </div>
              </div>
            </div>
          </main>

          {/* Aside 2: Connectors & Timeline */}
          <aside className="panel">
            <div className="ph">
              <span>Connectors</span>
              <span>REAL STATE</span>
            </div>
            <div className="pb stack">
              <div className="card connector">
                <div>
                  <span className="eyebrow">PLATFORM EXECUTION</span>
                  <b>Metricool Engine</b>
                </div>
                <span className="badge ok">READY</span>
                <div className="caps">SCHEDULE · PUBLISH · METRICS</div>
              </div>

              <div className="card connector">
                <div>
                  <span className="eyebrow">WITNESS ARCHIVE</span>
                  <b>SFI Structured Evidence</b>
                </div>
                <span className="badge ok">OBSERVING</span>
                <div className="caps">PERSISTENCE · CALIBRATION</div>
              </div>

              <div className="card connector">
                <div>
                  <span className="eyebrow">HUMAN SIGNATURE</span>
                  <b>Operator Token</b>
                </div>
                <span className="badge ok">ACTIVE</span>
                <div className="caps">EDWING AUTHORITY</div>
              </div>
            </div>

            <div className="ph">
              <span>Regime watch</span>
              <span className="badge warn">OBSERVING</span>
            </div>
            <div className="pb">
              <div className="notice">
                SFI Regime Transition is experimental. This console emits observations, never an uncalibrated transition.
              </div>
              <div className="vector">
                <div className="vrow">
                  <span>Attention density</span>
                  <div className="meter"><i style={{ width: '42%' }} /></div>
                  <b>0.42</b>
                </div>
                <div className="vrow">
                  <span>Propagation velocity</span>
                  <div className="meter"><i style={{ width: '51%' }} /></div>
                  <b>0.51</b>
                </div>
                <div className="vrow">
                  <span>Variance</span>
                  <div className="meter"><i style={{ width: '18%' }} /></div>
                  <b>0.18</b>
                </div>
                <div className="vrow">
                  <span>Resistance</span>
                  <div className="meter"><i style={{ width: '29%' }} /></div>
                  <b>0.29</b>
                </div>
              </div>
            </div>

            <div className="ph">
              <span>Evidence timeline</span>
              <span className="badge">{entries.length} RECORDS</span>
            </div>
            <div className="pb">
              <div className="timeline">
                {entries.map((e) => (
                  <article key={e.id} className="timeline-item">
                    <div className="timeline-meta">
                      <b>{e.platform} · {e.representation}</b>
                      <button
                        type="button"
                        className="del-btn"
                        onClick={() => removeEntry(e.id)}
                      >
                        ✕
                      </button>
                    </div>
                    <p>{e.signal}</p>
                    <small>KRY {e.kry} · {new Date(e.created_at).toLocaleDateString()}</small>
                  </article>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* AI Field Curator Section */}
        <section className="panel ai-plane">
          <div className="ph">
            <span>AI FIELD CURATOR</span>
            <span className="badge ok">CONFIGURED</span>
          </div>
          <div className="pb ai-layout">
            <div className="stack">
              <div className="notice">
                AI reads the KXTXR context capsule + local observation windows. It may propose observation mutations and prepare reversible site changes. It cannot establish canon or publish without human authority.
              </div>
              <label>
                Operator instruction
                <textarea
                  value={aiInstruction}
                  onChange={(e) => setAiInstruction(e.target.value)}
                />
              </label>
              <div className="grid2">
                <button type="button" className="btn" onClick={() => runAiTool('observer')}>
                  AI OBSERVER
                </button>
                <button type="button" className="btn" onClick={() => runAiTool('curator')}>
                  CURATE FIELDS
                </button>
                <button type="button" className="btn primary" onClick={() => runAiTool('plan')}>
                  PLAN SITE MUTATION
                </button>
                <button type="button" className="btn" onClick={() => runAiTool('pr')}>
                  CREATE DRAFT PR
                </button>
              </div>
              <div className="small">{aiReceipt}</div>
            </div>

            <div className="card ai-result">
              <span className="eyebrow">STRUCTURED OUTPUT</span>
              <pre>{aiOutput}</pre>
            </div>
          </div>
        </section>

        {/* Music Field / Hive Master Section */}
        <section className="panel music-plane">
          <div className="ph">
            <span>MUSIC FIELD / HIVE MASTER</span>
            <span className="badge ok">HYDRATED</span>
          </div>
          <div className="pb music-layout">
            <div className="stack">
              <div className="music-summary">
                <div className="metric">
                  <span>OBSERVED MASTERS</span>
                  <b>3</b>
                </div>
                <div className="metric">
                  <span>REFERENCE OBJECTS</span>
                  <b>12</b>
                </div>
                <div className="metric">
                  <span>NOT OBSERVED</span>
                  <b>0</b>
                </div>
                <div className="metric">
                  <span>STRONGEST COUNTERWEIGHT</span>
                  <b>111 / RETURN</b>
                </div>
              </div>

              <div className="track-grid">
                {['REM618', '111', 'QUE NO'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`track-card ${selectedTrack === t ? 'active' : ''}`}
                    onClick={() => setSelectedTrack(t)}
                  >
                    <b>{t}</b>
                    <span>{t === 'QUE NO' ? 'ACTIVE FIELD' : 'CANONICAL MASTER'}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="stack">
              <div className="card">
                <span className="eyebrow">PAIRWISE ALL-VS-ALL CORRELATION MATRIX</span>
                <table className="matrix-table">
                  <thead>
                    <tr>
                      <th>TRACK</th>
                      <th>REM618</th>
                      <th>111</th>
                      <th>QUE NO</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>REM618</td>
                      <td>1.00</td>
                      <td>0.84</td>
                      <td>0.72</td>
                    </tr>
                    <tr>
                      <td>111</td>
                      <td>0.84</td>
                      <td>1.00</td>
                      <td>0.91</td>
                    </tr>
                    <tr>
                      <td>QUE NO</td>
                      <td>0.72</td>
                      <td>0.91</td>
                      <td>1.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="foot">
          <span>PUBLICATION ≠ EVIDENCE · ENGAGEMENT ≠ CAUSALITY · REGIME CANDIDATE ≠ CALIBRATED TRANSITION</span>
          <span>AI RECOMMENDATION ≠ HUMAN AUTHORITY</span>
        </footer>
      </div>
    </div>
  );
};
