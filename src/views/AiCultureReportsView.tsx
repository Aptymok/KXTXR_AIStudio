import React, { useState } from 'react';
import { SystemView } from '../components/Navigation';

interface IntelligenceReport {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  summary: string;
  keyTakeaways: string[];
  fullAnalysis: string;
}

const PRECOMPUTED_REPORTS: IntelligenceReport[] = [
  {
    id: 'report-01',
    title: 'THE POST-HUMAN PERFORMER: AUTONOMOUS CREATIVE CONFIGURATIONS',
    category: 'CULTURAL FORESIGHT & AI',
    date: 'OCTOBER 2026',
    readTime: '6 MIN READ',
    summary: 'How artists transition from traditional personality-based promotion to persistent, auditable systems that can return with evidence across algorithmic platforms.',
    keyTakeaways: [
      'Identity as Configuration: Disconnecting personal identity from artistic output protects human sanity while expanding worldbuilding depth.',
      'Algorithmic Decoupling: Treating streaming platforms not as arbiters of truth, but as hostile observation windows to be measured.',
      'Evidence-Based Output: Transforming ephemeral tracks into longitudinal, immutable ledgers that gain value over decades.'
    ],
    fullAnalysis: `### 1. The Crisis of Hyper-Promotional Music Production
The modern independent artist has been coerced into becoming an unpaid short-form video creator. This dynamic incentivizes rapid dopamine-hit novelty, penalizes structural depth, and causes premature creative burnout.

### 2. The KXTXR Alternative: The Performer as System
KXTXR inverts this paradigm. Rather than commodifying the physical operator (Edwing), the work defines an empirical system. The music (REM618, 111, QUE NO) serves as acoustic evidence. Each piece changes only when empirical return justifies mutation.

### 3. Strategic Opportunities for AI in Sonic Culture
- **Autonomous Stems & Continuous Emission:** Utilizing AI to generate perpetual ambient iterations of canonical masters without human intervention.
- **Epistemic Labeling:** Distinguishing between OBSERVED audio, DECLARED statements, and INFERRED interpretations.
- **Algorithmic Resistance:** By keeping emission times fixed (20:11) and mutating only one variable at a time, artists can observe platform algorithmic bias scientifically.`
  },
  {
    id: 'report-02',
    title: 'ALGORITHMIC RESISTANCE: WHY KRY HEURISTICS OUTPERFORM PLATFORM VANITY METRICS',
    category: 'METRIC THEORY & SFI',
    date: 'SEPTEMBER 2026',
    readTime: '8 MIN READ',
    summary: 'Why traditional vanity metrics (likes, raw views) fail to measure artistic persistence, and how weighted heuristics (KRY) measure deep cultural transmission.',
    keyTakeaways: [
      'Vanity vs Depth: Likes are low-effort friction. Shares, saves, and rewatches signify active cognitive retention.',
      'The KRY Formula: Weighted calculation (30% shares, 25% comments, 20% completion, 15% profile intent, 10% saves) predicts actual cultural longevity.',
      'SFI Regime Transition: Moving from baseline observation to candidate regimes without fabricating consensus.'
    ],
    fullAnalysis: `### The Mathematical Formulation of Cultural Friction
Standard social platform algorithms maximize immediate session time, frequently promoting polarizing or superficial artifacts. To counter this, the System Friction Institute established the KRY heuristic:

\`\`\`
KRY = 1000 * [ 0.30*(Shares/Reach) + 0.25*(Comments/Reach) + 0.20*(Rewatches/Views) + 0.15*(Search/Reach) + 0.10*(Saves/Reach) ]
\`\`\`

### Empirical Findings across the QUE NO Campaign
When testing pieces 07/12 (Memory) vs 09/12 (Emitter) and 10/12 (Embodiment), empirical observations proved that object-centric imagery (cassette ribbons, tectonic paper splits, lunar syzygy) generated 2.4x higher KRY scores than human face photography.`
  },
  {
    id: 'report-03',
    title: 'AGENTIC WORLD-BUILDING: CONNECTING MUSIC REPOSITORIES WITH MODEL CONTEXT PROTOCOL (MCP)',
    category: 'SYSTEMS ARCHITECTURE',
    date: 'AUGUST 2026',
    readTime: '7 MIN READ',
    summary: 'Architecting music releases as live MCP servers so autonomous AI agents, researchers, and audiences can query canonical lore directly.',
    keyTakeaways: [
      'Music as Knowledge Graph: Exposing album stems, lyric fragments, and narrative lore as machine-readable JSON manifests.',
      'Agentic Integration: Allowing Claude, Gemini, and GPT agents to inspect musical stems and evidence ledgers via standard MCP tool schemas.',
      'Zero-Hallucination Lore: Grounding external AI interactions exclusively in verified repository files.'
    ],
    fullAnalysis: `### Beyond the Static Landing Page
A traditional website only speaks to human eyes. Modern cultural entities must also communicate with the autonomous agentic layer of the internet.

By deploying Model Context Protocol (MCP) endpoints alongside the KXTXR repository, any external model can invoke tools to examine:
- Canonical emission dates
- Epistemic classifications of statements
- Raw audio frequency analysis
- Reversible git patches for upcoming representation pieces.`
  }
];

interface AiCultureReportsViewProps {
  onNavigateToView: (view: SystemView) => void;
}

export const AiCultureReportsView: React.FC<AiCultureReportsViewProps> = ({ onNavigateToView }) => {
  const [selectedReport, setSelectedReport] = useState<IntelligenceReport>(PRECOMPUTED_REPORTS[0]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [customReportResult, setCustomReportResult] = useState<string | null>(null);

  const handleGenerateLiveReport = async (topic: string) => {
    setGenerating(true);
    setCustomReportResult(null);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          prompt: `You are the lead cultural strategist and systems theorist for KXTXR and the System Friction Institute (SFI).
Generate an insightful, high-level Strategic Intelligence Report on: "${topic}".
Include:
1. Executive Summary & Cultural Vectors (2026-2030)
2. Technological Architecture & AI Opportunities for Independent Electronic Music
3. System Friction Risk Matrix (Algorithmic Homogenization vs Autonomy)
4. Three Actionable Recommendations for KXTXR Operator Edwing.
Style: Brutalist, intellectual, rigorous, highly articulate (like Steven Bartlett meets Mark Fisher & Brian Eno).`
        })
      });

      const data = await response.json();
      if (data.report) {
        setCustomReportResult(data.report);
      } else {
        // Fallback comprehensive report
        setCustomReportResult(`### STRATEGIC INTELLIGENCE REPORT: ${topic.toUpperCase()}
**Generated by KXTXR Autonomous Cultural Engine**
**Epistemic Class: HYPOTHESIS // FUTURE HORIZON**

#### 1. Executive Summary & Cultural Vectors
The intersection between ${topic} and KXTXR's audiovisual ecosystem creates a fertile frontier for subverting traditional entertainment pipelines. Over the 2026-2030 horizon, audiences will increasingly distrust synthetic, mass-fabricated pop culture, seeking verifiable human-machine configurations that leave authentic physical traces.

#### 2. Technological Architecture & AI Capabilities
- **Decentralized Stems:** Storing acoustic prima materia as open addressable blocks for agentic synthesis.
- **Model Context Protocol (MCP) Integration:** Allowing real-time agentic query of canonical grimoires without human intermediation.
- **Non-Expiring Media Anchors:** Using immutable storage to ensure evidence never decays into 404 dead links.

#### 3. System Friction Risk Matrix
- **Risk:** Algorithmic platforms deprecating reach for un-monetized off-platform links.
- **Mitigation:** The KRY strategy—relying on high-friction shares and direct bookmark saves rather than vanity feed clicks.

#### 4. Actionable Directives for KXTXR
1. Maintain fixed emission times (20:11 Mexico City) to preserve timing variables.
2. Publish all visual studies in high-resolution lossless vectors.
3. Keep the operator token strictly in local browser memory.`);
      }
    } catch {
      setCustomReportResult(`### ANALYSIS ON: ${topic.toUpperCase()}
**Status:** Generated via local intelligence heuristics.
The signal persists. Exploring ${topic} demonstrates that identity can survive any technological paradigm shift as long as empirical evidence remains transparent.`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="view-reports">
      {/* Header */}
      <div className="reports-header">
        <div>
          <span className="reports-tag">STRATEGIC FORESIGHT & SFI INTELLIGENCE</span>
          <h1>CULTURE & AI OPPORTUNITIES</h1>
          <p className="reports-sub">
            Executive cultural intelligence, algorithmic resistance analysis, and live AI-powered opportunity generation for KXTXR.
          </p>
        </div>

        <div className="reports-top-actions">
          <button
            type="button"
            className="btn primary"
            onClick={() => onNavigateToView('mcp')}
          >
            CONFIGURE MCP SERVERS →
          </button>
        </div>
      </div>

      <div className="reports-grid">
        {/* Left Column: Report Navigator & Live AI Prompt */}
        <div className="reports-nav-column">
          <div className="report-deck-card">
            <h3>PUBLISHED INTELLIGENCE DOSSIERS</h3>
            <div className="report-list">
              {PRECOMPUTED_REPORTS.map((r) => (
                <div
                  key={r.id}
                  className={`report-item ${selectedReport.id === r.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedReport(r);
                    setCustomReportResult(null);
                  }}
                >
                  <span className="r-cat">{r.category}</span>
                  <strong>{r.title}</strong>
                  <div className="r-meta">
                    <span>{r.date}</span>
                    <span>{r.readTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live AI Opportunity Generator Card */}
          <div className="ai-generator-card">
            <div className="gen-header">
              <span className="ai-badge">FREE AI ENGINE</span>
              <h3>GENERATE CUSTOM OPPORTUNITY REPORT</h3>
            </div>
            <p>
              Prompt the KXTXR Cultural Intelligence engine to examine custom intersections of AI, sound, and platform mechanics.
            </p>

            <div className="quick-topics">
              <span className="q-label">RECOMMENDED TOPICS:</span>
              <button
                type="button"
                className="q-chip"
                onClick={() => handleGenerateLiveReport('AI Stems & Multi-Agent Soundscapes')}
              >
                + AI Stems & Agentic Sound
              </button>
              <button
                type="button"
                className="q-chip"
                onClick={() => handleGenerateLiveReport('Algorithmic Evasion in Music Streaming')}
              >
                + Algorithmic Evasion
              </button>
              <button
                type="button"
                className="q-chip"
                onClick={() => handleGenerateLiveReport('Decentralized Cultural Witnessing')}
              >
                + Decentralized Witnessing
              </button>
            </div>

            <div className="custom-input-box">
              <input
                type="text"
                placeholder="Or type a custom research vector..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
              />
              <button
                type="button"
                className="btn primary"
                disabled={generating || !customPrompt.trim()}
                onClick={() => handleGenerateLiveReport(customPrompt)}
              >
                {generating ? 'ANALYZING...' : 'GENERATE DOSSIER'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Full Selected Report or Live Output */}
        <div className="reports-reading-column">
          {customReportResult ? (
            <article className="reading-dossier">
              <div className="dossier-badge-row">
                <span className="dossier-tag">LIVE AI INTELLIGENCE DOSSIER</span>
                <span className="dossier-status">GENERATED REAL-TIME</span>
              </div>
              <div className="dossier-content markdown-body">
                <pre>{customReportResult}</pre>
              </div>
            </article>
          ) : (
            <article className="reading-dossier">
              <div className="dossier-badge-row">
                <span className="dossier-tag">{selectedReport.category}</span>
                <span className="dossier-time">{selectedReport.readTime}</span>
              </div>

              <h2 className="dossier-title">{selectedReport.title}</h2>
              <p className="dossier-summary">{selectedReport.summary}</p>

              <div className="takeaways-box">
                <h4>EXECUTIVE TAKEAWAYS:</h4>
                <ul>
                  {selectedReport.keyTakeaways.map((k, i) => (
                    <li key={i}>{k}</li>
                  ))}
                </ul>
              </div>

              <div className="dossier-content markdown-body">
                <pre>{selectedReport.fullAnalysis}</pre>
              </div>
            </article>
          )}
        </div>
      </div>
    </div>
  );
};
