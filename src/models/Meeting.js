import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      default: null,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    adminEmail: {
      type: String,
      default: '',
    },
    meetLink: {
      type: String,
      required: true,
    },
    calendarEventId: {
      type: String,
      default: '',
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    durationMinutes: {
      type: Number,
      default: 30,
    },
    purpose: {
      type: String,
      default: 'Product Demo / Consultation',
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Active', 'Expired', 'Ended'],
      default: 'Scheduled',
      index: true,
    },
    endedAt: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Virtual: meeting end time
meetingSchema.virtual('endsAt').get(function () {
  if (!this.scheduledAt) return null;
  return new Date(this.scheduledAt.getTime() + this.durationMinutes * 60 * 1000);
});

// Virtual: is expired?
meetingSchema.virtual('isExpired').get(function () {
  return new Date() > this.endsAt && this.status === 'Scheduled';
});

meetingSchema.set('toJSON', { virtuals: true });
meetingSchema.set('toObject', { virtuals: true });

export const Meeting = mongoose.model('Meeting', meetingSchema);
