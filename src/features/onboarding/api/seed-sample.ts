import { addDays, format, setHours } from 'date-fns';

import { saveContent } from '@/lib/data/contents';
import {
  addOption,
  addProperty,
  addRecord,
  createDatabase,
  getDatabase,
  setRecordHistory,
  updateOption,
} from '@/lib/data/databases';
import { createDashboard } from '@/lib/data/dashboards';
import { createPage, setPageIcon, toggleFavorite } from '@/lib/data/pages';
import { saveScene } from '@/lib/data/scenes';
import type { OptionColor, PropertyValue } from '@/schemas/database.schema';

import type { SampleCopy } from '../i18n';
import { bullets, doc, h, p, quote, todos } from '../utils/doc';
import { sitemapSketch } from '../utils/sketch';

const PRIORITY_COLORS: OptionColor[] = ['red', 'orange', 'gray'];

const dayFromToday = (days: number) => format(addDays(new Date(), days), 'yyyy-MM-dd');
const noonOf = (days: number) => setHours(addDays(new Date(), days), 12).getTime();
const daysAgo = (days: number) => addDays(new Date(), -days).getTime();

async function starterDatabase(
  title: string,
  stages: string[],
  dateName: string,
  copy: SampleCopy,
) {
  const [todo = '', inProgress = '', done = ''] = stages;
  const page = await createDatabase(null, title, {
    status: copy.status,
    todo,
    inProgress,
    done,
    date: dateName,
  });
  const database = await getDatabase(page.id);
  const [status, date] = database?.properties ?? [];
  if (!status || !date) throw new Error('Starter columns missing');
  return { page, status, date };
}

async function seedRelaunch(copy: SampleCopy) {
  const { page, status, date } = await starterDatabase(
    copy.relaunch.title,
    copy.stages,
    copy.date,
    copy,
  );
  await setPageIcon(page.id, '🚀');
  const priority = await addProperty(page.id, 'select', copy.relaunch.priority);
  const levels: string[] = [];
  for (const [i, name] of copy.relaunch.priorities.entries()) {
    const option = await addOption(page.id, priority.id, name);
    await updateOption(page.id, priority.id, option.id, { color: PRIORITY_COLORS[i] ?? 'gray' });
    levels.push(option.id);
  }

  let first = '';
  for (const [title, stage, due, level] of copy.relaunch.tasks) {
    const values: Record<string, PropertyValue> = {
      [status.id]: status.options[stage]?.id ?? null,
      [date.id]: dayFromToday(due),
      [priority.id]: levels[level] ?? null,
    };
    const record = await addRecord(page.id, values, title);
    await setRecordHistory(record.id, {
      createdAt: daysAgo(30),
      doneAt: stage === 2 ? noonOf(due) : null,
    });
    first ||= record.id;
  }
  if (first) await saveContent(first, doc(p(copy.relaunch.taskNote)));

  const notes = await createPage({ parentId: page.id, type: 'document', title: copy.notes.title });
  await setPageIcon(notes.id, '📝');
  await saveContent(
    notes.id,
    doc(...copy.notes.body.map(p), h(2, copy.notes.next), todos(copy.notes.steps)),
  );
}

async function seedReading(copy: SampleCopy) {
  const { reading } = copy;
  const { page, status, date } = await starterDatabase(
    reading.title,
    reading.stages,
    reading.finishedOn,
    copy,
  );
  await setPageIcon(page.id, '📚');
  const author = await addProperty(page.id, 'text', reading.author);
  const rating = await addProperty(page.id, 'number', reading.rating);
  for (const [title, writer, stage, score] of reading.books) {
    await addRecord(
      page.id,
      {
        [status.id]: status.options[stage]?.id ?? null,
        [author.id]: writer,
        [rating.id]: score,
        [date.id]: stage === 2 ? dayFromToday(-12) : null,
      },
      title,
    );
  }
}

export async function seedSampleWorkspace(copy: SampleCopy): Promise<void> {
  const { welcome } = copy;
  const home = await createPage({ parentId: null, type: 'document', title: welcome.title });
  await setPageIcon(home.id, '👋');
  await toggleFavorite(home.id);
  await saveContent(
    home.id,
    doc(
      p(welcome.intro),
      h(2, welcome.tryTitle),
      todos(welcome.tries),
      h(2, welcome.howTitle),
      bullets(welcome.how),
      quote(welcome.outro),
    ),
  );
  await seedRelaunch(copy);
  const dashboard = await createDashboard(null, copy.dashboard);
  await setPageIcon(dashboard.id, '📊');
  await seedReading(copy);
  const sketch = await createPage({ parentId: null, type: 'whiteboard', title: copy.sketch.title });
  await setPageIcon(sketch.id, '🗺️');
  await saveScene(sketch.id, sitemapSketch(copy.sketch));
}
