import { Media } from '../models/Media.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadMedia = asyncHandler(async (req, res) => {
  if (!req.file) {
    return ApiResponse.error(res, { statusCode: 400, message: 'No file uploaded.' });
  }

  const file = req.file;
  // Local accessible URL (via Express static middleware)
  const fileUrl = `/uploads/${file.filename}`;

  const media = await Media.create({
    originalName: file.originalname,
    fileName: file.filename,
    url: fileUrl,
    mimeType: file.mimetype,
    size: file.size,
    storageType: 'local',
  });

  return ApiResponse.success(res, {
    statusCode: 201,
    message: 'File uploaded successfully.',
    data: media,
  });
});

export const getMedia = asyncHandler(async (req, res) => {
  const { search, mimeType, page = 1, limit = 24, sort = '-createdAt' } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { originalName: { $regex: search, $options: 'i' } },
      { fileName: { $regex: search, $options: 'i' } },
    ];
  }

  if (mimeType) {
    query.mimeType = { $regex: mimeType, $options: 'i' };
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 24;
  const skip = (pageNum - 1) * limitNum;

  const [mediaList, total] = await Promise.all([
    Media.find(query).sort(sort).skip(skip).limit(limitNum).lean(),
    Media.countDocuments(query),
  ]);

  return ApiResponse.success(res, {
    message: 'Media files fetched successfully.',
    data: mediaList,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum) || 1,
    },
  });
});

export const deleteMedia = asyncHandler(async (req, res) => {
  const media = await Media.findById(req.params.id);
  if (!media) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Media not found.' });
  }

  // Delete local file if it exists
  if (media.storageType === 'local' && media.fileName) {
    const filePath = path.join(__dirname, '../uploads', media.fileName);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error('Failed to unlink local file:', err);
      }
    }
  }

  await Media.findByIdAndDelete(req.params.id);
  return ApiResponse.success(res, { message: 'Media deleted successfully.' });
});
