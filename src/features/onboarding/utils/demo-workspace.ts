import { addDays, format, type Locale } from 'date-fns';
import type { JSONContent } from '@tiptap/react';

import type { OptionColor } from '@/schemas/database.schema';
import type { Page } from '@/schemas/page.schema';

import type { DemoCopy } from '../demo-copy';
import { bullets, doc, h, p } from './doc';
import type { Random } from './random';
import { option, property, type WorkspaceBuilder } from './workspace-builder';

const DAY = 86_400_000;
const STAGE_COLORS: OptionColor[] = ['gray', 'yellow', 'blue', 'green'];
const PEOPLE_COLORS: OptionColor[] = ['pink', 'purple', 'orange', 'brown'];
const AREA_COLORS: OptionColor[] = ['green', 'blue', 'gray', 'pink'];

const dayKey = (now: number, offset: number) => format(addDays(now, offset), 'yyyy-MM-dd');

const mention = (page: Page): JSONContent => ({
  type: 'mention',
  attrs: { id: page.id, label: page.title },
});

// A small, believable product-team workspace: a roadmap and a bug tracker with history
// (so the dashboard charts have something to show) and meeting notes linking to them.
export function buildDemoWorkspace(
  b: WorkspaceBuilder,
  copy: DemoCopy,
  random: Random,
  now: number,
  locale?: Locale,
) {
  const c = copy.columns;
  const home = b.page({
    parentId: null,
    type: 'document',
    title: copy.team,
    icon: '🧭',
    favorite: true,
  });

  const stages = copy.roadmapStages.map((name, i) => option(name, STAGE_COLORS[i] ?? 'gray'));
  const owners = copy.people.map((name, i) => option(name, PEOPLE_COLORS[i] ?? 'gray'));
  const areas = copy.areas.map((name, i) => option(name, AREA_COLORS[i] ?? 'gray'));
  const roadmapProps = {
    status: property(c.status, 'select', stages),
    target: property(c.target, 'date'),
    owner: property(c.owner, 'select', owners),
    effort: property(c.effort, 'number'),
    area: property(c.area, 'multiSelect', areas),
  };
  const roadmap = b.database(
    { parentId: home.id, title: copy.roadmap, icon: '🗺️' },
    Object.values(roadmapProps),
  );
  const items = copy.roadmapItems.map((title, i) => {
    const stage = i < 7 ? 3 : i < 11 ? 2 : i < 18 ? 1 : 0;
    const createdAt = now - random.int(20, 60) * DAY;
    const doneAt = stage === 3 ? now - random.int(1, 40) * DAY : null;
    return b.page({
      parentId: roadmap.page.id,
      type: 'record',
      title,
      createdAt: doneAt ? Math.min(createdAt, doneAt - DAY * 3) : createdAt,
      doneAt,
      properties: {
        [roadmapProps.status.id]: stages[stage]?.id ?? null,
        [roadmapProps.target.id]: dayKey(
          now,
          stage === 3 ? -random.int(1, 40) : random.int(-3, 45),
        ),
        [roadmapProps.owner.id]: random.pick(owners).id,
        [roadmapProps.effort.id]: random.pick([1, 2, 3, 5, 8, 13]),
        [roadmapProps.area.id]: [
          ...new Set([
            random.pick(areas).id,
            ...(random.chance(0.3) ? [random.pick(areas).id] : []),
          ]),
        ],
      },
    });
  });

  const bugStages = copy.bugStages.map((name, i) => option(name, STAGE_COLORS[i] ?? 'gray'));
  const severities = copy.severities.map((name, i) =>
    option(name, (['red', 'orange', 'gray'] as const)[i] ?? 'gray'),
  );
  const platforms = copy.platforms.map((name, i) =>
    option(name, (['blue', 'gray', 'green'] as const)[i] ?? 'gray'),
  );
  const bugProps = {
    status: property(c.status, 'select', bugStages),
    severity: property(c.severity, 'select', severities),
    reported: property(c.reported, 'date'),
    platform: property(c.platform, 'multiSelect', platforms),
  };
  const bugs = b.database(
    { parentId: home.id, title: copy.bugs, icon: '🐞' },
    Object.values(bugProps),
  );
  copy.bugItems.forEach((title, i) => {
    const stage = i % 5 === 0 ? 3 : i % 3 === 0 ? 2 : i % 2 === 0 ? 1 : 0;
    const reported = random.int(1, 30);
    b.page({
      parentId: bugs.page.id,
      type: 'record',
      title,
      createdAt: now - reported * DAY,
      doneAt: stage === 3 ? now - random.int(0, reported) * DAY : null,
      properties: {
        [bugProps.status.id]: bugStages[stage]?.id ?? null,
        [bugProps.severity.id]: random.pick(severities).id,
        [bugProps.reported.id]: dayKey(now, -reported),
        [bugProps.platform.id]: [random.pick(platforms).id],
      },
    });
  });

  const meetings = b.page({
    parentId: home.id,
    type: 'document',
    title: copy.meetings,
    icon: '📝',
  });
  b.content(meetings.id, doc(p(copy.teamIntro)));
  copy.meetingTitles.forEach((title, i) => {
    const date = format(
      addDays(now, -7 * (copy.meetingTitles.length - i)),
      'd MMM',
      locale ? { locale } : {},
    );
    const meeting = b.page({
      parentId: meetings.id,
      type: 'document',
      title: `${title} — ${date}`,
    });
    // One shipped, one in progress, one planned item per meeting.
    const linked = [items[i], items[7 + i], items[11 + i]].filter((item) => item !== undefined);
    b.content(
      meeting.id,
      doc(
        p(`${copy.meetingIntro} ${title.toLowerCase()}.`),
        h(2, copy.decisions),
        bullets(copy.meetingLines),
        h(2, copy.actionItems),
        {
          type: 'taskList',
          content: linked.map((item, k) => ({
            type: 'taskItem',
            attrs: { checked: k === 0 },
            content: [
              {
                type: 'paragraph',
                content: [mention(item), { type: 'text', text: ` — ${copy.people[k] ?? ''}` }],
              },
            ],
          })),
        },
      ),
    );
  });

  b.content(home.id, doc(p(copy.teamIntro), bullets([copy.roadmap, copy.bugs, copy.meetings])));
  const dashboard = b.page({
    parentId: home.id,
    type: 'dashboard',
    title: copy.dashboard,
    icon: '📊',
  });
  b.dashboard(dashboard.id, roadmap.page.id);
}
