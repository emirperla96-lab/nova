import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));
  
  await page.evaluateOnNewDocument(() => {
    // Inject a global variable to bypass login if the app supports it
    window.__MOCK_USER = {
      uid: 'super-admin-emir',
      email: 'emirperla96@gmail.com',
      name: 'Emir Perla (Super Admin)',
      isSuperAdmin: true,
    };
  });

  await page.goto('http://localhost:3000');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Try to click the "Instant Launch as Super Admin" button!
  try {
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const launchBtn = btns.find(b => b.textContent.includes('Instant Launch'));
      if (launchBtn) launchBtn.click();
    });
    console.log("Clicked login button");
  } catch (e) {
    console.log("Could not click login", e);
  }

  await new Promise(resolve => setTimeout(resolve, 10000));
  await browser.close();
})();
