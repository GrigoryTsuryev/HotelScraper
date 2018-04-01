const puppeteer = require('puppeteer');
const rp = require('request-promise');
const dateFormat = require('dateformat');

function getHotelPageURL(options) {
  let url = `https://lookup.hotels.com/suggest/champion/json?locale=en_US&boostConfig=config-boost-challenger&excludeLpa=false&query=${options.city}+${options.hotel}`;

  return rp({ url, json: true })
    .then((data) => {
      let hotelID = data.suggestions
        .find(s => s.group === 'HOTEL_GROUP')
        // .find(h => h.name.toLowerCase() === options.hotel.toLowerCase())
        .entities[0]
        .destinationId;

      return `https://www.hotels.com/ho${hotelID}/?locale=en_US&q-check-out=${dateFormat(options.checkout, 'mm/dd/yyyy')}&q-check-in=${dateFormat(options.checkin, 'mm/dd/yyyy')}&WOE=4&WOD=1&q-room-0-children=${options.children}&pa=11&tab=description&JHR=2&q-room-0-adults=${options.adults}`;
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
    await page.$('.room');
    const result = await page.evaluate(() => {
      const data = { deals: [] };

      [...document.querySelectorAll('.room')].forEach((room) => {
        const elmInfo = room.querySelector('.room-info h3');
        let currencySymbols = {
          $: 'USD', // US Dollar
        };

        if (elmInfo) {
          [...room.querySelectorAll('.pricing')].forEach(() => {
            data.deals.push({
              providers: 'Hotels.com',
              name: elmInfo.innerText,
              price: room.querySelector('.current-price').innerText.replace(/\D+/g, ''),
              currency: currencySymbols[room.querySelector('.current-price').innerText.replace(/[0-9]/g, '')],
              cancellation: room.querySelector('strong.widget-tooltip').innerText,
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
