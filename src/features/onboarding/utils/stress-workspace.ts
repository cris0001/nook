import { addDays, format } from 'date-fns';

import type { OptionColor } from '@/schemas/database.schema';
import type { BoardElement } from '@/schemas/scene.schema';

import { doc, h, p } from './doc';
import type { Random } from './random';
import { option, property, type WorkspaceBuilder } from './workspace-builder';

const DAY = 86_400_000;
const VERBS = [
  'Fix',
  'Add',
  'Refactor',
  'Remove',
  'Test',
  'Document',
  'Speed up',
  'Redesign',
  'Migrate',
  'Review',
];
const THINGS = [
  'login',
  'billing',
  'search',
  'export',
  'sidebar',
  'editor',
  'calendar',
  'reports',
  'settings',
  'invites',
  'uploads',
  'onboarding',
  'API',
  'emails',
  'cache',
];
const DETAILS = [
  'for admins',
  'on mobile',
  'in dark mode',
  'for large teams',
  'after reload',
  'on Safari',
  'with filters',
  'for guests',
  'in the table view',
  '',
];
const WORDS =
  'the a team page record board view filter sort status task note plan ship test fix data sync user flow screen draft review idea goal week sprint launch metric chart design copy layout bug feature release update share link'.split(
    ' ',
  );
const PEOPLE = [
  'Ana',
  'Tom',
  'Kate',
  'Mark',
  'Ola',
  'Piotr',
  'Lena',
  'Sam',
  'Iga',
  'Noah',
  'Eva',
  'Leo',
];
const COLORS: OptionColor[] = [
  'gray',
  'brown',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'pink',
  'red',
];

export interface StressSize {
  records: number;
  documents: number;
  shapes: number;
}

export const STRESS_SIZE: StressSize = { records: 10_000, documents: 300, shapes: 1_500 };

function sentence(random: Random, words: number): string {
  const text = Array.from({ length: words }, () => random.pick(WORDS)).join(' ');
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}.`;
}

// A deliberately heavy workspace for performance checks: one big ticket database,
// hundreds of nested documents with real text, and a crowded whiteboard.
export function buildStressWorkspace(
  b: WorkspaceBuilder,
  random: Random,
  now: number,
  size = STRESS_SIZE,
) {
  const root = b.page({
    parentId: null,
    type: 'document',
    title: `Stress test · ${size.records.toLocaleString('en')} records`,
    icon: '🧪',
  });

  const stages = ['Backlog', 'To do', 'In progress', 'Done'].map((name, i) =>
    option(name, (['gray', 'yellow', 'blue', 'green'] as const)[i] ?? 'gray'),
  );
  const priorities = ['Urgent', 'High', 'Normal', 'Low'].map((name, i) =>
    option(name, (['red', 'orange', 'gray', 'brown'] as const)[i] ?? 'gray'),
  );
  const people = PEOPLE.map((name, i) => option(name, COLORS[i % COLORS.length] ?? 'gray'));
  const tags = THINGS.slice(0, 8).map((name, i) =>
    option(name, COLORS[(i + 3) % COLORS.length] ?? 'gray'),
  );
  const props = {
    status: property('Status', 'select', stages),
    due: property('Due', 'date'),
    priority: property('Priority', 'select', priorities),
    assignee: property('Assignee', 'select', people),
    estimate: property('Estimate', 'number'),
    tags: property('Tags', 'multiSelect', tags),
    notes: property('Notes', 'text'),
  };
  const tickets = b.database(
    { parentId: root.id, title: 'Tickets', icon: '🎫' },
    Object.values(props),
  );
  for (let i = 0; i < size.records; i++) {
    const stage = random.pick([0, 1, 1, 2, 3, 3, 3]);
    const createdAt = now - random.int(0, 180) * DAY;
    const doneAt = stage === 3 ? Math.min(now, createdAt + random.int(1, 40) * DAY) : null;
    b.page({
      parentId: tickets.page.id,
      type: 'record',
      title: `${random.pick(VERBS)} ${random.pick(THINGS)} ${random.pick(DETAILS)}`.trim(),
      createdAt,
      doneAt,
      properties: {
        [props.status.id]: stages[stage]?.id ?? null,
        [props.due.id]: random.chance(0.7)
          ? format(addDays(now, random.int(-60, 90)), 'yyyy-MM-dd')
          : null,
        [props.priority.id]: random.pick(priorities).id,
        [props.assignee.id]: random.pick(people).id,
        [props.estimate.id]: random.pick([1, 2, 3, 5, 8]),
        [props.tags.id]: random.chance(0.6) ? [random.pick(tags).id] : [],
        [props.notes.id]: random.chance(0.3) ? sentence(random, 8) : null,
      },
    });
  }
  const dashboard = b.page({
    parentId: root.id,
    type: 'dashboard',
    title: 'Tickets dashboard',
    icon: '📊',
  });
  b.dashboard(dashboard.id, tickets.page.id);

  const folders = Math.max(1, Math.round(size.documents / 10));
  for (let f = 0; f < folders; f++) {
    const folder = b.page({
      parentId: root.id,
      type: 'document',
      title: `Area ${f + 1}: ${random.pick(THINGS)}`,
    });
    b.content(folder.id, doc(p(sentence(random, 30))));
    for (let d = 0; d < size.documents / folders - 1; d++) {
      const page = b.page({
        parentId: folder.id,
        type: 'document',
        title: sentence(random, 4).slice(0, -1),
      });
      b.content(
        page.id,
        doc(
          ...Array.from({ length: 6 }, (_, k) => [
            h(2, sentence(random, 3)),
            p(sentence(random, 45 + k * 5)),
          ]).flat(),
        ),
      );
    }
  }

  const board = b.page({
    parentId: root.id,
    type: 'whiteboard',
    title: 'Crowded whiteboard',
    icon: '🗺️',
  });
  const shapes: BoardElement[] = Array.from({ length: size.shapes }, (_, i) => {
    const base = {
      id: crypto.randomUUID(),
      x: (i % 50) * 140,
      y: Math.floor(i / 50) * 110,
      stroke: random.pick(['ink', ...COLORS] as const),
      strokeWidth: random.pick([1, 2, 4] as const),
      seed: random.int(1, 2 ** 30),
    };
    return i % 3 === 0
      ? {
          ...base,
          type: 'ellipse',
          width: 100,
          height: 70,
          fill: random.chance(0.3) ? random.pick(COLORS) : null,
        }
      : {
          ...base,
          type: 'rectangle',
          width: 110,
          height: 70,
          fill: random.chance(0.3) ? random.pick(COLORS) : null,
        };
  });
  b.scene(board.id, shapes);
}
