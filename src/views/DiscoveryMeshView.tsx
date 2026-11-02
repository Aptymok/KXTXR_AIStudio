import React, { useState } from 'react';
import { SystemView } from '../components/Navigation';

interface MeshNode {
  id: string;
  label: string;
  category: 'SIGNAL' | 'ENTITY' | 'ARTIFACT' | 'REPRESENTATION' | 'CONCEPT';
  epistemicClass: 'OBSERVED' | 'DECLARED' | 'INFERRED' | 'CONDITIONAL';
  description: string;
  sourceFile: string;
  related: string[];
  coordinates: { x: number; y: number };
}

const NODES: MeshNode[] = [
  {
    id: 'rem618',
    label: 'REM618',
    category: 'SIGNAL',
    epistemicClass: 'OBSERVED',
    description: 'The opening emission and prima materia. Captured from decayed magnetic cassette tape splices.',
    sourceFile: '/data/releases.json',
    related: ['edwing', 'magnetic-tape', '111'],
    coordinates: { x: 22, y: 35 }
  },
  {
    id: '111',
    label: '111 / RETURN',
    category: 'SIGNAL',
    epistemicClass: 'DECLARED',
    description: 'Persistent live countdown transmission and cyclical calibration between physical room and signal field.',
    sourceFile: '/artist/111/live/index.html',
    related: ['rem618', 'lunar-syzygy', 'sfi'],
    coordinates: { x: 50, y: 20 }
  },
  {
    id: 'edwing',
    label: 'EDWING',
    category: 'ENTITY',
    epistemicClass: 'OBSERVED',
    description: 'The human operator and performer who entered the room making sound before the name was declared.',
    sourceFile: '/grimoire/story.json',
    related: ['rem618', 'kxtxr-ident', 'kaiju'],
    coordinates: { x: 30, y: 65 }
  },
  {
    id: 'kxtxr-ident',
    label: 'KXTXR',
    category: 'ENTITY',
    epistemicClass: 'DECLARED',
    description: 'Not an introduction, but the persistent configuration that can return with evidence.',
    sourceFile: '/grimoire/ledger.json',
    related: ['edwing', '111', 'que-no'],
    coordinates: { x: 50, y: 50 }
  },
  {
    id: 'que-no',
    label: 'QUE NO',
    category: 'REPRESENTATION',
    epistemicClass: 'DECLARED',
    description: 'Six-part representation engine (07/12 to 12/12) examining if identity survives mutated embodiment.',
    sourceFile: '/campaigns/que-no/representation-engine.json',
    related: ['kxtxr-ident', 'fractura', 'lunar-syzygy'],
    coordinates: { x: 72, y: 40 }
  },
  {
    id: 'lunar-syzygy',
    label: 'LUNAR ALIGNMENT',
    category: 'CONCEPT',
    epistemicClass: 'OBSERVED',
    description: 'Three moons aligned vertically on a crimson rupture line. "Lo que no se dice también gira."',
    sourceFile: 'KXTXR_QUE_NO_03_LUNAR.jpg',
    related: ['que-no', '111', 'sfi'],
    coordinates: { x: 78, y: 18 }
  },
  {
    id: 'fractura',
    label: 'FRACTURA 02/12',
    category: 'REPRESENTATION',
    epistemicClass: 'OBSERVED',
    description: 'Tectonic torn paper fissure dividing charcoal void from bone paper along a jagged bleeding seam.',
    sourceFile: 'KXTXR_QUE_NO_02_FRACTURA.jpg',
    related: ['que-no', 'magnetic-tape'],
    coordinates: { x: 80, y: 70 }
  },
  {
    id: 'magnetic-tape',
    label: 'MAGNETIC TAPE',
    category: 'ARTIFACT',
    epistemicClass: 'OBSERVED',
    description: 'The physical carrier of acoustic residue. Ribbon loops and cassette heads resisting digital flattening.',
    sourceFile: '/artist/scene-manifest.js',
    related: ['rem618', 'fractura'],
    coordinates: { x: 20, y: 80 }
  },
  {
    id: 'sfi',
    label: 'SYSTEM FRICTION',
    category: 'CONCEPT',
    epistemicClass: 'DECLARED',
    description: 'Empirical epistemological institute: "Publication ≠ Evidence. Engagement ≠ Causality. Missing remains missing."',
    sourceFile: '/grimoire/ledger.json',
    related: ['111', 'lunar-syzygy', 'kxtxr-ident'],
    coordinates: { x: 42, y: 85 }
  },
  {
    id: 'kaiju',
    label: 'KAIJU CONTACT',
    category: 'ENTITY',
    epistemicClass: 'INFERRED',
    description: 'The first show as contact event between performer, giant creature, and observed audience field.',
    sourceFile: '/artist/scene-manifest.js',
    related: ['edwing', 'kxtxr-ident'],
    coordinates: { x: 15, y: 55 }
  }
];

interface DiscoveryMeshViewProps {
  onNavigateToView: (view: SystemView) => void;
}

export const DiscoveryMeshView: React.FC<DiscoveryMeshViewProps> = ({ onNavigateToView }) => {
  const [selectedNode, setSelectedNode] = useState<MeshNode | null>(NODES[3]);
  const [filterClass, setFilterClass] = useState<string>('ALL');

  const filteredNodes = filterClass === 'ALL'
    ? NODES
    : NODES.filter((n) => n.epistemicClass === filterClass);

  return (
    <div className="view-mesh">
      {/* Header */}
      <div className="mesh-header">
        <div>
          <span className="mesh-kicker">GRIMOIRE V3 · TOPOLOGICAL CONSTELLATION</span>
          <h1>DISCOVERY MESH</h1>
          <p className="mesh-lead">
            An epistemic graph of signals, artifacts, entities, and empirical evidence in the KXTXR system.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="mesh-filters">
          {['ALL', 'OBSERVED', 'DECLARED', 'INFERRED'].map((cls) => (
            <button
              key={cls}
              type="button"
              className={`filter-chip ${filterClass === cls ? 'active' : ''}`}
              onClick={() => setFilterClass(cls)}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>

      {/* Main Graph Viewport */}
      <div className="mesh-viewport">
        {/* SVG Connective Strands */}
        <svg className="mesh-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <radialGradient id="meshOrbitGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(184, 45, 50, 0.2)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* Background Astronomical Rings (from user image aesthetic) */}
          <circle cx="50" cy="50" r="38" stroke="rgba(236, 231, 220, 0.06)" strokeDasharray="1 2" fill="none" />
          <circle cx="50" cy="50" r="24" stroke="rgba(184, 45, 50, 0.12)" fill="none" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(184, 45, 50, 0.2)" strokeWidth="0.3" strokeDasharray="2 1" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(236, 231, 220, 0.05)" strokeWidth="0.2" />

          {/* Node Connections */}
          {filteredNodes.map((node) =>
            node.related.map((relId) => {
              const target = NODES.find((t) => t.id === relId);
              if (!target) return null;
              const isHighlighted = selectedNode?.id === node.id || selectedNode?.id === target.id;
              return (
                <line
                  key={`${node.id}-${relId}`}
                  x1={node.coordinates.x}
                  y1={node.coordinates.y}
                  x2={target.coordinates.x}
                  y2={target.coordinates.y}
                  stroke={isHighlighted ? 'rgba(184, 45, 50, 0.7)' : 'rgba(236, 231, 220, 0.12)'}
                  strokeWidth={isHighlighted ? '0.6' : '0.25'}
                />
              );
            })
          )}
        </svg>

        {/* Nodes Layer */}
        <div className="mesh-nodes-layer">
          {filteredNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <button
                key={node.id}
                type="button"
                className={`mesh-node-pill ${isSelected ? 'selected' : ''} ${node.category.toLowerCase()}`}
                style={{
                  left: `${node.coordinates.x}%`,
                  top: `${node.coordinates.y}%`
                }}
                onClick={() => setSelectedNode(node)}
              >
                <span className="node-dot" />
                <span className="node-label">{node.label}</span>
                <span className="node-epistemic">{node.epistemicClass}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Node Inspector Drawer */}
      {selectedNode && (
        <div className="mesh-inspector">
          <div className="inspector-head">
            <div>
              <span className="inspector-cat">{selectedNode.category} · {selectedNode.epistemicClass}</span>
              <h3>{selectedNode.label}</h3>
            </div>
            <button
              type="button"
              className="inspector-close"
              onClick={() => setSelectedNode(null)}
            >
              ✕
            </button>
          </div>

          <div className="inspector-body">
            <p className="inspector-desc">{selectedNode.description}</p>

            <div className="inspector-meta-row">
              <span className="meta-label">CANONICAL SOURCE:</span>
              <code>{selectedNode.sourceFile}</code>
            </div>

            <div className="inspector-related">
              <span className="meta-label">CONNECTED STRANDS:</span>
              <div className="related-pills">
                {selectedNode.related.map((relId) => {
                  const target = NODES.find((t) => t.id === relId);
                  return (
                    <button
                      key={relId}
                      type="button"
                      className="rel-btn"
                      onClick={() => target && setSelectedNode(target)}
                    >
                      {target?.label || relId} →
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="inspector-actions">
              <button
                type="button"
                className="btn primary"
                onClick={() => onNavigateToView('stories')}
              >
                ENTER STORY REPOSITORY →
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => onNavigateToView('studio')}
              >
                LISTEN IN REPRODUCTION STUDIO →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
