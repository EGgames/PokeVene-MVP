class LoginPage {
  get url() { return '/login'; }

  // --- Selectors ---
  get usernameInput() { return browser.$('#login-username'); }
  get passwordInput() { return browser.$('#login-password'); }
  get submitButton() { return browser.$('button[type="submit"]'); }
  get guestButton() { return browser.$('button*=Jugar como Invitado'); }
  get registerLink() { return browser.$('a[href="/register"]'); }
  get errorMessage() { return browser.$('[class*="backendError"]'); }
  get fieldErrors() { return browser.$$('[class*="errorText"]'); }

  async navigate() {
    await browser.url(this.url);
    const el = await this.usernameInput;
    await el.waitForDisplayed({ timeout: 15000 });
  }

  async isDisplayed() {
    const el = await this.usernameInput;
    return el.isDisplayed();
  }

  async setUsername(value) {
    const el = await this.usernameInput;
    await el.waitForDisplayed({ timeout: 10000 });
    await el.setValue(value);
  }

  async setPassword(value) {
    const el = await this.passwordInput;
    await el.waitForDisplayed({ timeout: 10000 });
    await el.setValue(value);
  }

  async clickSubmit() {
    const el = await this.submitButton;
    await el.waitForClickable({ timeout: 10000 });
    await el.click();
  }

  async clickGuestPlay() {
    const el = await this.guestButton;
    await el.waitForClickable({ timeout: 10000 });
    await el.click();
  }

  async getErrorText() {
    const el = await this.errorMessage;
    const exists = await el.isExisting();
    if (!exists) return null;
    return el.getText();
  }
}

module.exports = new LoginPage();
