## NextAuth Starter Template

This is a Next-Auth starter template for making developers work easier to get started with the main tasks of their projects instead of implementing next auth from scratch in every project.

## Local Development

1. clone the repository

```bash
git clone https://github.com/Aayushg2908/NextAuth-Starter-Template.git
```

2. put your environments keys

```bash
DATABASE_URL=
AUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
RESEND_API_KEY=
```

3. If you are using docker to get started, just run the below command and set `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public"`

```bash
docker-compose up
```

4. run the following commands and get started with the app

```bash
npx prisma generate
npx prisma db push
npm run dev
```
