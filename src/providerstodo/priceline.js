const puppeteer = require('puppeteer');
// let fs = require('fs');


let scrape = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const startUrl = ('https://www.priceline.com/stay/search/details/1556004/20180417/20180419/1?returnUrl=%2Fstay%2Fsearch%2Fhotels%2FLas%2520Vegas,%2520NV%2F20180417%2F20180419%2F1%3FsearchType%3DCITY%26page%3D1&qdp=84.14&qdpcurr=USD&gid=3282&pclnId=AA49C8970565CEB78CB7F19F63EFFBCAAF5AC22A4A946E58FF2D19DAAA54B0A13BE3841CEBA79DA6057FD74620F79B216A474A296A39C2FB68C5B4525C6A189B4221F47BC763BDA1B6EF48231FCB79CA24850993765CB4C2CEFD09A857D1977E408E232E179DAC6F');
  try {
    await page.goto(startUrl);
  }
  catch (e) {
    await page.$('.room-container');
    const result = await page.evaluate(() => {
      const data = { deals: [] };
      [...document.querySelectorAll('.room-container')].forEach((room) => {
        const elmInfo = room.querySelector('.display-name');
        if (elmInfo) {
          [...room.querySelectorAll('div.ng-scope[room][guests]')].forEach((rate) => {
            data.deals.push({
              name: elmInfo.innerText,
              price: rate.querySelector('.room-rate-price .price-dollars').innerText,
              currency: rate.querySelector('.room-rate-price .price-symbol').innerText,
              cancellation: rate.querySelector('.policy-container .ng-binding').innerText,
            });
          });
        }
      });
      return data; // Return our data array
    });
    browser.close();
    return result; // Return the data
  }
};
scrape().then((value) => {
  console.log(value);
  // fs.writeFile('hotwire.json',JSON.stringify(value, null, '  '),function(err){
  //     if(err) throw err;
  //   })
});
// };
// };
