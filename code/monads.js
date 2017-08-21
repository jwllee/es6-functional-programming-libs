_ = require("lodash");
R = require("ramda");
M = require("ramda-fantasy").Maybe;
Either = require("ramda-fantasy").Either;

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
}, {
    brand: 'Acer',
    model: 'R7',
    ram: 4,
    dollar_value: 2000,
    in_stock: true
}, {
    brand: 'HP',
    model: 'Pavillion',
    ram: 16,
    dollar_value: null,
    in_stock: true
}, {
    brand: 'HP',
    model: 'Spectre',
    ram: 8,
    dollar_value: 1500,
    in_stock: false
}];

// ************* item display *******************************

// Normal

function display_item(item, currency) {
    console.log(item.brand + " " + item.model);
    if (item.dollar_value != null) {
        console.log("Buy it for " + item.dollar_value);
    } else {
        console.log("Price: check directly in the store ");
    }
}

display_item(COMPUTERS[9], 'clp');

// Ramda fantasy maybe monads

function ramda_display_item(item, currency) {
    let value = M(item.dollar_value).getOrElse('check directly in the store');
    console.log(item.brand + " " + item.model);
    console.log("Price: " + value);
}

ramda_display_item(COMPUTERS[8], 'clp');

// ************* buying an item without errors *******************************

// Normal

const check_stock = function(item) {
    if (item.in_stock === false) {
        return new Error("item not in stock");
    }
    return true;
};

const apply_tax = function(tax, item) {
    if (_.isNumber(item.dollar_value)) {
        return item.dollar_value * (1 + tax);
    }
    return new Error("price is not numeric");
};

const is_error = (error) => { return error && error.name == 'Error' };

const buy_item = function (item) {
    let stock_check = check_stock(item);
    let final_price = 0;

    if (is_error(stock_check)) {
        return console.log("Error " + stock_check.message);
    }

    final_price = apply_tax(0.19, item);
    if (is_error(final_price)) {
        return console.log("Error " + final_price.message);
    }
    return console.log("Congrats! the total was:  " + final_price);
};

buy_item(COMPUTERS[0]);

// Ramda fantasy either monads

const monad_check_stock = R.curry((item) => {
    if (item.in_stock === false) {
        return Either.Left(new Error("item not in stock"));
    }
    return Either.Right(item);
});

const monad_apply_tax = R.curry((tax, item) => {
    if (_.isNumber(item.dollar_value)) {
        return Either.Right(item.dollar_value * (1 + tax));
    }
    return Either.Left(new Error("price is not numeric"));
});

const monad_apply_iva_tax = monad_apply_tax(0.19);

const log_error = function(error) {
    return console.log("Error " + error.message);
};

const display_bought = function(price) {
    return console.log("Congrats! the total was:  " + price);
};

const eitherLogOrShow = Either.either(log_error, display_bought);

const monad_buy_item = function (item) {
    eitherLogOrShow(Either.Right(item).chain(monad_check_stock).chain(monad_apply_iva_tax));
};

monad_buy_item(COMPUTERS[9]);