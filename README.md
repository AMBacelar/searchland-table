# Searchland take-home test

This project is a take-home test submission for Searchland. It demonstrates key functionalities for user management, including creating, listing (with pagination), deleting users, and viewing individual user profiles. The project is built using the T3 Stack and adheres to TypeScript and tRPC for typesafe api requests.

## Quickstart

To set up and run the project locally, follow these steps after cloning the repository:

```bash
cp .env.example .env
npm install
npm run db:push
npm run build
npm run start
```

> the `cp` command is the copy command. If your OS does not support the command, simply make a copy of the `.env.example` file and name the new version `.env`. The application will not be able to connect to a database if this step is not followed.

Prerequisites
Ensure you have the following installed:

- Node.js

## Libraries/Technologies used

- [Next.js](https://nextjs.org) - For the React-based frontend
- [Drizzle](https://orm.drizzle.team) - As the ORM for database interactions
- [Tailwind CSS](https://tailwindcss.com) - For styling
- [tRPC](https://trpc.io) - For typesafe API routing
- [Tanstack Table](https://tanstack.com/table) - For efficient data tables
- [Tanstack Form](https://tanstack.com/form/latest) - For form handling
- [shadcn/ui](https://ui.shadcn.com/) - UI components

## Learn More about the T3 Stack

To learn more about the [T3 Stack](https://create.t3.gg/), check out the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available)

## How to Deploy

For deployment, refer to the T3 Stack’s official deployment guides:

- [Vercel](https://create.t3.gg/en/deployment/vercel)
- [Netlify](https://create.t3.gg/en/deployment/netlify)
- [Docker](https://create.t3.gg/en/deployment/docker)
