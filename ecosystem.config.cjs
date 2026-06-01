module.exports = {
  apps: [{
    name: "mam-server",
    script: "server.js",
    env: { PORT: 3000, NODE_ENV: "production" },
    restart_delay: 3000,
    max_restarts: 10,
  }],
};
