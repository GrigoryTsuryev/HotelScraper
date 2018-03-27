const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');

module.exports = {
  scrapeHotel() {
    return new Promise(async (resolve, reject) => {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      page.emulate(devices['iPhone 6']);
      let startURL = ('https://www.booking.com/hotel/ru/moscow-grand.en-gb.html?aid=304142;label=gen173nr-1FCAEoggJCAlhYSDNYBGhqiAEBmAEuuAEHyAEM2AEB6AEB-AELkgIBeagCAw;sid=b88aecb12d32719a92c4810e0011e53c;all_sr_blocks=4099601_108861133_0_2_0;bshb=2;checkin=2018-05-15;checkout=2018-05-18;dest_id=-2960561;dest_type=city;dist=0;group_adults=2;hapos=1;highlighted_blocks=4099601_108861133_0_2_0;hpos=1;room1=A%2CA;sb_price_type=total;srepoch=1521118523;srfid=affaf7bebab879e267765a6f2f3fcba33acbd798X1;srpvid=eeec5adcc6020321;type=total;ucfs=1&#hotelTmpl');
      try {
        page.goto(startURL);
      }
      catch (e) {
        page.$('.room');
        await page.waitForSelector('.room');
        const result = page.evaluate(() => {
          const data = { deals: [] };
          [...document.querySelectorAll('.room')].forEach((room) => {
            if (room.querySelector('.pod_tick.u-font-weight-bold')) {
              data.deals.push({
                provider: 'Booking',
                name: room.querySelector('.room__title-text').innerText,
                price: room.querySelector('.price').innerText.replace(/\D+/g, ''),
                currency: room.querySelector('.price').innerText.replace(/[0-9]/g, '').slice(' ')[0],
                cancellation: room.querySelector('.pod_tick.u-font-weight-bold').innerText.split('before')[0].trim(),
              });
            }
            else {
              data.deals.push({
                provider: 'Booking',
                name: room.querySelector('.room__title-text').innerText,
                price: room.querySelector('.price').innerText.replace(/\D+/g, ''),
                currency: room.querySelector('.price').innerText.replace(/[0-9]/g, '').split(' ')[0],
                cancellation: 'Non-refundable',
              });
            }
            return data;
          });
        });
        console.log(result);
        browser.close();
        resolve(result);
      }
    });
  },
};
