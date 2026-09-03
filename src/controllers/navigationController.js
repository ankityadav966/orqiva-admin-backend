import { Navigation } from '../models/Navigation.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getNavItems = asyncHandler(async (req, res) => {
  const items = await Navigation.find().sort('order').lean();
  return ApiResponse.success(res, { data: items });
});

export const createNavItem = asyncHandler(async (req, res) => {
  const item = await Navigation.create(req.body);
  return ApiResponse.success(res, { statusCode: 201, message: 'Navigation item created.', data: item });
});

export const updateNavItem = asyncHandler(async (req, res) => {
  const item = await Navigation.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Navigation item not found.' });
  }
  return ApiResponse.success(res, { message: 'Navigation item updated.', data: item });
});

export const deleteNavItem = asyncHandler(async (req, res) => {
  const item = await Navigation.findByIdAndDelete(req.params.id);
  if (!item) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Navigation item not found.' });
  }
  return ApiResponse.success(res, { message: 'Navigation item deleted.' });
});
