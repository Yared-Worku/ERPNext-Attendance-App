import { postAttendance } from '../../shared/services/attendance';
import { getPendingLogs, removePendingLog } from '../database/attendanceStorage';

export interface SyncResult {
  syncedCount: number;
  failedCount: number;
}

export async function syncPendingAttendance(): Promise<SyncResult> {
  const pendingLogs = await getPendingLogs();
  if (pendingLogs.length === 0) {
    return { syncedCount: 0, failedCount: 0 };
  }

  let syncedCount = 0;
  let failedCount = 0;

  for (const log of pendingLogs) {
    try {
      await postAttendance({
        logType: log.logType,
        latitude: log.latitude,
        longitude: log.longitude,
        timestamp: log.timestamp,
      });

      await removePendingLog(log.id);
      syncedCount++;
    } catch (error) {
      console.warn(`Failed to sync log ${log.id}:`, error);
      failedCount++;
    }
  }

  return { syncedCount, failedCount };
}