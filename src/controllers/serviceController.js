import { Service } from '../models/Service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import slugify from 'slugify';

export const getServices = asyncHandler(async (req, res) => {
  const { search, category, isPublished, page = 1, limit = 10, sort = 'order' } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  if (category) query.category = category;
  if (isPublished !== undefined) query.isPublished = isPublished === 'true';

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;

  const [services, total] = await Promise.all([
    Service.find(query).sort(sort).skip(skip).limit(limitNum).lean(),
    Service.countDocuments(query),
  ]);

  return ApiResponse.success(res, {
    message: 'Services fetched successfully.',
    data: services,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum) || 1,
    },
  });
});

export const getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Service not found.' });
  }
  return ApiResponse.success(res, { data: service });
});

export const createService = asyncHandler(async (req, res) => {
  const body = req.body;
  if (body.title && !body.slug) {
    body.slug = slugify(body.title, { lower: true, strict: true });
  }

  const service = await Service.create(body);
  return ApiResponse.success(res, {
    statusCode: 201,
    message: 'Service created successfully.',
    data: service,
  });
});

export const updateService = asyncHandler(async (req, res) => {
  const body = req.body;
  if (body.title && !body.slug) {
    body.slug = slugify(body.title, { lower: true, strict: true });
  }

  const service = await Service.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true,
  });

  if (!service) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Service not found.' });
  }

  return ApiResponse.success(res, {
    message: 'Service updated successfully.',
    data: service,
  });
});

export const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Service not found.' });
  }
  return ApiResponse.success(res, { message: 'Service deleted successfully.' });
});
