import mongoose from 'mongoose';
import slugify from 'slugify';

const industrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Industry name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    icon: {
      type: String,
      default: '🏥',
      trim: true,
    },
    projectCount: {
      type: String,
      default: '40+',
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '#FF6A21',
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

industrySchema.pre('validate', function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export const Industry = mongoose.model('Industry', industrySchema);
