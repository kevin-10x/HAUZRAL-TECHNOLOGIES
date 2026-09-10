const levels = ["error", "warn", "info", "debug"];

function getLevelIndex(level) {
  return levels.indexOf(level);
}

function log(level, message, meta = {}) {
  const idx = getLevelIndex(level);
  if (idx === -1) {
    console.log(level, message, meta);
    return;
  }

  const logMeta = meta && Object.keys(meta).length ? meta : undefined;
  const payload = logMeta !== undefined ? [message, logMeta] : [message];
  const base = console[level] || console.log;
  base.apply(console, payload);
}

module.exports = {
  error: (message, meta) => log("error", message, meta),
  warn: (message, meta) => log("warn", message, meta),
  info: (message, meta) => log("info", message, meta),
  debug: (message, meta) => log("debug", message, meta),
};
