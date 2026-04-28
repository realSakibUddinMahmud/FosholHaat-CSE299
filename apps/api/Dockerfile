FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/tokens/package.json packages/tokens/package.json
COPY packages/types/package.json packages/types/package.json
RUN npm ci

FROM deps AS build
COPY . .
RUN npm -w apps/api run prisma:generate && npm -w apps/api run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package*.json ./
COPY --from=build /app/apps/api/package.json apps/api/package.json
COPY --from=build /app/apps/api/dist apps/api/dist
COPY --from=build /app/node_modules node_modules
COPY --from=build /app/prisma prisma
COPY --from=build /app/packages packages
EXPOSE 3000
CMD ["node","apps/api/dist/main.js"]
