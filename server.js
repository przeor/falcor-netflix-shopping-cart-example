var falcorExpress = require('falcor-express');
var Router = require('falcor-router');
var falcor = require('falcor');
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));


// var $ref = falcor.Model.ref;
// var model = new falcor.Model({
//   cache: {
//       productsById: {
//            1: {
//                name: "Product ABC from backend",
//                otherAdd: "something 1"
//            },

//       },
//       _view: [ $ref('productsById[1]') ],
//       _cart: []
//   }
// });

var jsonGraph = require('falcor-json-graph');
var $ref = jsonGraph.ref;
var $error = jsonGraph.error;

// serve static files from current directory
app.use(express.static(__dirname + '/'));

app.use('/model.json', falcorExpress.dataSourceRoute(function(req, res) {
  // data source interface goes here
  return new Router([
    {
      route: "productsById[{integers}].name",
      get: function(pathSet) {
        console.log("This route is called as a second.");
        console.log("Calling productsById from _view via $ref(['productsById', 123])", pathSet);
        return {
          path:["productsById", 123], 
          value: {
               name: "Product ABC from backend",
               otherAdd: "something 1"
           }
        };
      }
    },
    {
      // match a request for the key "greeting"
      route: "_view[{integers}]",
      // respond with a PathValue with the value of "Hello World."
      get: function(pathSet) {
        console.log("This route is called first.");
        return {
          path:["_view", 123], 
          value: $ref(['productsById', 123])
        };
      }
    }
  ]);
}))




app.listen(3001);
console.log("Listening on http://localhost:3001");