export interface Task {
  id: string;
  client_id: string | null;
  project_id: string | null;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  due_date: string | null;
  created_at: string;
}

/** Lightweight option shapes for the Client/Project selects. */
export interface ClientOption {
  id: string;
  name: string;
}

export interface ProjectOption {
  id: string;
  name: string;
}
