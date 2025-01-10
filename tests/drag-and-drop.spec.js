// @ts-check
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

function getColumnByHeader(page, columnHeader) {
    return page.getByRole("listbox").filter({ has: page.getByRole("heading", { name: columnHeader }) });
}

function getColumnItems(page, columnHeader) {
    return page.getByRole("listbox").filter({ has: page.getByRole("heading", { name: columnHeader }) }).getByRole("option");
}

function getColumnItemByName(page, columnHeader, columnItemName) {
    return page.getByRole("listbox").filter({ has: page.getByRole("heading", { name: columnHeader }) }).getByRole("option", { name: columnItemName });
}

test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    await page.goto('https://cdpn.io/pen/debug/WNPVoag');
});

test('has title', async ({ page }) => {
    // Expect a page title "to contain" a substring.
    await expect(page).toHaveTitle('Drag and Drop (with sorting)');
});

test('page elements display', async ({ page }) => {
    // Expect to see the page heading.
    await expect(page.getByRole("heading", { name: "Drag and Drop (with sorting)" })).toBeVisible();
    // Expect to see the columns with expected names.
    await expect(getColumnByHeader(page, "Trees")).toBeVisible();
    await expect(getColumnByHeader(page, "Bushes")).toBeVisible();
    await expect(getColumnByHeader(page, "Flowers")).toBeVisible();
    // Expect to see the columns' items (first ones).
    await expect(getColumnItemByName(page, "Trees", "Oak")).toBeVisible();
    await expect(getColumnItemByName(page, "Bushes", "Juniper")).toBeVisible();
    await expect(getColumnItemByName(page, "Flowers", "Rose")).toBeVisible();
});

test('select a single element and place it in another column', async ({ page }) => {
    //Count number of elements in the first column.
    const numberOfElements = await getColumnItems(page, "Trees").count();
    //Select random element in the first column.
    const pickedElement = Math.floor(Math.random() * numberOfElements - 1).toString();
    await getColumnItems(page, "Trees").locator(`nth=${pickedElement}`).click();
    //Get and save the selected element label for verification in the last step.
    const pickedElementLabel = await getColumnItems(page, "Trees").locator(`nth=${pickedElement}`).textContent();
    const slicedElementLabel = pickedElementLabel?.slice(0, pickedElementLabel.length - 2);
    //Place the element in the third column.
    await getColumnByHeader(page, "Flowers").click();
    //Check if the element is properly displayed.
    await expect(getColumnItemByName(page, "Flowers", slicedElementLabel)).toBeVisible();
})

test('select multiple elements and place them in another column', async ({ page }) => {
    //Count number of elements in the third column.
    const numberOfElements = await getColumnItems(page, "Flowers").count();
    //Select random number of elements in the third column.
    const numberOfSelectedElements = Math.floor(Math.random() * numberOfElements) || 1;
    const pickedElementsLables = [];
    for (let i = 0; i < numberOfSelectedElements; i++) {
        await getColumnItems(page, "Flowers").locator(`nth=${i.toString()}`).click();

        const pickedElementLabel = await getColumnItems(page, "Flowers").locator(`nth=${i.toString()}`).textContent();
        const slicedElementLabel = pickedElementLabel?.slice(0, pickedElementLabel.length - 2);

        pickedElementsLables.push(slicedElementLabel);
    }
    //Place the element in the second column.
    await getColumnByHeader(page, "Bushes").click();
    //Check if the elements are properly displayed.
    for (const item of pickedElementsLables) {
        await expect(getColumnItemByName(page, "Bushes", item)).toBeVisible();
    }
})

test('drag and drop single element', async ({ page }) => {
    //Count number of elements in the second column.
    const numberOfElements = await getColumnItems(page, "Bushes").count();
    //Select random element in the second column.
    const pickedElement = Math.floor(Math.random() * numberOfElements - 1).toString();
    const selectedElement = getColumnItems(page, "Bushes").locator(`nth=${pickedElement}`);
    //Get and save the selected element label for verification in the last step.
    const pickedElementLabel = await getColumnItems(page, "Bushes").locator(`nth=${pickedElement}`).textContent();
    const slicedElementLabel = pickedElementLabel?.slice(0, pickedElementLabel.length - 2);
    //Drag random element in the second column and drop it in the first column.
    await selectedElement.hover();
    await page.mouse.down();
    await page.mouse.move(0, 0);
    await getColumnByHeader(page, "Trees").hover();
    await page.mouse.up();
    //Check if the element is properly displayed.
    await expect(getColumnItemByName(page, "Trees", slicedElementLabel)).toBeVisible();
});

test('drag and drop multiple elements', async ({ page }) => {
    //Count number of elements in the third column.
    const numberOfElements = getColumnItems(page, "Flowers").count();
    //Select random number of elements in the third column.
    const numberOfSelectedElements = Math.floor(Math.random() * numberOfElements) || 1;
    const pickedElementsLables = [];
    for (let i = 0; i < numberOfSelectedElements; i++) {
        await getColumnItems(page, "Flowers").locator(`nth=${i.toString()}`).click();

        const pickedElementLabel = await getColumnItems(page, "Flowers").locator(`nth=${i.toString()}`).textContent();
        const slicedElementLabel = pickedElementLabel?.slice(0, pickedElementLabel.length - 2);

        pickedElementsLables.push(slicedElementLabel);
    }
    //Drag random element in the third column and drop it in the first column.
    await page.locator("li[aria-checked=true]").first().hover();
    await page.mouse.down();
    await page.mouse.move(0, 0);
    await getColumnByHeader(page, "Trees").hover();
    await page.mouse.up();
    //Check if the elements are properly displayed.
    for (const item of pickedElementsLables) {
        await expect(getColumnItemByName(page, "Trees", item)).toBeVisible();
    }
});

test('accessibility check', async ({ page }) => {
    // Accessibility check with build-in tool.
    const accessibilityScanResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
})