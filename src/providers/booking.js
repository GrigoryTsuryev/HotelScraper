const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
let fs = require('fs');


let scrape = async () => {
  const iPhone = devices['iPhone 6'];
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.emulate(iPhone);
  let startURL = ('https://www.booking.com/hotel/ru/moscow-grand.en-gb.html?aid=304142;label=gen173nr-1FCAEoggJCAlhYSDNYBGhqiAEBmAEuuAEHyAEM2AEB6AEB-AELkgIBeagCAw;sid=b88aecb12d32719a92c4810e0011e53c;all_sr_blocks=4099601_108861133_0_2_0;bshb=2;checkin=2018-05-15;checkout=2018-05-18;dest_id=-2960561;dest_type=city;dist=0;group_adults=2;hapos=1;highlighted_blocks=4099601_108861133_0_2_0;hpos=1;room1=A%2CA;sb_price_type=total;srepoch=1521118523;srfid=affaf7bebab879e267765a6f2f3fcba33acbd798X1;srpvid=eeec5adcc6020321;type=total;ucfs=1&#hotelTmpl');
  await page.goto(startURL);
  await page.$('.db-card__room');
  const result = await page.evaluate(() => {
    const data = {
      query: {
      },
      deals: [],
    };
    [...document.querySelectorAll('.db-card__room')].forEach((room) => {
      if (room.querySelector('.pod_tick.u-font-weight-bold')) {
        data.deals.push({
          name: room.querySelector('.room__title-text').innerText,
          price: room.querySelector('.price').innerText.replace(/\D+/g, ''),
          currency: room.querySelector('.price').innerText.replace(/[0-9]/g, ''),
          cancellation: room.querySelector('.pod_tick.u-font-weight-bold').innerText,
        });
      }
      else {
        data.deals.push({
          name: room.querySelector('.room__title-text').innerText,
          price: room.querySelector('.price').innerText.replace(/\D+/g, ''),
          currency: room.querySelector('.price').innerText.replace(/[0-9]/g, ''),
          cancellation: 'Non-refundable',
        });
      }
      return data; // Return our data array
    });
    browser.close();
    return result; // Return the data
  });
  scrape().then((value) => {
    fs.writeFile('booking.json', JSON.stringify(value, null, '  '), function error(err) {
      if (this.err) throw err;
    });
  });
};
