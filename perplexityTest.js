const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function getPPHeaders() {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    // Set viewport
    await page.setViewport({ width: 1280, height: 800 });

    // Set user agent
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36');

    let PPheaders;
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      PPheaders = request.headers();
      request.continue();
    });

    await page.goto('https://www.perplexity.ai/', { waitUntil: 'load', timeout: 0 });
    const PPcookies = await page.cookies();
    await page.screenshot({ path: "image.png" });

    await browser.close();
    return { headers: PPheaders, cookies: PPcookies };

  } catch (error) {
    console.error('An error occurred in getPPHeaders:', error);
    if (browser) {
      await browser.close();
    }
    return null;
  }
}

async function perplexityTest() {
  try {
    let { headers, cookies } = await getPPHeaders();
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    // Set viewport
    await page.setViewport({ width: 1280, height: 800 });

    // Set user agent
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36');

    await page.setExtraHTTPHeaders(headers);
    for (const cookie of cookies) {
      await page.setCookie(cookie);
    }

    // Navigate through the page
    await page.goto('https://www.perplexity.ai/', { waitUntil: 'load' });
    await page.waitForSelector(".ml-md > button"), { delay: 100 };
    await page.click(".ml-md > button"), { delay: 100 };
    await page.waitForSelector(".max-w-sm input"), { delay: 100 };
    await page.click(".max-w-sm input"), { delay: 100 };
    await page.type(".max-w-sm input", 'a@a.com', { delay: 100 });
    await page.screenshot({ path: "image2.png" });
    await page.click('div.border-t.mt-md button'), { delay: 100 };
    ({ headers, cookies } = await getPPHeaders());
    await page.setExtraHTTPHeaders(headers);
    for (const cookie of cookies) {
      await page.setCookie(cookie);
    }
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Take a screenshot
    await page.screenshot({ path: "image3.png" });

    await browser.close();

  } catch (error) {
    console.error('An error occurred in perplexityTest:', error);
  }
}

// Usage example:
perplexityTest()
  .catch((error) => {
    console.error('An unexpected error occurred:', error);
  });
