import { SiteSettings } from '../models/SiteSettings.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getSiteSettings = asyncHandler(async (req, res) => {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({});
  }
  return ApiResponse.success(res, { data: settings });
});

export const updateSiteSettings = asyncHandler(async (req, res) => {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create(req.body);
  } else {
    settings = await SiteSettings.findByIdAndUpdate(settings._id, req.body, {
      new: true,
      runValidators: true,
    });
  }
  return ApiResponse.success(res, {
    message: 'Site settings updated successfully.',
    data: settings,
  });
});
