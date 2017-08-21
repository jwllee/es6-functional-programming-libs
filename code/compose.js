var _ = require('lodash');
var curry = require('lodash/curry');
var fp = require('lodash/fp');
var R = require('ramda');

// Data
var COMPUTERS = [{
    brand: 'Lenovo',
    model: 'IdeaPad 320',
    ram: 8,
    dollar_value: 1000,
    in_stock: true,
}, {
    brand: 'HP',
    model: 'ThinkPad',
    ram: 16,
    dollar_value: 1500,
    in_stock: true,
}, {
    brand: 'Asus',
    model: 'VivoBook',
    ram: 8,
    dollar_value: 1200,
    in_stock: true,
}, {
    brand: 'Apple',
    model: 'MacBook Pro',
    ram: 16, 
    dollar_value: 3000,
    in_stock: true,
}, {
    brand: 'Dell',
    model: 'Alienware',
    ram: 16, 
    dollar_value: 2000,
    in_stock: false,
}, {
    brand: 'MSI', 
    model: 'Dominator Pro',
    ram: 32,
    dollar_value: 2500,
    in_stock: true,
}, {
    brand: 'Acer',
    model: 'Gamer Nitro',
    ram: 16,
    dollar_value: 1500,
    in_stock: false,
}, {
    brand: 'Dell', 
    model: 'Latitude',
    ram: 8, 
    dollar_value: 1000,
    in_stock: true,
}]
 
// Compose
var toUpperCase = function(x) {
  return x.toUpperCase();
};
var exclaim = function(x) {
  return x + '!';
};
var shout = R.compose(exclaim, toUpperCase);
console.log(shout("hello world"));

var _average = function(xs) {
  return R.reduce(R.add, 0, xs) / xs.length;
};

// Normal
var averageDollarValue = function(computers) {
  var dollar_values = R.map(function(c) {
    return c.dollar_value;
  }, computers);
  return _average(dollar_values);
};
var computersOnStock = COMPUTERS.filter(function(x) { return x.in_stock == true; });
console.log(averageDollarValue(computersOnStock));

// ramda
var isInStock = function(x) { return x.in_stock == true; };
var averageDollarValueR = R.compose(_average, 
                                    R.map(R.prop('dollar_value')), 
                                    R.filter(isInStock));
console.log(averageDollarValueR(COMPUTERS));


