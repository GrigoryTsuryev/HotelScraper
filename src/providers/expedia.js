const puppeteer = require('puppeteer');
var fs = require('fs');
var getCurrencyFromSymbol = require('currency-symbol-map').getCurrencyFromSymbol;


let scrape = async () => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    var start_urls = ('https://www.expedia.com/New-York-Hotels-Hilton-Garden-Inn-Times-Square.h15987.Hotel-Information?adults=2&children=0&=undefined&chkin=03%2F11%2F2018&chkout=03%2F13%2F2018')
try{
    await page.goto(start_urls);
}  catch(e) {

    await page.$('span.room-price-value');
    
    const result = await page.evaluate(( ) => {
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
                          name: elmInfo.innerText.split('\n').splice(0,1).join('\n'),
                          price: rate.querySelector('.room-price-value').innerText.replace(/\D+/g, ''),
                          cancellation: rate.querySelector('.rate-policies').innerText.split('\n').splice(0,1).join('\n'),
                          currency: document.querySelector('.price.link-to-rooms ').innerText.replace(/[0-9]/g, '')
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
    fs.writeFile('expedia.json',JSON.stringify(value, null, '  '),function(err){
        if(err) throw err;
      })
});