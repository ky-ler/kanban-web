import type { User } from "./User";

export interface Collaborator {
  role: string;
  user: User;
}
