const providers = require('./providers');

module.exports = {
  scrapeHotel(options) {
    Promise.all(options.providers
      .filter(provider => provider in providers && typeof providers[provider].scrapeHotel === 'function')
      .map(provider => providers[provider].scrapeHotel(options)))
      .then((results) => {
        console.log(JSON.stringify(results, null, '  '));
      });
  },
  getHotelPageURL(options) {
    Promise.all(options.providers
      .filter(provider => provider in providers && typeof providers[provider].getHotelPageURL === 'function')
      .map(provider => providers[provider].getHotelPageURL(options)))
      .then(results => results);
  },
};

