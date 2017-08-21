Lodash y similares para soporte de paradigma funcional
=====================================================
#### (es6-functional-programming-libs)

- Juan Castro Penna
- Wai Lam Jonathan Lee


### Los puntos principales en esta presentacion
- Las librerias que vamos a presentar: 1) lodash, 2) ramda, 3) lodash/fp, y porque algunas son mejor que otra, e.g., el orden de los argumentos
- Currying
- ``Compose`` y pointfree funciones

-----------------------------------------------------

### Recursos
- [FP in JavaScript](https://medium.freecodecamp.org/functional-programming-in-js-with-practical-examples-part-1-87c2b0dbc276)
- (Youtube) [Porque importa el orden de los parametros de funciones](https://www.youtube.com/watch?v=m3svKOdZijA)
- Ramda docs](http://ramdajs.com/)
- [Lodash docs](https://lodash.com/)
- [Mostly adequate guide](https://github.com/MostlyAdequate/mostly-adequate-guide)

-----------------------------------------------------

### Setup
#### Instalar las librerias
```
// instalar local
npm install ramda
npm install lodash
```
#### O, usar [Repl](https://repl.it/languages/javascript)

-----------------------------------------------------

#### Data
```javascript
const COMPUTERS = [{
    brand: 'Lenovo',
    model: 'IdeaPad 320',
    ram: 8,
    dollar_value: 1000,
    in_stock: true,
}, { brand: 'HP',
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
}]
```
    
-------------------------------------------------------

### 1. Currying
```javascript
let add = function(x, y) {
  return x + y;
};

add(1 + 2);
//=> 3

let addCurried = function(x) {
  return function(y) {
    return x + y;
  };
};

var increment = addCurried(1);
var addFive = addCurried(5);

increment(3);
//=> 4

addFive(3);
//=> 8

addCurried(1)(2);
//=> 3
```
Una funcion "curried" puede acceptar menos argumentos y devuelve una funcion. Uno puede escribir todas las funciones en forma curried pero va a tener caso como ``addCurried(1)(2)``. Entonces se usa ``curry`` para "currify" funciones.

Ahora vamos a ver las distintas librerias y investigar las diferencias entre las librerias.

--------------------------------------------------------

Ej: Encontrar todas las marcas de laptops que tienen la letra 'E'.

#### Normal
```javascript
let filterEs = function(xs) {
  return xs.filter(function(x) { 
    return x.match(/e/i);
  });
};

var brands = COMPUTERS.map((x) => x.brand.toLowerCase());
console.log(filterEs(brands));
//=> ['lenovo', 'apple', 'dell', 'acer', 'dell']
```

#### Lodash
```javascript
const _ = require('lodash');

// Need to reimplement functions because of the order of the parameters
let map = curry((f, xs) => _.map(xs, f));
let filter = curry((f, x) => _.filter(x, f));
let match = curry((what, x) => x.match(what));

let brandNameLowerCase = (x) => x.brand.toLowerCase();
let filterEsLodash = filter(match(/e/i));
var brands = map(brandNameLowerCase, COMPUTERS);
console.log(filterEsLodash(brands));
```
Una limitacion de Lodash es el orden de las funciones, siempre tienen que poner el dato antes de la funcion. Una manera para resolver esta limitacion es usar ``curry`` para reorganizar el orden.

#### Lodash/fp
```javascript
const fp = require('lodash/fp');

let filterEsFp = fp.filter(match(/e/i));
var brands = fp.map(brandNameLowerCase, COMPUTERS);
console.log(filterEsFp(fp.uniq(brands)));
```
La libreria Lodash/fp resuelve la limitacion de Lodash y ahora la reimplementacion accepta la funcion como el primer argumento. 

#### Ramda
```javascript
const R = require('ramda');

// match return a list or null in Ramda
let filterEsRamda = R.filter(R.test(/e/i));
var brands = R.map(brandNameLowerCase, COMPUTERS);
console.log(filterEsRamda(R.uniq(brands)));
```
La libreria Ramda tambien fue desarrollada por la limitacion de Lodash. Todas las funciones son "curried", i.e., pueden acceptar menos argumentos y devuelve una funcion. 

-----------------------------------------------------

### 2. Compose
```javascript
// compose: ((y -> z), (x -> y), ..., (o -> p), ((a, b, ..., n) -> o)) -> ((a, b, ..., n) -> z)
let compose = function(f, g) {
  return function(x) {
    return f(g(x));
  };
};
```
``f`` y ``g`` son funciones y ``x`` es el valor que acepta las dos funciones. Entonces ``compose`` basicamente compone una lista de funciones. 

#### Ejemplo de ``compose``
```javascript
let toUpperCase = function(x) {
  return x.toUpperCase();
};
let exclaim = function(x) {
  return x + '!';
};
let shout = R.compose(exclaim, toUpperCase);
//=> "HELLO WORLD!"
```

Ej: El precio promedio de los laptops que estan in stock
```javascript
let _average = function(xs) {
  return R.reduce(R.add, 0, xs) / xs.length;
};
```

#### Normal
```javascript
let averageDollarValue = function(computers) {
  var dollar_values = computers.map(item => item.dollar_value);
  return _average(dollar_values);
};
var computersOnStock = COMPUTERS.filter(item => item.in_stock == true);
console.log(averageDollarValue(computersOnStock));
//=> 1700
```
``averageDollarValue`` dice en forma explicita que es para computadores y no es muy intuitiva. Ahora la mejoramos usando programacion funcional.

#### Ramda
```javascript
let isInStock = function(x) { return x.in_stock == true; };
let averageDollarValueR = R.compose(_average, 
                                    R.map(R.prop('dollar_value')), 
                                    R.filter(isInStock));
console.log(averageDollarValueR(COMPUTERS));
//=> 1700
```
El uso de ``compose`` permite componer distintas funciones juntas y con 
``map`` y ``reduce`` puede aplicar funciones de un elemento a listas. 

Ademas ``compose`` permite las funciones ser "pointfree" - no tiene que decir nada acerca tu dato.
Entonces las funciones ``isInStock`` y ``averageDollarValueR`` pueden ser aplicadas a otros productos como autos o comidas.

-----------------------------------------------------------------------

### 3. Monads

Existen importantes tecnicas de programación funcional que ni Lodash, Ramda y Lodash/fp implementan, entre los que se encuentran
functors y monads.
Monads son un patron de diseño que describe procedimientos o calculos como una serie de pasos. Los monads envuelven datos dandoles algun comportamiento adicional.
1. Maybe monad: que permite un seguro manejo de datos nulos o indefinidos.
2. Either monad: que facilita el manejo de errores.

Lodash y ramda no implementan monads y por lo tanto si se quieren untilizar se debe ocupar una libreria externa como lodash-fantasy.js, monet.js, o
la que ocuparemos en este caso ramda-fantasy.js.

Ej: Imprimiendo informacion de items

#### Normal

```javascript
function display_item(item, currency) {
    console.log(item.brand + " " + item.model);
    if (item.dollar_value != null) {
        console.log("Buy it for " + item.dollar_value);
    } else {
        console.log("Price: check directly in the store ");
    }
}

display_item(COMPUTERS[9], 'clp');
//=> HP Pavillion
//=> Price: check directly in the store
```

#### Ramda-fantasy maybe monad

```javascript
function ramda_display_item(item, currency) {
    let value = Maybe(item.dollar_value).getOrElse('check directly in the store');
    console.log(item.brand + " " + item.model);
    console.log("Price: " + value);
}

ramda_display_item(COMPUTERS[8], 'clp');

//=> Acer R7
//=> Price: 2000
```

Ej2: Comprando items sin errores

#### Normal

```javascript
const is_error = (error) => { return error && error.name == 'Error' };

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

const buy_item = function (item) {
    let stock_check = check_stock(item);
    if (is_error(stock_check)) {
        return console.log("Error " + stock_check.message);
    }

    let final_price = apply_tax(0.19, item);
    if (is_error(final_price)) {
        return console.log("Error " + final_price.message);
    }
    return console.log("Congrats! the total was:  " + final_price);
};

buy_item(COMPUTERS[0]);
//=> Congrats! the total was:  1190
```

#### Ramda fantasy either monad

```javascript
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
//=> Error price is not numeric
```

Por otro lado, tambien se pueden implementar mediante una clase que defina los metodos map, isNothing, entre otros.
Como se muestra a continuación:

```javascript

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

```

A continuación un ejemplo en el que se ocupan este clase Maybe, junto con: curry, compose y pointfree:

```javascript
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
        street: 'Fitz Roy',
        number: 1460,
    }],
});

console.log(street2);
//=> Maybe("Fitz Roy")
```
