export interface Project {
  id: string;
  client_id: string | null;
  name: string;
  project_type: string | null;
  status: string;
  start_date: string | null;
  due_date: string | null;
  budget: number | null;
  notes: string | null;
  created_at: string;
}

/** Lightweight client shape for the Client select — not the full Client type. */
export interface ClientOption {
  id: string;
  name: string;
}
