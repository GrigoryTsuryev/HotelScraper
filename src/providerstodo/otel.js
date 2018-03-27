const puppeteer = require('puppeteer');
// let fs = require('fs');

let scrape = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  let startURL = ('https://www.otel.com/desert-paradise-resort-las-vegas-usa-107c1a/?checkin=2018-05-08&checkout=2018-05-10&currency=ILS&pax=2&search_key=20180508_2_2_3_102_85b0da27a7224300bc355d1c223bdaf5_15-21-11-30-28-0-22-3-69-36-42-75-27-25-34-40-61-83-85&pid=3138302e30302d313030332e37372d494c537c6774617c323031382d30332d31352031343a31373a32327c63353363393238373865303238633834346232623839363761643233636162347c313030332e37372d3130372e35342d3839362e32322d302e3132');
  // try {
  await page.goto(startURL);
  // } catch (e) {
  await page.$('.room-availability__table tbody');
  // await page.$('.room-availability__see-all').click;
  const result = await page.evaluate(() => {
    const data = { deals: [] };
    [...document.querySelectorAll('.room-availability__table tbody')].forEach((room) => {
      const line = room.querySelector('.room-availability__price:not(.room-availability__price--bold)');
      const elmInfo = room.querySelector('.room-availability__room-type');
      if (line) {
        [...room.querySelectorAll('.room-availability__price:not(.room-availability__price--bold)')].forEach((rate) => {
          data.deals.push({
            name: elmInfo.innerText,
            price: rate.innerText.replace(/\D+/g, ''),
            currency: rate.innerText.replace(/[0-9]/g, ''),
            cancellation: rate.parentElement.previousSibling.querySelector('.information-tooltip__toggle').innerText.split('\n').splice(0, 1).join('\n').split('Cancellation Po')[0],
          });
        });
      }
    });
    return data; // Return our data array
  });
  browser.close();
  return result; // Return the data
};
// }
scrape().then((value) => {
  console.log(value);
  // fs.writeFile('otel.json',JSON.stringify(value, null, '  '),function(err){
  //     if(err) throw err;
  //   })
});
