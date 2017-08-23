/**
 * Created by JuanEnrique on 20-08-17.
 */

R = require("ramda");

class Maybe {

    constructor(val) {
        this.__value = val;
    }

    is_nothing() {
        return (this.__value === null || this.__value === undefined);
    }


    map(func) {
        if (this.is_nothing()) {
            return Maybe.of(null);
        }
        return Maybe.of(func(this.__value));
    }

    join() {
        return this.__value;
    }

    chain(func) {
        return this.map(func).join();
    }

    or_else(def) {
        if (this.is_nothing()) {
            return Maybe.of(def);
        }
        return this;
    }

    static of(val) {
        return new Maybe(val);
    }
}

// Ej 1

let safeHead = function(xs) {
    return Maybe.of(xs[0]);
};

let streetName = R.compose(R.map(R.prop('street')), safeHead, R.prop('addresses'));

let street1 = streetName({
    addresses: [],
});
console.log(street1);
//=> Maybe(null)


let street2 = streetName({
    addresses: [{
        street: 'Shady Ln.',
        number: 4201,
    }],
});

console.log(street2);
//=> Maybe("Shady Ln.")

