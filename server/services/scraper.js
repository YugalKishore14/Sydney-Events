const { chromium } = require('playwright');
const cheerio = require('cheerio');
const Event = require('../models/Event');
const { EVENT_STATUS } = require('../utils/constants');

const scrapeEvents = async () => {
    console.log('Starting scraper...');
    const browser = await chromium.launch({ headless: true }); // heavily depends on system deps
    const page = await browser.newPage();

    try {
        // Target: City of Sydney What's On
        await page.goto('https://whatson.cityofsydney.nsw.gov.au/major-events-and-festivals', { timeout: 60000 });

        // Wait for content to load
        await page.waitForSelector('article', { timeout: 10000 }).catch(() => console.log('Timeout waiting for articles'));

        const content = await page.content();
        const $ = cheerio.load(content);
        const eventsToSave = [];

        $('article').each((index, element) => {
            const title = $(element).find('h3').text().trim();
            const link = $(element).find('a').attr('href');
            const description = $(element).find('p').first().text().trim();
            const image = $(element).find('img').attr('src') || $(element).find('img').attr('data-src');

            // Attempt to extract date/location if available on card
            // This varies by site design, so fallback to generic or leave blank
            const dateString = $(element).find('.dates').text().trim() || 'Check details';
            const location = $(element).find('.location').text().trim() || 'Sydney';

            if (title && link) {
                eventsToSave.push({
                    externalId: link, // Use link as unique ID
                    title,
                    sourceUrl: link.startsWith('http') ? link : `https://whatson.cityofsydney.nsw.gov.au${link}`,
                    description,
                    imageUrl: image,
                    dateString,
                    location,
                    date: new Date(), // Placeholder, real scraping would parse dateString
                });
            }
        });

        console.log(`Found ${eventsToSave.length} events.`);

        // Upsert events
        for (const evt of eventsToSave) {
            const existing = await Event.findOne({ externalId: evt.externalId });

            if (!existing) {
                await Event.create({ ...evt, status: EVENT_STATUS.NEW });
                console.log(`New event: ${evt.title}`);
            } else {
                // Optional: Update logic if needed
                // console.log(`Existing event: ${evt.title}`);
            }
        }

    } catch (error) {
        console.error('Scraping failed:', error);
    } finally {
        await browser.close();
        console.log('Scraper finished.');
    }
};

module.exports = { scrapeEvents };
