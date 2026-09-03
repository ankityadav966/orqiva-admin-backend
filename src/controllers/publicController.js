import mongoose from 'mongoose';
import { Service } from '../models/Service.js';
import { Industry } from '../models/Industry.js';
import { Project } from '../models/Project.js';
import { Technology } from '../models/Technology.js';
import { Testimonial } from '../models/Testimonial.js';
import { BlogPost } from '../models/BlogPost.js';
import { FAQ } from '../models/FAQ.js';
import { Job, JobApplication } from '../models/Job.js';
import { HeroSection } from '../models/HeroSection.js';
import { Statistic } from '../models/Statistic.js';
import { FeaturedProject } from '../models/FeaturedProject.js';
import { SiteSettings } from '../models/SiteSettings.js';
import { Navigation } from '../models/Navigation.js';
import { Lead } from '../models/Lead.js';
import { ContactSubmission } from '../models/ContactSubmission.js';
import { NewsletterSubscriber } from '../models/NewsletterSubscriber.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendLeadEmails, sendMeetingScheduledEmails } from '../utils/emailService.js';
import { Meeting } from '../models/Meeting.js';
import { createGoogleMeetEvent } from '../utils/googleMeetService.js';

// Aggregate Homepage Data
export const getPublicHome = asyncHandler(async (req, res) => {
  const [
    hero,
    stats,
    featuredProject,
    services,
    industries,
    technologies,
    projects,
    testimonials,
    blogPosts,
    faqs,
    careers,
    settings,
  ] = await Promise.all([
    HeroSection.findOne({ isActive: true }),
    Statistic.find({ isActive: true }).sort('order'),
    FeaturedProject.findOne({ isActive: true }),
    Service.find({ isPublished: true }).sort('order'),
    Industry.find({ isPublished: true }).sort('order'),
    Technology.find({ isPublished: true }).sort('order'),
    Project.find({ isPublished: true }).sort('order'),
    Testimonial.find({ isPublished: true }).sort('order'),
    BlogPost.find({ status: 'Published' }).sort('-publishedAt'),
    FAQ.find({ isPublished: true }).sort('order'),
    Job.find({ isPublished: true }).sort('-createdAt'),
    SiteSettings.findOne(),
  ]);

  return ApiResponse.success(res, {
    message: 'Public homepage data fetched.',
    data: {
      hero,
      stats,
      statistics: stats,
      featuredProject,
      services,
      industries,
      technologies,
      projects,
      testimonials,
      blogPosts,
      faqs,
      careers,
      jobs: careers,
      settings,
    },
  });
});

// Services
export const getPublicServices = asyncHandler(async (req, res) => {
  const services = await Service.find({ isPublished: true }).sort('order');
  return ApiResponse.success(res, { data: services });
});

export const getPublicServiceBySlug = asyncHandler(async (req, res) => {
  const service = await Service.findOne({ slug: req.params.slug, isPublished: true });
  if (!service) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Service not found.' });
  }
  return ApiResponse.success(res, { data: service });
});

// Industries
export const getPublicIndustries = asyncHandler(async (req, res) => {
  const industries = await Industry.find({ isPublished: true }).sort('order');
  return ApiResponse.success(res, { data: industries });
});

export const getPublicIndustryBySlug = asyncHandler(async (req, res) => {
  const industry = await Industry.findOne({ slug: req.params.slug, isPublished: true });
  if (!industry) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Industry not found.' });
  }
  return ApiResponse.success(res, { data: industry });
});

// Projects
export const getPublicProjects = asyncHandler(async (req, res) => {
  const { category, industry, search } = req.query;
  const query = { isPublished: true };

  if (category && category !== 'All') query.category = category;
  if (industry) query.industry = industry;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const projects = await Project.find(query).sort('order -createdAt');
  return ApiResponse.success(res, { data: projects });
});

export const getPublicProjectBySlug = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug, isPublished: true });
  if (!project) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Project not found.' });
  }
  return ApiResponse.success(res, { data: project });
});

// Technologies
export const getPublicTechnologies = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const query = { isPublished: true };
  if (category && category !== 'All') query.category = category;

  const technologies = await Technology.find(query).sort('order');
  return ApiResponse.success(res, { data: technologies });
});

// Testimonials
export const getPublicTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({ isPublished: true }).sort('order');
  return ApiResponse.success(res, { data: testimonials });
});

// Blog
export const getPublicBlog = asyncHandler(async (req, res) => {
  const { category, search, page = 1, limit = 10 } = req.query;
  const query = { status: 'Published' };

  if (category && category !== 'All') query.category = category;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;

  const [posts, total] = await Promise.all([
    BlogPost.find(query).sort('-publishedAt').skip(skip).limit(limitNum),
    BlogPost.countDocuments(query),
  ]);

  return ApiResponse.success(res, {
    data: posts,
    pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) || 1 },
  });
});

export const getPublicBlogPostBySlug = asyncHandler(async (req, res) => {
  const post = await BlogPost.findOne({ slug: req.params.slug, status: 'Published' });
  if (!post) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Blog post not found.' });
  }
  return ApiResponse.success(res, { data: post });
});

// FAQs
export const getPublicFAQs = asyncHandler(async (req, res) => {
  const faqs = await FAQ.find({ isPublished: true }).sort('order');
  return ApiResponse.success(res, { data: faqs });
});

// Jobs
export const getPublicJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ isPublished: true }).sort('-createdAt');
  return ApiResponse.success(res, { data: jobs });
});

// Site Settings & Navigation
export const getPublicSettings = asyncHandler(async (req, res) => {
  const [settings, navigation] = await Promise.all([
    SiteSettings.findOne(),
    Navigation.find({ isPublished: true }).sort('order'),
  ]);
  return ApiResponse.success(res, { data: { settings, navigation } });
});

// Submit Lead (Quote, Demo, Consultation)
export const submitPublicLead = asyncHandler(async (req, res) => {
  const { name, email, phone, company, service, budget, message, source, meetingMode, scheduledAt } = req.body;

  if (!name || !email) {
    return ApiResponse.error(res, { statusCode: 400, message: 'Name and email are required.' });
  }

  const lead = await Lead.create({
    name,
    email,
    phone: phone || '',
    company: company || '',
    service: service || '',
    budget: budget || '',
    message: message || '',
    source: source || 'Quote',
    status: 'New',
  });

  let meetingData = null;
  let settings = null;
  try {
    settings = await SiteSettings.findOne();
  } catch (err) {
    console.error('Settings load error:', err.message);
  }

  // If meeting mode is enabled or source is Demo/Consultation with scheduled time, create Google Meet
  const isMeetingRequested =
    meetingMode === true ||
    meetingMode === 'true' ||
    meetingMode === 'Google Meet' ||
    source === 'Demo' ||
    Boolean(scheduledAt);

  const meetDate = scheduledAt ? new Date(scheduledAt) : new Date(Date.now() + 15 * 60 * 1000);

  if (isMeetingRequested) {
    try {
      const { meetLink, eventId } = await createGoogleMeetEvent({
        summary: `Orqiva Tech Meeting with ${name}`,
        description: `Requested session via website. Lead ID: ${lead._id}. Service: ${service || 'General'}`,
        startTime: meetDate,
        durationMinutes: 30,
        attendees: [email],
        customMeetLink: settings?.googleMeetLink || null,
      });

      const meeting = await Meeting.create({
        leadId: lead._id,
        userName: name,
        userEmail: email,
        adminEmail: settings?.salesEmail || process.env.GMAIL_USER || 'orqivatech@gmail.com',
        meetLink,
        calendarEventId: eventId,
        scheduledAt: meetDate,
        durationMinutes: 30,
        purpose: `${source || 'Demo'} Session`,
        status: 'Scheduled',
      });

      meetingData = meeting;
    } catch (err) {
      console.error('[Meet Creation Error]:', err.message);
    }
  }

  // 🚀 Send emails ASYNCHRONOUSLY in the background - Do NOT block user response!
  setImmediate(async () => {
    try {
      const settings = await SiteSettings.findOne();
      if (meetingData) {
        await sendMeetingScheduledEmails(meetingData, lead, settings);
      } else {
        await sendLeadEmails(lead, settings);
      }
    } catch (emailError) {
      console.error('[Background Email Error]:', emailError.message);
    }
  });

  // Return instant response with meetLink so frontend displays it immediately
  return ApiResponse.success(res, {
    statusCode: 201,
    message: meetingData
      ? 'Demo scheduled! Google Meet link has been generated.'
      : 'Thank you! Your request has been received.',
    data: {
      id: lead._id,
      meeting: meetingData,
      meetLink: meetingData?.meetLink || null,
      scheduledAt: meetingData?.scheduledAt || meetDate,
    },
  });
});

// Submit Contact Form
export const submitPublicContact = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return ApiResponse.error(res, {
      statusCode: 400,
      message: 'Name, email, and message are required.',
    });
  }

  const contact = await ContactSubmission.create({
    name,
    email,
    phone: phone || '',
    subject: subject || 'Website Contact Inquiry',
    message,
    status: 'Unread',
  });

  return ApiResponse.success(res, {
    statusCode: 201,
    message: 'Thank you! We have received your message and will respond promptly.',
    data: { id: contact._id },
  });
});

// Submit Newsletter
export const submitPublicNewsletter = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return ApiResponse.error(res, { statusCode: 400, message: 'Email is required.' });
  }

  const existing = await NewsletterSubscriber.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    if (existing.status === 'Unsubscribed') {
      existing.status = 'Subscribed';
      await existing.save();
      return ApiResponse.success(res, { message: 'Welcome back! You have been re-subscribed.' });
    }
    return ApiResponse.success(res, { message: 'You are already subscribed to our newsletter.' });
  }

  await NewsletterSubscriber.create({
    email: email.toLowerCase().trim(),
    status: 'Subscribed',
  });

  return ApiResponse.success(res, {
    statusCode: 201,
    message: 'Thank you for subscribing to our newsletter!',
  });
});

// Submit Job Application
export const submitJobApplication = asyncHandler(async (req, res) => {
  const {
    jobId,
    jobTitle,
    candidateName,
    fullName,
    name,
    email,
    phone,
    experience,
    currentCompany,
    currentCtc,
    expectedCtc,
    noticePeriod,
    portfolioUrl,
    linkedinUrl,
    resumeUrl,
    coverLetter,
  } = req.body;

  const finalName = (candidateName || fullName || name || '').trim();
  const finalEmail = (email || '').toLowerCase().trim();

  if (!finalName || !finalEmail) {
    return ApiResponse.error(res, {
      statusCode: 400,
      message: 'Candidate name and email are required.',
    });
  }

  // Resolve jobId and jobTitle
  let validJobId = null;
  let resolvedJobTitle = (jobTitle || '').trim();

  if (jobId && mongoose.Types.ObjectId.isValid(jobId)) {
    validJobId = jobId;
    if (!resolvedJobTitle) {
      const jobDoc = await Job.findById(jobId);
      if (jobDoc) resolvedJobTitle = jobDoc.title;
    }
  } else if (resolvedJobTitle) {
    const jobDoc = await Job.findOne({
      $or: [
        { title: { $regex: new RegExp(`^${resolvedJobTitle}$`, 'i') } },
        { slug: { $regex: new RegExp(`^${resolvedJobTitle}$`, 'i') } },
      ],
    });
    if (jobDoc) {
      validJobId = jobDoc._id;
      resolvedJobTitle = jobDoc.title;
    }
  }

  const application = await JobApplication.create({
    jobId: validJobId || undefined,
    jobTitle: resolvedJobTitle || 'General Application',
    candidateName: finalName,
    email: finalEmail,
    phone: (phone || '').trim(),
    experience: (experience || '').trim(),
    currentCompany: (currentCompany || '').trim(),
    currentCtc: (currentCtc || '').trim(),
    expectedCtc: (expectedCtc || '').trim(),
    noticePeriod: (noticePeriod || '').trim(),
    portfolioUrl: (portfolioUrl || linkedinUrl || '').trim(),
    resumeUrl: (resumeUrl || '').trim(),
    coverLetter: (coverLetter || '').trim(),
    status: 'Applied',
  });

  return ApiResponse.success(res, {
    statusCode: 201,
    message: 'Application submitted successfully! Our HR team will review your profile.',
    data: { id: application._id },
  });
});

// Public File / Resume Upload
export const uploadPublicFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    return ApiResponse.error(res, { statusCode: 400, message: 'No file uploaded.' });
  }

  const file = req.file;
  const fileUrl = `/uploads/${file.filename}`;

  return ApiResponse.success(res, {
    statusCode: 201,
    message: 'File uploaded successfully.',
    data: {
      url: fileUrl,
      fileName: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
    },
  });
});
