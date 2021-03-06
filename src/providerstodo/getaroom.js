const puppeteer = require('puppeteer');

module.exports = {
  scrapeHotel() {
    return new Promise(async (resolve, reject) => {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      let startUrl = ('https://www.getaroom.com/hotels/the-cosmopolitan-of-las-vegas?&check_in=04%2F24%2F2018&check_out=04%2F26%2F2018&destination=Las+Vegas&page%5Bending_before%5D=&page%5Bpage_number%5D=1&page%5Bstarting_after%5D=&property_name=&rinfo=%5B%5B18%5D%5D&sort_order=undefined#avail');

      await page.goto(startUrl);

      await page.$('.room');
      const result = await page.evaluate(() => {
        const data = { deals: [] };
        [...document.querySelectorAll('.room')].forEach((room) => {
          data.deals.push({
            provider: 'GETAROOM',
            name: room.querySelector('.unit-title').innerText.split('\n').splice(0, 1).join('\n').trim()
              .split('Save')[0],
            price: room.querySelector('.amount').innerText.replace(/[^0-9.,]+/g, ''),
            currency: room.querySelector('.amount').innerText.replace(/[\^0-9,. ]+/g, ''),
            cancellation: room.querySelector('.rate-description').innerText,
          });
        });
        return data;
      });

      browser.close();
      resolve(result);
    });
  },
};
