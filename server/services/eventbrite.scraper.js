require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const { chromium } = require('playwright');
const cheerio = require('cheerio');
const Event = require('../models/Event');
const { EVENT_STATUS } = require('../utils/constants');

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            require('dotenv').config();
        }
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sydney_events');
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('DB Connection Error:', err.message);
        process.exit(1);
    }
};

const scrapeEventbrite = async () => {
    await connectDB();

    console.log("Starting Eventbrite Scraper (Heuristic Mode)...");
    const browser = await chromium.launch({ headless: true });

    // Stealth context
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
    });
    const page = await context.newPage();

    try {
        // Adding source=search to minimal URL to look more natural
        const url = 'https://www.eventbrite.com/d/australia--sydney/events/';
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

        // Dynamic wait for content
        try {
            await page.waitForSelector('main', { timeout: 10000 });
        } catch (e) { console.log("Waiting for main timeout"); }

        // Aggressive scroll to trigger all lazy images
        await page.evaluate(async () => {
            const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
            const height = document.body.scrollHeight;
            for (let i = 0; i < height; i += 500) {
                window.scrollTo(0, i);
                await delay(100);
            }
        });
        await page.waitForTimeout(2000);

        const content = await page.content();
        const $ = cheerio.load(content);

        const eventsToProcess = [];

        // Strategy: Find Titles (h3/h2), then traverse UP to find the Card container that has an Image.
        $('h3, h2').each((i, el) => {
            const title = $(el).text().trim();
            if (title.length < 3) return;

            // Traverse up to find a container with an image and a link
            let card = $(el).parent();
            let foundImg = null;
            let foundLink = null;
            let foundDate = null;

            // Max 6 levels up
            for (let k = 0; k < 6; k++) {
                if (!card || card.length === 0) break;

                const img = card.find('img').first();
                const link = card.find('a[href*="/e/"]').first();
                const dateElem = card.find('time, .date, p:contains("2025"), p:contains("2026")').first();

                if (img.length > 0 && !foundImg) foundImg = img;
                if (link.length > 0 && !foundLink) foundLink = link;
                if (dateElem.length > 0) foundDate = dateElem.text().trim();

                if (foundImg && foundLink) break; // Found both!

                card = card.parent();
            }

            if (foundLink) {
                const linkHref = foundLink.attr('href');
                const sourceUrl = linkHref.startsWith('http') ? linkHref : `https://www.eventbrite.com${linkHref}`;
                const cleanUrl = sourceUrl.split('?')[0];

                // Image Extraction Logic
                let imageUrl = "";
                if (foundImg) {
                    imageUrl = foundImg.attr('src') || foundImg.attr('data-src') || foundImg.attr('srcset') || "";
                    // If srcset, take the first one or largest? Usually src is fine if lazy load triggered
                    if (imageUrl.startsWith('//')) imageUrl = `https:${imageUrl}`;
                    // Fallback cleanup
                    if (imageUrl.includes('data:image')) imageUrl = ""; // Avoid base64 placeholders
                }

                eventsToProcess.push({
                    title,
                    sourceUrl: cleanUrl,
                    city: 'Sydney',
                    sourceName: 'Eventbrite',
                    lastScrapedAt: new Date(),
                    imageUrl,
                    dateString: foundDate
                });
            }
        });

        console.log(`Found ${eventsToProcess.length} potential events.`);

        // Deduplicate by URL
        const uniqueEvents = Array.from(new Map(eventsToProcess.map(item => [item.sourceUrl, item])).values());

        let updateCount = 0;
        let newCount = 0;

        for (const evt of uniqueEvents) {
            const existing = await Event.findOne({ sourceUrl: evt.sourceUrl });

            if (!existing) {
                await Event.create({
                    ...evt,
                    status: EVENT_STATUS.NEW
                });
                console.log(`New event: ${evt.title}`);
                newCount++;
            } else {
                existing.lastScrapedAt = new Date();
                // Force update image if we found a better one
                if (evt.imageUrl && evt.imageUrl.length > 10) {
                    existing.imageUrl = evt.imageUrl;
                }
                await existing.save();
                updateCount++;
            }
        }

        console.log(`Summary: ${newCount} New, ${updateCount} Updated.`);

    } catch (error) {
        console.error('Scraping failed:', error);
    } finally {
        await browser.close();
        await mongoose.connection.close();
    }
};

if (require.main === module) {
    scrapeEventbrite();
}

module.exports = { scrapeEventbrite };
