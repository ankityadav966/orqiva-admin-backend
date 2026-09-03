import { Service } from '../models/Service.js';
import { Project } from '../models/Project.js';
import { Client } from '../models/Client.js';
import { Testimonial } from '../models/Testimonial.js';
import { BlogPost } from '../models/BlogPost.js';
import { Lead } from '../models/Lead.js';
import { ContactSubmission } from '../models/ContactSubmission.js';
import { NewsletterSubscriber } from '../models/NewsletterSubscriber.js';
import { Industry } from '../models/Industry.js';
import { Technology } from '../models/Technology.js';
import { Job } from '../models/Job.js';
import { Statistic } from '../models/Statistic.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalServices,
    totalProjects,
    totalClients,
    totalTestimonials,
    totalBlogPosts,
    totalLeads,
    newLeads,
    totalContactEnquiries,
    unreadContactEnquiries,
    totalNewsletterSubscribers,
    totalIndustries,
    totalTechnologies,
    totalJobs,
    recentLeads,
    recentEnquiries,
    statistics,
    leadsByStatus,
    projectsByCategory,
  ] = await Promise.all([
    Service.countDocuments(),
    Project.countDocuments(),
    Client.countDocuments(),
    Testimonial.countDocuments(),
    BlogPost.countDocuments(),
    Lead.countDocuments(),
    Lead.countDocuments({ status: 'New' }),
    ContactSubmission.countDocuments(),
    ContactSubmission.countDocuments({ status: 'Unread' }),
    NewsletterSubscriber.countDocuments({ status: 'Subscribed' }),
    Industry.countDocuments(),
    Technology.countDocuments(),
    Job.countDocuments(),
    Lead.find().sort({ createdAt: -1 }).limit(5).lean(),
    ContactSubmission.find().sort({ createdAt: -1 }).limit(5).lean(),
    Statistic.find({ isActive: true }).sort({ order: 1 }).lean(),
    Lead.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Project.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
  ]);

  return ApiResponse.success(res, {
    message: 'Dashboard metrics loaded successfully.',
    data: {
      overview: {
        totalServices,
        totalProjects,
        totalClients,
        totalTestimonials,
        totalBlogPosts,
        totalLeads,
        newLeads,
        totalContactEnquiries,
        unreadContactEnquiries,
        totalNewsletterSubscribers,
        totalIndustries,
        totalTechnologies,
        totalJobs,
      },
      homepageStats: statistics,
      leadsByStatus,
      projectsByCategory,
      recentLeads,
      recentEnquiries,
    },
  });
});
