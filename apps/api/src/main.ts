import express from 'express';
import { AttendancePayload, CheckinType } from '@attendance/shared-types';

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'Attendance Enterprise API Gateway',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[API Gateway] Running on http://localhost:${PORT}`);
});