import { FAQ } from '../models/FAQ.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getFAQs = asyncHandler(async (req, res) => {
  const { category, search, isPublished, page = 1, limit = 50, sort = 'order' } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { question: { $regex: search, $options: 'i' } },
      { answer: { $regex: search, $options: 'i' } },
    ];
  }

  if (category && category !== 'All') query.category = category;
  if (isPublished !== undefined) query.isPublished = isPublished === 'true';

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 50;
  const skip = (pageNum - 1) * limitNum;

  const [faqs, total] = await Promise.all([
    FAQ.find(query).sort(sort).skip(skip).limit(limitNum).lean(),
    FAQ.countDocuments(query),
  ]);

  return ApiResponse.success(res, {
    message: 'FAQs fetched successfully.',
    data: faqs,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum) || 1,
    },
  });
});

export const getFAQById = asyncHandler(async (req, res) => {
  const faq = await FAQ.findById(req.params.id);
  if (!faq) {
    return ApiResponse.error(res, { statusCode: 404, message: 'FAQ not found.' });
  }
  return ApiResponse.success(res, { data: faq });
});

export const createFAQ = asyncHandler(async (req, res) => {
  const faq = await FAQ.create(req.body);
  return ApiResponse.success(res, {
    statusCode: 201,
    message: 'FAQ created successfully.',
    data: faq,
  });
});

export const updateFAQ = asyncHandler(async (req, res) => {
  const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!faq) {
    return ApiResponse.error(res, { statusCode: 404, message: 'FAQ not found.' });
  }

  return ApiResponse.success(res, {
    message: 'FAQ updated successfully.',
    data: faq,
  });
});

export const deleteFAQ = asyncHandler(async (req, res) => {
  const faq = await FAQ.findByIdAndDelete(req.params.id);
  if (!faq) {
    return ApiResponse.error(res, { statusCode: 404, message: 'FAQ not found.' });
  }
  return ApiResponse.success(res, { message: 'FAQ deleted successfully.' });
});
