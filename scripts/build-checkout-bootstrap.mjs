import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=fs.readFileSync(path.join(root,'app/_source/bootstrap.mjs'),'utf8');
const template=fs.readFileSync(path.join(root,'app/_source/index.template.html'),'utf8');
if(template.split('{{CHECKOUT_BOOTSTRAP}}').length!==2)throw new Error('Expected exactly one bootstrap placeholder');
const vendor=source.match(/import\('\.\/([^']+)'\)/)?.[1];
if(!vendor || !fs.existsSync(path.join(root,'app/assets',vendor)))throw new Error('Published app bundle missing');
const hash=crypto.createHash('sha256').update(source).digest('hex').slice(0,12);
const name='checkout-bootstrap-'+hash+'.js';
fs.writeFileSync(path.join(root,'app/assets',name),source);
fs.writeFileSync(path.join(root,'app/index.html'),template.replace('{{CHECKOUT_BOOTSTRAP}}','./assets/'+name));
console.log('STOREFRONT BUILD OK',name);
