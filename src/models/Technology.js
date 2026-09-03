import mongoose from 'mongoose';
import slugify from 'slugify';

const technologySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Technology name is required'],
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Frontend', 'Backend', 'Mobile', 'Cloud', 'DevOps', 'Database', 'AI', 'Other'],
      default: 'Frontend',
      index: true,
    },
    icon: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '#FF6A21',
    },
    description: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

technologySchema.pre('validate', function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export const Technology = mongoose.model('Technology', technologySchema);
