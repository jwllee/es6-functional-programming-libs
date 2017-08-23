/**
 * Created by JuanEnrique on 22-08-17.
 */

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


let functor = Functor.of("word").map(function(s) {
    return s.toUpperCase();
});
// => Functor { "WORD" }






