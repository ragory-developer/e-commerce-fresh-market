import { BuilderController } from '../src/modules/builder/controller';
import prisma from '../src/config/database';
import { AuthRequest } from '../src/middleware/auth';
import { Response } from 'express';

const controller = new BuilderController();

// Simple mock HTTP context creator
function createMockHttp() {
  let resolve: (value: { code: number; json: any; error: any }) => void;
  const statusPromise = new Promise<{ code: number; json: any; error: any }>((r) => {
    resolve = r;
  });

  let statusCode = 200;
  const res: Partial<Response> = {
    status: (code: number) => {
      statusCode = code;
      return res as Response;
    },
    json: (data: any) => {
      resolve({ code: statusCode, json: data, error: null });
      return res as Response;
    }
  };

  const next = (err?: any) => {
    resolve({ code: err?.status || 500, json: null, error: err });
  };

  return { res: res as Response, statusPromise, next };
}

async function runTests() {
  console.log('🧪 Starting Phase 2 Integration Tests...');

  // Find administrative user to use as author
  const admin = await prisma.user.findFirst({
    where: { role: 'SUPER_ADMIN' },
  });

  if (!admin) {
    throw new Error('No SUPER_ADMIN user found in DB. Run seed first.');
  }

  let testTemplateId: string = '';

  // Clean up any stray data from previous failed runs to ensure idempotency
  await prisma.builderPageVersion.deleteMany({
    where: { page: { key: 'test-page' } }
  });
  await prisma.builderPage.deleteMany({
    where: { key: 'test-page' }
  });
  await prisma.builderTemplate.deleteMany({
    where: { key: 'custom-promo-home' }
  });

  // 1. Test POST /api/builder/templates (Create a custom page template)
  {
    console.log('1. Testing createTemplate...');
    const req = {
      user: { userId: admin.id, role: admin.role },
      body: {
        key: 'custom-promo-home',
        name: 'Custom Promotional Home',
        scope: 'page',
        pageType: 'home',
        themeKey: null,
        document: {
          schemaVersion: 1,
          page: {
            key: 'home',
            slug: '/',
            title: 'Custom Home'
          },
          sections: [
            {
              id: 'hero_test',
              type: 'HeroBanner',
              variant: 'eid',
              props: { title: 'Test Title' }
            }
          ]
        }
      }
    } as unknown as AuthRequest;

    const { res, statusPromise, next } = createMockHttp();
    await controller.createTemplate(req, res, next);
    const result = await statusPromise;

    if (result.code !== 201 || !result.json.success) {
      console.error('Failed to create template:', result.error || result.json);
      process.exit(1);
    }
    console.log('✅ createTemplate successful. Key:', result.json.data.key);
    testTemplateId = result.json.data.id;
  }

  // 2. Test GET /api/builder/templates (List templates with filter)
  {
    console.log('2. Testing getTemplates (with filters)...');
    const req = {
      query: { scope: 'page', pageType: 'home' }
    } as unknown as AuthRequest;

    const { res, statusPromise, next } = createMockHttp();
    await controller.getTemplates(req, res, next);
    const result = await statusPromise;

    if (result.code !== 200 || !result.json.success) {
      console.error('Failed to get templates:', result.error || result.json);
      process.exit(1);
    }

    const keys = result.json.data.map((t: any) => t.key);
    console.log('Found templates:', keys);
    if (!keys.includes('custom-promo-home') || !keys.includes('default-home')) {
      console.error('Expected templates missing from result');
      process.exit(1);
    }
    console.log('✅ getTemplates query filtering verified.');
  }

  // 3. Test GET /api/builder/templates/:id
  {
    console.log('3. Testing getTemplateById...');
    const req = {
      params: { id: testTemplateId }
    } as unknown as AuthRequest;

    const { res, statusPromise, next } = createMockHttp();
    await controller.getTemplateById(req, res, next);
    const result = await statusPromise;

    if (result.code !== 200 || !result.json.success || result.json.data.id !== testTemplateId) {
      console.error('Failed to retrieve template by ID:', result.error || result.json);
      process.exit(1);
    }
    console.log('✅ getTemplateById verified.');
  }

  // 4. Test POST /api/builder/pages/:key/apply-template
  {
    console.log('4. Testing applyTemplate (custom-promo-home to test-page)...');
    const req = {
      user: { userId: admin.id, role: admin.role },
      params: { key: 'test-page' },
      body: { templateId: testTemplateId }
    } as unknown as AuthRequest;

    const { res, statusPromise, next } = createMockHttp();
    await controller.applyTemplate(req, res, next);
    const result = await statusPromise;

    if (result.code !== 200 || !result.json.success) {
      console.error('Failed to apply template:', result.error || result.json);
      process.exit(1);
    }

    console.log('✅ applyTemplate verified. New draft version:', result.json.data.draft.version);
  }

  // 5. Test DELETE /api/builder/templates/:id (system template should fail)
  {
    console.log('5. Testing deleteTemplate protection on system templates...');
    const systemTemplate = await prisma.builderTemplate.findFirst({
      where: { key: 'default-home' }
    });

    if (!systemTemplate) {
      console.error('system default-home template not found');
      process.exit(1);
    }

    const req = {
      params: { id: systemTemplate.id }
    } as unknown as AuthRequest;

    const { res, statusPromise, next } = createMockHttp();
    await controller.deleteTemplate(req, res, next);
    const result = await statusPromise;

    if (!result.error) {
      console.error('Expected error when deleting system template, but none was thrown.');
      process.exit(1);
    }
    
    console.log('Caught expected error preventing system template deletion:', result.error.message);
    console.log('✅ System template deletion protection verified.');
  }

  // 6. Test DELETE /api/builder/templates/:id (custom template should succeed)
  {
    console.log('6. Testing deleteTemplate on custom template...');
    const req = {
      params: { id: testTemplateId }
    } as unknown as AuthRequest;

    const { res, statusPromise, next } = createMockHttp();
    await controller.deleteTemplate(req, res, next);
    const result = await statusPromise;

    if (result.code !== 200 || !result.json.success) {
      console.error('Failed to delete custom template:', result.error || result.json);
      process.exit(1);
    }

    // Verify it is deleted
    const check = await prisma.builderTemplate.findUnique({ where: { id: testTemplateId } });
    if (check) {
      console.error('Template still exists in DB after deletion.');
      process.exit(1);
    }

    console.log('✅ Custom template deletion verified.');
  }

  console.log('🎉 All Phase 2 Integration Tests Passed Successfully!');
}

runTests()
  .catch((err) => {
    console.error('❌ Test execution failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    // Clean up test page created during testing
    await prisma.builderPageVersion.deleteMany({
      where: { page: { key: 'test-page' } }
    });
    await prisma.builderPage.deleteMany({
      where: { key: 'test-page' }
    });
    await prisma.$disconnect();
  });
