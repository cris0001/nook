import { createFileRoute } from '@tanstack/react-router';

// Temporary home until the workspace layout (sidebar + pages) lands.
export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <main className="flex min-h-dvh items-center justify-center p-4">
      <p className="text-muted-foreground text-sm">Workspace coming soon.</p>
    </main>
  );
}
