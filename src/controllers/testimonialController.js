import { Testimonial } from '../models/Testimonial.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getTestimonials = asyncHandler(async (req, res) => {
  const { search, isFeatured, isPublished, page = 1, limit = 20, sort = 'order' } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { clientName: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
      { testimonial: { $regex: search, $options: 'i' } },
    ];
  }

  if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';
  if (isPublished !== undefined) query.isPublished = isPublished === 'true';

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 20;
  const skip = (pageNum - 1) * limitNum;

  const [testimonials, total] = await Promise.all([
    Testimonial.find(query).sort(sort).skip(skip).limit(limitNum).lean(),
    Testimonial.countDocuments(query),
  ]);

  return ApiResponse.success(res, {
    message: 'Testimonials fetched successfully.',
    data: testimonials,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum) || 1,
    },
  });
});

export const getTestimonialById = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Testimonial not found.' });
  }
  return ApiResponse.success(res, { data: testimonial });
});

export const createTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.create(req.body);
  return ApiResponse.success(res, {
    statusCode: 201,
    message: 'Testimonial created successfully.',
    data: testimonial,
  });
});

export const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!testimonial) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Testimonial not found.' });
  }

  return ApiResponse.success(res, {
    message: 'Testimonial updated successfully.',
    data: testimonial,
  });
});

export const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
  if (!testimonial) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Testimonial not found.' });
  }
  return ApiResponse.success(res, { message: 'Testimonial deleted successfully.' });
});
