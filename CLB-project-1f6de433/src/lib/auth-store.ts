import { useSyncExternalStore } from "react";

// Lightweight mock auth store (frontend only, no backend).
// Persists a registered profile so we can pre-fill the club application form.

export interface AuthUser {
  name: string;
  studentId: string;
  department: string;
  email: string;
  course: string;
  major: string;
  phone: string;
}

const SESSION_KEY = "clubhub-auth-session";
const PROFILE_KEY = "clubhub-auth-profile"; // survives logout for prefill
const PENDING_KEY = "clubhub-pending-club";

function read(key: string): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

let user: AuthUser | null = read(SESSION_KEY);
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function persist(key: string, value: AuthUser | null) {
  if (typeof window === "undefined") return;
  if (value) window.localStorage.setItem(key, JSON.stringify(value));
  else window.localStorage.removeItem(key);
}

export function login(email: string) {
  const profile = read(PROFILE_KEY);
  const next: AuthUser =
    profile && profile.email.toLowerCase() === email.toLowerCase()
      ? profile
      : {
          name: email.split("@")[0] || "Thành viên",
          studentId: "",
          department: "",
          email,
          course: "",
          major: "",
          phone: "",
        };
  user = next;
  persist(SESSION_KEY, next);
  persist(PROFILE_KEY, next);
  emit();
}

export function register(data: AuthUser) {
  user = data;
  persist(SESSION_KEY, data);
  persist(PROFILE_KEY, data);
  emit();
}

export function logout() {
  user = null;
  persist(SESSION_KEY, null);
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useAuth() {
  return useSyncExternalStore(
    subscribe,
    () => user,
    () => null,
  );
}

// Pending club: remembers which club a guest wanted to join while they log in.
export function setPendingClub(id: string | null) {
  if (typeof window === "undefined") return;
  if (id) window.sessionStorage.setItem(PENDING_KEY, id);
  else window.sessionStorage.removeItem(PENDING_KEY);
}

export function getPendingClub(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(PENDING_KEY);
}
