const puppeteer = require('puppeteer');
const rp = require('request-promise');
const dateFormat = require('dateformat');

function getHotelPageURL(options) {
  let url = `https://www.otel.com/autocomplete/?query=${options.hotel}`;

  return rp({ url, json: true })
    .then((data) => {
      let hotelUrl = data
        .find(s => s.hotel_url).hotel_url;
      return `https://www.otel.com${hotelUrl}?checkin=${dateFormat(options.checkin, 'yyyy-mm-dd')}&checkout=${dateFormat(options.checkin, 'yyyy-mm-dd')}&currency=USD`;
    })
    .catch((error) => {
      throw new Error(error);
    });
}

function scrapeHotel(options) {
  return new Promise(async (resolve, reject) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const startUrl = await getHotelPageURL(options);
    await page.goto(startUrl);
    console.log(startUrl);
    await page.$('.room-availability__room-type');
    const result = await page.evaluate(() => {
      const data = { deals: [] };
      [...document.querySelectorAll('.room-availability__table tbody')].forEach((room) => {
        const elmInfo = room.querySelector('.room-availability__room-type');
        let currencySymbols = {
          $: 'USD',
        };
        if (elmInfo) {
          [...room.querySelectorAll('tr')].forEach((rate) => {
            data.deals.push({
              name: elmInfo.innerText,
              price: rate.querySelector('.room-availability__price').innerText.replace(/\D+/g, ''),
              currency: currencySymbols[rate.querySelector('.room-availability__price').innerText.replace(/[0-9 ]/g, '')],
              cancellation: rate.querySelector('.information-tooltip__toggle').innerText.split('\n').splice(0, 1).join('\n').split('Cancellation Po')[0].split('lationunt')[0],
            });
          });
        }
      });

      return data;
    });
    browser.close();

    result.deals = result.deals.map((d) => {
      d.url = startUrl;
      return d;
    });
    resolve(result);
  });
}

module.exports = {
  scrapeHotel,
  getHotelPageURL,
};
