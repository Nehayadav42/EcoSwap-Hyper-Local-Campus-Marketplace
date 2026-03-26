const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

function ensureDbFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(
      DB_FILE,
      JSON.stringify(
        {
          users: {},
          otps: {}
        },
        null,
        2
      ),
      'utf8'
    );
  }
}

function readDb() {
  ensureDbFile();
  const raw = fs.readFileSync(DB_FILE, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (_e) {
    // If db.json got corrupted, fail loudly rather than silently overwriting.
    throw new Error('DB file is not valid JSON.');
  }
}

function writeDb(nextDb) {
  ensureDbFile();
  fs.writeFileSync(DB_FILE, JSON.stringify(nextDb, null, 2), 'utf8');
}

module.exports = { readDb, writeDb };

