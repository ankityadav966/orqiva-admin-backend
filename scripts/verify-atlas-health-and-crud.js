import http from 'http';

const BASE_URL = 'http://localhost:5000';

function request(method, path, headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, data: parsed, raw: data });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, raw: data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runVerification() {
  console.log('======================================================');
  console.log('  🔍 ORQIVA ADMIN — SYSTEM VERIFICATION SUITE');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Health Check
  console.log('[1/4] Checking Health Endpoints...');
  try {
    const healthV1 = await request('GET', '/api/v1/health');
    assert(healthV1.status === 200 && healthV1.data?.database === 'connected', 'GET /api/v1/health returns connected database');

    const healthRoot = await request('GET', '/api/health');
    assert(healthRoot.status === 200 && healthRoot.data?.status === 'healthy', 'GET /api/health returns healthy');
  } catch (err) {
    assert(false, `Health check error: ${err.message}`);
  }

  // 2. Admin Authentication
  console.log('\n[2/4] Testing Admin Authentication...');
  let token = null;
  try {
    const loginRes = await request('POST', '/api/v1/auth/login', {}, {
      email: 'admin@orqivatech.com',
      password: 'Admin@Orqiva2026!'
    });
    assert(loginRes.status === 200 && loginRes.data?.success, 'Admin login with valid credentials succeeded');
    token = loginRes.data?.data?.token;
    assert(!!token, 'JWT Token generated and returned in login response');

    // Test Protected Me
    if (token) {
      const meRes = await request('GET', '/api/v1/auth/me', { Authorization: `Bearer ${token}` });
      assert(meRes.status === 200 && meRes.data?.data?.email === 'admin@orqivatech.com', 'Protected GET /api/v1/auth/me returns admin profile');
    }
  } catch (err) {
    assert(false, `Auth error: ${err.message}`);
  }

  // 3. Admin Module Endpoints (Protected)
  console.log('\n[3/4] Testing Admin CRUD Modules with Atlas...');
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  const modules = [
    { name: 'Dashboard Stats', path: '/api/v1/dashboard/stats' },
    { name: 'Services', path: '/api/v1/services' },
    { name: 'Industries', path: '/api/v1/industries' },
    { name: 'Projects', path: '/api/v1/projects' },
    { name: 'Technologies', path: '/api/v1/technologies' },
    { name: 'Clients', path: '/api/v1/clients' },
    { name: 'Testimonials', path: '/api/v1/testimonials' },
    { name: 'Blog Posts', path: '/api/v1/blogs' },
    { name: 'Blog Categories', path: '/api/v1/blogs/categories' },
    { name: 'FAQs', path: '/api/v1/faqs' },
    { name: 'Careers / Jobs', path: '/api/v1/careers' },
    { name: 'Leads', path: '/api/v1/leads' },
    { name: 'Contacts', path: '/api/v1/contact' },
    { name: 'Newsletters', path: '/api/v1/newsletter' },
    { name: 'Media', path: '/api/v1/media' },
    { name: 'Site Settings', path: '/api/v1/settings' },
    { name: 'Hero Section', path: '/api/v1/hero' },
    { name: 'Statistics', path: '/api/v1/stats' },
    { name: 'Navigation', path: '/api/v1/navigation' },
  ];

  for (const mod of modules) {
    try {
      const res = await request('GET', mod.path, authHeader);
      assert(res.status === 200 && (res.data?.success !== false), `GET ${mod.path.padEnd(26)} -> Status: ${res.status}`);
    } catch (err) {
      assert(false, `GET ${mod.path} failed: ${err.message}`);
    }
  }

  // 4. Public API & End-to-End Flow Verification
  console.log('\n[4/4] Testing Public APIs & End-to-End Data Flow...');
  try {
    const publicIndustries = await request('GET', '/api/v1/public/industries');
    assert(publicIndustries.status === 200 && Array.isArray(publicIndustries.data?.data) && publicIndustries.data.data.length >= 8, `GET /api/v1/public/industries returned ${publicIndustries.data?.data?.length} public industries`);

    const publicServices = await request('GET', '/api/v1/public/services');
    assert(publicServices.status === 200 && Array.isArray(publicServices.data?.data), `GET /api/v1/public/services returned ${publicServices.data?.data?.length} public services`);

    const publicHome = await request('GET', '/api/v1/public/homepage');
    assert(publicHome.status === 200 && publicHome.data?.data?.hero, 'GET /api/v1/public/homepage returned full aggregated data payload');

    // Industry Update Flow Test:
    // 1. Get an industry (e.g. Healthcare)
    const indRes = await request('GET', '/api/v1/industries', authHeader);
    const healthcare = indRes.data?.data?.find(i => i.slug === 'healthcare' || i.name.toLowerCase() === 'healthcare') || indRes.data?.data?.[0];
    if (healthcare) {
      const originalCount = healthcare.projectCount;
      const testCount = originalCount === '40+' ? '45+' : '40+';

      // 2. Update via Admin API
      const updateRes = await request('PUT', `/api/v1/industries/${healthcare._id}`, authHeader, {
        projectCount: testCount
      });
      assert(updateRes.status === 200 && updateRes.data?.data?.projectCount === testCount, `Admin updated Healthcare projectCount to "${testCount}" in Atlas`);

      // 3. Verify Public API immediately returns updated count
      const verifyPub = await request('GET', '/api/v1/public/industries');
      const updatedHealthcare = verifyPub.data?.data?.find(i => i._id === healthcare._id);
      assert(updatedHealthcare?.projectCount === testCount, `Public API immediately reflected updated projectCount "${testCount}" from Atlas`);

      // 4. Revert back to original
      await request('PUT', `/api/v1/industries/${healthcare._id}`, authHeader, {
        projectCount: originalCount
      });
      console.log(`  ✓ Reverted Healthcare projectCount back to "${originalCount}"`);
    }
  } catch (err) {
    assert(false, `Public flow error: ${err.message}`);
  }

  console.log('\n======================================================');
  console.log(`  VERIFICATION RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runVerification().catch(console.error);
