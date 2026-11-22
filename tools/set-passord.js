// Bruk: node tools/set-passord.js "nytt passord"   (skriver js/gate-config.js med ny hash)
const crypto = require('crypto'), fs = require('fs'), path = require('path');
const pw = process.argv[2];
if(!pw){ console.error('Bruk: node tools/set-passord.js "passord"'); process.exit(1); }
const salt = crypto.randomBytes(8).toString('hex');
const hash = crypto.createHash('sha256').update(salt + pw.trim()).digest('hex');
fs.writeFileSync(path.join(__dirname, '..', 'js', 'gate-config.js'),
  `/* Passordlås for skoleboken.com. Generert med tools/set-passord.js. Hash, ikke passord. */\nwindow.SKB_GATE = {salt:'${salt}', hash:'${hash}'};\n`);
console.log('Ny hash skrevet til js/gate-config.js');
