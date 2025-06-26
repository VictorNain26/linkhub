FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY prisma ./prisma

RUN corepack enable \
 && pnpm install --frozen-lockfile   # (conserve la version du lock)

RUN npx prisma generate

COPY . .

EXPOSE 3000
CMD ["pnpm","dev","-p","3000"]
