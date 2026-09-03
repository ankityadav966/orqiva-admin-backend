# ORQIVA Tech — Admin Backend & Website CMS REST API

Enterprise REST API backend for managing dynamic content, leads, media, and site settings for the ORQIVA Tech platform.

---

## 🛠️ Technology Stack
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js 4.x
- **Database:** MongoDB & Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens) & bcryptjs (Salt factor 12)
- **Security:** Helmet, CORS, Express-Rate-Limit
- **Validation:** Express-Validator
- **File Uploads:** Multer with configurable local / Cloudinary storage
- **Logging:** Morgan

---

## 📁 Directory Structure
```
orqiva-admin-backend/
├── src/
│   ├── config/          # Database and Environment configs
│   ├── constants/       # Global system constants and enums
│   ├── controllers/     # Modular business logic controllers
│   ├── middlewares/     # Auth, error, rate-limiter, upload middlewares
│   ├── models/          # 20 Mongoose Data Models with indexes
│   ├── routes/          # RESTful route definitions & routers
│   ├── uploads/         # Local uploaded media storage
│   ├── utils/           # Response formatter, asyncHandler, Seed script
│   ├── validators/      # Request validation rules
│   ├── app.js           # Express app setup and middleware chain
│   └── server.js        # Server bootstrap and graceful shutdown
├── .env.example         # Template environment variables
├── package.json
└── README.md
```

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://localhost:27017` or a MongoDB Atlas URI

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Default `.env` configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/orqiva_admin
JWT_SECRET=orqiva_super_secure_jwt_secret_key_2026_x89f
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
ADMIN_EMAIL=admin@orqivatech.com
ADMIN_PASSWORD=Admin@Orqiva2026!
ADMIN_NAME=ORQIVA Administrator
```

### 4. Seed Initial Real Website Data
Seed all services, industries, projects, stats, blogs, testimonials, FAQs, and default admin credentials:
```bash
npm run seed
```

**Default Admin Credentials:**
- **Email:** `admin@orqivatech.com`
- **Password:** `Admin@Orqiva2026!`

### 5. Start the Development Server
```bash
npm run dev
```
The server will start on `http://localhost:5000`.

---

## 📡 API Endpoints Overview

### Authentication (`/api/v1/auth`)
- `POST /login` — Authenticate admin & receive JWT
- `POST /logout` — Invalidate session
- `GET /me` — Get current administrator profile
- `PUT /profile` — Update administrator details
- `PUT /change-password` — Change password

### Dashboard Metrics (`/api/v1/dashboard`)
- `GET /stats` — Total counts, lead pipelines, category distributions, recent leads

### Content Management (Admin Protected: `Bearer <token>`)
- `/api/v1/services` — CRUD for website services
- `/api/v1/industries` — CRUD for industry domains (Healthcare 40+, Education 55+, etc.)
- `/api/v1/projects` — CRUD for portfolio & case studies
- `/api/v1/technologies` — CRUD for tech stacks by category
- `/api/v1/clients` — CRUD for client roster & logos
- `/api/v1/testimonials` — CRUD for client reviews
- `/api/v1/blog` — CRUD for blog posts and categories
- `/api/v1/faqs` — CRUD for frequently asked questions
- `/api/v1/careers` — CRUD for job vacancies and candidate applications
- `/api/v1/leads` — View, filter, update status, add notes, and export CSV for quotes/demos
- `/api/v1/contact` — View and manage website contact inquiries
- `/api/v1/newsletter` — View subscribers and export CSV
- `/api/v1/hero` — Update homepage hero banner, badge text, and copy
- `/api/v1/statistics` — CRUD for homepage counter statistics
- `/api/v1/featured-project` — Manage "Currently Building" project
- `/api/v1/settings` — Global company info, SEO defaults, and footer
- `/api/v1/navigation` — Manage website navigation links
- `/api/v1/media` — Upload images/documents, list media library, delete files

### Public Endpoints (`/api/v1/public/*`)
Unauthenticated endpoints for consumption by public websites (only returns `isPublished: true` content):
- `GET /api/v1/public/home`
- `GET /api/v1/public/services`
- `GET /api/v1/public/industries`
- `GET /api/v1/public/projects`
- `GET /api/v1/public/technologies`
- `GET /api/v1/public/testimonials`
- `GET /api/v1/public/blog`
- `GET /api/v1/public/faqs`
- `GET /api/v1/public/jobs`
- `GET /api/v1/public/settings`
- `POST /api/v1/public/leads` (Quote, Demo, Consultation requests)
- `POST /api/v1/public/contact` (Contact Form submissions)
- `POST /api/v1/public/newsletter` (Newsletter subscriptions)
- `POST /api/v1/public/jobs/apply` (Job applications)
