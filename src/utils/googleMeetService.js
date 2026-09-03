import { google } from 'googleapis';
import { v4 as uuidv4 } from 'uuid';

/**
 * Initialize Google Calendar Client if Service Account credentials exist
 */
const getCalendarClient = () => {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!serviceAccountEmail || !privateKey) {
    return null;
  }

  // Replace escaped newlines if passed in .env
  privateKey = privateKey.replace(/\\n/g, '\n');

  const auth = new google.auth.JWT({
    email: serviceAccountEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/calendar'],
    subject: process.env.GOOGLE_CALENDAR_IMPERSONATE_USER || undefined,
  });

  return google.calendar({ version: 'v3', auth });
};

/**
 * Generate a Google Meet Link (Always Google Meet)
 * @param {Object} params
 * @param {string} params.summary
 * @param {string} params.description
 * @param {Date} params.startTime
 * @param {number} params.durationMinutes
 * @param {Array<string>} params.attendees - Email list
 * @param {string|null} params.customMeetLink - Optional custom meet link
 * @returns {Promise<{meetLink: string, eventId: string, isRealCalendarEvent: boolean}>}
 */
export const createGoogleMeetEvent = async ({
  summary = 'Orqiva Tech Client Meeting',
  description = 'Scheduled online meeting session via Orqiva Tech website.',
  startTime = new Date(),
  durationMinutes = 30,
  attendees = [],
  customMeetLink = null,
}) => {
  const calendar = getCalendarClient();
  const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

  const startIso = new Date(startTime).toISOString();
  const endIso = new Date(new Date(startTime).getTime() + durationMinutes * 60000).toISOString();

  // 1. If Service Account is setup, use Google Calendar API to create dynamic Google Meet
  if (calendar) {
    try {
      const response = await calendar.events.insert({
        calendarId,
        conferenceDataVersion: 1,
        sendUpdates: 'all',
        requestBody: {
          summary,
          description,
          start: { dateTime: startIso, timeZone: 'Asia/Kolkata' },
          end: { dateTime: endIso, timeZone: 'Asia/Kolkata' },
          attendees: attendees.map((email) => ({ email })),
          conferenceData: {
            createRequest: {
              requestId: `orqiva-meet-${uuidv4()}`,
              conferenceSolutionKey: { type: 'hangoutsMeet' },
            },
          },
        },
      });

      const event = response.data;
      const meetLink =
        event.conferenceData?.entryPoints?.find((ep) => ep.entryPointType === 'video')?.uri ||
        event.hangoutLink;

      if (meetLink) {
        return {
          meetLink,
          eventId: event.id,
          isRealCalendarEvent: true,
        };
      }
    } catch (error) {
      console.error('[Google Calendar API Error]:', error.message);
    }
  }

  // 2. Custom or Default Google Meet Room Link from .env / SiteSettings
  let configuredMeetLink = customMeetLink || process.env.GOOGLE_MEET_DEFAULT_LINK || 'https://meet.google.com/uyz-rudo-jpn';

  if (!configuredMeetLink.startsWith('http://') && !configuredMeetLink.startsWith('https://')) {
    configuredMeetLink = `https://${configuredMeetLink}`;
  }

  return {
    meetLink: configuredMeetLink.trim(),
    eventId: `google-meet-${uuidv4()}`,
    isRealCalendarEvent: false,
  };
};

/**
 * Delete a Calendar Event to effectively expire the meeting
 * @param {string} eventId
 */
export const deleteGoogleMeetEvent = async (eventId) => {
  if (!eventId || !eventId.startsWith('cal-')) {
    return true;
  }

  const calendar = getCalendarClient();
  if (!calendar) return true;

  try {
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
    await calendar.events.delete({
      calendarId,
      eventId,
      sendUpdates: 'none',
    });
    console.log(`[Google Meet] Event ${eventId} deleted/expired from calendar.`);
    return true;
  } catch (error) {
    console.error(`[Google Meet Expiry Error] Failed to delete event ${eventId}:`, error.message);
    return false;
  }
};
