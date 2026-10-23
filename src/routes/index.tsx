import { createFileRoute } from '@tanstack/react-router';

import { BrandMark } from '@/components/brand';

// Temporary home until the workspace layout (sidebar + pages) lands.
export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-4">
      <BrandMark animated intro className="text-6xl" />
      <p className="text-muted-foreground text-sm">Workspace coming soon.</p>
    </main>
  );
}
