const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

const LoginPage = require('../support/pages/LoginPage');
const RegisterPage = require('../support/pages/RegisterPage');
const GamePage = require('../support/pages/GamePage');

// ---------------------------------------------------------------------------
// Navegación genérica
// ---------------------------------------------------------------------------

Given('que el usuario se encuentra en la pantalla de registro', async function () {
  await RegisterPage.navigate();
});

Given('que el usuario se encuentra en la pantalla de inicio de sesión', async function () {
  await LoginPage.navigate();
});

Given('que el usuario no ha iniciado sesión', async function () {
  // El Before hook ya navegó al origen de la app y limpió localStorage.
  // Solo verificamos que no hay token.
  const token = await browser.execute(() => localStorage.getItem('auth_token'));
  if (token) {
    await browser.execute(() => {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    });
  }
});

Given('que el usuario accede a la pantalla del juego', async function () {
  await GamePage.navigate();
});

// Variante sin "que" — usada como "Y el usuario accede a la pantalla del juego"
Given('el usuario accede a la pantalla del juego', async function () {
  await GamePage.navigate();
});

When('accede a la pantalla del juego', async function () {
  await GamePage.navigate();
});

When('el usuario accede a la pantalla de la tabla de posiciones', async function () {
  const LeaderboardPage = require('../support/pages/LeaderboardPage');
  await LeaderboardPage.navigate();
});

// ---------------------------------------------------------------------------
// Presionar botones (genérico por texto)
// ---------------------------------------------------------------------------

When('presiona el botón {string}', async function (buttonText) {
  const btn = await browser.$(`button*=${buttonText}`);
  await btn.waitForClickable({ timeout: 15000 });
  await btn.click();
});

// ---------------------------------------------------------------------------
// Verificar mensajes en pantalla
// ---------------------------------------------------------------------------

Then('muestra el mensaje {string}', async function (expectedMessage) {
  await browser.waitUntil(
    async () => {
      const body = await browser.$('body');
      const text = await body.getText();
      return text.includes(expectedMessage);
    },
    {
      timeout: 10000,
      timeoutMsg: `No se encontró el mensaje "${expectedMessage}" en la página`,
    }
  );
});

// ---------------------------------------------------------------------------
// Verificar elementos visibles
// ---------------------------------------------------------------------------

Then('ve el botón {string} habilitado', async function (buttonText) {
  const btn = await browser.$(`button*=${buttonText}`);
  await btn.waitForDisplayed({ timeout: 10000 });
  const enabled = await btn.isEnabled();
  assert.strictEqual(enabled, true, `El botón "${buttonText}" debería estar habilitado`);
});

Then('ofrece el botón {string}', async function (buttonText) {
  const btn = await browser.$(`button*=${buttonText}`);
  await btn.waitForDisplayed({ timeout: 10000 });
  const displayed = await btn.isDisplayed();
  assert.strictEqual(displayed, true, `El botón "${buttonText}" debería estar visible`);
});

// ---------------------------------------------------------------------------
// Navegación a rutas (verificación)
// ---------------------------------------------------------------------------

Then('navega a la pantalla del juego', async function () {
  await browser.waitUntil(
    async () => {
      const url = await browser.getUrl();
      return url.includes('/game');
    },
    { timeout: 15000, timeoutMsg: 'No se navegó a la pantalla del juego' }
  );
});

Then('navega a la página de inicio', async function () {
  await browser.waitUntil(
    async () => {
      const url = await browser.getUrl();
      return url.endsWith('/') || url.includes('localhost:5173');
    },
    { timeout: 10000, timeoutMsg: 'No se navegó a la página de inicio' }
  );
});
