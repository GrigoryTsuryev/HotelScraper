const puppeteer = require('puppeteer');
var fs = require('fs');



let scrape = async () => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    var start_urls = ('https://vacation.hotwire.com/Las-Vegas-Hotels-The-Venetian-Las-Vegas.h1443.Hotel-Information?chkin=3%2F15%2F2018&chkout=3%2F16%2F2018&rm1=a2&regionId=178276&hwrqCacheKey=7d6486e5-e733-41e3-b9ae-335c1198e8a0HWRQ1521109776310&vip=false&c=f8ac63cc-671e-4ce8-9722-88a4d58c0c19&&exp_dp=269.31&exp_ts=1521109777365&exp_curr=USD&swpToggleOn=false&exp_pg=HSR')
    try {
        await page.goto(start_urls);
    } catch (e) {

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
                const elmInfo = room.querySelector('.room-info');
                if (elmInfo) {
                [...room.querySelectorAll('.rate-plan')].forEach((rate) => { 
                        data.deals.push({
                            name: elmInfo.querySelector('.room-name ').innerText,
                            price: rate.querySelector('.room-price-value').innerText.replace(/\D+/g, ''),
                            currency: rate.querySelector('.room-price-value').innerText.replace(/[0-9]/g, ''),
                            cancellation: rate.querySelector('.rate-policies').innerText.split('\n').splice(0,1).join('\n'), 
                        });
                });
                }
            });

            return data; // Return our data array

        });

        browser.close();
        return result; // Return the data
    };
}
scrape().then((value) => {
    fs.writeFile('hotwire.json',JSON.stringify(value, null, '  '),function(err){
        if(err) throw err;
      })
});
