FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma ./prisma

RUN corepack enable \
 && pnpm install --frozen-lockfile \
 && pnpm prisma generate          # client Prisma déjà prêt dans l’image

COPY . .

EXPOSE 3000
CMD ["pnpm","dev","-p","3000"]
