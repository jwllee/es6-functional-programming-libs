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
- [Ramda docs](http://ramdajs.com/)
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

var brands = [];
// Get the brands in lower case
for (let i = 0; i < COMPUTERS.length; i++) {
  brands.push(COMPUTERS[i].brand.toLowerCase());
};
// Use set to get unique brand values
var aux = new Set(brands);
brands = [];
for (let brand of aux) {
  brands.push(x);
};
console.log(filterEs(brands));
//=> ['lenovo', 'apple', 'dell', 'acer']
```

#### Lodash
```javascript
const _ = require('lodash');
// Need to reimplement functions because of the order of the parameters
let map = curry((f, xs) => _.map(xs, f));
let filter = curry((f, x) => _.filter(x, f));
let match = curry((what, x) => x.match(what));

let brandNameLowerCase = function(x) { return x.brand.toLowerCase(); };
let brandNameLowerCaseList = map(brandNameLowerCase);
let filterEsLodash = filter(match(/e/i));
var brands = brandNameLowerCaseList(COMPUTERS);
console.log(filterEsLodash(brands));
//=> ['lenovo', 'apple', 'dell', 'acer']
```
Una limitacion de Lodash es el orden de las funciones, siempre tienen que poner el dato antes de la funcion. Una manera para resolver esta limitacion es usar ``curry`` para reorganizar el orden.

#### Lodash/fp
```javascript
const fp = require('lodash/fp');
let brandNameLowerCase = function(x) { return x.brand.toLowerCase(); };
let brandNameLowerCaseList = fp.map(brandNameLowerCase);
let filterEsFp = fp.filter(match(/e/i));
var brands = brandNameLowerCaseList(COMPUTERS);
console.log(filterEsFp(fp.uniq(brands)));
//=> ['lenovo', 'apple', 'dell', 'acer']
```
La libreria Lodash/fp resuelve la limitacion de Lodash y ahora la reimplementacion accepta la funcion como el primer argumento. 

#### Ramda
```javascript
const R = require('ramda');
let brandNameLowerCase = function(x) { return x.brand.toLowerCase(); };
let brandNameLowerCaseList = R.map(brandNameLowerCase);
// match return a list or null in Ramda
let filterEsRamda = R.filter(R.test(/e/i));
var brands = brandNameLowerCaseList(COMPUTERS);
console.log(filterEsRamda(R.uniq(brands)));
//=> ['lenovo', 'apple', 'dell', 'acer']
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
console.log(shout('hello world'));
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

### 3. Functors y Monads

Existen importantes tecnicas de programación funcional que ni Lodash, Ramda y Lodash/fp implementan, entre los que se encuentran
functors y monads.

Functor es simplemente una estructura que contiene un valor, y define el metodo map. por ejemplo:

```javascript
class Functor {

    constructor(val) {
        this.__value = val;
    }

    map(func) {
        return Functor.of(func(this.__value));
    }

    static of(val) {
        return new Functor(val);
    }
}
```

Monads son un patron de diseño que describe procedimientos o calculos como una serie de pasos. Los monads envuelven datos dandoles algun comportamiento adicional.
1. Maybe monad: que permite un seguro manejo de datos nulos o indefinidos.
2. Either monad: que facilita el manejo de errores.

Lodash y ramda no implementan monads y por lo tanto si se quieren untilizar se debe ocupar una libreria externa como lodash-fantasy.js, monet.js, o
la que ocuparemos en este caso ramda-fantasy.js.

Ej: Imprimiendo informacion de items

En este ejemplo Maybe Monad permite despreocuparse de forma segura de los posibles valores null o undefined
que pueden aparecer. Esto lo hace mediante la clase Maybe que envuelve un valor. Para llamar una función sobre
este valor se realiza mediante el metodo map, pero cuando el valor dentro de maybe es nulo, la instancia no 
ejecuta la función sobre el valor sino que devuelve otra instancia de Maybe con valor null.

#### Normal

```javascript
const apply_eeuu_tax = R.multiply(1.11);

function display_item(item) {
    console.log(item.brand + " " + item.model);
    if (item.dollar_value != null) {
        return console.log("Buy it for " + apply_tax(item.dollar_value));
    }
    return console.log("Price: check directly in the store ");
}

display_item(COMPUTERS[9]);
// => HP Pavillion
// => Price: check directly in the store
```

#### Ramda-fantasy maybe monad

```javascript
function ramda_display_item(item) {
    let value = Maybe(item.dollar_value).map(apply_eeuu_tax).getOrElse('check directly in the store');
    console.log(item.brand + " " + item.model);
    console.log("Price: " + value);
}

ramda_display_item(COMPUTERS[8]);
// => Acer R7
// => Price: 2000


ramda_display_item(COMPUTERS[9]);
// => HP Pavillion
// => Price: check directly in the store
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
    return console.log("You've completed the buy, price was:  " + final_price);
};

buy_item(COMPUTERS[9]);
// => Error price is not numeric

buy_item(COMPUTERS[8]);
// => You've completed the buy, price was:  2380
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
    return console.log("You've completed the buy, price was:  " + price);
};

const eitherLogOrShow = Either.either(log_error, display_bought);

const monad_buy_item = function (item) {
    eitherLogOrShow(Either.Right(item).chain(monad_check_stock).chain(monad_apply_iva_tax));
};

monad_buy_item(COMPUTERS[9]);
// => Error price is not numeric

monad_buy_item(COMPUTERS[8]);
// => You've completed the buy, price was:  2380
```

Either monad permite una forma segura de manejo de errores, en la cual se definen dos clases, Right para
los valores, y Left para los errores. Cuando se llama una función desde Left, esta no la utiliza sino que
devuelve la misma instancia de left.

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

A continuación un ejemplo en el que se ocupan esta clase Maybe, junto con: curry, compose y pointfree:

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
