const puppeteer = require('puppeteer');
const rp = require('request-promise');
const dateFormat = require('dateformat');

function getHotelPageURL(options) {
  let url = `https://suggest.expedia.com/api/v4/typeahead/${options.city}+${options.hotel}?client=Homepage&lob=HOTELS&locale=en_US&regiontype=2047&ab=&dest=true&maxresults=8&features=contextual_ta%7Cpostal_code%7Cta_hierarchy%7CaltRegion&personalize=true&format=json`;

  return rp({ url, json: true })
    .then((data) => {
      let hotelID = data.sr
        .find(s => s.hotelId).hotelId;
      return `https://www.cheaptickets.com/h${hotelID}.Hotel-Information?adults=${options.adults}&children=${options.children}&chkin=${dateFormat(options.checkin, 'mm/dd/yyyy')}&chkout=${dateFormat(options.checkout, 'mm/dd/yyyy')}&exp_curr=USD`;
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
    try {
      await page.goto(startUrl);
    }
    catch (e) {
      await page.$('.room');
      const result = await page.evaluate(() => {
        const data = { deals: [] };
        [...document.querySelectorAll('.room:not(.first-room-featured)')].forEach((room) => {
          const elmInfo = room.querySelector('.room-name');
          let currencySymbols = {
            $: 'USD',
          };

          if (elmInfo) {
            [...room.querySelectorAll('.rate-plan')].forEach((rate) => {
              data.deals.push({
                providers: 'Cheaptickets.com',
                name: elmInfo.innerText,
                price: rate.querySelector('.room-price-value').innerText.replace(/\D+/g, ''),
                currency: currencySymbols[rate.querySelector('.room-price-value').innerText.replace(/[0-9,]/g, '')],
                cancellation: rate.querySelector('.rate-policies').innerText.split('\n')[0],
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
    }
  });
}

module.exports = {
  scrapeHotel,
  getHotelPageURL,
};
