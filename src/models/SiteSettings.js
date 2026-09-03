import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      default: 'Orqiva Tech',
    },
    tagline: {
      type: String,
      default: 'Transforming Businesses Through Technology',
    },
    establishedYear: {
      type: String,
      default: '2016',
    },
    logo: {
      type: String,
      default: '/orqiva_tech_logo.jpg',
    },
    favicon: {
      type: String,
      default: '/orqiva_tech_logo.jpg',
    },
    email: {
      type: String,
      default: 'orqivatech@gmail.com',
    },
    salesEmail: {
      type: String,
      default: 'orqivatech@gmail.com',
    },
    supportEmail: {
      type: String,
      default: 'orqivatech@gmail.com',
    },
    careersEmail: {
      type: String,
      default: 'orqivatech@gmail.com',
    },
    phone: {
      type: String,
      default: '+91 92512 17568',
    },
    whatsapp: {
      type: String,
      default: '+91 92512 17568',
    },
    googleMeetLink: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: 'Jaipur, Rajasthan — 302001, India',
    },
    socialLinks: {
      linkedin: { type: String, default: 'https://linkedin.com/company/abxtech' },
      twitter: { type: String, default: 'https://twitter.com/abxtech_in' },
      instagram: { type: String, default: 'https://instagram.com/abxtech_in' },
      youtube: { type: String, default: 'https://youtube.com/@abxtech' },
      facebook: { type: String, default: '' },
      github: { type: String, default: '' },
    },
    seo: {
      defaultTitle: {
        type: String,
        default: 'Orqiva Tech | Best IT & Digital Marketing Company in Jaipur',
      },
      defaultDescription: {
        type: String,
        default: 'Orqiva Tech is a leading IT and digital marketing company in Jaipur. Web development, mobile apps, ERP, SEO, and growth marketing — 500+ projects delivered.',
      },
      defaultKeywords: {
        type: String,
        default: 'Orqiva Tech, IT company Jaipur, best IT company Jaipur, web development Jaipur, digital marketing Jaipur, SEO company Jaipur, mobile app development, ERP software',
      },
      ogImage: {
        type: String,
        default: 'https://www.orqivatech.com/orqiva_tech_logo.jpg',
      },
    },
    footer: {
      copyrightText: {
        type: String,
        default: '© 2026 Orqiva Tech Pvt. Ltd. All rights reserved.',
      },
      aboutText: {
        type: String,
        default: 'Orqiva Tech is an award-winning global IT & digital marketing company delivering enterprise software, mobile apps, and AI solutions.',
      },
    },
  },
  { timestamps: true }
);

export const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
