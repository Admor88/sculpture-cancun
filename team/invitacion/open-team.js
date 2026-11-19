'use strict';

// Invitaciones Sculpture Team. El correo trae aquí el enlace de Supabase Auth
// en el FRAGMENTO, que el navegador no envía al servidor. Los escáneres de
// enlaces del proveedor de correo descargan esta página estática, pero no
// tocan el botón: el enlace de un solo uso llega intacto a la persona. Al
// tocarlo, el navegador abre el mismo enlace de Auth, que vuelve a Team con
// `team_invite`. Esta página nunca navega sola.
const canonical = location.origin === 'https://sculpturecancun.com'
  && location.pathname === '/team/invitacion/'
  && location.search === '';
const fragment = location.hash;
history.replaceState(null, '', location.pathname);

const REALMS = new Set(['bwhoregqfexvjpzvwccu.supabase.co', 'wrbxakeucjqykhqnqosf.supabase.co']);
const TOKEN = /^(?:[0-9a-f]{56}|[0-9a-f]{64})$/;
const RETURN = /^sculptureteam:\/\/sculptureteam\.com\/\?team_invite=[0-9a-f]{64}$/;

// Devuelve el enlace de Auth reconstruido desde sus partes validadas, o null.
function authLink(hash) {
  if (!hash.startsWith('#enlace=') || hash.length > 2048) return null;
  let raw = hash.slice('#enlace='.length);
  try {
    // html/template lo codifica entero; sin codificar, empieza por https://.
    if (/^https%3a/i.test(raw)) raw = decodeURIComponent(raw);
    const url = new URL(raw);
    const keys = [...url.searchParams.keys()].sort().join(',');
    const token = url.searchParams.get('token');
    const type = url.searchParams.get('type');
    const redirect = url.searchParams.get('redirect_to');
    if (url.protocol !== 'https:' || !REALMS.has(url.host) || url.username || url.password
      || url.pathname !== '/auth/v1/verify' || url.hash || keys !== 'redirect_to,token,type'
      || !TOKEN.test(token) || !['invite', 'magiclink'].includes(type) || !RETURN.test(redirect)) {
      return null;
    }
    return 'https://' + url.host + '/auth/v1/verify?token=' + token + '&type=' + type
      + '&redirect_to=' + encodeURIComponent(redirect);
  } catch {
    return null;
  }
}

const status = document.getElementById('status');
const button = document.getElementById('continue');
const note = document.getElementById('note');
const link = canonical ? authLink(fragment) : null;
if (!link) {
  status.textContent = 'El enlace está incompleto. Pide a quien te invitó que te envíe una nueva invitación.';
} else {
  status.textContent = 'Toca el botón en el iPhone donde tienes instalada Sculpture Team.';
  button.hidden = false;
  note.hidden = false;
  let used = false;
  button.addEventListener('click', () => {
    if (used) return;
    used = true;
    button.disabled = true;
    status.textContent = 'Abriendo Sculpture Team…';
    location.assign(link);
  });
}
