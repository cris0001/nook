import { can, type Action } from '@/lib/permissions';
import { useProfileStore } from '@/stores/profile.store';

export function useCan(action: Action): boolean {
  return useProfileStore((s) => can(s.role, action));
}

export function usePermissions(): (action: Action) => boolean {
  const role = useProfileStore((s) => s.role);
  return (action) => can(role, action);
}
