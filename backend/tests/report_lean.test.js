
import { describe, it, expect, mock, beforeAll } from "bun:test";

// Mock middleware
// Note: In Express routers, the middleware is executed before the handler.
// But here we are extracting the handler directly from the stack and calling it.
// The handler in the router stack might be wrapped if we use middleware in router.use()
// However, the router definition in reports.js uses:
// router.post('/', verifyToken, async (req, res) => { ... })
// So the stack will contain layers. Each layer has a route.
// If we grab the route, `route.stack` contains the handles.
// The first handle is `verifyToken`, the second is the async function.
// We need to verify which one we are calling.

// Let's inspect the router structure in the test if needed.
// But first, let's fix the mock. `verifyToken` is imported in reports.js.
// When reports.js runs, it calls `router.get('/', verifyToken, handler)`.
// Express adds these to the stack.
// In the test, we traverse `router.stack`.
// `layer.route.stack` is an array of handles. [verifyToken, handler]
// We grabbed `layer.route.stack[0].handle` which is `verifyToken`.
// That's why it failed (we passed `req, res` but no `next`).

// We should grab the LAST handle in the stack, which is the actual controller logic.

mock.module('../middleware/auth', () => ({
  verifyToken: (req, res, next) => next(),
  verifyTokenAndAdmin: (req, res, next) => next(),
}));

// Mock Report model
let leanCalled = false;
mock.module('../models/Report', () => ({
  default: {
    find: (query) => ({
      populate: (path) => ({
        lean: () => {
          leanCalled = true;
          return [{ _id: "123", kitchen: { name: "Test Kitchen" } }];
        },
        // In case lean is not called, it returns this object, which is then awaited.
        // If awaited, it returns itself.
        then: function(resolve) { resolve([{ _id: "123", kitchen: { name: "Test Kitchen" } }]); }
      }),
      lean: () => {
        leanCalled = true;
        return [{ _id: "123", kitchen: "kitchenId" }];
      },
      then: function(resolve) { resolve([{ _id: "123", kitchen: "kitchenId" }]); }
    }),
    aggregate: () => [],
    findByIdAndUpdate: () => ({})
  }
}));

const router = require('../routes/reports');

describe('Reports Route Performance', () => {
  it('GET / should use .lean()', async () => {
    leanCalled = false;

    const layer = router.stack.find(layer =>
      layer.route && layer.route.path === '/' && layer.route.methods.get
    );

    expect(layer).toBeDefined();
    // layer.route.stack contains [verifyToken, handler]
    // We want the last one.
    const handles = layer.route.stack;
    const handler = handles[handles.length - 1].handle;

    const req = {};
    const res = {
      status: (code) => ({
        json: (data) => {}
      })
    };

    await handler(req, res);

    expect(leanCalled).toBe(true);
  });

  it('GET /kitchen/:kitchenId should use .lean()', async () => {
    leanCalled = false;

    const layer = router.stack.find(layer =>
      layer.route && layer.route.path === '/kitchen/:kitchenId' && layer.route.methods.get
    );

    expect(layer).toBeDefined();
    const handles = layer.route.stack;
    const handler = handles[handles.length - 1].handle;

    const req = { params: { kitchenId: '123' } };
    const res = {
      status: (code) => ({
        json: (data) => {}
      })
    };

    await handler(req, res);

    expect(leanCalled).toBe(true);
  });
});
