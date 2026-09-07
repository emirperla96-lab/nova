import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  await page.evaluateOnNewDocument(() => {
    window.__MOCK_USER = {
      uid: 'super-admin-emir',
      email: 'emirperla96@gmail.com',
      name: 'Emir Perla (Super Admin)',
      isSuperAdmin: true,
    };
  });

  await page.goto('http://localhost:3000');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
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

  // Wait long enough for the dashboard to render and potentially crash
  await new Promise(resolve => setTimeout(resolve, 6000));
  await browser.close();
})();
