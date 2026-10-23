import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Role } from '@/lib/permissions';

interface ProfileState {
  name: string;
  role: Role;
  setName: (name: string) => void;
  setRole: (role: Role) => void;
}

// No accounts yet, so who you are and your role are picked by hand — once auth lands
// both come from the session instead, and every `useCan` caller keeps working.
export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      name: '',
      role: 'owner',
      setName: (name) => set({ name }),
      setRole: (role) => set({ role }),
    }),
    { name: 'nook-profile' },
  ),
);
