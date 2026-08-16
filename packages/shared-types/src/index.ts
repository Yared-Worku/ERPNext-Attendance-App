export enum CheckinType {
  IN = 'IN',
  OUT = 'OUT'
}

export interface AttendancePayload {
  employeeId: string;
  timestamp: string;
  logType: CheckinType;
  latitude: number;
  longitude: number;
  deviceId: string;
}