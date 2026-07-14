export type { Database } from "./database";

export type AppRole = "owner" | "admin" | "member" | "viewer";

export interface AppUser {
  id: string;
  email: string;
  role: AppRole;
}
