const { expect } = require('@playwright/test');

exports.DragAndDropPage = class DragAndDropPage {
    constructor(page) {
        this.page = page
    }

    async navigateTo(url) {
        await this.page.goto(url);
    }
}