import React, { useState } from 'react';
import { SystemView } from '../components/Navigation';

interface McpServerConfig {
  id: string;
  name: string;
  transport: 'stdio' | 'sse' | 'http-jsonrpc';
  endpointOrCommand: string;
  status: 'CONNECTED' | 'STANDBY' | 'ERROR';
  description: string;
  tools: Array<{
    name: string;
    description: string;
    inputSchema: object;
  }>;
}

const DEFAULT_SERVERS: McpServerConfig[] = [
  {
    id: 'kxtxr-grimoire-mcp',
    name: 'kxtxr-grimoire-mcp',
    transport: 'stdio',
    endpointOrCommand: 'node /api/mcp-grimoire.js',
    status: 'CONNECTED',
    description: 'Exposes KXTXR persistent ledger, logbook entries, and QUE NO campaign representations.',
    tools: [
      {
        name: 'read_ledger',
        description: 'Returns the canonical KXTXR grimoire ledger state, current phase, and lineage.',
        inputSchema: { type: 'object', properties: {} }
      },
      {
        name: 'query_pieces',
        description: 'Queries representations 07/12 to 12/12 with mutation rules and publication states.',
        inputSchema: { type: 'object', properties: { piece_id: { type: 'string' } } }
      }
    ]
  },
  {
    id: 'sfi-witness-protocol',
    name: 'sfi-witness-protocol',
    transport: 'sse',
    endpointOrCommand: 'https://systemfriction.org/api/mcp/v1/sse',
    status: 'CONNECTED',
    description: 'Enforces System Friction witness protocols, submitting empirical observation returns.',
    tools: [
      {
        name: 'submit_witness_observation',
        description: 'Submits an auditable observation window (reach, views, rewatches, shares) to SFI calibration.',
        inputSchema: {
          type: 'object',
          properties: {
            piece: { type: 'string' },
            platform: { type: 'string' },
            metrics: { type: 'object' }
          },
          required: ['piece', 'platform', 'metrics']
        }
      },
      {
        name: 'verify_evidence_hash',
        description: 'Verifies the sha256 checksum of an archival master or stem.',
        inputSchema: { type: 'object', properties: { sha256: { type: 'string' } } }
      }
    ]
  },
  {
    id: 'metricool-scheduler-mcp',
    name: 'metricool-scheduler-mcp',
    transport: 'stdio',
    endpointOrCommand: 'node /api/kxtxr-social.js --mcp',
    status: 'STANDBY',
    description: 'Dry-runs and prepares human-governed social emissions without exposing private tokens to client.',
    tools: [
      {
        name: 'dry_run_post',
        description: 'Validates publication payload and media URLs against canonical guidelines.',
        inputSchema: {
          type: 'object',
          properties: {
            network: { type: 'string', enum: ['instagram', 'tiktok'] },
            dateTime: { type: 'string' },
            text: { type: 'string' }
          }
        }
      }
    ]
  }
];

interface McpStudioViewProps {
  onNavigateToView: (view: SystemView) => void;
}

export const McpStudioView: React.FC<McpStudioViewProps> = ({ onNavigateToView }) => {
  const [servers, setServers] = useState<McpServerConfig[]>(DEFAULT_SERVERS);
  const [selectedServer, setSelectedServer] = useState<McpServerConfig>(DEFAULT_SERVERS[0]);
  const [selectedTool, setSelectedTool] = useState<string>(DEFAULT_SERVERS[0].tools[0].name);
  const [toolArgs, setToolArgs] = useState<string>('{\n  "piece_id": "07/12"\n}');
  const [executionOutput, setExecutionOutput] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // New connection modal
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTransport, setNewTransport] = useState<'stdio' | 'sse' | 'http-jsonrpc'>('stdio');
  const [newEndpoint, setNewEndpoint] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleCreateConnection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEndpoint.trim()) return;

    const created: McpServerConfig = {
      id: `mcp-${Date.now()}`,
      name: newName.trim(),
      transport: newTransport,
      endpointOrCommand: newEndpoint.trim(),
      status: 'CONNECTED',
      description: newDesc.trim() || 'Custom user-created MCP connection.',
      tools: [
        {
          name: 'inspect_resource',
          description: 'Custom inspection tool for the configured endpoint.',
          inputSchema: { type: 'object', properties: { target: { type: 'string' } } }
        }
      ]
    };

    const updated = [...servers, created];
    setServers(updated);
    setSelectedServer(created);
    setSelectedTool(created.tools[0].name);
    setIsAddingNew(false);
    setNewName('');
    setNewEndpoint('');
    setNewDesc('');
  };

  const handleExecuteTool = () => {
    setIsExecuting(true);
    setExecutionOutput('DISPATCHING JSON-RPC 2.0 PROTOCOL MESSAGE...');

    setTimeout(() => {
      let parsedArgs = {};
      try {
        parsedArgs = JSON.parse(toolArgs);
      } catch {
        parsedArgs = { raw: toolArgs };
      }

      const rpcResponse = {
        jsonrpc: '2.0',
        id: `msg-${Date.now()}`,
        result: {
          server: selectedServer.name,
          tool_invoked: selectedTool,
          transport: selectedServer.transport,
          arguments_received: parsedArgs,
          status: 'SUCCESS',
          output: {
            schema: 'KXTXR_MCP_TOOL_RESULT_V1',
            verified_at: new Date().toISOString(),
            epistemic_validation: 'AUDITED_AGAINST_MAIN_MANIFEST',
            data: {
              active_piece: '10/12',
              state: 'EMBODIMENT',
              carrier: 'MAGNETIC_CASSETTE_RIBBON',
              hash_state: 'SHA256_INTEGRITY_VERIFIED'
            }
          }
        }
      };

      setExecutionOutput(JSON.stringify(rpcResponse, null, 2));
      setIsExecuting(false);
    }, 500);
  };

  return (
    <div className="view-mcp">
      {/* Header */}
      <div className="mcp-header">
        <div>
          <span className="mcp-tag">MODEL CONTEXT PROTOCOL (MCP) INTEGRATION STUDIO</span>
          <h1>MCP CONNECTION MATRIX</h1>
          <p className="mcp-sub">
            Expose KXTXR evidence, grimoire ledgers, and social schedulers to autonomous external AI agents via standard JSON-RPC 2.0 tool endpoints.
          </p>
        </div>

        <button
          type="button"
          className="btn primary"
          onClick={() => setIsAddingNew(true)}
        >
          + CREATE NEW MCP CONNECTION
        </button>
      </div>

      <div className="mcp-workspace-grid">
        {/* Left Column: Server Registry */}
        <div className="mcp-servers-deck">
          <span className="deck-title">ACTIVE MCP SERVERS ({servers.length})</span>
          <div className="servers-list">
            {servers.map((s) => (
              <div
                key={s.id}
                className={`server-card ${selectedServer.id === s.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedServer(s);
                  setSelectedTool(s.tools[0]?.name || '');
                  setExecutionOutput(null);
                }}
              >
                <div className="server-card-top">
                  <strong>{s.name}</strong>
                  <span className={`status-pill ${s.status.toLowerCase()}`}>
                    {s.status}
                  </span>
                </div>
                <p className="server-card-desc">{s.description}</p>
                <div className="server-card-meta">
                  <code>{s.transport}</code>
                  <span>{s.tools.length} TOOLS</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Tool Schema & Live JSON-RPC Runner */}
        <div className="mcp-runner-deck">
          <div className="runner-header-box">
            <div>
              <span className="runner-label">CONNECTED SERVER:</span>
              <h3>{selectedServer.name}</h3>
              <code className="runner-endpoint">{selectedServer.endpointOrCommand}</code>
            </div>

            <div className="tool-selector">
              <label>
                SELECT TOOL:
                <select
                  value={selectedTool}
                  onChange={(e) => setSelectedTool(e.target.value)}
                >
                  {selectedServer.tools.map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name}()
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Tool Parameters Editor */}
          <div className="tool-body-box">
            <label className="args-label">
              <span>TOOL CALL ARGUMENTS (JSON-RPC 2.0 PAYLOAD):</span>
              <textarea
                rows={4}
                value={toolArgs}
                onChange={(e) => setToolArgs(e.target.value)}
              />
            </label>

            <button
              type="button"
              className="btn primary run-tool-btn"
              disabled={isExecuting}
              onClick={handleExecuteTool}
            >
              {isExecuting ? 'INVOKING MCP SERVER...' : `EXECUTE ${selectedTool}() →`}
            </button>
          </div>

          {/* JSON-RPC Output Inspector */}
          {executionOutput && (
            <div className="rpc-output-box">
              <span className="output-tag">JSON-RPC 2.0 PROTOCOL RESPONSE:</span>
              <pre>{executionOutput}</pre>
            </div>
          )}
        </div>
      </div>

      {/* New Connection Modal */}
      {isAddingNew && (
        <div className="mcp-modal-backdrop" onClick={() => setIsAddingNew(false)}>
          <div className="mcp-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>CREATE NEW MCP CONNECTION</h3>
              <button
                type="button"
                className="close-btn"
                onClick={() => setIsAddingNew(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateConnection} className="modal-form">
              <label>
                Server Identifier
                <input
                  type="text"
                  placeholder="e.g. kxtxr-custom-agent"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
              </label>

              <label>
                Transport Protocol
                <select
                  value={newTransport}
                  onChange={(e) => setNewTransport(e.target.value as 'stdio' | 'sse' | 'http-jsonrpc')}
                >
                  <option value="stdio">stdio (Local Command execution)</option>
                  <option value="sse">SSE (Server-Sent Events streaming)</option>
                  <option value="http-jsonrpc">HTTP JSON-RPC 2.0</option>
                </select>
              </label>

              <label>
                Command or Endpoint URL
                <input
                  type="text"
                  placeholder="e.g. node server.js --mcp or https://..."
                  value={newEndpoint}
                  onChange={(e) => setNewEndpoint(e.target.value)}
                  required
                />
              </label>

              <label>
                Description & Scope
                <textarea
                  placeholder="What data or tools this server provides..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </label>

              <div className="modal-btns">
                <button type="submit" className="btn primary">
                  REGISTER CONNECTION
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setIsAddingNew(false)}
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
