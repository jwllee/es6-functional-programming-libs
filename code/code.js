_ = require('lodash');
curry = require('lodash/curry');
fp = require('lodash/fp');
R = require('ramda');

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
    
// Normal
var filterEs = function(xs) {
  return xs.filter(function(x) { 
    return x.match(/e/i);
  });
};

var brands = COMPUTERS.map(function(x) { return x.brand.toLowerCase(); });
var aux = new Set(brands);
brands = [];
aux.forEach(function(x) {brands.push(x);});
console.log(filterEs(brands));

// Lodash
// Need to reimplement functions because of the order of the parameters
var map = curry(function(f, xs) {
  return _.map(xs, f);
});
var filter = curry(function(f, x) {
  return _.filter(x, f);
});
var match = curry(function(what, x) {
  return x.match(what);
});
var brandNameLowerCase = function(x) {
  return x.brand.toLowerCase();
};
var filterEsLodash = filter(match(/e/i));
var brands = map(brandNameLowerCase, COMPUTERS);
console.log(filterEsLodash(_.uniq(brands)));

// Ramda
// match return a list or null in Ramda
var filterEsRamda = R.filter(R.test(/e/i));
var brands = R.map(brandNameLowerCase, COMPUTERS);
console.log(filterEsRamda(R.uniq(brands)));

// lodash/fp
var filterEsFp = fp.filter(match(/e/i));
var brands = fp.map(brandNameLowerCase, COMPUTERS);
console.log(filterEsFp(fp.uniq(brands)));

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


