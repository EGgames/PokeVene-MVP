const { Before, After, BeforeAll, AfterAll, setDefaultTimeout } = require('@cucumber/cucumber');
const { healthCheck } = require('./helpers/api.helper');

setDefaultTimeout(60000);

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

// ---------------------------------------------------------------------------
// BeforeAll: verificar que el backend esté levantado
// ---------------------------------------------------------------------------
BeforeAll(async function () {
  const apiUrl = process.env.API_URL || 'http://localhost:3000';
  const isUp = await healthCheck();
  if (!isUp) {
    throw new Error(
      `El backend no responde en ${apiUrl}/health.\n` +
      'Asegúrate de que esté levantado antes de ejecutar los tests E2E.\n' +
      'Puedes definir la variable de entorno API_URL si usas otro puerto.'
    );
  }
});

// ---------------------------------------------------------------------------
// Before: preparar estado limpio para cada escenario
// ---------------------------------------------------------------------------
Before(async function () {
  // Limpiar cookies y localStorage antes de cada escenario.
  // Navegar primero a la app para tener un origen válido donde
  // localStorage esté accesible, luego limpiar.
  await browser.reloadSession();
  await browser.url(BASE_URL);
  await browser.execute(() => {
    try {
      localStorage.clear();
    } catch {
      // Ignorar si localStorage no es accesible
    }
  });
});

// ---------------------------------------------------------------------------
// After: limpiar después de cada escenario
// ---------------------------------------------------------------------------
After(async function (scenario) {
  // Captura de screenshot en caso de fallo (complementa Serenity Photographer)
  if (scenario.result && scenario.result.status === 'FAILED') {
    try {
      const screenshot = await browser.takeScreenshot();
      this.attach(screenshot, 'image/png');
    } catch {
      // Ignorar si no se puede capturar
    }
  }
});
