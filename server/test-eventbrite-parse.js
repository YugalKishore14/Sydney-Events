const { chromium } = require("playwright");
const cheerio = require("cheerio");

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(
        "https://www.eventbrite.com/d/australia--sydney/events/",
        { waitUntil: "domcontentloaded", timeout: 120000 }
    );

    await page.waitForTimeout(5000);

    const html = await page.content();
    const $ = cheerio.load(html);

    let count = 0;

    $("a[href*='/e/']").each((i, el) => {
        const title =
            $(el).find("h3").text().trim() ||
            $(el).text().trim().slice(0, 80);

        const link = $(el).attr("href");

        if (title && link) {
            count++;
            console.log(`${count}. ${title}`);
        }
    });

    console.log("TOTAL EVENTS FOUND:", count);
    await browser.close();
})();
