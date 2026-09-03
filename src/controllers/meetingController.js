import { Meeting } from '../models/Meeting.js';
import { Lead } from '../models/Lead.js';
import { SiteSettings } from '../models/SiteSettings.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createGoogleMeetEvent, deleteGoogleMeetEvent } from '../utils/googleMeetService.js';
import { sendMeetingScheduledEmails } from '../utils/emailService.js';

/**
 * Public Endpoint: Request a Google Meeting session
 * POST /api/v1/meetings/request
 */
export const requestMeeting = asyncHandler(async (req, res) => {
  const { name, email, phone, company, scheduledAt, durationMinutes, purpose, leadId } = req.body;

  if (!name || !email) {
    return ApiResponse.error(res, {
      statusCode: 400,
      message: 'Name and email are required to schedule a meeting.',
    });
  }

  const meetingDate = scheduledAt ? new Date(scheduledAt) : new Date(Date.now() + 10 * 60 * 1000); // default in 10 mins if immediate
  const duration = parseInt(durationMinutes, 10) || 30;

  // 1. Fetch site settings for admin email
  const settings = await SiteSettings.findOne();
  const adminEmail = settings?.salesEmail || process.env.GMAIL_USER || 'orqivatech@gmail.com';

  // 2. Generate Google Meet Event
  const { meetLink, eventId } = await createGoogleMeetEvent({
    summary: `Orqiva Tech Meeting with ${name}`,
    description: `Online consultation / demo session for ${name} (${company || 'Individual'}). Purpose: ${purpose || 'Demo'}`,
    startTime: meetingDate,
    durationMinutes: duration,
    attendees: [email, adminEmail],
  });

  // 3. Save Meeting record
  const meeting = await Meeting.create({
    leadId: leadId || null,
    userName: name,
    userEmail: email,
    adminEmail,
    meetLink,
    calendarEventId: eventId,
    scheduledAt: meetingDate,
    durationMinutes: duration,
    purpose: purpose || 'Live Demo / Online Meeting',
    status: 'Scheduled',
  });

  // 4. If lead exists or was not provided, optionally record/update lead
  let associatedLead = null;
  if (leadId) {
    associatedLead = await Lead.findById(leadId);
  } else {
    // Create or find lead
    associatedLead = await Lead.create({
      name,
      email,
      phone: phone || '',
      company: company || '',
      source: 'Demo',
      message: `Requested Google Meet on ${meetingDate.toLocaleString('en-IN')}. Purpose: ${purpose || 'Demo'}`,
      status: 'New',
    });
    meeting.leadId = associatedLead._id;
    await meeting.save();
  }

  // 5. Send automated emails to both Admin and User
  try {
    await sendMeetingScheduledEmails(meeting, associatedLead, settings);
  } catch (emailErr) {
    console.error('[Meeting Email Error]:', emailErr.message);
  }

  return ApiResponse.success(res, {
    statusCode: 201,
    message: 'Google Meet scheduled successfully! Confirmation emails sent to both you and our team.',
    data: meeting,
  });
});

/**
 * Admin: Get all meetings
 * GET /api/v1/meetings
 */
export const getAllMeetings = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 20;
  const skip = (pageNum - 1) * limitNum;

  const [meetings, total] = await Promise.all([
    Meeting.find(filter).sort('-createdAt').skip(skip).limit(limitNum).populate('leadId'),
    Meeting.countDocuments(filter),
  ]);

  return ApiResponse.success(res, {
    data: meetings,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum) || 1,
    },
  });
});

/**
 * Admin / Public: Get meeting by ID
 * GET /api/v1/meetings/:id
 */
export const getMeetingById = asyncHandler(async (req, res) => {
  const meeting = await Meeting.findById(req.params.id).populate('leadId');
  if (!meeting) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Meeting not found.' });
  }
  return ApiResponse.success(res, { data: meeting });
});

/**
 * Admin: Start / Activate Meeting (keeps it alive until ended)
 * PATCH /api/v1/meetings/:id/start
 */
export const startMeeting = asyncHandler(async (req, res) => {
  const meeting = await Meeting.findById(req.params.id);
  if (!meeting) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Meeting not found.' });
  }

  if (meeting.status === 'Ended' || meeting.status === 'Expired') {
    return ApiResponse.error(res, {
      statusCode: 400,
      message: `Cannot start a meeting that is already ${meeting.status}.`,
    });
  }

  meeting.status = 'Active';
  await meeting.save();

  return ApiResponse.success(res, {
    message: 'Meeting marked as Active. Link will remain active until manually ended.',
    data: meeting,
  });
});

/**
 * Admin: End Meeting (terminates meeting and deletes calendar event)
 * PATCH /api/v1/meetings/:id/end
 */
export const endMeeting = asyncHandler(async (req, res) => {
  const meeting = await Meeting.findById(req.params.id);
  if (!meeting) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Meeting not found.' });
  }

  meeting.status = 'Ended';
  meeting.endedAt = new Date();
  await meeting.save();

  // Delete calendar event to expire meeting
  if (meeting.calendarEventId) {
    await deleteGoogleMeetEvent(meeting.calendarEventId);
  }

  return ApiResponse.success(res, {
    message: 'Meeting ended successfully. The Google Meet link is now closed.',
    data: meeting,
  });
});
