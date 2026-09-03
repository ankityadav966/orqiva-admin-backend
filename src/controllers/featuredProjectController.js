import { FeaturedProject } from '../models/FeaturedProject.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getFeaturedProject = asyncHandler(async (req, res) => {
  let project = await FeaturedProject.findOne();
  if (!project) {
    project = await FeaturedProject.create({
      name: 'ERP System for MediCare Group',
      client: 'MediCare Group',
      description: 'Enterprise hospital operations suite',
      status: 'Live',
    });
  }
  return ApiResponse.success(res, { data: project });
});

export const updateFeaturedProject = asyncHandler(async (req, res) => {
  let project = await FeaturedProject.findOne();
  if (!project) {
    project = await FeaturedProject.create(req.body);
  } else {
    project = await FeaturedProject.findByIdAndUpdate(project._id, req.body, {
      new: true,
      runValidators: true,
    });
  }
  return ApiResponse.success(res, {
    message: 'Featured project updated successfully.',
    data: project,
  });
});
