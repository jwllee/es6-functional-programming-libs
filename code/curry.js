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
}];
    
// Normal
var filterEs = function(xs) {
  return xs.filter(function(x) { 
    return x.match(/e/i);
  });
};

var brands = [];
for (let i = 0; i < COMPUTERS.length; i++) {
  brands.push(COMPUTERS[i].brand.toLowerCase());
};
var aux = new Set(brands);
brands = [];
for (let brand of aux) {
  brands.push(brand);
};
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
var brandNameLowerCaseLodash = map(brandNameLowerCase);
var brands = brandNameLowerCaseLodash(COMPUTERS);
console.log(filterEsLodash(_.uniq(brands)));

// Ramda
// match return a list or null in Ramda
var filterEsRamda = R.filter(R.test(/e/i));
var brandNameLowerCaseRamda = R.map(brandNameLowerCase);
var brands = brandNameLowerCaseRamda(COMPUTERS);
console.log(filterEsRamda(R.uniq(brands)));

// lodash/fp
var filterEsFp = fp.filter(match(/e/i));
var brandNameLowerCaseFp = fp.map(brandNameLowerCase);
var brands = brandNameLowerCaseFp(COMPUTERS);
console.log(filterEsFp(fp.uniq(brands)));


