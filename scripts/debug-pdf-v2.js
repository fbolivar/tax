try {
    const pdf1 = require('pdf-parse');
    console.log('Require("pdf-parse"):', typeof pdf1);
    if (typeof pdf1 === 'object') console.log('Keys:', Object.keys(pdf1));
} catch (e) { console.log('Require 1 failed', e.message); }

try {
    const pdf2 = require('pdf-parse/lib/pdf-parse.js');
    console.log('Require("pdf-parse/lib/pdf-parse.js"):', typeof pdf2);
} catch (e) { console.log('Require 2 failed', e.message); }

try {
    const pdf3 = require('pdf-parse/index.js');
    console.log('Require("pdf-parse/index.js"):', typeof pdf3);
} catch (e) { console.log('Require 3 failed', e.message); }
