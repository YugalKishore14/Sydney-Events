const { chromium } = require("playwright");
const cheerio = require("cheerio");
const Event = require("../models/Event");
const { EVENT_STATUS } = require("../utils/constants");

const scrapeEvents = async () => {
    console.log("Starting scraper...");
    console.log("SCRAPER FILE LOADED");


    const browser = await chromium.launch({
        headless: true,
    });

    const context = await browser.newContext({
        userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
    });

    const page = await context.newPage();

    try {
        await page.goto(
            "https://whatson.cityofsydney.nsw.gov.au/major-events-and-festivals",
            {
                waitUntil: "domcontentloaded",
                timeout: 120000,
            }
        );

        // Let JS render cards
        await page.waitForTimeout(4000);

        const content = await page.content();
        const $ = cheerio.load(content);

        const eventsToSave = [];

        $("article").each((_, element) => {
            const title = $(element).find("h3").first().text().trim();
            const relativeLink = $(element).find("a").attr("href");
            const description = $(element).find("p").first().text().trim();
            const image =
                $(element).find("img").attr("src") ||
                $(element).find("img").attr("data-src");

            if (!title || !relativeLink) return;

            const sourceUrl = relativeLink.startsWith("http")
                ? relativeLink
                : `https://whatson.cityofsydney.nsw.gov.au${relativeLink}`;

            eventsToSave.push({
                externalId: sourceUrl,
                title,
                sourceUrl,
                description,
                imageUrl: image,
                city: "Sydney",
                venue: "Sydney",
                date: new Date(), // placeholder
                lastScrapedAt: new Date(),
            });
        });

        console.log(`Found ${eventsToSave.length} events`);
        console.log("PAGE OPENED");


        for (const evt of eventsToSave) {
            const existing = await Event.findOne({ externalId: evt.externalId });

            if (!existing) {
                await Event.create({
                    ...evt,
                    status: EVENT_STATUS.NEW,
                });
                console.log(`New event saved: ${evt.title}`);
            }
        }
    } catch (err) {
        console.error("Scraping failed:", err.message);
    } finally {
        await browser.close();
        console.log("Scraper finished.");
        console.log("HTML LENGTH:");

    }
};

module.exports = { scrapeEvents };
