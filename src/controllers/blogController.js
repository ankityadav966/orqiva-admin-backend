import { BlogPost, BlogCategory } from '../models/BlogPost.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import slugify from 'slugify';

export const getBlogPosts = asyncHandler(async (req, res) => {
  const { search, category, status, page = 1, limit = 10, sort = '-publishedAt' } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } },
    ];
  }

  if (category && category !== 'All') query.category = category;
  if (status) query.status = status;

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;

  const [posts, total] = await Promise.all([
    BlogPost.find(query).sort(sort).skip(skip).limit(limitNum).lean(),
    BlogPost.countDocuments(query),
  ]);

  return ApiResponse.success(res, {
    message: 'Blog posts fetched successfully.',
    data: posts,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum) || 1,
    },
  });
});

export const getBlogPostById = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Blog post not found.' });
  }
  return ApiResponse.success(res, { data: post });
});

export const createBlogPost = asyncHandler(async (req, res) => {
  const body = req.body;
  if (body.title && !body.slug) {
    body.slug = slugify(body.title, { lower: true, strict: true });
  }

  const post = await BlogPost.create(body);
  return ApiResponse.success(res, {
    statusCode: 201,
    message: 'Blog post created successfully.',
    data: post,
  });
});

export const updateBlogPost = asyncHandler(async (req, res) => {
  const body = req.body;
  if (body.title && !body.slug) {
    body.slug = slugify(body.title, { lower: true, strict: true });
  }

  const post = await BlogPost.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true,
  });

  if (!post) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Blog post not found.' });
  }

  return ApiResponse.success(res, {
    message: 'Blog post updated successfully.',
    data: post,
  });
});

export const deleteBlogPost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findByIdAndDelete(req.params.id);
  if (!post) {
    return ApiResponse.error(res, { statusCode: 404, message: 'Blog post not found.' });
  }
  return ApiResponse.success(res, { message: 'Blog post deleted successfully.' });
});

// Categories
export const getBlogCategories = asyncHandler(async (req, res) => {
  const categories = await BlogCategory.find().sort('name');
  return ApiResponse.success(res, { data: categories });
});

export const createBlogCategory = asyncHandler(async (req, res) => {
  const category = await BlogCategory.create(req.body);
  return ApiResponse.success(res, {
    statusCode: 201,
    message: 'Category created successfully.',
    data: category,
  });
});

export const deleteBlogCategory = asyncHandler(async (req, res) => {
  await BlogCategory.findByIdAndDelete(req.params.id);
  return ApiResponse.success(res, { message: 'Category deleted.' });
});
