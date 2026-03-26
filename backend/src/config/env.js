const required = (key) => {
  if (!process.env[key]) throw new Error(`Missing env var: ${key}`);
};

function parseEnvInt(key, fallback) {
  const val = process.env[key];
  if (!val) return fallback;
  const num = Number(val);
  return Number.isFinite(num) ? num : fallback;
}

module.exports = {
  required,
  parseEnvInt
};

