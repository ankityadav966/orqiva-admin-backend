import mongoose from 'mongoose';

const statisticSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: [true, 'Label is required'],
      trim: true,
    },
    value: {
      type: Number,
      required: [true, 'Value is required'],
    },
    suffix: {
      type: String,
      default: '+',
      trim: true,
    },
    icon: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

export const Statistic = mongoose.model('Statistic', statisticSchema);
