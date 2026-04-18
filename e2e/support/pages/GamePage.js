// Lookup de categorías de términos conocidos (basado en seed 001_terms.sql — 100 términos)
const TERM_CATEGORIES = {
  // ── Pokémon (50 términos) ──
  'Charmander': 'pokemon',
  'Pikachu': 'pokemon',
  'Bulbasaur': 'pokemon',
  'Squirtle': 'pokemon',
  'Jigglypuff': 'pokemon',
  'Eevee': 'pokemon',
  'Mewtwo': 'pokemon',
  'Gengar': 'pokemon',
  'Onix': 'pokemon',
  'Snorlax': 'pokemon',
  'Geodude': 'pokemon',
  'Machop': 'pokemon',
  'Diglett': 'pokemon',
  'Psyduck': 'pokemon',
  'Caterpie': 'pokemon',
  'Weedle': 'pokemon',
  'Rattata': 'pokemon',
  'Pidgey': 'pokemon',
  'Zubat': 'pokemon',
  'Abra': 'pokemon',
  'Kadabra': 'pokemon',
  'Dragonite': 'pokemon',
  'Lapras': 'pokemon',
  'Togepi': 'pokemon',
  'Marill': 'pokemon',
  'Wobbuffet': 'pokemon',
  'Mudkip': 'pokemon',
  'Torchic': 'pokemon',
  'Gardevoir': 'pokemon',
  'Flygon': 'pokemon',
  'Lucario': 'pokemon',
  'Garchomp': 'pokemon',
  'Toxicroak': 'pokemon',
  'Mimikyu': 'pokemon',
  'Rowlet': 'pokemon',
  'Litten': 'pokemon',
  'Popplio': 'pokemon',
  'Wooloo': 'pokemon',
  'Corviknight': 'pokemon',
  'Ditto': 'pokemon',
  'Magikarp': 'pokemon',
  'Gyarados': 'pokemon',
  'Alakazam': 'pokemon',
  'Haunter': 'pokemon',
  'Clefairy': 'pokemon',
  'Vulpix': 'pokemon',
  'Growlithe': 'pokemon',
  'Poliwag': 'pokemon',
  'Oddish': 'pokemon',
  'Bellsprout': 'pokemon',
  'Jolteon': 'pokemon',
  'Lugia': 'pokemon',
  'Arcanine': 'pokemon',
  'Primarina': 'pokemon',
  'Rapidash': 'pokemon',
  'Darmanitan': 'pokemon',
  'Jynx': 'pokemon',
  'Kommo-o': 'pokemon',
  'Aegislash': 'pokemon',
  'Ludicolo': 'pokemon',
  'Milotic': 'pokemon',
  'Yveltal': 'pokemon',
  'Carnivine': 'pokemon',
  'Jumpluff': 'pokemon',
  'Yanmega': 'pokemon',
  'Infernape': 'pokemon',
  'Pidgeot': 'pokemon',
  'Yamper': 'pokemon',
  'Sylveon': 'pokemon',
  'Cresselia': 'pokemon',
  'Meloetta': 'pokemon',
  // ── Venezolano (50 términos + 35 nombres) ──
  'Arepa': 'venezolano',
  'Cachapa': 'venezolano',
  'Hallaca': 'venezolano',
  'Tequeño': 'venezolano',
  'Pabellón': 'venezolano',
  'Guarapo': 'venezolano',
  'Papelón': 'venezolano',
  'Chimó': 'venezolano',
  'Chamo': 'venezolano',
  'Catire': 'venezolano',
  'Sifrino': 'venezolano',
  'Pana': 'venezolano',
  'Marico': 'venezolano',
  'Burda': 'venezolano',
  'Ladilla': 'venezolano',
  'Gafo': 'venezolano',
  'Cambur': 'venezolano',
  'Lechosa': 'venezolano',
  'Guayoyo': 'venezolano',
  'Morocho': 'venezolano',
  'Patacón': 'venezolano',
  'Mandoca': 'venezolano',
  'Golfeado': 'venezolano',
  'Cachito': 'venezolano',
  'Fosforera': 'venezolano',
  'Perolita': 'venezolano',
  'Chuzo': 'venezolano',
  'Güevón': 'venezolano',
  'Coroto': 'venezolano',
  'Corotico': 'venezolano',
  'Chévere': 'venezolano',
  'Chola': 'venezolano',
  'Tusera': 'venezolano',
  'Macundales': 'venezolano',
  'Mecate': 'venezolano',
  'Cocuy': 'venezolano',
  'Pasticho': 'venezolano',
  'Birra': 'venezolano',
  'Gandola': 'venezolano',
  'Cotufa': 'venezolano',
  'Pavita': 'venezolano',
  'Zamuro': 'venezolano',
  'Cuaima': 'venezolano',
  'Sapoara': 'venezolano',
  'Bochinche': 'venezolano',
  'Perico': 'venezolano',
  'Bachaco': 'venezolano',
  'Taguara': 'venezolano',
  'Palmarejo': 'venezolano',
  'Guacharo': 'venezolano',
  'Yorman': 'venezolano',
  'Yosmar': 'venezolano',
  'Maikel': 'venezolano',
  'Yuleisy': 'venezolano',
  'Yorgelis': 'venezolano',
  'Ender': 'venezolano',
  'Yuleima': 'venezolano',
  'Wilmer': 'venezolano',
  'Yennifer': 'venezolano',
  'Yusleidy': 'venezolano',
  'Jhosmar': 'venezolano',
  'Carleisy': 'venezolano',
  'Luismar': 'venezolano',
  'Andrelis': 'venezolano',
  'Pedrimar': 'venezolano',
  'Migleisy': 'venezolano',
  'Rafelis': 'venezolano',
  'Danimar': 'venezolano',
  'Josleiny': 'venezolano',
  'Carlimar': 'venezolano',
  'Andryelis': 'venezolano',
  'Jhonleisy': 'venezolano',
  'Luisdrel': 'venezolano',
  'Marleisy': 'venezolano',
  'Yandriela': 'venezolano',
  'Carleiny': 'venezolano',
  'Josmary': 'venezolano',
  'Yormanis': 'venezolano',
  'Andresmar': 'venezolano',
  'Pedrelys': 'venezolano',
  'Yorandri': 'venezolano',
  'Luisyelis': 'venezolano',
  'Jhoseidy': 'venezolano',
  'Carleysi': 'venezolano',
  'Yormanely': 'venezolano',
};

class GamePage {
  get url() { return '/game'; }

  // --- Selectors (usan data-testid del frontend real) ---
  get termText() { return browser.$('[data-testid="term-text"]'); }
  get pokemonButton() { return browser.$('#btn-pokemon'); }
  get venezolanoButton() { return browser.$('#btn-venezolano'); }
  get progressText() { return browser.$('[data-testid="question-counter"]'); }
  get progressBar() { return browser.$('[data-testid="progress-bar"]'); }
  get loadingMessage() { return browser.$('[data-testid="game-loading"]'); }
  get gameContainer() { return browser.$('[data-testid="game-container"]'); }
  get feedbackOverlay() { return browser.$('[data-testid="feedback-overlay"]'); }
  get feedbackMessage() { return browser.$('[data-testid="feedback-message"]'); }

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
