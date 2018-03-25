
let inquirer = require('inquirer');
inquirer.registerPrompt('datetime', require('inquirer-datepicker-prompt'));
let dateFormat = require('dateformat');


let request = [
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
      { name: 'All', checked: true },
      'EAN',
      'HOTELBEDS',
      'AMADEUS',
      'GTA',
      'SMYROOMS',
      'TOURICO',
      'ROOMER',
      'INNSTANT',
      'EXTERNAL',
      'PRICELINE',
      'GETAROOM',
      'RESTEL',
      'PTC',
    ],
    validate(answer) {
      if (answer.length < 1) {
        return 'Choose at least one presented option.';
      }
      return true;
    },
  },
  {
    type: 'checkbox',
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
    type: 'checkbox',
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

let startUrl = [];

// let childrenAge = [];
inquirer.prompt(request).then((response) => {
  switch (response.providers) {
    default: startUrl = ['Need to work with bulding links'];
  }
  let data = {
    query: {
      city: response.city,
      hotel: response.hotel,
      adults: response.adults,
      children: response.children,
      ages: 'Need to work on ages',
      checkin: dateFormat(response.checkin, 'isoDate'),
      checkout: dateFormat(response.checkout, 'isoDate'),
      providers: response.providers,
      urls: startUrl,
    },
  };
  console.log(data);
});

