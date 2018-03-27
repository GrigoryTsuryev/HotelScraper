const puppeteer = require('puppeteer');
// let fs = require('fs');
let scrape = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  let startUrl = ('https://www.roomertravel.com/hotels/cancun-hotels/hard-rock-hotel-cancun-all-inclusive.h517088/45030396?redis_id=6||517088||2018-09-27||2018-09-30||||2||0||||NON_REFUNDABLE||2||45030396||US||NDUwMzAzOTY%3D&orig_price=289&&map=false');
  await page.goto(startUrl);
  await page.$('.room');
  const result = await page.evaluate(() => {
    const data = { deals: [] };
    [...document.querySelectorAll('.room_type_item')].forEach((room) => {
      const elmInfo = room.querySelector('.room_type_header_data_string');
      if (elmInfo) {
        [...room.querySelectorAll('.component_items_wrapper')].forEach((rate) => {
          data.deals.push({
            name: elmInfo.innerText,
            price: rate.querySelector('.text_price_new').innerText.replace(/\D+/g, ''),
            currency: rate.querySelector('.text_price_new').innerText.replace(/[0-9]/g, '').split('\n').splice(1, 1).join('\n')
              .trim(),
            cancellation: rate.querySelector('.clearfix.item_header').innerText.split('\n').splice(1, 1).join('\n')
              .trim(),
          });
        });
      }
    });
    return data; // Return our data array
  });
  browser.close();
  return result; // Return the data
};
scrape().then((value) => {
  console.log(value);
});

