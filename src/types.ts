export interface QueNoPiece {
  piece: string;
  state: string;
  objective: string;
  status: string;
  mutation_rule?: string;
  publication_state?: string;
  web_representation?: {
    class: string;
    background: string;
    foreground: string;
    source_ref?: string;
    motion?: string;
    mobile?: string;
  };
}

export interface RepresentationEngineConfig {
  schema?: string;
  version?: string;
  updated_at?: string;
  campaign: string;
  current_piece: string;
  pieces: QueNoPiece[];
  runtime_state?: {
    active_piece?: string;
    next_piece?: string;
    next_publication_at?: string;
  };
  kry?: {
    weights: {
      shares_sends_per_reach: number;
      substantive_comments_per_reach: number;
      completion_rewatch_per_views: number;
      profile_search_per_reach: number;
      saves_per_reach: number;
    };
  };
}

export interface ReleaseItem {
  id: string;
  title?: string;
  function?: string;
  state?: string;
  file?: string;
  released_at?: string;
  lineage_order?: number;
}

export interface ContactData {
  public_email?: string | null;
  routes?: Array<{
    network: string;
    label: string;
    url: string;
    verified: boolean;
  }>;
}

export interface RiderData {
  status?: string;
  epistemic_class?: string;
  verification?: {
    verified_in_main?: boolean;
    rule?: string;
  };
}

export interface MediaManifestData {
  live?: Array<{
    id: string;
    file: string;
    metadata_status: string;
    description?: string;
  }>;
}

export interface LedgerData {
  schema?: string;
  current_state?: string;
  phase?: string;
  axiom?: string;
  lineage?: Array<{
    id: string;
    emblem: string;
    label: string;
    state: string;
    function: string;
  }>;
}

export interface LogbookEntry {
  title?: string;
  event?: string;
  type?: string;
  id?: string;
  date?: string;
  timestamp?: string;
  at?: string;
  note?: string;
}

export interface ReturnEntry {
  id: string;
  created_at: string;
  campaign: string;
  piece: string;
  platform: string;
  representation: string;
  metrics: {
    reach: number;
    views: number;
    completion: number;
    shares: number;
    comments: number;
    saves: number;
    profile: number;
    follows: number;
    latency?: number | null;
  };
  return_type: string;
  permission: string;
  signal: string;
  observation: string;
  next_change: string;
  kry?: number | null;
}

export interface ObservationMetrics {
  reach: number;
  views: number;
  completion: number;
  shares: number;
  comments: number;
  saves: number;
  profile: number;
  follows: number;
  latency?: number | null;
}

export interface ConnectorInfo {
  id: string;
  label: string;
  class: string;
  current_status: string;
  capabilities: string[];
}
