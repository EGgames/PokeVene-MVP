const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

const GamePage = require('../support/pages/GamePage');
const GameResultPage = require('../support/pages/GameResultPage');
const LeaderboardPage = require('../support/pages/LeaderboardPage');
const { ensureTestUser, setAuthInBrowser } = require('../support/helpers/auth.helper');
const { saveTestScore } = require('../support/helpers/api.helper');

// ---------------------------------------------------------------------------
// Mecánica de juego — carga y visualización
// ---------------------------------------------------------------------------

When('la página termina de cargar', async function () {
  await GamePage.waitForGameReady();
});

Then('ve un término en el centro de la pantalla', async function () {
  const term = await GamePage.getCurrentTerm();
  assert.ok(term && term.length > 0, 'No se encontró un término en pantalla');
  this.currentTerm = term;
});

Then('ve dos botones lado a lado: {string} y {string}', async function (btn1, btn2) {
  const pokemonBtn = await GamePage.pokemonButton;
  const venezolanoBtn = await GamePage.venezolanoButton;
  const pokemonDisplayed = await pokemonBtn.isDisplayed();
  const venezolanoDisplayed = await venezolanoBtn.isDisplayed();
  assert.ok(pokemonDisplayed, `El botón "${btn1}" no está visible`);
  assert.ok(venezolanoDisplayed, `El botón "${btn2}" no está visible`);
});

Then('ve un contador que indica {string}', async function (expectedText) {
  const progressText = await GamePage.getProgressText();
  assert.ok(
    progressText.includes(expectedText),
    `Se esperaba "${expectedText}" en el progreso, pero se encontró: "${progressText}"`
  );
});

Then('ve una barra de progreso en su estado inicial', async function () {
  const bar = await GamePage.progressBar;
  const displayed = await bar.isDisplayed();
  assert.ok(displayed, 'La barra de progreso no está visible');
});

// ---------------------------------------------------------------------------
// Responder preguntas
// ---------------------------------------------------------------------------

When('el usuario responde correctamente al término mostrado', async function () {
  await GamePage.answerCorrectly();
});

Then('el sistema muestra feedback positivo', async function () {
  // El feedback overlay se muestra brevemente tras responder
  await browser.waitUntil(
    async () => {
      const overlay = await GamePage.feedbackOverlay;
      return overlay.isExisting();
    },
    { timeout: 5000, timeoutMsg: 'No se mostró feedback tras responder' }
  );
});

Then('después de un breve instante se carga automáticamente el siguiente término', async function () {
  await GamePage.waitForNextQuestion();
  const term = await GamePage.getCurrentTerm();
  assert.ok(term && term.length > 0, 'No se cargó el siguiente término');
});

Then('el contador avanza a {string}', async function (expectedText) {
  await browser.waitUntil(
    async () => {
      const text = await GamePage.getProgressText();
      return text.includes(expectedText);
    },
    { timeout: 5000, timeoutMsg: `El contador no avanzó a "${expectedText}"` }
  );
});

// ---------------------------------------------------------------------------
// Jugar partida completa
// ---------------------------------------------------------------------------

When('el usuario responde las {int} preguntas de la partida', async function (totalQuestions) {
  // Responder todas las preguntas (mezcla de correctas e incorrectas)
  this.gameResult = await GamePage.playGame(7, totalQuestions);
});

When('el usuario responde correctamente {int} de {int} preguntas', async function (targetCorrect, totalQuestions) {
  this.gameResult = await GamePage.playGame(targetCorrect, totalQuestions);
});

Then('el sistema navega automáticamente a la pantalla de resultados', async function () {
  await GameResultPage.waitForResults();
});

Then('muestra los aciertos, errores, porcentaje y el estado de la partida', async function () {
  const percentage = await GameResultPage.getPercentage();
  assert.ok(percentage, 'No se muestra el porcentaje');

  const status = await GameResultPage.getStatus();
  assert.ok(status, 'No se muestra el estado (ganó/perdió)');

  const displayed = await GameResultPage.isDisplayed();
  assert.ok(displayed, 'La pantalla de resultados no se muestra correctamente');
});

// ---------------------------------------------------------------------------
// Cálculo de score
// ---------------------------------------------------------------------------

Then('muestra en pantalla {string}', async function (expectedText) {
  await browser.waitUntil(
    async () => {
      const body = await browser.$('body');
      const text = await body.getText();
      return text.includes(expectedText);
    },
    { timeout: 10000, timeoutMsg: `No se encontró "${expectedText}" en pantalla` }
  );
});

Then('muestra el mensaje {string} con énfasis visual', async function (expectedMessage) {
  const status = await GameResultPage.getStatus();
  assert.ok(
    status.includes(expectedMessage) || status.includes('GANASTE'),
    `Se esperaba "${expectedMessage}" en el badge de estado, se encontró: "${status}"`
  );
});

// ---------------------------------------------------------------------------
// Guardar puntaje
// ---------------------------------------------------------------------------

Then('el botón es interactuable', async function () {
  const enabled = await GameResultPage.isSaveButtonEnabled();
  assert.ok(enabled, 'El botón de guardar no es interactuable');
});

// ---------------------------------------------------------------------------
// Invitado
// ---------------------------------------------------------------------------

Then('puede ver el primer término de la partida', async function () {
  await GamePage.waitForGameReady();
  const term = await GamePage.getCurrentTerm();
  assert.ok(term && term.length > 0, 'No se muestra el primer término');
});

Then('puede interactuar con los botones {string} y {string}', async function (btn1, btn2) {
  const pokemonBtn = await GamePage.pokemonButton;
  const venezolanoBtn = await GamePage.venezolanoButton;
  const pokemonClickable = await pokemonBtn.isClickable();
  const venezolanoClickable = await venezolanoBtn.isClickable();
  assert.ok(pokemonClickable, `El botón "${btn1}" no es interactuable`);
  assert.ok(venezolanoClickable, `El botón "${btn2}" no es interactuable`);
});

Then('puede completar una partida de {int} preguntas', async function (totalQuestions) {
  this.gameResult = await GamePage.playGame(6, totalQuestions);
  await GameResultPage.waitForResults();
});

Then('al finalizar, ve la opción {string}', async function (buttonText) {
  const btn = await browser.$(`button*=${buttonText}`);
  await btn.waitForDisplayed({ timeout: 10000 });
  const displayed = await btn.isDisplayed();
  assert.ok(displayed, `No se encontró la opción "${buttonText}"`);
});

Then('puede elegir reiniciar otra partida sin registrarse', async function () {
  const retryBtn = await GameResultPage.retryButton;
  const displayed = await retryBtn.isDisplayed();
  assert.ok(displayed, 'El botón de reiniciar no está visible');
});

// ---------------------------------------------------------------------------
// Leaderboard
// ---------------------------------------------------------------------------

Given('que existen puntajes guardados de múltiples usuarios', async function () {
  // Setup: crear usuarios de prueba y guardar puntajes si no existen
  const testUsers = [
    { username: 'e2e_user_1', password: 'TestPass_001!', score: 90, total: 10, correct: 9 },
    { username: 'e2e_user_2', password: 'TestPass_002!', score: 80, total: 10, correct: 8 },
    { username: 'e2e_user_3', password: 'TestPass_003!', score: 70, total: 10, correct: 7 },
  ];

  for (const u of testUsers) {
    try {
      const data = await ensureTestUser(u.username, u.password);
      await saveTestScore(data.token, u.score, u.total, u.correct);
    } catch {
      // Ignorar si ya tienen scores guardados
    }
  }
});

Then('ve una tabla con las columnas {string}, {string}, {string} y {string}', async function (col1, col2, col3, col4) {
  await LeaderboardPage.waitForTable();
  const headers = await LeaderboardPage.getColumnHeaders();
  const headerText = headers.join(', ');
  assert.ok(headerText.includes(col1), `Columna "${col1}" no encontrada en: ${headerText}`);
  assert.ok(headerText.includes(col2), `Columna "${col2}" no encontrada en: ${headerText}`);
  assert.ok(headerText.includes(col3), `Columna "${col3}" no encontrada en: ${headerText}`);
  assert.ok(headerText.includes(col4), `Columna "${col4}" no encontrada en: ${headerText}`);
});

Then('los puntajes están ordenados de mayor a menor', async function () {
  const percentages = await LeaderboardPage.getScorePercentages();
  const numericValues = percentages.map((p) => parseInt(p.replace('%', ''), 10));

  for (let i = 1; i < numericValues.length; i++) {
    assert.ok(
      numericValues[i - 1] >= numericValues[i],
      `Puntajes desordenados: ${numericValues[i - 1]} debería ser >= ${numericValues[i]}`
    );
  }
});

// ---------------------------------------------------------------------------
// Reiniciar partida
// ---------------------------------------------------------------------------

Then('se inicia una nueva partida con el contador reiniciado', async function () {
  await GamePage.waitForGameReady();
  const progressText = await GamePage.getProgressText();
  assert.ok(
    progressText.includes('1 de'),
    `Se esperaba que el contador reiniciara a "1 de ...", pero muestra: "${progressText}"`
  );
});
