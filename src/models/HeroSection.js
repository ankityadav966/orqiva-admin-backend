import mongoose from 'mongoose';

const heroSectionSchema = new mongoose.Schema(
  {
    badgeText: {
      type: String,
      default: 'Award-Winning Global IT Company',
    },
    headingLine1: {
      type: String,
      default: 'Transform Your',
    },
    headingLine2: {
      type: String,
      default: 'Business With',
    },
    typingWords: {
      type: [String],
      default: [
        'Custom Software',
        'Mobile Apps',
        'ERP Systems',
        'AI Solutions',
        'Cloud Architecture',
        'Digital Marketing',
      ],
    },
    description: {
      type: String,
      default:
        'Enterprise-grade software, mobile apps, ERP & AI that drive measurable growth across 10+ countries.',
    },
    primaryCtaText: {
      type: String,
      default: 'Get Free Quote',
    },
    primaryCtaUrl: {
      type: String,
      default: '/get-quote',
    },
    secondaryCtaText: {
      type: String,
      default: 'Book Free Demo',
    },
    secondaryCtaUrl: {
      type: String,
      default: '/book-demo',
    },
    heroImage: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=960&h=720&fit=crop&auto=format&q=80',
    },
    trustBadges: {
      type: [String],
      default: ['ISO 27001 Certified', 'GDPR Compliant', '99.9% Uptime SLA'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const HeroSection = mongoose.model('HeroSection', heroSectionSchema);
