const puppeteer = require('puppeteer');
// var fs = require('fs');
let scrape = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  let startUrl = ('https://www.hotels.com/ho557335/?q-check-out=2018-05-24&FPQ=null&q-check-in=2018-05-21&WOE=4&WOD=1&q-room-0-children=0&pa=11&tab=description&JHR=2&q-room-0-adults=2&YGF=14&MGT=3&ZSX=0&SYE=3')
  await page.goto(startUrl);
  await page.$('.room');
  const result = await page.evaluate(() => {
    const data = { deals: [] };
    [...document.querySelectorAll('.room')].forEach((room) => {
      const elmInfo = room.querySelector('.room-info h3');
      if (elmInfo) {
        [...room.querySelectorAll('.pricing')].forEach(() => {
          data.deals.push({
            name: elmInfo.innerText,
            price: room.querySelector('.current-price').innerText.replace(/\D+/g, ''),
            currency: room.querySelector('.current-price').innerText.replace(/[0-9]/g, ''),
            cancellation: room.querySelector('strong.widget-tooltip').innerText,
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
  // fs.writeFile('hotels.json',JSON.stringify(value, null, '  '),function(err){
  //     if(err) throw err;
  //   })
});
