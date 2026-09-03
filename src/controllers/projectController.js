import { Project } from '../models/Project.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import slugify from 'slugify';

export const getProjects = asyncHandler(async (req, res) => {
  const { search, category, industry, isFeatured, isPublished, page = 1, limit = 10, sort = '-createdAt' } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { client: { $regex: search, $options: 'i' } },
    ];
  }

  if (category && category !== 'All') query.category = category;
  if (industry) query.industry = industry;
  if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';
  if (isPublished !== undefined) query.isPublished = isPublished === 'true';

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;

  const [projects, total] = await Promise.all([
    Project.find(query).sort(sort).skip(skip).limit(limitNum).lean(),
    Project.countDocuments(query),
  ]);

  return ApiResponse.success(res, {
    message: 'Projects fetched successfully.',
    data: projects,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum) || 1,
    },
  });
});

export const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Project not found.' });
  }
  return ApiResponse.success(res, { data: project });
});

export const createProject = asyncHandler(async (req, res) => {
  const body = req.body;
  if (body.title && !body.slug) {
    body.slug = slugify(body.title, { lower: true, strict: true });
  }

  const project = await Project.create(body);
  return ApiResponse.success(res, {
    statusCode: 201,
    message: 'Project created successfully.',
    data: project,
  });
});

export const updateProject = asyncHandler(async (req, res) => {
  const body = req.body;
  if (body.title && !body.slug) {
    body.slug = slugify(body.title, { lower: true, strict: true });
  }

  const project = await Project.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true,
  });

  if (!project) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Project not found.' });
  }

  return ApiResponse.success(res, {
    message: 'Project updated successfully.',
    data: project,
  });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Project not found.' });
  }
  return ApiResponse.success(res, { message: 'Project deleted successfully.' });
});
