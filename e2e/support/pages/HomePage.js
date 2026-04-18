class HomePage {
  get url() { return '/'; }

  get loginButton() { return browser.$('#home-login-btn'); }
  get registerButton() { return browser.$('#home-register-btn'); }
  get guestButton() { return browser.$('#home-guest-btn'); }
  get logo() { return browser.$('h1'); }

  async navigate() {
    await browser.url(this.url);
  }

  async isDisplayed() {
    const el = await this.logo;
    return el.isDisplayed();
  }

  async clickLogin() {
    const el = await this.loginButton;
    await el.waitForClickable({ timeout: 10000 });
    await el.click();
  }

  async clickRegister() {
    const el = await this.registerButton;
    await el.waitForClickable({ timeout: 10000 });
    await el.click();
  }

  async clickGuestPlay() {
    const el = await this.guestButton;
    await el.waitForClickable({ timeout: 10000 });
    await el.click();
  }
}

module.exports = new HomePage();
