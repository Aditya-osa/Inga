const fs = require('fs');

const gen = fs.readFileSync('temp_generic.html', 'utf8');
console.log('--- Generic Name Sample Section ---');
// Let's find where products are listed
const m = gen.match(/<div class="[^"]*product[^"]*"[\s\S]*?<\/div>/gi) || gen.match(/<ul[\s\S]*?<\/ul>/gi);
console.log(gen.substring(gen.indexOf('Amoxycillin') - 200, gen.indexOf('Amoxycillin') + 800));

const th = fs.readFileSync('temp_therapeutic.html', 'utf8');
console.log('--- Therapeutic Sample Section ---');
console.log(th.substring(th.indexOf('Alkaliser') - 200, th.indexOf('Alkaliser') + 800));
