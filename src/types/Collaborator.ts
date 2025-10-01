import type { User } from "./User";

export const ROLES = ["ADMIN", "MEMBER", "GUEST"];

export interface Collaborator {
  role: (typeof ROLES)[number];
  user: User;
}
