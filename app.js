
let inquirer = require('inquirer');
inquirer.registerPrompt('datetime', require('inquirer-datepicker-prompt'));
let dateFormat = require('dateformat');


let request = [
  {
    type: 'input',
    name: 'city',
    message: 'Type your city',
  },
  {
    type: 'input',
    name: 'hotel',
    message: 'Type your hotel',
  },
  {
    type: 'datetime',
    name: 'checkin',
    message: 'Select your checkin date',
    format: ['yyyy', '-', 'mm', '-', 'dd'],
  },
  {
    type: 'datetime',
    name: 'checkout',
    message: 'Select your checkout date',
    format: ['yyyy', '-', 'mm', '-', 'dd'],
  },
  {
    type: 'list',
    name: 'providers',
    message: 'Choose provider(s)',
    choices: [
      'All',
      'Booking.com',
      'Expedia.com',
      'Getaroom.com',
      'Hotels.com',
      'Hotwire.com',
      'Otel.com',
    ],
  },
];

let startUrl = [];

inquirer.prompt(request).then((response) => {
  switch (response.providers) {
    case 'Otel.com': startUrl = `https://www.otel.com/${response.hotel.replace(/ /g, '-')}-${response.city.replace(/ /g, '-')}-107c1a/?checkin=${dateFormat(response.checkin, 'isoDate')}&checkout=${dateFormat(response.checkout, 'isoDate')}&currency=USD&pax=2`;
      break;
    case 'Hotwire.com': startUrl = 'https://www.otel.com/desert-paradise-resort-las-vegas-usa-107c1a/?checkin=2018-05-08&checkout=2018-05-10&currency=USD&pax=2';
      break;
    case 'Hotels.com': startUrl = 'https://www.otel.com/desert-paradise-resort-las-vegas-usa-107c1a/?checkin=2018-05-08&checkout=2018-05-10&currency=USD&pax=2';
      break;
    case 'Getaroom.com': startUrl = 'https://www.otel.com/desert-paradise-resort-las-vegas-usa-107c1a/?checkin=2018-05-08&checkout=2018-05-10&currency=USD&pax=2';
      break;
    case 'Expedia.com': startUrl = 'https://www.otel.com/desert-paradise-resort-las-vegas-usa-107c1a/?checkin=2018-05-08&checkout=2018-05-10&currency=USD&pax=2';
      break;
    case 'Booking.com': startUrl = 'https://www.otel.com/desert-paradise-resort-las-vegas-usa-107c1a/?checkin=2018-05-08&checkout=2018-05-10&currency=USD&pax=2';
      break;
    default: startUrl = ['https://www.otel.com/desert-paradise-resort-las-vegas-usa-107c1a/?checkin=2018-05-08&checkout=2018-05-10&currency=USD&pax=2', 'https://www.otel.com/desert-paradise-resort-las-vegas-usa-107c1a/?checkin=2018-05-08&checkout=2018-05-10&currency=USD&pax=2'];
  }
  let data = {
    query: {
      city: response.city,
      hotel: response.hotel,
      checkin: dateFormat(response.checkin, 'isoDate'),
      checkout: dateFormat(response.checkout, 'isoDate'),
      providers: response.providers,
      urls: startUrl,
    },
  };
  console.log(data);
});
