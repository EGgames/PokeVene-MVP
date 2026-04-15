class LeaderboardPage {
  get url() { return '/leaderboard'; }

  // --- Selectors ---
  get table() { return browser.$('table'); }
  get tableHeaders() { return browser.$$('th'); }
  get tableRows() { return browser.$$('tbody tr'); }
  get refreshButton() { return browser.$('button*=Actualizar'); }
  get loadingState() { return browser.$('div*=Cargando'); }
  get emptyState() { return browser.$('div*=No hay puntajes'); }

  async navigate() {
    await browser.url(this.url);
  }

  async isDisplayed() {
    const el = await this.table;
    return el.isDisplayed();
  }

  async waitForTable() {
    await browser.waitUntil(
      async () => {
        const tbl = await this.table;
        return tbl.isExisting();
      },
      { timeout: 15000, timeoutMsg: 'La tabla de posiciones no se cargó' }
    );
  }

  async getColumnHeaders() {
    const headers = await this.tableHeaders;
    const texts = [];
    for (const header of headers) {
      texts.push(await header.getText());
    }
    return texts;
  }

  async getRowCount() {
    const rows = await this.tableRows;
    return rows.length;
  }

  async getRowData(index) {
    const rows = await this.tableRows;
    if (index >= rows.length) return null;
    const cells = await rows[index].$$('td');
    const data = [];
    for (const cell of cells) {
      data.push(await cell.getText());
    }
    return data;
  }

  async getScorePercentages() {
    const rows = await this.tableRows;
    const percentages = [];
    for (const row of rows) {
      const cells = await row.$$('td');
      if (cells.length >= 3) {
        percentages.push(await cells[2].getText());
      }
    }
    return percentages;
  }

  async clickRefresh() {
    const el = await this.refreshButton;
    await el.waitForClickable({ timeout: 10000 });
    await el.click();
  }
}

module.exports = new LeaderboardPage();
