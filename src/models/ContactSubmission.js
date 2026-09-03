import mongoose from 'mongoose';

const contactSubmissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    subject: {
      type: String,
      default: 'Website Contact Inquiry',
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    status: {
      type: String,
      enum: ['Unread', 'Read', 'Responded', 'Archived'],
      default: 'Unread',
      index: true,
    },
  },
  { timestamps: true }
);

export const ContactSubmission = mongoose.model('ContactSubmission', contactSubmissionSchema);
