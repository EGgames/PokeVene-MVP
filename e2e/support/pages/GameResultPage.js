class GameResultPage {
  get url() { return '/game-result'; }

  // --- Selectors (usan data-testid / IDs del frontend real) ---
  get percentageText() { return browser.$('[data-testid="score-percentage"]'); }
  get statusBadge() { return browser.$('[data-testid="game-status"]'); }
  get correctCount() { return browser.$('[class*="correct"]'); }
  get errorsCount() { return browser.$('[class*="errors"]'); }
  get saveButton() { return browser.$('#btn-save-score'); }
  get createAccountButton() { return browser.$('#btn-register-to-save'); }
  get retryButton() { return browser.$('#btn-retry'); }
  get homeButton() { return browser.$('#btn-go-home'); }
  get leaderboardButton() { return browser.$('button*=Ver Tabla de Posiciones'); }
  get successMessage() { return browser.$('[data-testid="save-success"]'); }
  get errorMessageEl() { return browser.$('[class*="error"]'); }

  async isDisplayed() {
    const el = await this.percentageText;
    return el.isDisplayed();
  }

  async waitForResults() {
    await browser.waitUntil(
      async () => {
        const url = await browser.getUrl();
        return url.includes('/game-result');
      },
      { timeout: 15000, timeoutMsg: 'No se redirigió a la pantalla de resultados' }
    );
    const el = await this.percentageText;
    await el.waitForDisplayed({ timeout: 10000 });
  }

  async getPercentage() {
    const el = await this.percentageText;
    return el.getText();
  }

  async getStatus() {
    const el = await this.statusBadge;
    return el.getText();
  }

  async isSaveButtonDisplayed() {
    const el = await this.saveButton;
    return el.isExisting();
  }

  async isSaveButtonEnabled() {
    const el = await this.saveButton;
    const exists = await el.isExisting();
    if (!exists) return false;
    return el.isEnabled();
  }

  async isCreateAccountButtonDisplayed() {
    const el = await this.createAccountButton;
    return el.isExisting();
  }

  async clickSave() {
    const el = await this.saveButton;
    await el.waitForClickable({ timeout: 10000 });
    await el.click();
  }

  async clickRetry() {
    const el = await this.retryButton;
    await el.waitForClickable({ timeout: 10000 });
    await el.click();
  }

  async clickHome() {
    const el = await this.homeButton;
    await el.waitForClickable({ timeout: 10000 });
    await el.click();
  }

  async clickLeaderboard() {
    const el = await this.leaderboardButton;
    await el.waitForClickable({ timeout: 10000 });
    await el.click();
  }

  async getSuccessMessage() {
    const el = await this.successMessage;
    const exists = await el.isExisting();
    if (!exists) return null;
    await el.waitForDisplayed({ timeout: 10000 });
    return el.getText();
  }

  async isLeaderboardButtonDisplayed() {
    const el = await this.leaderboardButton;
    return el.isExisting();
  }
}

module.exports = new GameResultPage();
