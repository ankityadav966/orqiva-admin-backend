import { Client } from '../models/Client.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getClients = asyncHandler(async (req, res) => {
  const { search, isFeatured, isPublished, page = 1, limit = 20, sort = 'order' } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { companyName: { $regex: search, $options: 'i' } },
      { industry: { $regex: search, $options: 'i' } },
    ];
  }

  if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';
  if (isPublished !== undefined) query.isPublished = isPublished === 'true';

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 20;
  const skip = (pageNum - 1) * limitNum;

  const [clients, total] = await Promise.all([
    Client.find(query).sort(sort).skip(skip).limit(limitNum).lean(),
    Client.countDocuments(query),
  ]);

  return ApiResponse.success(res, {
    message: 'Clients fetched successfully.',
    data: clients,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum) || 1,
    },
  });
});

export const getClientById = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (!client) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Client not found.' });
  }
  return ApiResponse.success(res, { data: client });
});

export const createClient = asyncHandler(async (req, res) => {
  const client = await Client.create(req.body);
  return ApiResponse.success(res, {
    statusCode: 201,
    message: 'Client created successfully.',
    data: client,
  });
});

export const updateClient = asyncHandler(async (req, res) => {
  const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!client) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Client not found.' });
  }

  return ApiResponse.success(res, {
    message: 'Client updated successfully.',
    data: client,
  });
});

export const deleteClient = asyncHandler(async (req, res) => {
  const client = await Client.findByIdAndDelete(req.params.id);
  if (!client) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Client not found.' });
  }
  return ApiResponse.success(res, { message: 'Client deleted successfully.' });
});
