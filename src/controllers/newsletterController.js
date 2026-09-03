import { NewsletterSubscriber } from '../models/NewsletterSubscriber.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getSubscribers = asyncHandler(async (req, res) => {
  const { search, status, page = 1, limit = 20, sort = '-subscribedAt' } = req.query;
  const query = {};

  if (search) query.email = { $regex: search, $options: 'i' };
  if (status && status !== 'All') query.status = status;

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 20;
  const skip = (pageNum - 1) * limitNum;

  const [subscribers, total] = await Promise.all([
    NewsletterSubscriber.find(query).sort(sort).skip(skip).limit(limitNum).lean(),
    NewsletterSubscriber.countDocuments(query),
  ]);

  return ApiResponse.success(res, {
    message: 'Newsletter subscribers fetched successfully.',
    data: subscribers,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum) || 1,
    },
  });
});

export const deleteSubscriber = asyncHandler(async (req, res) => {
  const subscriber = await NewsletterSubscriber.findByIdAndDelete(req.params.id);
  if (!subscriber) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Subscriber not found.' });
  }
  return ApiResponse.success(res, { message: 'Subscriber deleted successfully.' });
});

export const exportNewsletterCSV = asyncHandler(async (req, res) => {
  const subscribers = await NewsletterSubscriber.find({ status: 'Subscribed' }).sort('-subscribedAt');
  const headers = ['Email,Status,Subscribed At'];
  const rows = subscribers.map((s) => `"${s.email}","${s.status}","${new Date(s.subscribedAt).toISOString()}"`);
  const csv = [headers, ...rows].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="subscribers_export.csv"');
  return res.status(200).send(csv);
});
