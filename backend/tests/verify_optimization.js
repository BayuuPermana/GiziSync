const proxyquire = require('proxyquire');
const sinon = require('sinon');
const express = require('express');
const request = require('supertest');

// Mock Middleware
const authMock = {
    verifyToken: (req, res, next) => next(),
    verifyTokenAndAdmin: (req, res, next) => next()
};

// Mock Mongoose Model
const findStub = sinon.stub();
const populateStub = sinon.stub();
const sortStub = sinon.stub();
const selectStub = sinon.stub();
const leanStub = sinon.stub();
const findByIdStub = sinon.stub();

const ReportMock = {
    find: findStub,
    findById: findByIdStub,
    aggregate: sinon.stub()
};

// Chainable query object
const queryObj = {
    populate: populateStub,
    sort: sortStub,
    select: selectStub,
    lean: leanStub
};

// Setup default behavior for chaining
findStub.returns(queryObj);
populateStub.returns(queryObj);
sortStub.returns(queryObj);
selectStub.returns(queryObj);
leanStub.resolves([]); // Default to empty list
// findByIdStub needs to return queryObj because of .populate('kitchen').lean()
findByIdStub.returns(queryObj);

const app = express();
app.use(express.json());

// Load route with mocks
// We need to use proxyquire to load the route file and inject our mocks
const reportsRoute = proxyquire('../routes/reports', {
    '../models/Report': ReportMock,
    '../middleware/auth': authMock,
    '../models/Kitchen': { find: sinon.stub().resolves([]) } // Mock Kitchen dependency
});

app.use('/api/reports', reportsRoute);

async function runTests() {
    console.log("Running verification tests...");
    let failure = false;

    // Test 1: GET / should exclude items
    // Reset stubs
    findStub.resetHistory();
    populateStub.resetHistory();
    sortStub.resetHistory();
    selectStub.resetHistory();
    leanStub.resetHistory();

    // Ensure mocks return the chainable object
    findStub.returns(queryObj);

    try {
        await request(app).get('/api/reports');

        if (selectStub.calledWith('-items')) {
            console.log("✅ PASS: GET /api/reports excludes 'items'.");
        } else {
            console.log("❌ FAIL: GET /api/reports does NOT exclude 'items'.");
            failure = true;
        }
    } catch (error) {
        console.error("Error during GET /:", error);
        failure = true;
    }

    // Test 2: GET /:id should return full report
    try {
        const resId = await request(app).get('/api/reports/123');

        if (resId.status === 200) {
             console.log("✅ PASS: GET /api/reports/:id exists and returns 200.");
        } else {
             console.log(`❌ FAIL: GET /api/reports/:id failed. Status: ${resId.status}`);
             failure = true;
        }
    } catch (error) {
        console.error("Error during GET /:id:", error);
        failure = true;
    }

    // process.exit(failure ? 1 : 0);
}

runTests();
