/**
 * Created by JuanEnrique on 22-08-17.
 */
_ = require("lodash");
R = require("ramda");


// lodash
function first_to_letters(words) {
    return _.map(words, function(word) {
        return _.slice(word, 0, 2).join("")
    })
}

console.log(first_to_letters(["word", "functional"]));
// => [ 'wo', 'fu' ]


// Ramda
const fp_first_to_letters = R.map(R.slice(0, 2));

console.log(fp_first_to_letters(["word", "functional"]));
// => [ 'wo', 'fu' ]





