import { Technology } from '../models/Technology.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import slugify from 'slugify';

export const getTechnologies = asyncHandler(async (req, res) => {
  const { category, search, isPublished, page = 1, limit = 50, sort = 'order' } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  if (category && category !== 'All') query.category = category;
  if (isPublished !== undefined) query.isPublished = isPublished === 'true';

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 50;
  const skip = (pageNum - 1) * limitNum;

  const [technologies, total] = await Promise.all([
    Technology.find(query).sort(sort).skip(skip).limit(limitNum).lean(),
    Technology.countDocuments(query),
  ]);

  return ApiResponse.success(res, {
    message: 'Technologies fetched successfully.',
    data: technologies,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum) || 1,
    },
  });
});

export const getTechnologyById = asyncHandler(async (req, res) => {
  const tech = await Technology.findById(req.params.id);
  if (!tech) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Technology not found.' });
  }
  return ApiResponse.success(res, { data: tech });
});

export const createTechnology = asyncHandler(async (req, res) => {
  const body = req.body;
  if (body.name && !body.slug) {
    body.slug = slugify(body.name, { lower: true, strict: true });
  }

  const tech = await Technology.create(body);
  return ApiResponse.success(res, {
    statusCode: 201,
    message: 'Technology created successfully.',
    data: tech,
  });
});

export const updateTechnology = asyncHandler(async (req, res) => {
  const body = req.body;
  if (body.name && !body.slug) {
    body.slug = slugify(body.name, { lower: true, strict: true });
  }

  const tech = await Technology.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true,
  });

  if (!tech) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Technology not found.' });
  }

  return ApiResponse.success(res, {
    message: 'Technology updated successfully.',
    data: tech,
  });
});

export const deleteTechnology = asyncHandler(async (req, res) => {
  const tech = await Technology.findByIdAndDelete(req.params.id);
  if (!tech) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Technology not found.' });
  }
  return ApiResponse.success(res, { message: 'Technology deleted successfully.' });
});
