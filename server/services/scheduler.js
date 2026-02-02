const cron = require('node-cron');
const { scrapeEvents } = require('./scraper');

const initScheduler = () => {
    // Run everyday at midnight
    cron.schedule('0 0 * * *', () => {
        console.log('Running daily event scrape...');
        scrapeEvents();
    });
    console.log('Scheduler initialized: Scraping set for midnight.');
};

module.exports = { initScheduler };
