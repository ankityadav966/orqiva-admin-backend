import { Industry } from '../models/Industry.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import slugify from 'slugify';

export const getIndustries = asyncHandler(async (req, res) => {
  const { search, isPublished, page = 1, limit = 20, sort = 'order' } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  if (isPublished !== undefined) query.isPublished = isPublished === 'true';

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 20;
  const skip = (pageNum - 1) * limitNum;

  const [industries, total] = await Promise.all([
    Industry.find(query).sort(sort).skip(skip).limit(limitNum).lean(),
    Industry.countDocuments(query),
  ]);

  return ApiResponse.success(res, {
    message: 'Industries fetched successfully.',
    data: industries,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum) || 1,
    },
  });
});

export const getIndustryById = asyncHandler(async (req, res) => {
  const industry = await Industry.findById(req.params.id);
  if (!industry) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Industry not found.' });
  }
  return ApiResponse.success(res, { data: industry });
});

export const createIndustry = asyncHandler(async (req, res) => {
  const body = req.body;
  if (body.name && !body.slug) {
    body.slug = slugify(body.name, { lower: true, strict: true });
  }

  const industry = await Industry.create(body);
  return ApiResponse.success(res, {
    statusCode: 201,
    message: 'Industry created successfully.',
    data: industry,
  });
});

export const updateIndustry = asyncHandler(async (req, res) => {
  const body = req.body;
  if (body.name && !body.slug) {
    body.slug = slugify(body.name, { lower: true, strict: true });
  }

  const industry = await Industry.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true,
  });

  if (!industry) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Industry not found.' });
  }

  return ApiResponse.success(res, {
    message: 'Industry updated successfully.',
    data: industry,
  });
});

export const deleteIndustry = asyncHandler(async (req, res) => {
  const industry = await Industry.findByIdAndDelete(req.params.id);
  if (!industry) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Industry not found.' });
  }
  return ApiResponse.success(res, { message: 'Industry deleted successfully.' });
});
