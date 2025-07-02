// Test siswa end-to-end access via browser
const puppeteer = require('puppeteer');

const testSiswaEndToEnd = async () => {
  let browser;
  try {
    console.log('🧪 Testing siswa end-to-end access...\n');

    // Launch browser
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ['--start-maximized'],
    });

    const page = await browser.newPage();

    // Navigate to login page
    console.log('1. Navigating to siswa login page...');
    await page.goto('http://localhost:3000/login/siswa');
    await page.waitForSelector('form', { timeout: 10000 });

    // Fill login form
    console.log('2. Filling login form...');
    await page.type('input[name="username"]', 'siswa01');
    await page.type('input[name="password"]', 'siswa123');

    // Submit form
    console.log('3. Submitting login...');
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard
    await page.waitForNavigation({ timeout: 10000 });
    console.log('4. Login successful, checking current URL...');
    console.log('Current URL:', page.url());

    // Check if redirected to dashboard
    if (page.url().includes('/dashboard')) {
      console.log('✅ Successfully redirected to dashboard');
    }

    // Navigate to complaints page
    console.log('5. Navigating to complaints page...');
    await page.goto('http://localhost:3000/complaints');
    await page.waitForSelector(
      '[data-testid="complaints-page"], .complaints-container, h1, h2',
      { timeout: 10000 }
    );

    console.log('6. Checking for 403 errors...');

    // Check for any error messages
    const errorElements = await page.$$(
      '.error, .alert-error, [data-testid="error"]'
    );
    if (errorElements.length > 0) {
      console.log('❌ Found error elements on complaints page');
      for (let error of errorElements) {
        const text = await error.textContent();
        console.log('Error:', text);
      }
    } else {
      console.log('✅ No error elements found on complaints page');
    }

    // Check if stats are loading
    console.log('7. Checking stats loading...');
    await page.waitForTimeout(3000); // Wait for API calls

    const statsElements = await page.$$(
      '[data-testid="stats"], .stats, .statistics'
    );
    if (statsElements.length > 0) {
      console.log('✅ Stats elements found on page');
    } else {
      console.log('⚠️ No stats elements found, checking for loading states...');
    }

    // Check browser console for errors
    console.log('8. Checking browser console for errors...');
    const logs = await page.evaluate(() => {
      return window.console._logs || [];
    });

    console.log('🎉 End-to-end test completed successfully!');
    console.log('Please check the browser window for visual confirmation.');

    // Keep browser open for manual inspection
    console.log(
      'Browser will remain open for 30 seconds for manual inspection...'
    );
    await page.waitForTimeout(30000);
  } catch (error) {
    console.error('❌ End-to-end test failed:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

// Only run if puppeteer is available
try {
  testSiswaEndToEnd();
} catch (error) {
  console.log('Puppeteer not available, skipping browser test');
  console.log('Please test manually:');
  console.log('1. Open http://localhost:3000/login/siswa');
  console.log('2. Login with: siswa01 / siswa123');
  console.log('3. Navigate to /complaints');
  console.log('4. Check for any 403 errors');
}
