# syntax=docker/dockerfile:1

FROM oven/bun as build

ENV TZ=UTC

WORKDIR /usr/src/app

COPY . .

RUN bun install

EXPOSE 3333

RUN ["bun", "generate"]

CMD [ "tail", "-f", "/dev/null" ]