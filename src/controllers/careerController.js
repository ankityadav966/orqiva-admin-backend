import { Job, JobApplication } from '../models/Job.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import slugify from 'slugify';

export const getJobs = asyncHandler(async (req, res) => {
  const { department, search, isPublished, page = 1, limit = 20, sort = '-createdAt' } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { department: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } },
    ];
  }

  if (department) query.department = department;
  if (isPublished !== undefined) query.isPublished = isPublished === 'true';

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 20;
  const skip = (pageNum - 1) * limitNum;

  const [jobs, total] = await Promise.all([
    Job.find(query).sort(sort).skip(skip).limit(limitNum).lean(),
    Job.countDocuments(query),
  ]);

  return ApiResponse.success(res, {
    message: 'Jobs fetched successfully.',
    data: jobs,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum) || 1,
    },
  });
});

export const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Job not found.' });
  }
  return ApiResponse.success(res, { data: job });
});

export const createJob = asyncHandler(async (req, res) => {
  const body = req.body;
  if (body.title && !body.slug) {
    body.slug = slugify(body.title, { lower: true, strict: true });
  }

  const job = await Job.create(body);
  return ApiResponse.success(res, {
    statusCode: 201,
    message: 'Job vacancy created successfully.',
    data: job,
  });
});

export const updateJob = asyncHandler(async (req, res) => {
  const body = req.body;
  if (body.title && !body.slug) {
    body.slug = slugify(body.title, { lower: true, strict: true });
  }

  const job = await Job.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true,
  });

  if (!job) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Job not found.' });
  }

  return ApiResponse.success(res, {
    message: 'Job vacancy updated successfully.',
    data: job,
  });
});

export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findByIdAndDelete(req.params.id);
  if (!job) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Job not found.' });
  }
  return ApiResponse.success(res, { message: 'Job deleted successfully.' });
});

// Applications
export const getApplications = asyncHandler(async (req, res) => {
  const { jobId, status, search, page = 1, limit = 20 } = req.query;
  const query = {};

  if (jobId) query.jobId = jobId;
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { candidateName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { jobTitle: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 20;
  const skip = (pageNum - 1) * limitNum;

  const [applications, total] = await Promise.all([
    JobApplication.find(query).populate('jobId', 'title department').sort('-createdAt').skip(skip).limit(limitNum).lean(),
    JobApplication.countDocuments(query),
  ]);

  return ApiResponse.success(res, {
    data: applications,
    pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) || 1 },
  });
});

export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const app = await JobApplication.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  if (!app) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Application not found.' });
  }
  return ApiResponse.success(res, { message: 'Status updated.', data: app });
});

export const deleteApplication = asyncHandler(async (req, res) => {
  const app = await JobApplication.findByIdAndDelete(req.params.id);
  if (!app) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Application not found.' });
  }
  return ApiResponse.success(res, { message: 'Application deleted successfully.', data: null });
});
