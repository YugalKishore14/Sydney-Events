const { chromium } = require('playwright');
const cheerio = require('cheerio');

(async () => {
    console.log("Launching browser for image debug...");
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Mimic real user
    await page.setExtraHTTPHeaders({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
    });

    try {
        await page.goto('https://www.eventbrite.com/d/australia--sydney/events/', { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.waitForTimeout(3000); // Wait for initial load

        // Scroll down to force lazy loading
        await page.evaluate(async () => {
            const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
            for (let i = 0; i < 3; i++) {
                window.scrollBy(0, 1000);
                await delay(500);
            }
        });

        await page.waitForTimeout(2000);

        const content = await page.content();
        const $ = cheerio.load(content);

        console.log("Analyzing image tags...");

        // Find first 5 event cards
        $('a[href*="/e/"]').slice(0, 5).each((i, el) => {
            console.log(`\n--- Event ${i + 1} ---`);
            const title = $(el).find('h3').text().trim() || "No Title";
            console.log("Title:", title);

            const img = $(el).find('img');
            if (img.length) {
                console.log("Img Tag HTML:", $.html(img));
                console.log("src:", img.attr('src'));
                console.log("data-src:", img.attr('data-src'));
                console.log("srcset:", img.attr('srcset'));
            } else {
                console.log("No img tag found inside this link.");
                // Sometimes the structure is Link -> Div -> Img? Or Link is sibling?
                // Eventbrite cards are usually: 
                // <div class="card"> <a href="..."> <div class="image-container"> <img ...> </div> ... </a> </div>
            }
        });

    } catch (err) {
        console.error("Debug failed:", err);
    } finally {
        await browser.close();
    }
})();
