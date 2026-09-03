import { ContactSubmission } from '../models/ContactSubmission.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getContactSubmissions = asyncHandler(async (req, res) => {
  const { search, status, page = 1, limit = 15, sort = '-createdAt' } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { subject: { $regex: search, $options: 'i' } },
      { message: { $regex: search, $options: 'i' } },
    ];
  }

  if (status && status !== 'All') query.status = status;

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 15;
  const skip = (pageNum - 1) * limitNum;

  const [submissions, total] = await Promise.all([
    ContactSubmission.find(query).sort(sort).skip(skip).limit(limitNum).lean(),
    ContactSubmission.countDocuments(query),
  ]);

  return ApiResponse.success(res, {
    message: 'Contact submissions fetched successfully.',
    data: submissions,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum) || 1,
    },
  });
});

export const updateContactStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const submission = await ContactSubmission.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!submission) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Contact inquiry not found.' });
  }

  return ApiResponse.success(res, {
    message: 'Status updated successfully.',
    data: submission,
  });
});

export const deleteContactSubmission = asyncHandler(async (req, res) => {
  const submission = await ContactSubmission.findByIdAndDelete(req.params.id);
  if (!submission) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Contact inquiry not found.' });
  }
  return ApiResponse.success(res, { message: 'Contact inquiry deleted.' });
});
