FROM node:20-alpine
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install
COPY . .
EXPOSE 3000
CMD ["pnpm","dev","-p","3000"]
