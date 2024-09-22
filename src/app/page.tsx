import { HydrateClient } from "~/trpc/server";
import { UsersTable } from "~components/users-table";
import { ModeToggle } from "~components/theme-toggle";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            <ModeToggle />
          </h1>
          <UsersTable />
        </div>
      </main>
    </HydrateClient>
  );
}
