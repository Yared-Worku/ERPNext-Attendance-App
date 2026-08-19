import { db, initDatabase } from './db';
import { AttendancePayload } from '../../shared/services/attendance';

export interface PendingAttendanceLog extends AttendancePayload {
  id: string;
  createdAt: string;
}

// Ensure table exists on initialization
initDatabase();

export async function getPendingLogs(): Promise<PendingAttendanceLog[]> {
  try {
    const rows = db.getAllSync<any>(
      'SELECT * FROM pending_attendance ORDER BY created_at ASC;'
    );

    return rows.map((row) => ({
      id: row.id,
      logType: row.log_type as 'IN' | 'OUT',
      latitude: row.latitude,
      longitude: row.longitude,
      timestamp: row.timestamp,
      createdAt: row.created_at,
    }));
  } catch (error) {
    console.error('Failed to query SQLite pending logs:', error);
    return [];
  }
}

export async function savePendingLog(payload: AttendancePayload): Promise<PendingAttendanceLog> {
  const id = `offline_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const createdAt = new Date().toISOString();

  db.runSync(
    `INSERT INTO pending_attendance (id, log_type, latitude, longitude, timestamp, created_at)
     VALUES (?, ?, ?, ?, ?, ?);`,
    [id, payload.logType, payload.latitude, payload.longitude, payload.timestamp, createdAt]
  );

  return {
    ...payload,
    id,
    createdAt,
  };
}

export async function removePendingLog(id: string): Promise<void> {
  db.runSync('DELETE FROM pending_attendance WHERE id = ?;', [id]);
}

export async function clearPendingLogs(): Promise<void> {
  db.runSync('DELETE FROM pending_attendance;');
}

export function debugDumpDatabase() {
  try {
    const rows = db.getAllSync('SELECT * FROM pending_attendance;');
    console.log('=== SQLITE PENDING ATTENDANCE TABLE ===');
    if (rows.length === 0) {
      console.log('No pending logs in local SQLite database.');
    } else {
      console.log(JSON.stringify(rows, null, 2));
    }
  } catch (error) {
    console.error('Failed to dump SQLite DB:', error);
  }
}