import * as SQLite from 'expo-sqlite';

// Opens or creates the local SQLite database file
export const db = SQLite.openDatabaseSync('attendance.db');

export function initDatabase() {
  db.execSync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS pending_attendance (
      id TEXT PRIMARY KEY NOT NULL,
      log_type TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      timestamp TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
}