import { pb } from "@/api/pocketbaseClient";

export type UserRole = "user" | "admin" | "moderator";

export const adminUtils = {
  isAdmin(): boolean {
    const user = pb.authStore.model;
    if (!user) return false;
    return (user as any).role === "admin";
  },

  isModerator(): boolean {
    const user = pb.authStore.model;
    if (!user) return false;
    const role = (user as any).role;
    return role === "moderator" || role === "admin";
  },

  getUserRole(): UserRole {
    const user = pb.authStore.model;
    if (!user) return "user";
    return ((user as any).role as UserRole) || "user";
  },

  hasAdminAccess(): boolean {
    return this.isAdmin();
  },

  hasModeratorAccess(): boolean {
    return this.isModerator();
  },

  canManageUsers(): boolean {
    return this.isAdmin();
  },

  canModerateContent(): boolean {
    return this.isModerator();
  },

  canManageSettings(): boolean {
    return this.isAdmin();
  },
};

