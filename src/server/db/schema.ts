// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, int, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator(
  (name) => `searchland-table_${name}`,
);

export const users = createTable(
  "user",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    username: text("username", { length: 256 }).notNull(),
    givenName: text("givenName", { length: 256 }).notNull(),
    familyName: text("familyName", { length: 256 }).notNull(),
    dob: text("dob", { length: 256 }).notNull(),
    title: text("title", { length: 256 }).notNull(),
    department: text("department", { length: 256 }).notNull(),
    email: text("email", { length: 256 }).notNull().unique(),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
  },
  (example) => ({
    emailIndex: index("email_idx").on(example.email),
  }),
);
