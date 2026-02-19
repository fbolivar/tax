const pdf = require('pdf-parse');
console.log('Type:', typeof pdf);
console.log('Is Function?', typeof pdf === 'function');
console.log('Keys:', Object.keys(pdf));
console.log('Default?', pdf.default);
