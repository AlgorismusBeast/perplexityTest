const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function getPPHeaders() {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
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
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36');
    await page.setExtraHTTPHeaders(headers);
    for (const cookie of cookies) {
      await page.setCookie(cookie);
    }

    // Navigate through the page
    await page.goto('https://www.perplexity.ai/', { waitUntil: 'load' });

    // await page.waitForSelector(".ml-md > button"), { delay: 10000 };
    // await page.click(".ml-md > button"), { delay: 10000 };

    // NEW BUTTON ATTEMPT
    await page.waitForSelector(".ml-md.mt-md button[type='button']", { timeout: 10000 });
    await page.click(".ml-md.mt-md button[type='button']", { delay: 10000 });

    await page.setRequestInterception(true);
    page.on('request', async request => {
      let url = request.url()
      if (url.includes('/api/auth/signin/email')) {
        PPheaders = request.headers()
        PPcookies = await page.cookies()
      }
      request.continue();
    });

    await page.screenshot({ path: "image2.png" });
    await page.click('div.border-t.mt-md button'), { delay: 10000 };


    await new Promise(resolve => setTimeout(resolve, 10000));
    await page.screenshot({ path: "image3.png" });
    await browser.close();

    return { headers: PPheaders, cookies: PPcookies }; // Return the headers and cookies
  } catch (error) {
    console.error('An error occurred in perplexityTest:', error);
  }
}

// Usage example:
// perplexityTest()
//   .then(({ headers, cookies }) => {
//     console.log('Headers and cookies:', headers, cookies);
//   })
//   .catch((error) => {
//     console.error('An unexpected error occurred:', error);
//   });

module.exports.perplexityTest = perplexityTest;

