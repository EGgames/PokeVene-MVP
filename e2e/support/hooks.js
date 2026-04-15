const { Before, After, BeforeAll, AfterAll } = require('@cucumber/cucumber');
const { healthCheck } = require('./helpers/api.helper');
const { clearAuthInBrowser } = require('./helpers/auth.helper');

// ---------------------------------------------------------------------------
// BeforeAll: verificar que el backend esté levantado
// ---------------------------------------------------------------------------
BeforeAll(async function () {
  const isUp = await healthCheck();
  if (!isUp) {
    throw new Error(
      'El backend no responde en ' +
      (process.env.API_URL || 'http://localhost:3001') +
      '/health. Asegúrate de que esté levantado antes de ejecutar los tests E2E.'
    );
  }
});

// ---------------------------------------------------------------------------
// Before: preparar estado limpio para cada escenario
// ---------------------------------------------------------------------------
Before(async function () {
  // Limpiar cookies y localStorage antes de cada escenario
  await browser.reloadSession();
});

// ---------------------------------------------------------------------------
// After: limpiar después de cada escenario
// ---------------------------------------------------------------------------
After(async function (scenario) {
  // Captura de screenshot en caso de fallo (complementa Serenity Photographer)
  if (scenario.result && scenario.result.status === 'FAILED') {
    const screenshot = await browser.takeScreenshot();
    this.attach(screenshot, 'image/png');
  }

  // Limpiar sesión de autenticación
  try {
    await clearAuthInBrowser();
  } catch {
    // Si el browser ya se cerró, ignorar
  }
});
