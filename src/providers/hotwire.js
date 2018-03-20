const puppeteer = require('puppeteer');
// let fs = require('fs');
let scrape = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  let startUrl = ('https://vacation.hotwire.com/Las-Vegas-Hotels-The-Venetian-Las-Vegas.h1443.Hotel-Information?adults=2&children=0&chkin=04%2F12%2F2018&chkout=04%2F13%2F2018&regionId=178276&hwrqCacheKey=7d6486e5-e733-41e3-b9ae-335c1198e8a0HWRQ1521109776310&vip=false&=undefined&exp_dp=269.31&exp_ts=1521109777365&exp_curr=USD&swpToggleOn=false&exp_pg=HSR&daysInFuture=&stayLength=&ts=1521467845209');
  await page.goto(startUrl);
  await page.$('.room');
  const result = await page.evaluate(() => {
    const data = { deals: [] };
    [...document.querySelectorAll('.room')].forEach((room) => {
      const elmInfo = room.querySelector('.room-info');
      if (elmInfo) {
        [...room.querySelectorAll('.rate-plan')].forEach((rate) => {
          data.deals.push({
            name: elmInfo.querySelector('.room-name').innerText,
            price: rate.querySelector('.room-price-value').innerText.replace(/\D+/g, ''),
            currency: rate.querySelector('.room-price-value').innerText.replace(/[0-9]/g, ''),
            cancellation: rate.querySelector('.rate-policies').innerText.split('\n').splice(0, 1).join('\n'),
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
  // fs.writeFile('hotwire.json',JSON.stringify(value, null, '  '),function(err){
  //     if(err) throw err;
  //   })
});

module.exports.scrape = scrape;
