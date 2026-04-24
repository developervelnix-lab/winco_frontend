// Use sharp programmatically via dynamic import
const path = require('path');
const { execSync } = require('child_process');

// Force install sharp to node_modules  
execSync('npm install sharp@0.33.2 --no-save --force', { stdio: 'inherit', cwd: __dirname });

async function main() {
  // Clear require cache and require fresh
  delete require.cache[require.resolve('sharp')];
  const sharp = require('sharp');

  const source = path.join(__dirname, 'public', 'wincologo.png');

  const sizes = [
    { name: 'logo192.png', size: 192 },
    { name: 'logo512.png', size: 512 },
    { name: 'pwa-192x192.png', size: 192 },
    { name: 'pwa-512x512.png', size: 512 },
    { name: 'favicon.png', size: 192 },
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 },
  ];

  for (const { name, size } of sizes) {
    const output = path.join(__dirname, 'public', name);
    await sharp(source)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(output);
    console.log(`Created ${name} (${size}x${size})`);
  }
  
  // Verify
  for (const { name } of sizes) {
    const buf = require('fs').readFileSync(path.join(__dirname, 'public', name));
    const w = buf.readUInt32BE(16);
    const h = buf.readUInt32BE(20);
    console.log(`Verify ${name}: ${w}x${h}`);
  }

  console.log('\nAll icons resized successfully!');
}

main().catch(e => console.error('Error:', e));
