FROM node:24.5-alpine3.22 AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --frozen-lockfile

COPY . .

RUN npm run build

FROM node:24.5-alpine3.22 AS runner

WORKDIR /app

COPY package.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 5173

CMD ["npm", "run", "dev"]