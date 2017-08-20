Lodash y similares para soporte de paradigma funcional
=====================================================
#### (es6-functional-programming-libs)

- Juan Castro Penna
- Wai Lam Jonathan Lee


### Los puntos principales en esta presentacion
- Las librerias que vamos a presentar: lodash, ramda, lodash/fp, y porque algunas son mejor que otra, e.g., el orden de los argumentos
- Currying
- "Compose" y pointfree function y ejemplos de su uso 
- monad?
- Un ejemplo de aplicacion no trivial

-----------------------------------------------------

### Recursos
- (Youtube) [Porque importa el orden de los parametros de funciones](https://www.youtube.com/watch?v=m3svKOdZijA)
- [Ramda docs](http://ramdajs.com/)
- [Lodash docs](https://lodash.com/)

El objetivo es introducir como se usa las librerias para programacion funcional a traves de ejemplos.

-----------------------------------------------------

### Setup
#### Instalar las librerias
```
npm install ramda
npm install lodash
```

-----------------------------------------------------

#### Data
```javascript
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
```
    
### 1. Currying
Ej: Encontrar todas las marcas que tienen la letra 'E'.

#### Normal
```javascript
var filterEs = function(xs) {
  return xs.filter(function(x) { 
    return x.match(/e/i);
  });
};

var brands = COMPUTERS.map(function(x) { return x.brand.toLowerCase(); });
console.log(filterEs(brands));
//=> ['lenovo', 'apple', 'dell', 'acer', 'dell']
```

#### Lodash
```javascript
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
console.log(filterEsLodash(brands));
```

#### Ramda
```javascript
// match return a list or null in Ramda
var filterEsRamda = R.filter(R.test(/e/i));
var brands = R.map(brandNameLowerCase, COMPUTERS);
console.log(filterEsRamda(R.uniq(brands)));
```

#### Lodash/fp
```javascript
var filterEsFp = fp.filter(match(/e/i));
var brands = fp.map(brandNameLowerCase, COMPUTERS);
console.log(filterEsFp(fp.uniq(brands)));
```

### Compose
```javascript
var compose = function(f, g) {
  return function(x) {
    return f(g(x));
  };
};
```
``f`` y ``g`` son funciones y ``x`` es el valor que acepta las dos funciones.

#### Ejemplo de ``compose``
```javascript
var toUpperCase = function(x) {
  return x.toUpperCase();
};
var exclaim = function(x) {
  return x + '!';
};
var shout = R.compose(exclaim, toUpperCase);
//=> "HELLO WORLD!"
```

Ej: El precio promedio de los laptops que estan in stock
```javascript
var _average = function(xs) {
  return R.reduce(R.add, 0, xs) / xs.length;
};
```

#### Normal
```javascript
var averageDollarValue = function(computers) {
  var dollar_values = R.map(function(c) {
    return c.dollar_value;
  }, computers);
  return _average(dollar_values);
};
var computersOnStock = COMPUTERS.filter(function(x) { return x.in_stock == true;});
console.log(averageDollarValue(computersOnStock));
//=> 1700
```

#### Ramda
```javascript
var isInStock = function(x) { return x.in_stock == true; };
var averageDollarValueR = R.compose(_average, 
                                    R.map(R.prop('dollar_value')), 
                                    R.filter(isInStock));
console.log(averageDollarValueR(COMPUTERS));
//=> 1700
```
El uso de ``compose`` permite componer distintas funciones juntas y con 
``map`` y ``reduce`` puede aplicar funciones de un elemento a listas. 

Ademas ``compose`` permite las funciones ser "pointfree" - no tiene que decir nada acerca tu dato.
Entonces las funciones ``isInStock`` y ``averageDollarValueR`` pueden ser aplicadas a otros productos como autos o comidas.

