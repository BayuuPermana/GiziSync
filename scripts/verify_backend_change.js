
const fs = require('fs');
const path = require('path');

const routesPath = path.join(__dirname, '../backend/routes/reports.js');
const content = fs.readFileSync(routesPath, 'utf8');

if (content.includes(".populate('kitchen', 'name')")) {
    console.log("PASS: Backend route updated correctly.");
} else {
    console.log("FAIL: Backend route not updated.");
    process.exit(1);
}
