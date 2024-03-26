FROM denoland/deno:alpine-1.41.3

ARG SITE_URL
ARG GIT_REVISION
ENV SITE_URL=${SITE_URL}
ENV DENO_DEPLOYMENT_ID=${GIT_REVISION}

WORKDIR /app
COPY . .

RUN deno cache main.ts

EXPOSE 3000
VOLUME ["/app/data"]
CMD ["run", "-A", "--unstable-cron", "--unstable-kv", "main.ts"]
