import cron from 'node-cron';
import { Meeting } from '../models/Meeting.js';
import { deleteGoogleMeetEvent } from './googleMeetService.js';

/**
 * Check and expire scheduled meetings that passed their window without being activated.
 */
export const checkAndExpireMeetings = async () => {
  try {
    const now = new Date();
    // Find meetings that are still in "Scheduled" status
    const scheduledMeetings = await Meeting.find({ status: 'Scheduled' });

    for (const meeting of scheduledMeetings) {
      const endsAt = new Date(meeting.scheduledAt.getTime() + meeting.durationMinutes * 60000);

      // If current time is past the meeting end duration and it was never started
      if (now > endsAt) {
        console.log(`[Meeting Scheduler] Expiring meeting ID: ${meeting._id} for ${meeting.userName}`);
        meeting.status = 'Expired';
        meeting.endedAt = now;
        meeting.notes = (meeting.notes ? meeting.notes + ' | ' : '') + 'Auto-expired due to no attendees within schedule window.';
        await meeting.save();

        // Delete Google Calendar event to invalidate/clean link
        if (meeting.calendarEventId) {
          await deleteGoogleMeetEvent(meeting.calendarEventId);
        }
      }
    }
  } catch (error) {
    console.error('[Meeting Scheduler Error]:', error.message);
  }
};

/**
 * Initialize meeting cleanup background cron (runs every 3 minutes)
 */
export const initMeetingScheduler = () => {
  cron.schedule('*/3 * * * *', async () => {
    await checkAndExpireMeetings();
  });
  console.log('[Meeting Scheduler] Background auto-expiry cron initialized (every 3 minutes).');
};
