import mongoose from 'mongoose';
import { ENV } from '../config/env.js';
import { Admin } from '../models/Admin.js';
import { SiteSettings } from '../models/SiteSettings.js';
import { HeroSection } from '../models/HeroSection.js';
import { Statistic } from '../models/Statistic.js';
import { FeaturedProject } from '../models/FeaturedProject.js';
import { Service } from '../models/Service.js';
import { Industry } from '../models/Industry.js';
import { Project } from '../models/Project.js';
import { Technology } from '../models/Technology.js';
import { Client } from '../models/Client.js';
import { Testimonial } from '../models/Testimonial.js';
import { BlogPost, BlogCategory } from '../models/BlogPost.js';
import { FAQ } from '../models/FAQ.js';
import { Job } from '../models/Job.js';
import { Lead } from '../models/Lead.js';
import { ContactSubmission } from '../models/ContactSubmission.js';
import { NewsletterSubscriber } from '../models/NewsletterSubscriber.js';
import { Navigation } from '../models/Navigation.js';

const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(ENV.MONGODB_URI);
    console.log('[Seed] Connected to database. Beginning fresh data population...');

    // 1. Seed Admin
    await Admin.deleteMany({});
    const admin = await Admin.create({
      name: ENV.ADMIN_NAME,
      email: ENV.ADMIN_EMAIL,
      password: ENV.ADMIN_PASSWORD,
      role: 'super_admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face&q=80',
    });
    console.log(`[Seed] ✅ Admin created: ${admin.email} (Password: ${ENV.ADMIN_PASSWORD})`);

    // 2. Seed Site Settings
    await SiteSettings.deleteMany({});
    await SiteSettings.create({
      companyName: 'Orqiva Tech',
      tagline: 'Transforming Businesses Through Technology',
      establishedYear: '2016',
      logo: '/orqiva_tech_logo.jpg',
      favicon: '/orqiva_tech_logo.jpg',
      email: 'orqivatech@gmail.com',
      salesEmail: 'orqivatech@gmail.com',
      supportEmail: 'orqivatech@gmail.com',
      careersEmail: 'orqivatech@gmail.com',
      phone: '+91 92512 17568',
      whatsapp: '+91 92512 17568',
      address: 'Jaipur, Rajasthan — 302001, India',
      socialLinks: {
        linkedin: 'https://linkedin.com/company/abxtech',
        twitter: 'https://twitter.com/abxtech_in',
        instagram: 'https://instagram.com/abxtech_in',
        youtube: 'https://youtube.com/@abxtech',
        facebook: '',
        github: '',
      },
      seo: {
        defaultTitle: 'Orqiva Tech | Best IT & Digital Marketing Company in Jaipur',
        defaultDescription:
          'Orqiva Tech is a leading IT and digital marketing company in Jaipur. Web development, mobile apps, ERP, SEO, and growth marketing — 500+ projects delivered.',
        defaultKeywords:
          'Orqiva Tech, IT company Jaipur, best IT company Jaipur, web development Jaipur, digital marketing Jaipur, SEO company Jaipur, mobile app development, ERP software',
        ogImage: 'https://www.orqivatech.com/orqiva_tech_logo.jpg',
      },
      footer: {
        copyrightText: '© 2026 Orqiva Tech Pvt. Ltd. All rights reserved.',
        aboutText:
          'Orqiva Tech is an award-winning global IT & digital marketing company delivering enterprise software, mobile apps, and AI solutions.',
      },
    });
    console.log('[Seed] ✅ Site Settings created');

    // 3. Seed Hero Section
    await HeroSection.deleteMany({});
    await HeroSection.create({
      badgeText: 'Award-Winning Global IT Company',
      headingLine1: 'Transform Your',
      headingLine2: 'Business With',
      typingWords: [
        'Custom Software',
        'Mobile Apps',
        'ERP Systems',
        'AI Solutions',
        'Cloud Architecture',
        'Digital Marketing',
      ],
      description:
        'Enterprise-grade software, mobile apps, ERP & AI that drive measurable growth across 10+ countries.',
      primaryCtaText: 'Get Free Quote',
      primaryCtaUrl: '/get-quote',
      secondaryCtaText: 'Book Free Demo',
      secondaryCtaUrl: '/book-demo',
      heroImage:
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=960&h=720&fit=crop&auto=format&q=80',
      trustBadges: ['ISO 27001 Certified', 'GDPR Compliant', '99.9% Uptime SLA'],
      isActive: true,
    });
    console.log('[Seed] ✅ Hero Section created');

    // 4. Seed Statistics
    await Statistic.deleteMany({});
    const statsData = [
      { label: 'Clients', value: 100, suffix: '+', icon: 'FaUsers', order: 1, isActive: true },
      { label: 'Projects', value: 500, suffix: '+', icon: 'FaCode', order: 2, isActive: true },
      { label: 'Countries', value: 10, suffix: '+', icon: 'Globe', order: 3, isActive: true },
      { label: 'Satisfaction', value: 99, suffix: '%', icon: 'Award', order: 4, isActive: true },
      { label: 'Years Experience', value: 8, suffix: '+', icon: 'Clock', order: 5, isActive: true },
      { label: 'Developers', value: 50, suffix: '+', icon: 'Users', order: 6, isActive: true },
    ];
    await Statistic.insertMany(statsData);
    console.log(`[Seed] ✅ ${statsData.length} Statistics created`);

    // 5. Seed Featured Project
    await FeaturedProject.deleteMany({});
    await FeaturedProject.create({
      name: 'ERP System for MediCare Group',
      client: 'MediCare Group',
      description: 'Complete hospital management and operations ERP suite',
      status: 'Live',
      image:
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=960&h=720&fit=crop&auto=format&q=80',
      url: '/portfolio',
      isActive: true,
    });
    console.log('[Seed] ✅ Featured Project created');

    // 6. Seed Industries (Very Important)
    await Industry.deleteMany({});
    const industriesData = [
      {
        name: 'Healthcare',
        slug: 'healthcare',
        icon: '🏥',
        projectCount: '40+',
        description: 'Hospital ERP, patient portals, telemedicine, and medical billing.',
        color: '#DC2626',
        order: 1,
        isPublished: true,
      },
      {
        name: 'Education',
        slug: 'education',
        icon: '🎓',
        projectCount: '55+',
        description: 'School ERP, LMS, e-learning apps, and student admission management.',
        color: '#2563EB',
        order: 2,
        isPublished: true,
      },
      {
        name: 'Finance & Fintech',
        slug: 'finance-and-fintech',
        icon: '💰',
        projectCount: '30+',
        description: 'Banking software, payment gateways, fraud detection, and compliance dashboards.',
        color: '#059669',
        order: 3,
        isPublished: true,
      },
      {
        name: 'Retail & E-Commerce',
        slug: 'retail-and-e-commerce',
        icon: '🛒',
        projectCount: '65+',
        description: 'Online stores, multi-vendor marketplaces, and real-time inventory systems.',
        color: '#FF6A21',
        order: 4,
        isPublished: true,
      },
      {
        name: 'Manufacturing',
        slug: 'manufacturing',
        icon: '🏭',
        projectCount: '25+',
        description: 'Production planning, QC management, supply chain, and IoT integrations.',
        color: '#7C3AED',
        order: 5,
        isPublished: true,
      },
      {
        name: 'Real Estate',
        slug: 'real-estate',
        icon: '🏠',
        projectCount: '35+',
        description: 'Property management, real estate CRM, and property listing portals.',
        color: '#0891B2',
        order: 6,
        isPublished: true,
      },
      {
        name: 'Travel & Hospitality',
        slug: 'travel-and-hospitality',
        icon: '✈️',
        projectCount: '20+',
        description: 'Hotel PMS, booking engines, and guest experience platforms.',
        color: '#D97706',
        order: 7,
        isPublished: true,
      },
      {
        name: 'Government & NGO',
        slug: 'government-and-ngo',
        icon: '🏛️',
        projectCount: '15+',
        description: 'Citizen portals, e-governance solutions, and public service platforms.',
        color: '#64748B',
        order: 8,
        isPublished: true,
      },
    ];
    await Industry.insertMany(industriesData);
    console.log(`[Seed] ✅ ${industriesData.length} Industries created`);

    // 7. Seed Services
    await Service.deleteMany({});
    const servicesData = [
      {
        title: 'Website Development',
        slug: 'website-development',
        color: '#FF6A21',
        icon: 'FaCode',
        shortDescription: 'High-performance, SEO-optimized web platforms.',
        description:
          'High-performance, SEO-optimized websites using React, Next.js, and modern frameworks that convert visitors into customers.',
        technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js'],
        features: ['Custom Web Architecture', 'Headless CMS Integration', 'SEO & Speed Optimization', 'Enterprise Security'],
        order: 1,
        isFeatured: true,
        isPublished: true,
      },
      {
        title: 'Mobile App Development',
        slug: 'mobile-app-development',
        color: '#2563EB',
        icon: 'FaMobileAlt',
        shortDescription: 'Native and cross-platform mobile apps for iOS & Android.',
        description:
          'Native and cross-platform apps for iOS and Android using Flutter and React Native with silky-smooth UX.',
        technologies: ['Flutter', 'React Native', 'Swift', 'Kotlin', 'Firebase'],
        features: ['Cross-Platform Development', 'Offline First Architecture', 'Push Notifications', 'App Store Optimization'],
        order: 2,
        isFeatured: true,
        isPublished: true,
      },
      {
        title: 'ERP & CRM Solutions',
        slug: 'erp-and-crm-solutions',
        color: '#7C3AED',
        icon: 'FaCogs',
        shortDescription: 'Custom enterprise resource planning and CRM software.',
        description:
          'End-to-end enterprise resource planning and CRM systems tailored precisely to your industry and workflow.',
        technologies: ['Node.js', 'PostgreSQL', 'Redis', 'Docker', 'React'],
        features: ['Custom Workflow Automation', 'Multi-Branch Support', 'Role-Based Access Control', 'Financial & GST Reporting'],
        order: 3,
        isFeatured: true,
        isPublished: true,
      },
      {
        title: 'AI & Machine Learning',
        slug: 'ai-and-machine-learning',
        color: '#059669',
        icon: 'FaBrain',
        shortDescription: 'Intelligent automation, NLP chatbots, and predictive models.',
        description:
          'Intelligent automation, NLP chatbots, predictive analytics, and OpenAI integrations that transform operations.',
        technologies: ['Python', 'OpenAI', 'TensorFlow', 'PyTorch', 'FastAPI'],
        features: ['Custom LLM Chatbots', 'Predictive Analytics', 'Document Processing OCR', 'Automated Recommendation Engines'],
        order: 4,
        isFeatured: true,
        isPublished: true,
      },
      {
        title: 'Cloud & DevOps',
        slug: 'cloud-and-devops',
        color: '#DC2626',
        icon: 'FaCloud',
        shortDescription: 'Scalable cloud architectures on AWS, Azure, and GCP.',
        description:
          'Scalable cloud architectures on AWS, Azure, and GCP with CI/CD pipelines and containerised deployments.',
        technologies: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'Terraform'],
        features: ['CI/CD Pipeline Automation', 'Zero-Downtime Deployments', 'Cloud Cost Optimization', '24/7 Infrastructure Monitoring'],
        order: 5,
        isFeatured: true,
        isPublished: true,
      },
      {
        title: 'Digital Marketing',
        slug: 'digital-marketing',
        color: '#D97706',
        icon: 'FaChartLine',
        shortDescription: 'Data-driven SEO, Google Ads, Meta Ads, and growth campaigns.',
        description:
          'Data-driven SEO, Google Ads, Meta Ads, WhatsApp marketing, and social campaigns that drive real ROI.',
        technologies: ['Google Analytics', 'Meta Ads', 'Search Console', 'HubSpot'],
        features: ['Technical SEO Audits', 'Performance Marketing', 'Conversion Rate Optimization', 'Social Media Branding'],
        order: 6,
        isFeatured: true,
        isPublished: true,
      },
      {
        title: 'Cyber Security',
        slug: 'cyber-security',
        color: '#0891B2',
        icon: 'FaShieldAlt',
        shortDescription: 'Security audits, penetration testing, and compliance.',
        description:
          'Security audits, penetration testing, and compliance frameworks to protect your digital assets end-to-end.',
        technologies: ['OWASP', 'Kali Linux', 'Burp Suite', 'WAF'],
        features: ['Vulnerability Assessment', 'Penetration Testing (VAPT)', 'ISO 27001 Readiness', 'Data Encryption & Access Control'],
        order: 7,
        isFeatured: true,
        isPublished: true,
      },
      {
        title: 'UI/UX & Branding',
        slug: 'ui-ux-and-branding',
        color: '#BE185D',
        icon: 'FaPaintBrush',
        shortDescription: 'Award-winning product design and brand identity systems.',
        description:
          'Award-winning product design, brand identity systems, and design languages that users genuinely love.',
        technologies: ['Figma', 'Adobe XD', 'Illustrator', 'Tailwind CSS'],
        features: ['Design Systems', 'Interactive Prototypes', 'User Research & Wireframing', 'Brand Identity Guidelines'],
        order: 8,
        isFeatured: true,
        isPublished: true,
      },
    ];
    await Service.insertMany(servicesData);
    console.log(`[Seed] ✅ ${servicesData.length} Services created`);

    // 8. Seed Technologies
    await Technology.deleteMany({});
    const techData = [
      { name: 'React', cat: 'Frontend', color: '#61DAFB', order: 1 },
      { name: 'Next.js', cat: 'Frontend', color: '#000000', order: 2 },
      { name: 'Vue.js', cat: 'Frontend', color: '#4FC08D', order: 3 },
      { name: 'TypeScript', cat: 'Frontend', color: '#3178C6', order: 4 },
      { name: 'Tailwind CSS', cat: 'Frontend', color: '#06B6D4', order: 5 },
      { name: 'Angular', cat: 'Frontend', color: '#DD0031', order: 6 },
      { name: 'Node.js', cat: 'Backend', color: '#339933', order: 7 },
      { name: 'Python', cat: 'Backend', color: '#3776AB', order: 8 },
      { name: 'Laravel', cat: 'Backend', color: '#FF2D20', order: 9 },
      { name: 'NestJS', cat: 'Backend', color: '#E0234E', order: 10 },
      { name: 'Django', cat: 'Backend', color: '#092E20', order: 11 },
      { name: 'FastAPI', cat: 'Backend', color: '#009688', order: 12 },
      { name: 'Flutter', cat: 'Mobile', color: '#02569B', order: 13 },
      { name: 'React Native', cat: 'Mobile', color: '#61DAFB', order: 14 },
      { name: 'Swift', cat: 'Mobile', color: '#F05138', order: 15 },
      { name: 'Kotlin', cat: 'Mobile', color: '#7F52FF', order: 16 },
      { name: 'AWS', cat: 'Cloud', color: '#FF9900', order: 17 },
      { name: 'Azure', cat: 'Cloud', color: '#0089D6', order: 18 },
      { name: 'Google Cloud', cat: 'Cloud', color: '#4285F4', order: 19 },
      { name: 'Firebase', cat: 'Cloud', color: '#FFCA28', order: 20 },
      { name: 'Docker', cat: 'DevOps', color: '#2496ED', order: 21 },
      { name: 'Kubernetes', cat: 'DevOps', color: '#326CE5', order: 22 },
      { name: 'PostgreSQL', cat: 'Database', color: '#4169E1', order: 23 },
      { name: 'MongoDB', cat: 'Database', color: '#47A248', order: 24 },
      { name: 'MySQL', cat: 'Database', color: '#4479A1', order: 25 },
      { name: 'Redis', cat: 'Database', color: '#DC382D', order: 26 },
      { name: 'OpenAI', cat: 'AI', color: '#10A37F', order: 27 },
      { name: 'TensorFlow', cat: 'AI', color: '#FF6F00', order: 28 },
      { name: 'PyTorch', cat: 'AI', color: '#EE4C2C', order: 29 },
      { name: 'Gemini', cat: 'AI', color: '#8E75FF', order: 30 },
    ];
    await Technology.insertMany(
      techData.map((t) => ({
        name: t.name,
        category: t.cat,
        color: t.color,
        order: t.order,
        isPublished: true,
      }))
    );
    console.log(`[Seed] ✅ ${techData.length} Technologies created`);

    // 9. Seed Projects / Portfolio
    await Project.deleteMany({});
    const projectsData = [
      {
        title: 'MediCare Pro ERP',
        slug: 'medicare-pro-erp',
        category: 'ERP',
        industry: 'Healthcare',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis'],
        image:
          'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=380&fit=crop&auto=format',
        shortDescription: 'Complete hospital management ERP suite for multi-specialty healthcare.',
        description:
          'Complete hospital management system for a 500-bed multi-specialty hospital covering OPD, IPD, pharmacy, lab, billing, and HR.',
        client: 'MediCare Group',
        results: '40% cost reduction, 98% staff adoption',
        projectUrl: 'https://medicare.example.com',
        isFeatured: true,
        isPublished: true,
        order: 1,
      },
      {
        title: 'EduGlobe LMS Platform',
        slug: 'eduglobe-lms-platform',
        category: 'Web App',
        industry: 'Education',
        technologies: ['Next.js', 'Python', 'AWS', 'PostgreSQL'],
        image:
          'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&h=380&fit=crop&auto=format',
        shortDescription: 'Multi-campus learning management system serving 15,000+ students.',
        description:
          'Multi-campus learning management system serving 15,000+ students across 8 cities with live classes, assessments, and analytics.',
        client: 'EduGlobe Academy',
        results: '15,000+ active students, 99.9% uptime',
        projectUrl: 'https://eduglobe.example.com',
        isFeatured: true,
        isPublished: true,
        order: 2,
      },
      {
        title: 'ShopNest E-Commerce',
        slug: 'shopnest-e-commerce',
        category: 'E-Commerce',
        industry: 'Retail & E-Commerce',
        technologies: ['React', 'Laravel', 'MySQL', 'Razorpay'],
        image:
          'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=380&fit=crop&auto=format',
        shortDescription: 'Full-featured online marketplace with multi-vendor support.',
        description:
          'Full-featured online marketplace with multi-vendor support, real-time inventory, GST billing, and WhatsApp order tracking.',
        client: 'ShopNest Retail',
        results: '₹2 Cr+ monthly GMV, 3.2× conversion lift',
        projectUrl: 'https://shopnest.example.com',
        isFeatured: true,
        isPublished: true,
        order: 3,
      },
      {
        title: 'FinTrack Analytics Dashboard',
        slug: 'fintrack-analytics-dashboard',
        category: 'Web App',
        industry: 'Finance & Fintech',
        technologies: ['Vue.js', 'FastAPI', 'Redis', 'ClickHouse'],
        image:
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=380&fit=crop&auto=format',
        shortDescription: 'Real-time financial analytics platform with AI fraud detection.',
        description:
          'Real-time financial analytics platform handling 5M+ daily transactions with AI-powered fraud detection and executive dashboards.',
        client: 'FinEdge Capital',
        results: '82% fraud detection rate, <10ms response',
        projectUrl: 'https://fintrack.example.com',
        isFeatured: true,
        isPublished: true,
        order: 4,
      },
      {
        title: 'Prestige Hotel PMS',
        slug: 'prestige-hotel-pms',
        category: 'ERP',
        industry: 'Travel & Hospitality',
        technologies: ['React Native', 'Node.js', 'MongoDB', 'Socket.io'],
        image:
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=380&fit=crop&auto=format',
        shortDescription: 'Property management system deployed across 50+ hotel properties.',
        description:
          'Property management system deployed across 50+ Prestige Group hotel properties with channel manager, POS, and guest app.',
        client: 'Prestige Hotels & Resorts',
        results: '50+ properties, 35% RevPAR improvement',
        projectUrl: 'https://prestige.example.com',
        isFeatured: true,
        isPublished: true,
        order: 5,
      },
      {
        title: 'AgriTrack Farmer App',
        slug: 'agritrack-farmer-app',
        category: 'Mobile App',
        industry: 'Manufacturing',
        technologies: ['Flutter', 'Firebase', 'TensorFlow Lite', 'AWS'],
        image:
          'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&h=380&fit=crop&auto=format',
        shortDescription: 'AI-powered smart farming app for crop management and disease detection.',
        description:
          'AI-powered smart farming app for crop management, disease detection via camera, market prices, and government scheme notifications.',
        client: 'AgriNext Foundation',
        results: '50,000+ farmers, 4.8★ rating, 6 state partnerships',
        projectUrl: 'https://agritrack.example.com',
        isFeatured: true,
        isPublished: true,
        order: 6,
      },
    ];
    await Project.insertMany(projectsData);
    console.log(`[Seed] ✅ ${projectsData.length} Projects created`);

    // 10. Seed Clients
    await Client.deleteMany({});
    const clientsData = [
      { companyName: 'MediCare Group', industry: 'Healthcare', isFeatured: true, order: 1 },
      { companyName: 'EduGlobe Academy', industry: 'Education', isFeatured: true, order: 2 },
      { companyName: 'ShopNest Retail', industry: 'Retail', isFeatured: true, order: 3 },
      { companyName: 'FinEdge Capital', industry: 'Finance', isFeatured: true, order: 4 },
      { companyName: 'Prestige Hotels', industry: 'Hospitality', isFeatured: true, order: 5 },
      { companyName: 'AgriNext Foundation', industry: 'Agriculture', isFeatured: true, order: 6 },
    ];
    await Client.insertMany(clientsData);
    console.log(`[Seed] ✅ ${clientsData.length} Clients created`);

    // 11. Seed Testimonials
    await Testimonial.deleteMany({});
    const testimonialsData = [
      {
        clientName: 'Dr. Rajesh Mehta',
        designation: 'CEO',
        company: 'MediCare Group',
        testimonial:
          'Orqiva Tech transformed our entire hospital operations. The ERP system they delivered has cut manual work by 70%. The team is incredibly professional and always available.',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&h=120&fit=crop&crop=face&q=80',
        isFeatured: true,
        isPublished: true,
        order: 1,
      },
      {
        clientName: 'Sarah Johnson',
        designation: 'CTO',
        company: 'EduGlobe International',
        testimonial:
          'The school ERP delivered by ORQIVA Tech exceeded all expectations — it handles 15,000+ students across 8 campuses flawlessly. Their support team is available 24/7.',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=face&q=80',
        isFeatured: true,
        isPublished: true,
        order: 2,
      },
      {
        clientName: 'Arjun Kapoor',
        designation: 'Founder',
        company: 'ShopNest Retail',
        testimonial:
          'Our e-commerce platform built by ORQIVA Tech now generates ₹2 Cr+ monthly revenue. The performance and UI/UX work is exceptional. Absolutely worth every rupee invested.',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face&q=80',
        isFeatured: true,
        isPublished: true,
        order: 3,
      },
      {
        clientName: 'Priya Sharma',
        designation: 'MD',
        company: 'Prestige Hotels',
        testimonial:
          'ORQIVA Tech delivered our hotel management system in record time. The property management, booking engine, and analytics dashboard are exactly what we needed to scale.',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&h=120&fit=crop&crop=face&q=80',
        isFeatured: true,
        isPublished: true,
        order: 4,
      },
      {
        clientName: 'David Chen',
        designation: 'VP Technology',
        company: 'FinTrack Analytics',
        testimonial:
          'The fintech dashboard handles millions of transactions daily with zero downtime. Their DevOps expertise and cloud architecture are truly enterprise-grade.',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face&q=80',
        isFeatured: true,
        isPublished: true,
        order: 5,
      },
      {
        clientName: 'Deepa Nair',
        designation: 'Managing Director',
        company: 'FinEdge Capital',
        testimonial:
          'Their team went above and beyond at every step. The fintech platform is rock-solid, secure, and handles millions of transactions flawlessly. Absolute world-class quality.',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1614786269829-d24616faf56d?w=120&h=120&fit=crop&crop=face&q=80',
        isFeatured: true,
        isPublished: true,
        order: 6,
      },
    ];
    await Testimonial.insertMany(testimonialsData);
    console.log(`[Seed] ✅ ${testimonialsData.length} Testimonials created`);

    // 12. Seed Blog Categories & Posts
    await BlogCategory.deleteMany({});
    await BlogPost.deleteMany({});
    const blogCategories = [
      { name: 'AI & Technology', description: 'Artificial intelligence and modern tech' },
      { name: 'DevOps', description: 'Cloud infrastructure, CI/CD, and containers' },
      { name: 'Mobile Development', description: 'iOS, Android, React Native, and Flutter' },
      { name: 'Fintech & Compliance', description: 'Financial software and compliance' },
      { name: 'Business Strategy', description: 'Digital transformation guides' },
      { name: 'Cybersecurity', description: 'Data protection and security standards' },
    ];
    await BlogCategory.insertMany(blogCategories);

    const blogPostsData = [
      {
        title: 'How AI is Revolutionizing Enterprise ERP Systems in 2025',
        slug: 'how-ai-is-revolutionizing-enterprise-erp-systems-in-2025',
        category: 'AI & Technology',
        author: 'Aryan Verma',
        readingTime: '8 min',
        featuredImage:
          'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&h=380&fit=crop&auto=format',
        excerpt:
          'Artificial intelligence is fundamentally changing how enterprise ERPs work — from predictive analytics to natural language queries.',
        content: `Artificial intelligence is fundamentally changing how enterprise ERPs work. From predictive inventory management to automated financial reconciliation, modern businesses are adopting AI-driven workflows.\n\nKey advancements include:\n1. Real-time anomaly detection\n2. Natural language query assistants\n3. Automated supply chain routing\n4. Predictive maintenance schedules`,
        tags: ['AI', 'ERP', 'Enterprise', 'Digital Transformation'],
        status: 'Published',
        publishedAt: new Date('2025-01-15'),
      },
      {
        title: 'Building Scalable Microservices with Docker & Kubernetes on AWS',
        slug: 'building-scalable-microservices-with-docker-and-kubernetes-on-aws',
        category: 'DevOps',
        author: 'Pooja Nair',
        readingTime: '12 min',
        featuredImage:
          'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=380&fit=crop&auto=format',
        excerpt:
          'A step-by-step guide to containerising your Node.js/Python microservices and orchestrating them on EKS with real-world examples.',
        content: `A step-by-step guide to containerising your Node.js/Python microservices and orchestrating them on EKS — with real-world Orqiva Tech project examples.\n\nMicroservices architecture provides unparalleled agility and modularity when configured with proper service meshes and auto-scaling groups.`,
        tags: ['Docker', 'Kubernetes', 'AWS', 'Microservices'],
        status: 'Published',
        publishedAt: new Date('2025-01-08'),
      },
      {
        title: 'React Native vs Flutter in 2025: The Definitive Comparison for Indian Startups',
        slug: 'react-native-vs-flutter-in-2025-the-definitive-comparison-for-indian-startups',
        category: 'Mobile Development',
        author: 'Ravi Kumar',
        readingTime: '10 min',
        featuredImage:
          'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=380&fit=crop&auto=format',
        excerpt:
          'Both frameworks are mature in 2025 — but which is right for your business? We compare performance, ecosystem, cost, and hiring.',
        content: `Both frameworks are mature in 2025 — but which is right for your business? We compare performance, ecosystem, cost, and hiring in the Indian context.\n\nFlutter excels in pixel-perfect uniform UI across platforms, while React Native offers deeper native code bridge integrations.`,
        tags: ['Flutter', 'React Native', 'Mobile', 'Startups'],
        status: 'Published',
        publishedAt: new Date('2025-01-02'),
      },
      {
        title: 'GST-Compliant Billing System: What Your Software Must Include',
        slug: 'gst-compliant-billing-system-what-your-software-must-include',
        category: 'Fintech & Compliance',
        author: 'Meena Iyer',
        readingTime: '7 min',
        featuredImage:
          'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=380&fit=crop&auto=format',
        excerpt:
          'From e-invoicing mandates to GSTR-1 reconciliation — the complete checklist for building a GST-ready billing module in 2025.',
        content: `From e-invoicing mandates to GSTR-1 reconciliation — the complete checklist for building a GST-ready billing and accounting module in 2025.\n\nEnsure automated IRN generation, QR code embedding on B2B tax invoices, and real-time ledger synchronization.`,
        tags: ['GST', 'Billing', 'Compliance', 'India'],
        status: 'Published',
        publishedAt: new Date('2024-12-28'),
      },
      {
        title: 'Digital Transformation Roadmap for Indian SMEs: A Practical Guide',
        slug: 'digital-transformation-roadmap-for-indian-smes-a-practical-guide',
        category: 'Business Strategy',
        author: 'Rahul Sharma',
        readingTime: '9 min',
        featuredImage:
          'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=380&fit=crop&auto=format',
        excerpt:
          "Most SMEs know they need to digitise but don't know where to start. Here's our proven 5-phase roadmap that has helped 100+ businesses.",
        content: `Most SMEs know they need to digitise but don't know where to start. Here's our proven 5-phase roadmap that has helped 100+ Indian businesses transform successfully.`,
        tags: ['Digital Transformation', 'SME', 'Strategy', 'India'],
        status: 'Published',
        publishedAt: new Date('2024-12-20'),
      },
      {
        title: 'Cybersecurity Checklist for Indian Fintech Companies: RBI & SEBI Guidelines',
        slug: 'cybersecurity-checklist-for-indian-fintech-companies-rbi-and-sebi-guidelines',
        category: 'Cybersecurity',
        author: 'Suresh Bhat',
        readingTime: '11 min',
        featuredImage:
          'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&h=380&fit=crop&auto=format',
        excerpt:
          "RBI's cybersecurity framework and SEBI's CSCRF mandate are reshaping security requirements for Indian fintechs.",
        content: `RBI's cybersecurity framework and SEBI's CSCRF mandate are reshaping security requirements for Indian fintechs. Here's your practical implementation checklist including tokenization and zero-trust perimeter defenses.`,
        tags: ['Cybersecurity', 'Fintech', 'RBI', 'Compliance'],
        status: 'Published',
        publishedAt: new Date('2024-12-12'),
      },
    ];
    await BlogPost.insertMany(blogPostsData);
    console.log(`[Seed] ✅ ${blogPostsData.length} Blog Posts created`);

    // 13. Seed FAQs
    await FAQ.deleteMany({});
    const faqsData = [
      {
        question: 'What services does Orqiva Tech offer?',
        answer:
          'Orqiva Tech offers end-to-end IT services including custom software development, mobile app development, ERP/CRM systems, AI & machine learning, cloud & DevOps, digital marketing, cybersecurity, and UI/UX design.',
        category: 'General Questions',
        order: 1,
        isPublished: true,
      },
      {
        question: 'How many years of experience does Orqiva Tech have?',
        answer:
          'Orqiva Tech was founded in 2016 and has 8+ years of experience delivering over 500 projects across 10+ countries with a team of 50+ expert developers.',
        category: 'General Questions',
        order: 2,
        isPublished: true,
      },
      {
        question: 'Do you work with startups as well as enterprises?',
        answer:
          'Absolutely. We work with the full spectrum — from early-stage startups building their first MVP to large enterprises undergoing digital transformation.',
        category: 'General Questions',
        order: 3,
        isPublished: true,
      },
      {
        question: 'What is your development methodology?',
        answer:
          'We follow Agile/Scrum methodology with 2-week sprint cycles. You receive working software every two weeks with full visibility through Jira and weekly demo sessions.',
        category: 'Development Process',
        order: 4,
        isPublished: true,
      },
      {
        question: 'Do you sign an NDA before sharing project details?',
        answer:
          'Yes, absolutely. We sign a mutual Non-Disclosure Agreement (NDA) before any detailed project discussion begins to protect your business ideas and proprietary data.',
        category: 'Development Process',
        order: 5,
        isPublished: true,
      },
      {
        question: 'Do you offer post-launch support and maintenance?',
        answer:
          'Yes. Every project includes a 90-day warranty with bug fixes at no charge. We also provide flexible Annual Maintenance Contracts (AMC) and 24/7 SLA-backed support.',
        category: 'Support & Maintenance',
        order: 6,
        isPublished: true,
      },
      {
        question: 'Who owns the source code after project completion?',
        answer:
          'Upon receipt of full payment, the Client owns 100% of all custom source code, designs, and creative assets developed specifically for the project.',
        category: 'Legal & Compliance',
        order: 7,
        isPublished: true,
      },
    ];
    await FAQ.insertMany(faqsData);
    console.log(`[Seed] ✅ ${faqsData.length} FAQs created`);

    // 14. Seed Careers / Jobs
    await Job.deleteMany({});
    const jobsData = [
      {
        title: 'Senior React Developer',
        department: 'Engineering',
        location: 'Remote / Jaipur / Mumbai',
        employmentType: 'Full-time',
        experience: '4–6 Years',
        salary: '₹12,00,000 – ₹18,00,000 / annum',
        description: 'Seeking an experienced React developer to build enterprise-grade SaaS web applications.',
        requirements: ['4+ years in React, Next.js, and TypeScript', 'Deep understanding of state management (Redux/Zustand)', 'Experience with REST & GraphQL APIs'],
        responsibilities: ['Architect reusable frontend components', 'Collaborate with UI/UX designers and backend team', 'Optimize performance and SEO'],
        applicationEmail: 'careers@orqivatech.com',
        isPublished: true,
      },
      {
        title: 'Flutter Developer',
        department: 'Mobile',
        location: 'Bangalore / Remote',
        employmentType: 'Full-time',
        experience: '2–4 Years',
        salary: '₹8,00,000 – ₹14,00,000 / annum',
        description: 'Build silky smooth iOS and Android mobile apps using Flutter and Dart.',
        requirements: ['2+ years Flutter/Dart experience', 'State management with BLoC/Provider', 'Experience publishing apps on App Store & Google Play'],
        responsibilities: ['Develop clean cross-platform mobile apps', 'Integrate third-party APIs and native modules', 'Maintain high test coverage'],
        applicationEmail: 'careers@orqivatech.com',
        isPublished: true,
      },
      {
        title: 'AI/ML Engineer',
        department: 'AI Lab',
        location: 'Remote',
        employmentType: 'Full-time',
        experience: '3–5 Years',
        salary: '₹14,00,000 – ₹22,00,000 / annum',
        description: 'Design and deploy custom machine learning models and generative AI assistants.',
        requirements: ['Python, PyTorch, TensorFlow', 'Experience fine-tuning LLMs and embeddings', 'FastAPI & Docker deployment'],
        responsibilities: ['Build enterprise RAG pipelines', 'Train custom vision and NLP models', 'Deploy scalable ML microservices'],
        applicationEmail: 'careers@orqivatech.com',
        isPublished: true,
      },
      {
        title: 'DevOps Engineer',
        department: 'Infrastructure',
        location: 'Hybrid / Jaipur',
        employmentType: 'Full-time',
        experience: '3–5 Years',
        salary: '₹10,00,000 – ₹16,00,000 / annum',
        description: 'Manage AWS infrastructure, Kubernetes clusters, and automated CI/CD pipelines.',
        requirements: ['AWS Certified Solutions Architect', 'Docker, Kubernetes, Helm', 'Terraform and GitHub Actions CI/CD'],
        responsibilities: ['Maintain 99.9% uptime across production clusters', 'Automate deployment pipelines', 'Implement security monitoring'],
        applicationEmail: 'careers@orqivatech.com',
        isPublished: true,
      },
    ];
    await Job.insertMany(jobsData);
    console.log(`[Seed] ✅ ${jobsData.length} Jobs created`);

    // 15. Seed Navigation
    await Navigation.deleteMany({});
    const navData = [
      { label: 'Home', url: '/', order: 1, isPublished: true },
      { label: 'About', url: '/about', order: 2, isPublished: true },
      { label: 'Services', url: '/services', order: 3, isPublished: true },
      { label: 'Industries', url: '/industries', order: 4, isPublished: true },
      { label: 'Technologies', url: '/technologies', order: 5, isPublished: true },
      { label: 'Portfolio', url: '/portfolio', order: 6, isPublished: true },
      { label: 'Blog', url: '/blog', order: 7, isPublished: true },
      { label: 'Careers', url: '/careers', order: 8, isPublished: true },
      { label: 'Pricing', url: '/pricing', order: 9, isPublished: true },
      { label: 'Contact', url: '/contact', order: 10, isPublished: true },
    ];
    await Navigation.insertMany(navData);
    console.log(`[Seed] ✅ ${navData.length} Navigation items created`);

    // 16. Seed Initial Sample Leads & Inquiries
    await Lead.deleteMany({});
    const initialLeads = [
      {
        name: 'Vikas Sharma',
        email: 'vikas.sharma@healthcorp.in',
        phone: '+91 98290 11223',
        company: 'HealthCorp Diagnostics',
        service: 'ERP & CRM Solutions',
        budget: '₹5,00,000 – ₹10,00,000',
        message: 'We require an end-to-end diagnostic center ERP with barcode specimen tracking.',
        source: 'Quote',
        status: 'New',
      },
      {
        name: 'Anjali Verma',
        email: 'anjali@edusmart.org',
        phone: '+91 98111 22334',
        company: 'EduSmart Group',
        service: 'Website Development',
        budget: '₹2,50,000 – ₹5,00,000',
        message: 'Looking to build a modern LMS and admission portal for our 3 institutions.',
        source: 'Demo',
        status: 'Contacted',
      },
    ];
    await Lead.insertMany(initialLeads);

    await ContactSubmission.deleteMany({});
    await ContactSubmission.create({
      name: 'Rohan Gupta',
      email: 'rohan.gupta@fintechindia.com',
      phone: '+91 98765 43210',
      subject: 'Inquiry regarding AI analytics dashboard integration',
      message: 'Hello team, we are evaluating AI analytics partners for our payment gateway dashboard.',
      status: 'Unread',
    });

    await NewsletterSubscriber.deleteMany({});
    await NewsletterSubscriber.create({
      email: 'techlead@enterprise.in',
      status: 'Subscribed',
    });

    console.log('[Seed] ✅ Sample Leads & Inquiries created');
    console.log('\n======================================================');
    console.log('  🎉 DATABASE SEEDED SUCCESSFULLY WITH ORQIVA TECH DATA');
    console.log('======================================================\n');
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error] Failed to seed database: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
