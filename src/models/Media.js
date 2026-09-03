import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    originalName: {
      type: String,
      required: true,
      trim: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      default: 'image/jpeg',
    },
    size: {
      type: Number,
      default: 0,
    },
    dimensions: {
      width: Number,
      height: Number,
    },
    storageType: {
      type: String,
      enum: ['local', 'cloudinary'],
      default: 'local',
    },
    publicId: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export const Media = mongoose.model('Media', mediaSchema);
