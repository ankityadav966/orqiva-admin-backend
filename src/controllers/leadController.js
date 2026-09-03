import { Lead } from '../models/Lead.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getLeads = asyncHandler(async (req, res) => {
  const { search, source, status, page = 1, limit = 15, sort = '-createdAt' } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { service: { $regex: search, $options: 'i' } },
    ];
  }

  if (source && source !== 'All') query.source = source;
  if (status && status !== 'All') query.status = status;

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 15;
  const skip = (pageNum - 1) * limitNum;

  const [leads, total] = await Promise.all([
    Lead.find(query).sort(sort).skip(skip).limit(limitNum).lean(),
    Lead.countDocuments(query),
  ]);

  return ApiResponse.success(res, {
    message: 'Leads fetched successfully.',
    data: leads,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum) || 1,
    },
  });
});

export const getLeadById = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Lead not found.' });
  }
  return ApiResponse.success(res, { data: lead });
});

export const updateLeadStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Lead not found.' });
  }

  if (status) lead.status = status;
  if (note && note.trim()) {
    lead.notes.push({
      content: note.trim(),
      author: req.admin?.name || 'Administrator',
      createdAt: new Date(),
    });
  }

  await lead.save();

  return ApiResponse.success(res, {
    message: 'Lead updated successfully.',
    data: lead,
  });
});

export const addLeadNote = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content || !content.trim()) {
    return ApiResponse.error(res, { statusCode: 400, message: 'Note content is required.' });
  }

  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Lead not found.' });
  }

  lead.notes.push({
    content: content.trim(),
    author: req.admin?.name || 'Administrator',
    createdAt: new Date(),
  });

  await lead.save();

  return ApiResponse.success(res, {
    message: 'Note added successfully.',
    data: lead,
  });
});

export const deleteLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Lead not found.' });
  }
  return ApiResponse.success(res, { message: 'Lead deleted successfully.' });
});

export const exportLeadsCSV = asyncHandler(async (req, res) => {
  const { source, status } = req.query;
  const query = {};
  if (source && source !== 'All') query.source = source;
  if (status && status !== 'All') query.status = status;

  const leads = await Lead.find(query).sort('-createdAt');

  const headers = ['Name,Email,Phone,Company,Service,Budget,Source,Status,Created At'];
  const rows = leads.map((l) =>
    [
      `"${l.name || ''}"`,
      `"${l.email || ''}"`,
      `"${l.phone || ''}"`,
      `"${l.company || ''}"`,
      `"${l.service || ''}"`,
      `"${l.budget || ''}"`,
      `"${l.source || ''}"`,
      `"${l.status || ''}"`,
      `"${new Date(l.createdAt).toISOString()}"`,
    ].join(',')
  );

  const csv = [headers, ...rows].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="leads_export.csv"');
  return res.status(200).send(csv);
});
