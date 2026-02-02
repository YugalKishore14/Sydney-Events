const { chromium } = require("playwright");

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(
        "https://www.eventbrite.com/d/australia--sydney/events/",
        { waitUntil: "domcontentloaded", timeout: 120000 }
    );

    await page.waitForTimeout(5000);

    const html = await page.content();
    console.log("HTML LENGTH:", html.length);

    await browser.close();
})();
