FROM node:16-alpine AS deps
# Check https://github.com/nodejs/docker-node/#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY . .
RUN npm ci

FROM node:16-alpine AS server
WORKDIR /app
ENV NODE_ENV production

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx ts-node ./src/create-schema.ts
RUN npm run build

ENTRYPOINT [ "npm", "run", "start:prod" ]