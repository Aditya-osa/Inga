async function run() {
  try {
    const res1 = await fetch('https://www.ingalabs.com/generic-name.html');
    const html1 = await res1.text();
    
    // Save html1 to inspect structure
    const fs = require('fs');
    fs.writeFileSync('temp_generic.html', html1);

    const res2 = await fetch('https://www.ingalabs.com/therapeutic-segment.html');
    const html2 = await res2.text();
    fs.writeFileSync('temp_therapeutic.html', html2);

    console.log('Saved temp files.');
  } catch (err) {
    console.error(err);
  }
}
run();
