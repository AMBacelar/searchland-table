import { eq } from "drizzle-orm";
import { z } from "zod";
import { faker } from "@faker-js/faker";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { users } from "~/server/db/schema";

const departments = ["Engineering", "Marketing", "Finance"] as const;

const newPerson = (): {
  department: string;
  dob: Date;
  email: string;
  familyName: string;
  givenName: string;
  title: string;
  username: string;
} => {
  const givenName = faker.person.firstName();
  const familyName = faker.person.lastName();
  return {
    department:
      departments[Math.floor(Math.random() * departments.length)] ??
      departments[0],
    dob: faker.date.birthdate(),
    email: faker.internet.email({ firstName: givenName, lastName: familyName }),
    familyName,
    givenName,
    title: faker.person.jobTitle(),
    username: faker.internet.displayName({
      firstName: givenName,
      lastName: familyName,
    }),
  };
};

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        dob: z.string(),
        email: z.string().email(),
        familyName: z.string(),
        givenName: z.string(),
        username: z.string().min(1),
        title: z.string(),
        department: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(users).values({
        dob: new Date(input.dob),
        email: input.email,
        familyName: input.familyName,
        givenName: input.givenName,
        title: input.title,
        username: input.username,
        department: input.department,
      });
    }),

  seed: publicProcedure.mutation(async ({ ctx }) => {
    // Seed the database with 100 new users
    const values = Array.from({ length: 100 }, () => newPerson());
    await ctx.db.insert(users).values(values);
  }),

  getUser: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, input.id),
      });
      return user ?? null;
    }),

  getUsers: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        offset: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, offset } = input;
      const totalCount = (await ctx.db.query.users.findMany()).length;
      const users = await ctx.db.query.users.findMany({
        limit: limit,
        offset: offset ?? 0,
        orderBy: (users, { asc }) => [asc(users.id)],
      });
      return { users, totalCount };
    }),

  deleteUser: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(users).where(eq(users.id, input.id)).returning();
    }),
});
