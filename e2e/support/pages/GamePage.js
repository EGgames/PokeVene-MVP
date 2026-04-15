// Lookup de categorías de términos conocidos (basado en test-data.md)
const TERM_CATEGORIES = {
  'Charmander': 'pokemon',
  'Pikachu': 'pokemon',
  'Bulbasaur': 'pokemon',
  'Snorlax': 'pokemon',
  'Jigglypuff': 'pokemon',
  'Geodude': 'pokemon',
  'Mewtwo': 'pokemon',
  'Eevee': 'pokemon',
  'Squirtle': 'pokemon',
  'Gengar': 'pokemon',
  'Arepa': 'venezolano',
  'Chimbo': 'venezolano',
  'Chamo': 'venezolano',
  'Pana': 'venezolano',
  'Cachapa': 'venezolano',
  'Guarapo': 'venezolano',
  'Catire': 'venezolano',
  'Maracucho': 'venezolano',
  'Burda': 'venezolano',
  'Hallaca': 'venezolano',
  'Lickitung': 'pokemon',
  'Tepuy': 'venezolano',
};

class GamePage {
  get url() { return '/game'; }

  // --- Selectors ---
  get termText() { return browser.$('[class*="term"]'); }
  get pokemonButton() { return browser.$('button*=Pokémon'); }
  get venezolanoButton() { return browser.$('button*=Venezolano'); }
  get progressText() { return browser.$('[class*="progress"]'); }
  get progressBar() { return browser.$('[role="progressbar"]'); }
  get loadingMessage() { return browser.$('[class*="stateMessage"]'); }
  get correctCounter() { return browser.$('[class*="correct"]'); }
  get incorrectCounter() { return browser.$('[class*="incorrect"]'); }
  get feedbackOverlay() { return browser.$('[class*="overlay"]'); }
  get feedbackMessage() { return browser.$('[class*="message"]'); }

  async navigate() {
    await browser.url(this.url);
  }

  async isDisplayed() {
    const el = await this.pokemonButton;
    return el.isDisplayed();
  }

  async waitForGameReady() {
    await browser.waitUntil(
      async () => {
        const btn = await this.pokemonButton;
        return btn.isDisplayed();
      },
      { timeout: 15000, timeoutMsg: 'El juego no cargó en el tiempo esperado' }
    );
  }

  async getCurrentTerm() {
    const el = await this.termText;
    await el.waitForDisplayed({ timeout: 10000 });
    return el.getText();
  }

  async getProgressText() {
    const el = await this.progressText;
    return el.getText();
  }

  async clickPokemon() {
    const el = await this.pokemonButton;
    await el.waitForClickable({ timeout: 10000 });
    await el.click();
  }

  async clickVenezolano() {
    const el = await this.venezolanoButton;
    await el.waitForClickable({ timeout: 10000 });
    await el.click();
  }

  /**
   * Responde correctamente al término mostrado en pantalla.
   * Usa el lookup de categorías para determinar la respuesta correcta.
   */
  async answerCorrectly() {
    const term = await this.getCurrentTerm();
    const category = TERM_CATEGORIES[term] || 'pokemon';
    if (category === 'pokemon') {
      await this.clickPokemon();
    } else {
      await this.clickVenezolano();
    }
  }

  /**
   * Responde incorrectamente al término mostrado en pantalla.
   */
  async answerIncorrectly() {
    const term = await this.getCurrentTerm();
    const category = TERM_CATEGORIES[term] || 'pokemon';
    if (category === 'pokemon') {
      await this.clickVenezolano();
    } else {
      await this.clickPokemon();
    }
  }

  /**
   * Espera a que el feedback desaparezca y se muestre el siguiente término.
   */
  async waitForNextQuestion() {
    await browser.waitUntil(
      async () => {
        const overlay = await this.feedbackOverlay;
        const exists = await overlay.isExisting();
        if (!exists) return true;
        const displayed = await overlay.isDisplayed();
        return !displayed;
      },
      { timeout: 5000, timeoutMsg: 'El feedback no desapareció a tiempo' }
    );
    // Esperar a que los botones estén activos para la siguiente pregunta
    const btn = await this.pokemonButton;
    await btn.waitForClickable({ timeout: 5000 });
  }

  /**
   * Juega N preguntas respondiendo correctamente `targetCorrect` veces.
   * @param {number} targetCorrect - Cantidad de respuestas correctas deseadas
   * @param {number} totalQuestions - Total de preguntas (default 10)
   * @returns {{ correct: number, incorrect: number }}
   */
  async playGame(targetCorrect, totalQuestions = 10) {
    let correct = 0;
    let incorrect = 0;

    for (let i = 0; i < totalQuestions; i++) {
      await this.waitForGameReady();

      if (correct < targetCorrect) {
        await this.answerCorrectly();
        correct++;
      } else {
        await this.answerIncorrectly();
        incorrect++;
      }

      // Esperar transición al siguiente término (excepto en la última pregunta)
      if (i < totalQuestions - 1) {
        await this.waitForNextQuestion();
      }
    }

    return { correct, incorrect };
  }
}

module.exports = new GamePage();
