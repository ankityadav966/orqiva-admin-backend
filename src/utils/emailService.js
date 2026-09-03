import nodemailer from 'nodemailer';
import dns from 'dns';
import { Resend } from 'resend';

// Force IPv4 — prevents ENETUNREACH on Render Linux containers
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

// ─── Resend Client (HTTP API — port 443, never blocked on Render) ─────────────
const getResendClient = () => {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
};

// ─── Nodemailer SMTP (local dev fallback only) ────────────────────────────────
let _smtpIPv4Promise = null;
const getSmtpIPv4 = () => {
  if (!_smtpIPv4Promise) {
    _smtpIPv4Promise = new Promise((resolve) => {
      dns.resolve4('smtp.gmail.com', (err, addresses) => {
        resolve(!err && addresses?.length > 0 ? addresses[0] : null);
      });
    });
  }
  return _smtpIPv4Promise;
};

const createSmtpTransporter = async () => {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) throw new Error('SMTP credentials not configured.');
  const ipv4 = await getSmtpIPv4();
  return nodemailer.createTransport({
    host: ipv4 || 'smtp.gmail.com',
    port: 465,
    secure: true,
    tls: { servername: 'smtp.gmail.com', rejectUnauthorized: true },
    auth: { user, pass },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 25000,
  });
};


// ─── CTA Source Labels ───────────────────────────────────────────────────────
const sourceConfig = {
  Demo: {
    label: 'Product Demo Request',
    adminSubject: 'New Demo Request from',
    userSubject: 'Demo Confirmation & Google Meet Details - Orqiva Tech',
    userGreeting: 'Thank you for requesting a demo!',
    userMessage:
      'We have received your demo request. Below are your meeting details and Google Meet joining link.',
    meetingNote:
      'Our solutions specialist will join the Google Meet room to walk you through our software and answer your questions.',
    ctaText: 'Schedule Your Demo',
    color: '#2563eb',
  },
  Quote: {
    label: 'Quote Request',
    adminSubject: 'New Quote Request from',
    userSubject: 'Quote Request Confirmation - Orqiva Tech',
    userGreeting: 'Thank you for requesting a quote!',
    userMessage:
      'We have received your project details and will prepare a customized proposal within 24 hours.',
    meetingNote:
      'We may follow up to understand your exact requirements before delivering the final quote.',
    ctaText: 'View Our Services',
    color: '#0284c7',
  },
  Consultation: {
    label: 'Consultation Request',
    adminSubject: 'New Consultation Request from',
    userSubject: 'Consultation Booking Confirmation - Orqiva Tech',
    userGreeting: 'Thank you for scheduling a consultation!',
    userMessage:
      'Our team is looking forward to discussing your project goals and architecture.',
    meetingNote:
      'We will review your requirements and provide technical guidance during our session.',
    ctaText: 'Learn More',
    color: '#059669',
  },
  'Contact Form': {
    label: 'Contact Message',
    adminSubject: 'New Contact Submission from',
    userSubject: 'We Received Your Message - Orqiva Tech',
    userGreeting: 'Thank you for contacting us!',
    userMessage: 'We have received your inquiry and will get back to you shortly.',
    meetingNote: 'Our team will reach out via email or phone to address your inquiry.',
    ctaText: 'Explore Our Work',
    color: '#d97706',
  },
  Other: {
    label: 'General Inquiry',
    adminSubject: 'New Website Inquiry from',
    userSubject: 'Inquiry Confirmation - Orqiva Tech',
    userGreeting: 'Thank you for reaching out!',
    userMessage: 'We have received your request and our team will get in touch.',
    meetingNote: 'Our team will be in touch to discuss how we can assist you.',
    ctaText: 'Visit Our Website',
    color: '#2563eb',
  },
};

// ─── Helper: Detail Row ──────────────────────────────────────────────────────
const buildDetailRow = (label, value) => `
  <tr>
    <td style="padding:8px 0;color:#64748b;font-size:13px;width:130px;vertical-align:top;border-bottom:1px solid #f1f5f9;">${label}</td>
    <td style="padding:8px 0;color:#0f172a;font-size:13px;font-weight:600;text-align:right;border-bottom:1px solid #f1f5f9;">${value}</td>
  </tr>`;

// ─── Helper: Google Calendar Link ───────────────────────────────────────────
const makeGoogleCalendarUrl = (title, details, startTime, durationMinutes = 30) => {
  try {
    const start = new Date(startTime).toISOString().replace(/-|:|\.\d\d\d/g, '');
    const end = new Date(new Date(startTime).getTime() + durationMinutes * 60000)
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, '');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&dates=${start}/${end}&details=${encodeURIComponent(details)}`;
  } catch {
    return 'https://calendar.google.com';
  }
};

// ─── Admin Lead Email HTML ───────────────────────────────────────────────────
const buildAdminEmailHTML = (lead, config) => {
  const { name, email, phone, company, service, budget, message, source } = lead;
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:20px;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#1e293b;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
    <div style="background:#1e293b;padding:24px;text-align:center;">
      <h2 style="color:#ffffff;margin:0;font-size:18px;">${config.label}</h2>
      <p style="color:#94a3b8;margin:6px 0 0;font-size:13px;">New website inquiry</p>
    </div>
    <div style="padding:24px;">
      <table style="width:100%;border-collapse:collapse;">
        ${buildDetailRow('Name', name)}
        ${buildDetailRow('Email', `<a href="mailto:${email}" style="color:#2563eb;">${email}</a>`)}
        ${buildDetailRow('Phone', phone || 'Not provided')}
        ${buildDetailRow('Company', company || 'Not provided')}
        ${buildDetailRow('Service', service || 'General')}
        ${buildDetailRow('Budget', budget || 'Not specified')}
        ${buildDetailRow('Source', source)}
      </table>
      ${
        message
          ? `
      <div style="margin-top:18px;padding:14px;background:#f8fafc;border-radius:8px;border-left:3px solid #2563eb;">
        <p style="color:#64748b;font-size:11px;margin:0 0 4px;text-transform:uppercase;font-weight:bold;">Message</p>
        <p style="color:#1e293b;margin:0;font-size:13px;line-height:1.5;">${message}</p>
      </div>`
          : ''
      }
      <div style="text-align:center;margin-top:24px;">
        <a href="mailto:${email}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:10px 24px;border-radius:6px;font-size:13px;font-weight:bold;">Reply to ${name}</a>
      </div>
    </div>
  </div>
</body>
</html>`;
};

// ─── User Confirmation Email HTML ────────────────────────────────────────────
const buildUserEmailHTML = (lead, config, settings) => {
  const { name, source } = lead;
  const companyName = settings?.companyName || 'Orqiva Tech';
  const websiteUrl = process.env.PUBLIC_WEBSITE_URL || 'https://www.orqivatech.com';
  const phone = settings?.phone || '+91 92512 17568';
  const supportEmail = process.env.GMAIL_USER || 'ankityadav941318@gmail.com';

  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:20px;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#1e293b;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
    <div style="background:#1e293b;padding:28px 24px;text-align:center;">
      <h2 style="color:#ffffff;margin:0;font-size:20px;">${config.userGreeting}</h2>
      <p style="color:#94a3b8;margin:6px 0 0;font-size:13px;">Hi ${name}, we have received your submission.</p>
    </div>
    <div style="padding:24px;">
      <p style="color:#334155;font-size:14px;line-height:1.6;margin:0 0 16px;">${config.userMessage}</p>
      
      <div style="background:#f1f5f9;border-left:3px solid #2563eb;padding:14px 16px;border-radius:6px;margin-bottom:20px;">
        <p style="margin:0;color:#0f172a;font-size:13px;font-weight:bold;">Next steps:</p>
        <p style="margin:4px 0 0;color:#475569;font-size:13px;line-height:1.5;">${config.meetingNote}</p>
      </div>

      <p style="color:#64748b;font-size:13px;margin:0 0 6px;">Need immediate help? Contact us:</p>
      <p style="margin:0 0 20px;font-size:13px;color:#1e293b;">
        Phone: <a href="tel:${phone}" style="color:#2563eb;text-decoration:none;font-weight:600;">${phone}</a> &nbsp;|&nbsp;
        Email: <a href="mailto:${supportEmail}" style="color:#2563eb;text-decoration:none;font-weight:600;">${supportEmail}</a>
      </p>

      <div style="text-align:center;border-top:1px solid #f1f5f9;padding-top:18px;">
        <a href="${websiteUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:10px 24px;border-radius:6px;font-size:13px;font-weight:bold;">Visit ${companyName}</a>
      </div>
    </div>
    <div style="background:#f8fafc;padding:14px;text-align:center;border-top:1px solid #e2e8f0;">
      <p style="color:#94a3b8;font-size:11px;margin:0;">&copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
};

// ─── Admin Meeting Email HTML ────────────────────────────────────────────────
const buildMeetAdminEmailHTML = (meeting) => {
  const calUrl = makeGoogleCalendarUrl(
    `Demo with ${meeting.userName}`,
    `Meeting Session with ${meeting.userName}. Link: ${meeting.meetLink}`,
    meeting.scheduledAt,
    meeting.durationMinutes
  );

  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:20px;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#1e293b;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
    <div style="background:#1e293b;padding:24px;text-align:center;">
      <h2 style="color:#ffffff;margin:0;font-size:18px;">New Meeting Scheduled</h2>
      <p style="color:#94a3b8;margin:6px 0 0;font-size:13px;">Participant: ${meeting.userName}</p>
    </div>
    <div style="padding:24px;">
      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px;text-align:center;margin-bottom:18px;">
        <p style="color:#1e40af;font-size:12px;font-weight:bold;margin:0 0 6px;text-transform:uppercase;">Google Meet Room</p>
        <p style="margin:0 0 12px;font-size:15px;font-weight:bold;"><a href="${meeting.meetLink}" target="_blank" rel="noopener noreferrer" style="color:#2563eb;">${meeting.meetLink}</a></p>
        <a href="${meeting.meetLink}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:10px 24px;border-radius:6px;font-size:13px;font-weight:bold;">Join Google Meet</a>
      </div>

      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        ${buildDetailRow('Client Name', meeting.userName)}
        ${buildDetailRow('Client Email', `<a href="mailto:${meeting.userEmail}" style="color:#2563eb;">${meeting.userEmail}</a>`)}
        ${buildDetailRow('Scheduled Time', new Date(meeting.scheduledAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }))}
        ${buildDetailRow('Duration', `${meeting.durationMinutes} Minutes`)}
        ${buildDetailRow('Purpose', meeting.purpose || 'Demo')}
      </table>

      <div style="text-align:center;margin-top:14px;">
        <a href="${calUrl}" target="_blank" rel="noopener noreferrer" style="color:#64748b;font-size:12px;text-decoration:underline;">Add to Google Calendar</a>
      </div>
    </div>
  </div>
</body>
</html>`;
};

// ─── User Meeting Email HTML (Optimized for Primary Inbox) ───────────────────
const buildMeetUserEmailHTML = (meeting, settings) => {
  const companyName = settings?.companyName || 'Orqiva Tech';
  const supportEmail = process.env.GMAIL_USER || 'ankityadav941318@gmail.com';
  const phone = settings?.phone || '+91 92512 17568';
  const formattedDate = new Date(meeting.scheduledAt).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const calUrl = makeGoogleCalendarUrl(
    `${companyName} Demo Session`,
    `Demo meeting with ${companyName}. Google Meet Link: ${meeting.meetLink}`,
    meeting.scheduledAt,
    meeting.durationMinutes
  );

  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:20px;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#1e293b;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
    <div style="background:#1e293b;padding:28px 24px;text-align:center;">
      <h2 style="color:#ffffff;margin:0;font-size:20px;">Meeting Confirmation</h2>
      <p style="color:#94a3b8;margin:6px 0 0;font-size:13px;">Hi ${meeting.userName}, your Google Meet session is ready.</p>
    </div>
    <div style="padding:24px;">
      <p style="color:#334155;font-size:14px;line-height:1.5;margin:0 0 18px;">
        Thank you for scheduling a session with ${companyName}. Please find your meeting time and Google Meet link below:
      </p>

      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:20px;text-align:center;margin-bottom:20px;">
        <p style="color:#1e40af;font-size:12px;font-weight:bold;margin:0 0 4px;text-transform:uppercase;">Scheduled Date & Time (IST)</p>
        <p style="color:#0f172a;font-size:16px;font-weight:bold;margin:0 0 14px;">${formattedDate}</p>
        
        <a href="${meeting.meetLink}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:6px;font-size:14px;font-weight:bold;margin-bottom:12px;">Join Google Meet</a>
        
        <p style="color:#64748b;font-size:12px;margin:0 0 10px;">Link: <a href="${meeting.meetLink}" target="_blank" rel="noopener noreferrer" style="color:#2563eb;">${meeting.meetLink}</a></p>
        <div>
          <a href="${calUrl}" target="_blank" rel="noopener noreferrer" style="color:#2563eb;font-size:12px;font-weight:bold;text-decoration:underline;">Add to Google Calendar</a>
        </div>
      </div>

      <div style="background:#f8fafc;padding:14px 16px;border-radius:8px;margin-bottom:20px;border-left:3px solid #64748b;">
        <p style="margin:0 0 4px;font-size:12px;font-weight:bold;color:#0f172a;">Joining Guidelines:</p>
        <p style="margin:0;color:#475569;font-size:12px;line-height:1.5;">Please join at the scheduled time using Chrome, Edge, or the Google Meet mobile app. Make sure your microphone and camera permissions are enabled.</p>
      </div>

      <p style="color:#64748b;font-size:12px;margin:0 0 4px;">Need to reschedule or have questions?</p>
      <p style="margin:0 0 16px;font-size:13px;color:#1e293b;">
        Phone: <a href="tel:${phone}" style="color:#2563eb;text-decoration:none;font-weight:600;">${phone}</a> &nbsp;|&nbsp;
        Email: <a href="mailto:${supportEmail}" style="color:#2563eb;text-decoration:none;font-weight:600;">${supportEmail}</a>
      </p>
    </div>
    <div style="background:#f8fafc;padding:14px;text-align:center;border-top:1px solid #e2e8f0;">
      <p style="color:#94a3b8;font-size:11px;margin:0;">&copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
};

// ─── Main Send Function: Lead Submissions ────────────────────────────────────
export const sendLeadEmails = async (lead, settings) => {
  const config = sourceConfig[lead.source] || sourceConfig['Other'];
  const transporter = await createSmtpTransporter();
  const adminEmail = process.env.GMAIL_USER;
  const companyName = settings?.companyName || 'Orqiva Tech';

  // 1. Email to Admin
  await transporter.sendMail({
    from: `"${companyName}" <${process.env.GMAIL_USER}>`,
    to: adminEmail,
    replyTo: lead.email,
    subject: `${config.adminSubject} ${lead.name}`,
    text: `New Lead Details:\nName: ${lead.name}\nEmail: ${lead.email}\nPhone: ${lead.phone}\nCompany: ${lead.company}\nService: ${lead.service}\nBudget: ${lead.budget}\nMessage: ${lead.message}`,
    html: buildAdminEmailHTML(lead, config),
  });

  // 2. Confirmation Email to User
  await transporter.sendMail({
    from: `"${companyName}" <${process.env.GMAIL_USER}>`,
    to: lead.email,
    replyTo: adminEmail,
    subject: config.userSubject,
    text: `Hi ${lead.name},\n\nThank you for contacting ${companyName}.\n${config.userMessage}\n\nOur team will be in touch shortly.\n\nBest Regards,\n${companyName}`,
    html: buildUserEmailHTML(lead, config, settings),
  });
};

// ─── Main Send Function: Meeting Creation ────────────────────────────────────
export const sendMeetingScheduledEmails = async (meeting, lead = {}, settings = {}) => {
  const transporter = await createSmtpTransporter();
  const adminEmail = process.env.GMAIL_USER;
  const companyName = settings?.companyName || 'Orqiva Tech';

  // 1. Admin Meeting Alert
  await transporter.sendMail({
    from: `"${companyName}" <${process.env.GMAIL_USER}>`,
    to: adminEmail,
    replyTo: meeting.userEmail,
    subject: `Meeting Scheduled with ${meeting.userName}`,
    text: `Meeting Scheduled:\nParticipant: ${meeting.userName} (${meeting.userEmail})\nTime: ${new Date(meeting.scheduledAt).toLocaleString('en-IN')}\nGoogle Meet Link: ${meeting.meetLink}\nPurpose: ${meeting.purpose}`,
    html: buildMeetAdminEmailHTML(meeting),
  });

  // 2. User Google Meet Link Email (Clean, high-deliverability format)
  await transporter.sendMail({
    from: `"${companyName}" <${process.env.GMAIL_USER}>`,
    to: meeting.userEmail,
    replyTo: adminEmail,
    subject: `Meeting Confirmation & Google Meet Link - ${companyName}`,
    text: `Hi ${meeting.userName},\n\nYour meeting with ${companyName} has been confirmed.\n\nDate & Time: ${new Date(meeting.scheduledAt).toLocaleString('en-IN')}\nGoogle Meet Link: ${meeting.meetLink}\n\nPlease join on time.\n\nBest Regards,\n${companyName}`,
    html: buildMeetUserEmailHTML(meeting, settings),
  });
};

// ─── Main Send Function: Admin Login OTP ─────────────────────────────────────
// Uses Resend HTTP API (port 443) when RESEND_API_KEY is set — works on Render.
// Falls back to Gmail SMTP for local development.
export const sendAdminOtpEmail = async (email, otp) => {
  const companyName = 'ORQIVA Tech';
  const subject = `${otp} is your ORQIVA Tech Admin Verification Code`;
  const text = `Your ORQIVA Tech CMS Admin verification code is: ${otp}. It expires in 10 minutes. Do not share this code.`;
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Admin Login Verification</title></head>
<body style="margin:0;padding:30px 15px;background:#070B14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:520px;margin:0 auto;background:#0E1524;border:1px solid #1E2D4A;border-radius:20px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,.6);">
    <div style="background:linear-gradient(135deg,#111C2E,#0E1524);padding:32px 24px;text-align:center;border-bottom:1px solid #1E2D4A;">
      <div style="display:inline-block;width:48px;height:48px;line-height:48px;border-radius:14px;background:linear-gradient(135deg,#FF8336,#FF5A1F);color:#fff;font-size:22px;font-weight:900;margin-bottom:12px;">O</div>
      <h1 style="color:#fff;margin:0;font-size:20px;font-weight:800;">ORQIVA <span style="color:#FF6A21;">TECH</span></h1>
      <p style="color:#94A3B8;margin:6px 0 0;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Admin Security Verification</p>
    </div>
    <div style="padding:36px 28px;text-align:center;">
      <p style="color:#E2E8F0;font-size:15px;line-height:1.5;margin:0 0 24px;font-weight:500;">A login request was made to the <strong>ORQIVA Tech Admin CMS Dashboard</strong>. Use the code below:</p>
      <div style="background:#070B14;border:2px dashed #FF6A21;border-radius:16px;padding:22px 16px;margin:0 auto 28px;max-width:320px;">
        <span style="font-size:38px;font-weight:900;letter-spacing:10px;color:#FF6A21;display:inline-block;font-family:monospace,Courier,sans-serif;">${otp}</span>
      </div>
      <div style="background:#111C2E;border-radius:12px;padding:14px 18px;margin-bottom:24px;text-align:left;border-left:3px solid #FF6A21;">
        <p style="margin:0;color:#94A3B8;font-size:12px;line-height:1.5;">⏱️ Valid for <strong style="color:#fff;">10 minutes</strong> only. If you did not request this, ignore this email.</p>
      </div>
    </div>
    <div style="background:#070B14;padding:18px;text-align:center;border-top:1px solid #1E2D4A;">
      <p style="color:#64748B;font-size:11px;margin:0;">© ${new Date().getFullYear()} ORQIVA Tech Enterprise Control Panel. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;

  // ── Try Resend HTTP API first (works on Render — uses HTTPS port 443) ──────
  const resend = getResendClient();
  if (resend) {
    const fromAddress = process.env.RESEND_FROM_EMAIL || 'ORQIVA Tech Security <onboarding@resend.dev>';
    await resend.emails.send({
      from: fromAddress,
      to: [email],
      subject,
      text,
      html,
    });
    return;
  }

  // ── Fallback: Gmail SMTP (works locally, may be blocked on Render) ─────────
  const transporter = await createSmtpTransporter();
  await transporter.sendMail({
    from: `"${companyName} Security" <${process.env.GMAIL_USER}>`,
    to: email,
    subject,
    text,
    html,
  });
};
