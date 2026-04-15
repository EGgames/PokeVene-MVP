class RegisterPage {
  get url() { return '/register'; }

  // --- Selectors ---
  get usernameInput() { return browser.$('#reg-username'); }
  get passwordInput() { return browser.$('#reg-password'); }
  get confirmPasswordInput() { return browser.$('#reg-confirm-password'); }
  get submitButton() { return browser.$('button[type="submit"]'); }
  get loginLink() { return browser.$('a[href="/login"]'); }
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

  async setConfirmPassword(value) {
    const el = await this.confirmPasswordInput;
    await el.waitForDisplayed({ timeout: 10000 });
    await el.setValue(value);
  }

  async clickSubmit() {
    const el = await this.submitButton;
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

module.exports = new RegisterPage();
