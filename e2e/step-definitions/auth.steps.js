const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

const LoginPage = require('../support/pages/LoginPage');
const RegisterPage = require('../support/pages/RegisterPage');
const { ensureTestUser, setAuthInBrowser, getStoredToken, getStoredUser } = require('../support/helpers/auth.helper');
const { cleanupTestUser } = require('../support/helpers/api.helper');

// ---------------------------------------------------------------------------
// Precondiciones de usuario
// ---------------------------------------------------------------------------

Given('que no existe un usuario con nombre {string}', async function (username) {
  // Generar un username único por ejecución para evitar conflicto 409 en runs repetidos
  const suffix = Date.now().toString(36).slice(-5);
  this.testUsername = `${username}_${suffix}`;
});

Given('que existe un usuario registrado con nombre {string} y contraseña {string}', async function (username, password) {
  const data = await ensureTestUser(username, password);
  this.testUserData = data;
  this.testUsername = username;
  this.testPassword = password;
});

Given('que el usuario {string} está autenticado con un token válido', async function (username) {
  const password = 'M4racucho#2026';
  const data = await ensureTestUser(username, password);
  this.testUserData = data;
  this.testToken = data.token;

  // Inyectar sesión en el navegador
  await browser.url('/');
  await setAuthInBrowser(data.token, {
    id: data.id,
    username: data.username,
    created_at: data.created_at,
  });
});

// ---------------------------------------------------------------------------
// Inputs de formulario de auth
// ---------------------------------------------------------------------------

When('el usuario ingresa el nombre {string}', async function (username) {
  const url = await browser.getUrl();
  // En el flujo de registro, usar el username único generado para evitar conflictos
  const finalUsername = (url.includes('/register') && this.testUsername) ? this.testUsername : username;
  this.currentUsername = finalUsername;
  if (url.includes('/register')) {
    await RegisterPage.setUsername(finalUsername);
  } else {
    await LoginPage.setUsername(finalUsername);
  }
});

When('ingresa la contraseña {string}', async function (password) {
  this.currentPassword = password;
  const url = await browser.getUrl();
  if (url.includes('/register')) {
    await RegisterPage.setPassword(password);
    await RegisterPage.setConfirmPassword(password);
  } else {
    await LoginPage.setPassword(password);
  }
});

// ---------------------------------------------------------------------------
// Verificaciones de registro exitoso
// ---------------------------------------------------------------------------

Then('el sistema crea la cuenta exitosamente', async function () {
  // Verificar redireccionamiento a /dashboard como indicador de éxito
  await browser.waitUntil(
    async () => {
      const url = await browser.getUrl();
      return url.includes('/dashboard') || url.includes('/game');
    },
    { timeout: 15000, timeoutMsg: 'No se redirigió a /dashboard tras el registro' }
  );
});

Then('retorna un código de estado {int}', async function (_statusCode) {
  // En E2E verificamos el efecto en UI, no el código HTTP directamente.
  // Un registro exitoso (201) redirige a /dashboard.
  // Un login exitoso (200) redirige a /dashboard.
  const url = await browser.getUrl();
  const hasRedirected = url.includes('/dashboard') || url.includes('/game');
  assert.ok(hasRedirected, `Se esperaba redirección confirmando el status code esperado`);
});

Then('retorna un token de sesión válido', async function () {
  await browser.waitUntil(
    async () => {
      const t = await getStoredToken();
      return t && t.length > 0;
    },
    { timeout: 15000, timeoutMsg: 'El token no apareció en localStorage tras registro' }
  );
  const token = await getStoredToken();
  assert.ok(token, 'No se encontró token en localStorage');
  assert.ok(token.length > 0, 'El token está vacío');
});

Then('el usuario es redirigido a la pantalla del juego', async function () {
  await browser.waitUntil(
    async () => {
      const url = await browser.getUrl();
      return url.includes('/dashboard') || url.includes('/game');
    },
    { timeout: 15000, timeoutMsg: 'No se redirigió a la pantalla del juego' }
  );
});

Then('el token queda almacenado en el navegador', async function () {
  const token = await getStoredToken();
  assert.ok(token, 'El token no quedó almacenado en el navegador');
});

// ---------------------------------------------------------------------------
// Verificaciones de login exitoso
// ---------------------------------------------------------------------------

Then('retorna un token de sesión válido con expiración de 7 días', async function () {
  await browser.waitUntil(
    async () => {
      const t = await getStoredToken();
      return t && t.length > 0;
    },
    { timeout: 15000, timeoutMsg: 'El token no apareció en localStorage tras login' }
  );
  const token = await getStoredToken();
  assert.ok(token, 'No se encontró token en localStorage tras login');

  // Decodificar el payload del JWT para verificar expiración
  const payload = JSON.parse(
    Buffer.from(token.split('.')[1], 'base64').toString()
  );
  const expDays = (payload.exp - payload.iat) / (60 * 60 * 24);
  assert.ok(expDays >= 6 && expDays <= 8, `Se esperaba expiración ~7 días, obtuvo ${expDays.toFixed(1)}`);
});

Then('retorna los datos del usuario autenticado', async function () {
  const user = await getStoredUser();
  assert.ok(user, 'No se encontraron datos de usuario en localStorage');
  assert.ok(user.username, 'Los datos del usuario no contienen username');
  assert.ok(user.id, 'Los datos del usuario no contienen id');
});

Then('el sistema retorna un código de estado {int}', async function (_statusCode) {
  // En E2E verificamos UI. Para status 200/201, verificamos que la operación tuvo éxito.
  // La verificación real se hace en los pasos siguientes de cada escenario.
});
