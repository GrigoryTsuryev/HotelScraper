const dateFormat = require('dateformat');
const inquirer = require('inquirer');
const scraper = require('./src/scraper');

inquirer.registerPrompt('datetime', require('inquirer-datepicker-prompt'));

const request = [
  {
    type: 'input',
    name: 'city',
    message: 'Type your city',
    validate(answer) {
      if (answer.length < 1) {
        return 'Type city inside';
      }
      return true;
    },
  },
  {
    type: 'input',
    name: 'hotel',
    message: 'Type your hotel',
    validate(answer) {
      if (answer.length < 1) {
        return 'Type hotel inside';
      }
      return true;
    },
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
    type: 'checkbox',
    name: 'providers',
    message: 'Choose provider(s)',
    choices: [
      { name: 'expedia', value: 1, checked: true },
      { name: 'orbitz', value: 2, checked: true },
      { name: 'travelocity', value: 3, checked: true },
      { name: 'cheaptickets', value: 4, checked: true },
      { name: 'tripAdvisor', value: 7, checked: true },
      { name: 'hotels', value: 8, checked: true },
      { name: 'otel', value: 9, checked: true },
      { name: 'booking', value: 10, checked: true },
      { name: 'priceline', value: 11, checked: true },
      { name: 'roomer', value: 12, checked: true },
      { name: 'hotwire', value: 13, checked: true },
      { name: 'getaroom', value: 14, checked: true },
    ],
    validate(answer) {
      if (answer.length < 1) {
        return 'Choose at least one presented option.';
      }
      return true;
    },
  },
  {
    type: 'list',
    name: 'adults',
    message: 'Number of adults',
    choices: [
      '1',
      {
        name: '2',
        checked: true,
      },
      '3',
      '4',
    ],
    validate(answer) {
      if (answer.length < 1 || answer.length >= 2) {
        return 'Choose only one presented option.';
      }
      return true;
    },
  },
  {
    type: 'list',
    name: 'children',
    message: 'Number of children',
    choices: [
      {
        name: '0',
        checked: true,
      },
      '1',
      '2',
      '3',
      '4',
    ],
    validate(answer) {
      if (answer.length < 1) {
        return 'Choose only one presented option.';
      }
      return true;
    },
  },
];

inquirer.prompt(request).then((response) => {
  const options = {
    city: response.city,
    hotel: response.hotel,
    adults: response.adults,
    children: response.children,
    ages: 'Need to work on ages',
    checkin: dateFormat(response.checkin, 'isoDate'),
    checkout: dateFormat(response.checkout, 'isoDate'),
    providers: response.providers,
    urls: 'Need to work on bulding links',
  };

  console.log(options);

  scraper.scrapeHotel(options);
});
