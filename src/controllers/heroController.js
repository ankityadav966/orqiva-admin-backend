import { HeroSection } from '../models/HeroSection.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getHeroSection = asyncHandler(async (req, res) => {
  let hero = await HeroSection.findOne();
  if (!hero) {
    hero = await HeroSection.create({});
  }
  return ApiResponse.success(res, { data: hero });
});

export const updateHeroSection = asyncHandler(async (req, res) => {
  let hero = await HeroSection.findOne();
  if (!hero) {
    hero = await HeroSection.create(req.body);
  } else {
    hero = await HeroSection.findByIdAndUpdate(hero._id, req.body, {
      new: true,
      runValidators: true,
    });
  }
  return ApiResponse.success(res, { message: 'Hero section updated successfully.', data: hero });
});
