const puppeteer = require('puppeteer');
var fs = require('fs');



let scrape = async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    var start_urls = ('https://www.getaroom.com/hotels/the-venetian-resort-hotel-casino?&check_in=04%2F24%2F2018&check_out=04%2F26%2F2018&destination=Las+Vegas&page%5Bending_before%5D=&page%5Bpage_number%5D=1&page%5Bstarting_after%5D=&property_name=&rinfo=%5B%5B18%5D%5D&sort_order=undefined#avail')
    // try {
        await page.goto(start_urls);
    // } catch (e) {

        await page.$('.room');

        const result = await page.evaluate(() => {
            const data = {
                query: {
                    "ota": "name",
                    "location": "name",
                    "hotel": "name",
                    "checkin": "yyyy-mm-dd",
                    "checkout": "yyyy-mm-dd",
                    "url": "https://…"
                },
                deals: []
            };
            [...document.querySelectorAll('.room')].forEach((room) => {
             
                    
                    // [...room.querySelectorAll('[data-block-id]')].forEach((rate) => {
                        data.deals.push({
                            name: room.querySelector('.unit-title').innerText.split('\n').splice(0,1).join('\n').trim().split("Save")[0],
                            price: room.querySelector('.amount').innerText.replace(/[^0-9\.,]+/g,""),
                            currency: room.querySelector('.amount').innerText.replace(/[\^0-9,. ]+/g,""),
                            cancellation: room.querySelector('.rate-description').innerText
                    // });
                });

            });

            return data; // Return our data array

        });

        browser.close();
        return result; // Return the data
    };


    scrape().then((value) => {
        // console.log(value)
        fs.writeFile('getaroom.json',JSON.stringify(value, null, '  '),function(err){
            if(err) throw err;
          })
    });
