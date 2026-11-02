import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {prepareCheckout} from '../app/_source/bootstrap.mjs';

const legacy=fs.readFileSync(new URL('../app/assets/index-aMkEsQav.js',import.meta.url),'utf8');
const start=legacy.indexOf('const Pr=ct.get();');
assert.ok(start>=0);
const end=legacy.indexOf(';wo(',start);
assert.ok(end>start);
const startup=legacy.slice(start,end+1);
function fixture(){
 const values=new Map([['glam.sent.v1',String(Date.now())],['cart-test','["lisa"]']]);
 const storage={getItem:key=>values.get(key)||null,removeItem:key=>values.delete(key)};
 let clears=0;
 const run=()=>vm.runInNewContext(startup,{Date,ct:{get:()=>Number(storage.getItem('glam.sent.v1')||0),set:()=>storage.removeItem('glam.sent.v1')},W:{clear:()=>{clears++;values.delete('cart-test');}}});
 return {storage,values,run,get clears(){return clears;}};
}
test('positive control: old published startup discards a recently submitted cart',()=>{
 const f=fixture();f.run();assert.equal(f.clears,1);
});
test('a submission attempt preserves the cart on reopening the app',()=>{
 const f=fixture();prepareCheckout(f.storage);f.run();
 assert.equal(f.clears,0);assert.equal(f.values.get('cart-test'),'["lisa"]');
});
test('denied localStorage does not prevent storefront startup',()=>{
 assert.doesNotThrow(()=>prepareCheckout({removeItem(){throw new Error('denied');}}));
});
