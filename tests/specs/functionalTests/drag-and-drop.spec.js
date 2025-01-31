// @ts-check
const { test, expect } = require('@playwright/test');
const { columnHeader } = require('../../../helpers/constants.js')
const { generateRandomNumber } = require('../../../helpers/utils.js')
const { DragAndDropPage } = require('../../pageObjects/DragAndDropPage')

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
    const dragAndDropPage = new DragAndDropPage(page);
    dragAndDropPage.navigateTo('/');
});

test('has title', async ({ page }) => {
    await test.step('expect a page title to contain a substring', async ({ page }) => {
        await expect(page).toHaveTitle('Drag and Drop (with sorting)');
    })
});

test('page elements display', async ({ page }) => {
    await test.step('expect to see the page heading', async ({ page }) => {
        await expect(page.getByRole("heading", { name: "Drag and Drop (with sorting)" })).toBeVisible();
    })

    await test.step('expect to see the columns with expected names', async ({ page }) => {
        const dragAndDropPage = new DragAndDropPage(page);

        await expect(getColumnByHeader(page, columnHeader[0])).toBeVisible();
        await expect(getColumnByHeader(page, columnHeader[1])).toBeVisible();
        await expect(getColumnByHeader(page, columnHeader[2])).toBeVisible();
    })

    await test.step('expect to see the columns items (first ones', async ({ page }) => {
        await expect(getColumnItemByName(page, columnHeader[0], "Oak")).toBeVisible();
        await expect(getColumnItemByName(page, columnHeader[1], "Juniper")).toBeVisible();
        await expect(getColumnItemByName(page, columnHeader[2], "Rose")).toBeVisible();
    })
});

test('select a single element and place it in another column', async ({ page }) => {
    //Count number of elements in the first column.
    const numberOfElements = await getColumnItems(page, columnHeader[0]).count();

    let pickedElement;
    let slicedElementLabel;

    await test.step('select random element in the first column', async ({ page }) => {
        pickedElement = generateRandomNumber(numberOfElements).toString();
        await getColumnItems(page, columnHeader[0]).locator(`nth=${pickedElement}`).click();
    })

    await test.step('get and save the selected element label for verification in the last step', async ({ page }) => {
        const pickedElementLabel = await getColumnItems(page, columnHeader[0]).locator(`nth=${pickedElement}`).textContent();
        slicedElementLabel = pickedElementLabel?.slice(0, pickedElementLabel.length - 2);
    })

    await test.step('place the element in the third column', async ({ page }) => {
        await getColumnByHeader(page, columnHeader[2]).click();
    })

    await test.step('check if the element is properly displayed', async ({ page }) => {
        await expect(getColumnItemByName(page, columnHeader[2], slicedElementLabel)).toBeVisible();
    })
})

test('select multiple elements and place them in another column', async ({ page }) => {
    //Count number of elements in the third column.
    const numberOfElements = await getColumnItems(page, columnHeader[2]).count();

    let numberOfSelectedElements;
    const pickedElementsLables = [];

    await test.step('select random number of elements in the third column', async ({ page }) => {
        numberOfSelectedElements = generateRandomNumber(numberOfElements) || 1;

        for (let i = 0; i < numberOfSelectedElements; i++) {
            await getColumnItems(page, columnHeader[2]).locator(`nth=${i.toString()}`).click();

            const pickedElementLabel = await getColumnItems(page, columnHeader[2]).locator(`nth=${i.toString()}`).textContent();
            const slicedElementLabel = pickedElementLabel?.slice(0, pickedElementLabel.length - 2);

            pickedElementsLables.push(slicedElementLabel);
        }
    })

    await test.step('place the element in the second column', async ({ page }) => {
        await getColumnByHeader(page, columnHeader[1]).click();
    })

    await test.step('check if the elements are properly displayed', async ({ page }) => {
        for (const item of pickedElementsLables) {
            await expect(getColumnItemByName(page, columnHeader[1], item)).toBeVisible();
        }
    })
})

test('drag and drop single element', async ({ page }) => {
    //Count number of elements in the second column.
    const numberOfElements = await getColumnItems(page, columnHeader[1]).count();

    let pickedElement = generateRandomNumber(numberOfElements).toString();
    let selectedElement;
    let pickedElementLabel;
    let slicedElementLabel;

    await test.step('select random element in the second column', async ({ page }) => {
        pickedElement = generateRandomNumber(numberOfElements).toString();
        selectedElement = await getColumnItems(page, columnHeader[1]).locator(`nth=${pickedElement}`);
    })

    await test.step('get and save the selected element lavel for verification in the last step', async ({ page }) => {
        pickedElementLabel = await getColumnItems(page, columnHeader[1]).locator(`nth=${pickedElement}`).textContent();
        slicedElementLabel = pickedElementLabel?.slice(0, pickedElementLabel.length - 2);
    })

    await test.step('drag random element in the second column and drop it in the first column', async ({ page }) => {
        await selectedElement.hover();
        await page.mouse.down();
        await page.mouse.move(0, 0);
        await getColumnByHeader(page, columnHeader[0]).hover();
        await page.mouse.up();
    })

    await test.step('check if the element is properly displayed', async ({ page }) => {
        await expect(getColumnItemByName(page, columnHeader[0], slicedElementLabel)).toBeVisible();
    })
});

test('drag and drop multiple elements', async ({ page }) => {
    //Count number of elements in the third column.
    const numberOfElements = await getColumnItems(page, columnHeader[2]).count();

    let numberOfSelectedElements
    const pickedElementsLables = [];

    await test.step('select random number of elements in the third column', async ({ page }) => {
        numberOfSelectedElements = generateRandomNumber(numberOfElements) || 1;
        for (let i = 0; i < numberOfSelectedElements; i++) {
            await getColumnItems(page, columnHeader[2]).locator(`nth=${i.toString()}`).click();

            const pickedElementLabel = await getColumnItems(page, columnHeader[2]).locator(`nth=${i.toString()}`).textContent();
            const slicedElementLabel = pickedElementLabel?.slice(0, pickedElementLabel.length - 2);

            pickedElementsLables.push(slicedElementLabel);
        }
    })

    await test.step('drag random element in the third column and drop it in the first column', async ({ page }) => {
        await page.locator("li[aria-checked=true]").first().hover();
        await page.mouse.down();
        await page.mouse.move(0, 0);
        await getColumnByHeader(page, columnHeader[0]).hover();
        await page.mouse.up();
    })

    await test.step('check if the elements are properly displayed', async ({ page }) => {
        for (const item of pickedElementsLables) {
            await expect(getColumnItemByName(page, columnHeader[0], item)).toBeVisible();
        }
    })
});