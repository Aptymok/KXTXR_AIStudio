import React, { useState, useEffect } from 'react';
import { SystemView } from '../components/Navigation';

interface EdwingRegistryViewProps {
  onNavigateToView: (view: SystemView) => void;
}

interface RegistryEntry {
  id: string;
  created_at: string;
  piece: string;
  platform: string;
  representation: string;
  metrics: {
    reach: number;
    views: number;
    completion: number;
    shares: number;
    comments: number;
    profile: number;
    saves: number;
    follows: number;
  };
  return_type: string;
  permission: string;
  signal: string;
  observation: string;
  next_change: string;
  kry?: number | null;
}

const REGISTRY_ENTRIES_KEY = 'kxtxr_que_no_representation_entries_v1';

export const EdwingRegistryView: React.FC<EdwingRegistryViewProps> = ({ onNavigateToView }) => {
  const [isOperator, setIsOperator] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');
  const [clock, setClock] = useState<string>('--:--:--');

  const pieces = [
    { piece: '07/12', state: 'MEMORY', objective: 'identification + transmission', status: 'READY' },
    { piece: '08/12', state: 'RETURN', objective: 'let observed reception modify the field', status: 'WAIT_RETURN_07' },
    { piece: '09/12', state: 'EMITTER', objective: 'associate work → KXTXR', status: 'CONDITIONAL' },
    { piece: '10/12', state: 'EMBODIMENT', objective: 'voice + body + performance', status: 'CONDITIONAL' },
    { piece: '11/12', state: 'INVOCATION', objective: 'desire for access + sound recognition', status: 'CONDITIONAL' },
    { piece: '12/12', state: 'APERTURA', objective: 'listen + save + transmit', status: 'CONDITIONAL' }
  ];

  const [selectedPiece, setSelectedPiece] = useState<string>('07/12');

  // Form inputs
  const [platform, setPlatform] = useState<string>('Instagram');
  const [representation, setRepresentation] = useState<string>('HUMAN_02 / OBJECT');
  const [reach, setReach] = useState<number>(0);
  const [views, setViews] = useState<number>(0);
  const [completion, setCompletion] = useState<number>(0);
  const [shares, setShares] = useState<number>(0);
  const [comments, setComments] = useState<number>(0);
  const [profile, setProfile] = useState<number>(0);
  const [saves, setSaves] = useState<number>(0);
  const [follows, setFollows] = useState<number>(0);
  const [returnType, setReturnType] = useState<string>('Identificación');
  const [permission, setPermission] = useState<string>('No requerido');
  const [signal, setSignal] = useState<string>('');
  const [observation, setObservation] = useState<string>('');
  const [nextChange, setNextChange] = useState<string>('');

  const [operatorNotice, setOperatorNotice] = useState<string>(
    'Introduce el token operativo para firmar registros en memoria.'
  );

  const [entries, setEntries] = useState<RegistryEntry[]>(() => {
    try {
      const stored = localStorage.getItem(REGISTRY_ENTRIES_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return [
      {
        id: 'init-1',
        created_at: '2026-09-20T19:40:00Z',
        piece: '07/12',
        platform: 'Instagram',
        representation: 'HUMAN_01',
        metrics: { reach: 1100, views: 2400, completion: 600, shares: 45, comments: 20, profile: 30, saves: 55, follows: 12 },
        return_type: 'Identificación',
        permission: 'Concedido',
        signal: 'Audiencia pregunta por el vínculo con REM618.',
        observation: 'Fuerte reconocimiento de la identidad gráfica inicial.',
        next_change: 'Probar representación puramente de objeto en 08/12.',
        kry: 23.4
      }
    ];
  });

  useEffect(() => {
    const update = () => setClock(new Date().toLocaleTimeString('es-MX', { hour12: false }));
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const calculateKry = (m: RegistryEntry['metrics']) => {
    if (!m.reach || !m.views) return null;
    const w = {
      shares: 0.30,
      comments: 0.25,
      completion: 0.20,
      profile: 0.15,
      saves: 0.10
    };
    return 1000 * (
      w.shares * (m.shares / m.reach) +
      w.comments * (m.comments / m.reach) +
      w.completion * (m.completion / m.views) +
      w.profile * (m.profile / m.reach) +
      w.saves * (m.saves / m.reach)
    );
  };

  const currentPieceData = pieces.find((p) => p.piece === selectedPiece) || pieces[0];

  const handleIngest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      alert('Se requiere el token operativo.');
      return;
    }

    const metrics = { reach, views, completion, shares, comments, profile, saves, follows };
    const kryVal = calculateKry(metrics);

    const newEntry: RegistryEntry = {
      id: `reg-${Date.now()}`,
      created_at: new Date().toISOString(),
      piece: selectedPiece,
      platform,
      representation,
      metrics,
      return_type: returnType,
      permission,
      signal,
      observation,
      next_change: nextChange,
      kry: kryVal ? parseFloat(kryVal.toFixed(2)) : null
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    try {
      localStorage.setItem(REGISTRY_ENTRIES_KEY, JSON.stringify(updated));
    } catch {}

    setOperatorNotice('Registro guardado en sesión local. Datos sincronizados con la heurística KRY.');
    setSignal('');
    setObservation('');
    setNextChange('');
  };

  const handleExportJson = () => {
    const data = JSON.stringify(
      {
        schema: 'KXTXR_QUE_NO_RETURN_EXPORT_V1',
        exported_at: new Date().toISOString(),
        entries_count: entries.length,
        entries
      },
      null,
      2
    );
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kxtxr-que-no-registry-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearLocal = () => {
    if (confirm('¿Vaciar los registros locales guardados en este navegador?')) {
      setEntries([]);
      localStorage.removeItem(REGISTRY_ENTRIES_KEY);
    }
  };

  const kryValues = entries.map((e) => e.kry).filter((v): v is number => typeof v === 'number');
  const lastKry = kryValues.length ? kryValues[0].toFixed(2) : '—';
  const avgKry = kryValues.length
    ? (kryValues.reduce((a, b) => a + b, 0) / kryValues.length).toFixed(2)
    : '—';

  return (
    <div className={`view-registry ${isOperator ? 'operator-mode' : 'public-mode'}`}>
      <div className="shell">
        {/* Header */}
        <header>
          <span>
            <button type="button" className="text-link" onClick={() => onNavigateToView('index')}>
              KXTXR
            </button>{' '}
            · QUE NO · REPRESENTATION FIELD ·{' '}
            <button type="button" className="text-link" onClick={() => onNavigateToView('console')}>
              CONTROL PLANE
            </button>
          </span>
          <div className="header-right">
            <button
              type="button"
              className={`mode-toggle-btn ${isOperator ? 'active' : ''}`}
              onClick={() => setIsOperator(!isOperator)}
            >
              MODO: {isOperator ? 'OPERATOR' : 'WITNESS'}
            </button>
            <span>CONTROL SURFACE · <b id="clock">{clock}</b></span>
          </div>
        </header>

        {/* Main 3-column layout */}
        <main>
          {/* Aside: Series */}
          <aside className="panel">
            <div className="ph">
              <span>Serie</span>
              <span className="badge ok">GIT-BACKED</span>
            </div>
            <div className="pb">
              <div className="notice">
                07/12–12/12 son piezas de la serie, no fechas. El canon artístico no se modifica desde esta pantalla.
              </div>
              <div className="sep" />
              <div className="pieces">
                {pieces.map((p) => (
                  <button
                    key={p.piece}
                    type="button"
                    className={`piece ${p.piece === selectedPiece ? 'active' : ''}`}
                    onClick={() => setSelectedPiece(p.piece)}
                  >
                    <b>{p.piece}</b>
                    <span>
                      {p.state}
                      <br />
                      <small style={{ opacity: 0.55 }}>{p.objective}</small>
                    </span>
                    <span className="pill">{p.status}</span>
                  </button>
                ))}
              </div>
              <div className="sep" />
              <button
                type="button"
                className="micro-link"
                onClick={() => onNavigateToView('rem618')}
              >
                ABRIR REGISTRY HISTÓRICO REM618 →
              </button>
            </div>
          </aside>

          {/* Center: Ingest / Witness */}
          <section>
            <div className="hero">
              <div>
                <div className="micro">CURRENT FIELD / HUMAN-GOVERNED</div>
                <h1>QUE NO</h1>
              </div>
              <div>
                <h2>{currentPieceData.piece} · {currentPieceData.state}</h2>
                <p className="lead">{currentPieceData.objective}.</p>
              </div>
            </div>

            <div className="sep" />

            {isOperator ? (
              <div className="panel operator-panel">
                <div className="ph">
                  <span>Ingesta de observación</span>
                  <span className={`badge ${token ? 'ok' : 'warn'}`}>
                    {token ? 'ABIERTO' : 'BLOQUEADO'}
                  </span>
                </div>
                <div className="pb">
                  <div className="notice">{operatorNotice}</div>
                  <div className="sep" />
                  <label>
                    Token operativo
                    <input
                      type="password"
                      placeholder="TOKEN PRIVADO · NO SE GUARDA EN SERVIDOR"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                    />
                  </label>
                  <div className="sep" />

                  <form className="form" onSubmit={handleIngest}>
                    <div className="grid2">
                      <label>
                        Pieza
                        <select
                          value={selectedPiece}
                          onChange={(e) => setSelectedPiece(e.target.value)}
                        >
                          {pieces.map((p) => (
                            <option key={p.piece}>{p.piece}</option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Plataforma
                        <select
                          value={platform}
                          onChange={(e) => setPlatform(e.target.value)}
                        >
                          <option>Instagram</option>
                          <option>TikTok</option>
                          <option>YouTube Shorts</option>
                          <option>Otra</option>
                        </select>
                      </label>
                    </div>

                    <label>
                      Representación
                      <input
                        placeholder="HUMAN_02 / TEXT / OBJECT / PERFORMANCE"
                        value={representation}
                        onChange={(e) => setRepresentation(e.target.value)}
                      />
                    </label>

                    <div className="grid3">
                      <label>
                        Alcance
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
                        Comentarios
                        <input
                          type="number"
                          value={comments}
                          onChange={(e) => setComments(Number(e.target.value))}
                        />
                      </label>
                      <label>
                        Perfil / búsqueda
                        <input
                          type="number"
                          value={profile}
                          onChange={(e) => setProfile(Number(e.target.value))}
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
                        Follows
                        <input
                          type="number"
                          value={follows}
                          onChange={(e) => setFollows(Number(e.target.value))}
                        />
                      </label>
                    </div>

                    <div className="grid2">
                      <label>
                        Tipo de RETURN
                        <select
                          value={returnType}
                          onChange={(e) => setReturnType(e.target.value)}
                        >
                          <option>Identificación</option>
                          <option>Interpretación</option>
                          <option>Relato</option>
                          <option>Contradicción</option>
                          <option>Transmisión</option>
                          <option>Conversión</option>
                          <option>Otro</option>
                        </select>
                      </label>
                      <label>
                        Permiso
                        <select
                          value={permission}
                          onChange={(e) => setPermission(e.target.value)}
                        >
                          <option>No requerido</option>
                          <option>Solicitado</option>
                          <option>Concedido</option>
                          <option>No concedido</option>
                        </select>
                      </label>
                    </div>

                    <label>
                      Respuesta / señal
                      <textarea
                        placeholder="Qué dijo o hizo realmente la audiencia."
                        value={signal}
                        onChange={(e) => setSignal(e.target.value)}
                      />
                    </label>

                    <label>
                      Observación
                      <textarea
                        placeholder="Qué está observado, no qué creemos que significa."
                        value={observation}
                        onChange={(e) => setObservation(e.target.value)}
                      />
                    </label>

                    <label>
                      Siguiente cambio
                      <textarea
                        placeholder="Cambiar una variable principal como máximo."
                        value={nextChange}
                        onChange={(e) => setNextChange(e.target.value)}
                      />
                    </label>

                    <div className="btns">
                      <button className="btn primary" type="submit">
                        INGESTAR RETURN
                      </button>
                      <button className="btn" type="button" onClick={handleExportJson}>
                        EXPORTAR JSON
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="panel witness-panel">
                <div className="ph">
                  <span>Modo testigo</span>
                  <span className="badge">LECTURA</span>
                </div>
                <div className="pb">
                  <div className="notice">
                    Esta ruta pública muestra la serie activa en modo observador. Haz clic en "MODO: WITNESS" en la barra superior para alternar a modo operador.
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Aside: Log & KRY Score */}
          <aside className="panel">
            <div className="ph">
              <span>RETURN / sesión local</span>
              <span className="badge">{entries.length}</span>
            </div>
            <div className="pb">
              <div className="score">
                <div className="card">
                  <span className="micro">KRY ÚLTIMO</span>
                  <b>{lastKry}</b>
                </div>
                <div className="card">
                  <span className="micro">KRY PROMEDIO</span>
                  <b>{avgKry}</b>
                </div>
              </div>
              <div className="sep" />
              <p className="kry-note">
                KRY es un indicador interno comparativo. No representa ni pretende conocer el algoritmo de Instagram, TikTok o YouTube.
              </p>
              <div className="sep" />

              <div className="log">
                {entries.map((e) => (
                  <article key={e.id} className="entry">
                    <div className="meta">
                      <span>{e.piece} · {e.platform}</span>
                      <span>{new Date(e.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="body">{e.observation || e.signal || 'Sin observación'}</div>
                    <div className="micro">
                      KRY {e.kry !== null && e.kry !== undefined ? e.kry : 'N/D'} · {e.return_type}
                    </div>
                  </article>
                ))}
              </div>

              {isOperator && (
                <>
                  <div className="sep" />
                  <button className="btn bad" type="button" onClick={clearLocal}>
                    VACIAR LOCAL
                  </button>
                </>
              )}
            </div>
          </aside>
        </main>

        {/* Footer */}
        <footer>
          <span>CANON ≠ EXPERIMENT · KRY ≠ PLATFORM ALGORITHM</span>
          <span>{isOperator ? 'OPERATOR ACTIVE' : 'WITNESS MODE'}</span>
        </footer>
      </div>
    </div>
  );
};
