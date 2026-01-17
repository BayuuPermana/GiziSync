
const assert = require('assert');
const proxyquire = require('proxyquire');

// Mock dependencies
const mockReport = {
  aggregate: async () => [],
  find: () => ({ populate: () => ({ sort: () => ({ lean: async () => [] }) }), lean: async () => [] }),
};

const mockKitchen = {
  countDocuments: async () => 42,
  find: () => ({ select: () => [] })
};

const mockAuth = {
  verifyToken: (req, res, next) => next(),
  verifyTokenAndAdmin: (req, res, next) => next()
};

// Use proxyquire to load the module with mocks
const router = proxyquire('./routes/reports.js', {
  '../models/Report': mockReport,
  '../models/Kitchen': mockKitchen,
  '../middleware/auth': mockAuth
});

async function runTest() {
  console.log('Verifying GET /stats endpoint...');

  // Find the handler for GET /stats
  // Express router structure is complex to inspect, but we can iterate the stack
  const route = router.stack.find(layer => layer.route && layer.route.path === '/stats');

  if (!route) {
    throw new Error('GET /stats route not found');
  }

  const handler = route.route.stack[0].handle; // Assuming the first handler is the controller (after auth middleware if verifiedToken is used)

  // Actually verifyToken is a middleware, so the stack might have multiple handles.
  // In our mock, verifyToken calls next(), so the actual controller should be reachable.
  // Let's iterate to find the async function.
  const controller = route.route.stack.find(layer => layer.handle.length === 2 && layer.handle.constructor.name === 'AsyncFunction').handle;

  const req = {};
  let responseData = null;
  const res = {
    status: (code) => {
      assert.strictEqual(code, 200, 'Status code should be 200');
      return {
        json: (data) => {
          responseData = data;
        }
      };
    }
  };

  await controller(req, res);

  console.log('Response data:', responseData);

  assert.ok(responseData.totalKitchens !== undefined, 'Response should contain totalKitchens');
  assert.strictEqual(responseData.totalKitchens, 42, 'totalKitchens should matches mocked value');

  console.log('✅ Verification successful: /stats returns totalKitchens');
}

runTest().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
