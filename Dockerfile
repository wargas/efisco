# syntax=docker/dockerfile:1

FROM oven/bun as build

ENV TZ=UTC

WORKDIR /usr/src/app

COPY . .

RUN bun install


RUN bun generate

EXPOSE 3333

CMD [ "tail", "-f", "/dev/null" ]