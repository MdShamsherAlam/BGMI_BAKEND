const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const UserAgent = require('user-agents');

// Add stealth plugin
puppeteer.use(StealthPlugin());

const scrapeMovieSite = async (movieUrl) => {
  if (!movieUrl) {
    throw new Error('Movie URL is required');
  }

  const browser = await puppeteer.launch({
    headless: false, // Running in non-headless mode helps bypass detection
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-infobars',
    ],
    defaultViewport: null, // Set viewport to `null` for realistic behavior
  });

  const page = await browser.newPage();

  // Set a realistic user agent
  const userAgent = new UserAgent();
  await page.setUserAgent(userAgent.toString());

  // Handle requests
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    const url = request.url();
    if (
      url.includes('ads') ||
      url.includes('redirect') ||
      url.includes('youtube')
    ) {
      console.log('Blocking:', url);
      request.abort();
    } else {
      request.continue();
    }
  });

  // Go to the movie URL
  try {
    await page.goto(movieUrl, { waitUntil: 'domcontentloaded' });
  } catch (err) {
    console.error('Navigation failed:', err.message);
  }

  // Optionally wait for Cloudflare's challenge to resolve
  await page.waitForTimeout(10000); // Wait 10 seconds for challenge to complete

  const downloadButtonSelector = 'a.download-button'; // Adjust the selector as needed

  try {
    await page.waitForSelector(downloadButtonSelector, { timeout: 15000 });
    await page.click(downloadButtonSelector);
  } catch (err) {
    console.error('Error clicking download button:', err.message);
    throw new Error('Download button not found.');
  }

  // Extract the download link
  const downloadLink = await page.evaluate(() => {
    const linkElement = document.querySelector('a.final-download-link');
    return linkElement ? linkElement.href : null;
  });

  console.log('Download Link:', downloadLink);

  await browser.close();
  return downloadLink;
};

module.exports = {scrapeMovieSite};
