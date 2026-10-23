import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Role } from '@/lib/permissions';

interface RoleState {
  role: Role;
  setRole: (role: Role) => void;
}

// No accounts yet, so the role is picked by hand — once auth lands it comes from the
// session instead, and every `useCan` caller keeps working unchanged.
export const useRoleStore = create<RoleState>()(
  persist(
    (set) => ({
      role: 'owner',
      setRole: (role) => set({ role }),
    }),
    { name: 'nook-role' },
  ),
);
