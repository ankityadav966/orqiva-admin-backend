import mongoose from 'mongoose';

const navigationSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: [true, 'Navigation label is required'],
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'Navigation URL is required'],
      trim: true,
    },
    parent: {
      type: String,
      default: null,
    },
    order: {
      type: Number,
      default: 0,
    },
    isExternal: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

export const Navigation = mongoose.model('Navigation', navigationSchema);
