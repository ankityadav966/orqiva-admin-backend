import dns from 'dns';
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

import app from './app.js';
import { connectDB } from './config/db.js';
import { ENV } from './config/env.js';
import { initMeetingScheduler } from './utils/meetingScheduler.js';

const startServer = async () => {
  try {
    await connectDB();

    // Start background auto-expiry scheduler for Google Meet meetings
    initMeetingScheduler();

    const server = app.listen(ENV.PORT, () => {
      console.log(`
======================================================
  🚀 ORQIVA TECH BACKEND API RUNNING SUCCESSFULLY
  📡 Environment : ${ENV.NODE_ENV}
  🌐 Server Port  : http://localhost:${ENV.PORT}
  📚 Base API    : http://localhost:${ENV.PORT}/api/v1
  🩺 Health Check: http://localhost:${ENV.PORT}/api/health
======================================================
      `);
    });

    // Graceful shutdown handling
    const shutdown = () => {
      console.log('\n[Server] Shutting down gracefully...');
      server.close(() => {
        console.log('[Server] Process terminated.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error(`[Server Error] Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
