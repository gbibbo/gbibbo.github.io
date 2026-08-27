CREATE TABLE IF NOT EXISTS bot_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  session_id TEXT,
  language TEXT,
  page_path TEXT,
  question TEXT NOT NULL,
  answer TEXT,
  source TEXT NOT NULL,
  model TEXT,
  success INTEGER NOT NULL DEFAULT 0,
  latency_ms INTEGER,
  error TEXT
);

CREATE INDEX IF NOT EXISTS idx_bot_questions_created_at
  ON bot_questions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_bot_questions_session_id
  ON bot_questions(session_id);

CREATE INDEX IF NOT EXISTS idx_bot_questions_source
  ON bot_questions(source);
