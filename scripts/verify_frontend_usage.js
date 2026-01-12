
const fs = require('fs');
const path = require('path');

const reportPagePath = path.join(__dirname, '../frontend/src/pages/ReportsPage.jsx');
const content = fs.readFileSync(reportPagePath, 'utf8');

// Regex to find all usage of .kitchen
// We expect .kitchen.name or .kitchen?.name
// We should NOT see .kitchen.location, .kitchen.capacity, etc.

const kitchenUsageRegex = /\.kitchen\??\.(\w+)/g;
let match;
const usages = new Set();

while ((match = kitchenUsageRegex.exec(content)) !== null) {
    usages.add(match[1]);
}

console.log("Found usages of report.kitchen.*:", Array.from(usages));

if (usages.size === 1 && usages.has('name')) {
    console.log("PASS: Only 'name' is accessed from kitchen.");
} else {
    console.log("FAIL: Other properties accessed:", Array.from(usages));
    process.exit(1);
}
