export const ROLES = ['owner', 'editor', 'viewer'] as const;
export type Role = (typeof ROLES)[number];

export type Action =
  | 'page.create'
  | 'page.edit'
  | 'page.trash'
  | 'page.deleteForever'
  | 'database.editSchema'
  | 'record.edit'
  | 'workspace.manage';

const GRANTS: Record<Role, readonly Action[]> = {
  owner: [
    'page.create',
    'page.edit',
    'page.trash',
    'page.deleteForever',
    'database.editSchema',
    'record.edit',
    'workspace.manage',
  ],
  editor: ['page.create', 'page.edit', 'page.trash', 'record.edit'],
  viewer: [],
};

export function can(role: Role, action: Action): boolean {
  return GRANTS[role].includes(action);
}
