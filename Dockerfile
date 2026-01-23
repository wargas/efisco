# syntax=docker/dockerfile:1

FROM oven/bun AS build

ENV TZ=UTC

WORKDIR /app

COPY bun.lock package.json ./

RUN bun install

COPY . .

RUN bun generate

RUN bun build.ts

# ------ RUNTIME --------
FROM debian:12-slim

WORKDIR /app

COPY --from=build /app/dist/busca /app/busca
COPY --from=build /app/dist/server /app/server
COPY --from=build /app/dist/server /app/server

EXPOSE 3333

CMD [ "/app/server" ]