const { ALL_CALCULATORS } = require('./audit-calculators-helper.js');
// Wait, let's just inspect directly from src/data/calculators
const fs = require('fs');
const path = require('path');

// Let's read files in src/data/calculators
const files = fs.readdirSync('src/data/calculators').filter(f => f.endsWith('.ts') && f !== 'index.ts');
console.log('Base files:', files);

// Let's check extra files
const extraFiles = fs.readdirSync('src/data/calculators/extra').filter(f => f.endsWith('.ts') && f !== 'index.ts');
console.log('Extra files:', extraFiles);
