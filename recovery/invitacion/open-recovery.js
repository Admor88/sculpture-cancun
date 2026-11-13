'use strict';

// This static document makes no request carrying the fragment. Keep it out of
// analytics and browser history, then hand it only to the fixed native route.
const fragment = location.hash;
history.replaceState(null, '', location.pathname);
const expected = /^#realm=(?:wrbxakeucjqykhqnqosf|bwhoregqfexvjpzvwccu)&proof=[0-9a-f]{64}(?:&auth_type=(?:invite|magiclink)&token_hash=[0-9a-f]{64})?$/;
const status = document.getElementById('status');
const button = document.getElementById('open-app');
if (!expected.test(fragment)) {
  status.textContent = 'El enlace está incompleto. Solicita a Sculpture que te envíe una nueva invitación.';
} else {
  const open = () => location.assign('sculpturerecovery://sculpturerecovery.com/patientInvitation' + fragment);
  button.hidden = false;
  button.addEventListener('click', open);
  open();
}
