const fs = require('fs');

const urls = JSON.parse(fs.readFileSync('product.json', 'utf8'));
console.log(urls.product.length);