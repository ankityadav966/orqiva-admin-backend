import mongoose from 'mongoose';

const featuredProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
    },
    client: {
      type: String,
      default: 'MediCare Group',
      trim: true,
    },
    description: {
      type: String,
      default: 'ERP System for MediCare Group',
    },
    status: {
      type: String,
      default: 'Live',
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=960&h=720&fit=crop&auto=format&q=80',
    },
    url: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const FeaturedProject = mongoose.model('FeaturedProject', featuredProjectSchema);
