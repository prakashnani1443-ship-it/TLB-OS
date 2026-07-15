// Hand-written to match supabase/migrations/0001_create_clients.sql,
// 0002_add_client_address_notes.sql, 0003_grant_client_privileges.sql,
// and 0004_create_projects.sql. Once the Supabase CLI is linked to the
// project, prefer regenerating this from the live schema instead of
// hand-editing further:
//   npx supabase gen types typescript --project-id <id> > src/types/database.ts
export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          email: string | null;
          phone: string | null;
          company: string | null;
          address: string | null;
          notes: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          company?: string | null;
          address?: string | null;
          notes?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          email?: string | null;
          phone?: string | null;
          company?: string | null;
          address?: string | null;
          notes?: string | null;
          status?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          client_id: string | null;
          name: string;
          project_type: string | null;
          status: string;
          start_date: string | null;
          due_date: string | null;
          budget: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          client_id?: string | null;
          name: string;
          project_type?: string | null;
          status?: string;
          start_date?: string | null;
          due_date?: string | null;
          budget?: number | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          client_id?: string | null;
          name?: string;
          project_type?: string | null;
          status?: string;
          start_date?: string | null;
          due_date?: string | null;
          budget?: number | null;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
