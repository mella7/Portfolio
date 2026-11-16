# Site + visitor statistics in one small container.
#
#   docker build -t mella7-portfolio .
#   docker run -d -p 8080:8080 -e STATS_TOKEN="$(openssl rand -hex 24)" \
#     -e TRUST_PROXY=1 -v mella7-stats:/data mella7-portfolio
#
# Put it behind a TLS-terminating proxy (Caddy, Traefik, an ingress, Cloudflare).

FROM node:22-alpine AS build
WORKDIR /app
COPY . .
RUN node scripts/build.mjs && node scripts/check.mjs

FROM node:22-alpine
ENV NODE_ENV=production PORT=8080 SITE_DIR=/app/dist DATA_DIR=/data
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server
RUN mkdir -p /data && chown node:node /data
USER node
VOLUME /data
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:8080/robots.txt >/dev/null || exit 1
CMD ["node", "server/server.mjs"]
