// A sendData attempt is not an acknowledgement from the bot or a bank payment.
// Keep the buyer's saved cart until they explicitly change or clear it.
export function prepareCheckout(storage) {
  try { storage.removeItem('glam.sent.v1'); } catch {}
}

if (typeof window !== 'undefined') {
  try { prepareCheckout(window.localStorage); } catch {}
  import('./index-aMkEsQav.js');
}
