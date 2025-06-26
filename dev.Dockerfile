FROM node:20-alpine

WORKDIR /usr/src/app

# ----- install deps
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install

# ----- générer Prisma avant la copie totale (build + hot-reload plus rapides)
COPY prisma ./prisma
RUN npx prisma generate

# ----- reste de l’app
COPY . .

EXPOSE 3000
CMD ["pnpm","dev","-p","3000"]
