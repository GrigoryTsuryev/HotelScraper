const puppeteer = require('puppeteer');
// let fs = require('fs');


let scrape = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  let startURL = ('https://www.expedia.com/New-York-Hotels-Hilton-Garden-Inn-Times-Square.h15987.Hotel-Information?adults=2&children=0&=undefined&chkin=04%2F17%2F2018&chkout=04%2F18%2F2018&swpToggleOn=false&daysInFuture=&stayLength=&ts=1521467424320');
  await page.goto(startURL);
  await page.$('span.room-price-value');
  const result = await page.evaluate(() => {
    const data = { deals: [] };
    [...document.querySelectorAll('.room')].forEach((room) => {
      const elmInfo = room.querySelector('.room-info');
      if (elmInfo) {
        [...room.querySelectorAll('.rate-plan')].forEach((rate) => {
          data.deals.push({
            name: elmInfo.innerText.split('\n').splice(0, 1).join('\n'),
            price: rate.querySelector('.room-price-value').innerText.replace(/\D+/g, ''),
            cancellation: rate.querySelector('.rate-policies').innerText.split('\n').splice(0, 1).join('\n'),
            currency: document.querySelector('.price.link-to-rooms ').innerText.replace(/[0-9]/g, ''),
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
