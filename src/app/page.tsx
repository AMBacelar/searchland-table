import { HydrateClient } from "~/trpc/server";
import { UsersTable } from "~components/users-table";
import { Suspense } from 'react'

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-full flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <Suspense fallback={<div>Loading...</div>}>
            <UsersTable />
          </Suspense>
        </div>
      </main>
    </HydrateClient>
  );
}
