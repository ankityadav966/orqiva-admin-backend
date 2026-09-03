import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Lead email is required'],
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    company: {
      type: String,
      default: '',
      trim: true,
    },
    service: {
      type: String,
      default: '',
    },
    budget: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
    source: {
      type: String,
      default: 'Quote',
      enum: ['Quote', 'Demo', 'Consultation', 'Contact Form', 'Other'],
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'In Progress', 'Converted', 'Closed'],
      default: 'New',
      index: true,
    },
    notes: [
      {
        content: String,
        author: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export const Lead = mongoose.model('Lead', leadSchema);
