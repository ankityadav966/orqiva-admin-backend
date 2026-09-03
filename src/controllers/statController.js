import { Statistic } from '../models/Statistic.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getStatistics = asyncHandler(async (req, res) => {
  const stats = await Statistic.find().sort('order').lean();
  return ApiResponse.success(res, { data: stats });
});

export const createStatistic = asyncHandler(async (req, res) => {
  const stat = await Statistic.create(req.body);
  return ApiResponse.success(res, { statusCode: 201, message: 'Statistic created.', data: stat });
});

export const updateStatistic = asyncHandler(async (req, res) => {
  const stat = await Statistic.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!stat) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Statistic not found.' });
  }
  return ApiResponse.success(res, { message: 'Statistic updated.', data: stat });
});

export const deleteStatistic = asyncHandler(async (req, res) => {
  const stat = await Statistic.findByIdAndDelete(req.params.id);
  if (!stat) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Statistic not found.' });
  }
  return ApiResponse.success(res, { message: 'Statistic deleted.' });
});
