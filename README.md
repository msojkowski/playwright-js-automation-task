# Project playwright-js-automation-task

## Overview

Project Name is a test automation project built with [Playwright](https://playwright.dev/), a powerful framework for browser automation. This project is designed to help you efficiently automate end-to-end testing, boosting confidence in your web applications by ensuring consistent user experience across different browsers.

## Features

- Cross-browser testing: Run tests in Chrome, Firefox, and WebKit.
- Headless execution: Perform tests without a UI for better performance and resource utilization.
- Easy to write and maintain tests with Playwright's rich API.
- Supports CI/CD integration for continuous testing.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (>= v12.x.x)
- npm (comes with Node.js) or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/msojkowski/playwright-js-automation-task
   
2. Navigate into the project directory:
 
   ```bash
   cd playwright-js-automation-task
   
3. Install dependencies:
 
    ```bash
   npm install
   # or
   yarn install
   
4. Install Playwright and the necessary browser binaries:
 
    ```bash
   npx playwright install
   
## Configuration
Configure your test settings in the playwright.config.js file. You can specify options such as the browsers to test against, paths to test files, or custom launch options.

## Running Tests
Execute the test suite using the following command:
   npx playwright test

Execute the test suite in UI mode using the following command:
   npx playwright test --ui
   
For detailed reports, you can generate an HTML report with:
   npx playwright show-report

## Contact
For any questions, please contact [mateusz.sojkowski@stnext.pl].

## Additional spottings
1. Sort-by button functionality is not sorting the values - it is moving the selected element to the end of the list.
2. Accessibility issues spotted thanks to the analyze tool.

## Potential improvements
1. Page Object Model
2. Data fixtures
3. CI/CD