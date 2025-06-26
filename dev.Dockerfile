FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack enable && pnpm install

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

EXPOSE 3000
CMD ["pnpm","dev","-p","3000"]
