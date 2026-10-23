import { createFileRoute } from '@tanstack/react-router';

import { JumpBackIn } from '@/features/pages';
import { TodayView } from '@/features/today';

export const Route = createFileRoute('/_workspace/')({
  component: TodayRoute,
});

function TodayRoute() {
  return <TodayView aside={<JumpBackIn />} />;
}
