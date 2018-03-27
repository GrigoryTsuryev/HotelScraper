const puppeteer = require('puppeteer');

module.exports = {
  scrapeHotel() {
    return new Promise(async (resolve, reject) => {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      let startURL = ('https://reservations.travelclick.com/74495?children=0&utm_content=copy1-old&dateout=04/28/2018&hotelid=74495&adults=2&datein=04/25/2018&rooms=1#/accommodation/room');
      await page.goto(startURL);
      await page.$('.AccommodationsGrid-card');
      await page.waitFor(5000);
      const result = await page.evaluate(() => {
        const data = { deals: [] };
        [...document.querySelectorAll('.AccommodationsGrid-card')].forEach((room) => {
          data.deals.push({
            provider: 'ORBITZ',
            name: room.querySelector('.CardGrid-summary-title').innerText,
            price: room.querySelector('.CardList-price-title').innerText.split('.')[0].trim().split(' ')[1],
            currency: document.querySelector('.CardList-price-title').innerText.split('.')[0].trim().split(' ')[0],
            cancellation: 'Not presented in provider',
          });
        });
        return data;
      });
      browser.close();
      resolve(result);
    });
  },
};
