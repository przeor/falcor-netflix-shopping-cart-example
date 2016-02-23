var jsonGraph = require('falcor-json-graph');
var $ref = jsonGraph.ref;
var $error = jsonGraph.error;



/*
    this array is mocking mongoDB (TODO).

    Imagine that this object below represents our
    collections in mongoDB.
 */
module.exports = [
  {
    productsById: {
         959: {
             name: "Product ABC from backend haha",
             otherAdd: "something 1"
         },
    },
    _view: [ 959 ], 
    _cart: []
  }
];

