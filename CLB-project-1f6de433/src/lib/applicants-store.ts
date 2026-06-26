import { useSyncExternalStore } from "react";
import { applicants as seed, type Applicant } from "./mock-data";

// Lightweight in-memory store so club registrations show up live
// inside the recruitment (Tuyển dụng) waiting list.
let state: Applicant[] = [...seed];
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

export function addApplicant(input: Omit<Applicant, "id" | "initials" | "status" | "appliedAt">) {
  const initials = input.name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  const now = new Date();
  const appliedAt = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}`;

  const applicant: Applicant = {
    ...input,
    id: `c${now.getTime()}`,
    initials: initials || input.name.slice(0, 2).toUpperCase(),
    status: "pending",
    appliedAt,
  };

  state = [applicant, ...state];
  emit();
  return applicant;
}

export function updateApplicantStatus(id: string, status: Applicant["status"]) {
  state = state.map((a) => (a.id === id ? { ...a, status } : a));
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useApplicants() {
  return useSyncExternalStore(subscribe, () => state, () => state);
}
