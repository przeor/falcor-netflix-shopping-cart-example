var falcorExpress = require('falcor-express');
var Router = require('falcor-router');
var falcor = require('falcor');
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));


var jsonGraph = require('falcor-json-graph');
var $ref = jsonGraph.ref;
var $error = jsonGraph.error;

// serve static files from current directory
app.use(express.static(__dirname + '/'));

app.use('/model.json', falcorExpress.dataSourceRoute(function(req, res) {
  // data source interface goes here
  return new Router([
    {
        route: 'genrelist[{integers:indices}].titles.remove',
        call: function(callPath, args) {
            
            if (this.userId == undefined)
                throw new Error("not authorized");

            var genreIndex = callPath.indices[0], titleIndex = args[0];

            return recommendationService.
                removeTitleFromGenreListByIndex(this.userId, genreIndex, titleIndex).
                then(function(titleIdAndLength) {
                    return [
                        {
                            path: ['genrelist', genreIndex, 'titles', {from: titleIndex, to: titleIdAndLength.length }],
                            invalidated: true
                        },
                        {
                            path: ['genrelist', genreIndex, 'titles', 'length'],
                            value: titleIdAndLength.length
                        }
                    ];
                });
        }
    },
    {
      route: "productsById[{integers}]",
      set: function(pathSet) {

        var newProductId = 999;
        var newProduct = {
            name: "321BACKEND KAMIL Product ABC DZIALA",
            otherAdd: "321BACKEND KAMIL something 1",
            id: newProductId
        };
        /*
          here we save stuff to DB
         */

        console.log(JSON.stringify(pathSet, null, 4));

        return {
          path:["productsById", newProductId], 
          value: newProduct
        };

      }
    },
    {
      route: "productsById[{integers}].name",
      get: function(pathSet) {
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
        console.log("1. pathSet", pathSet);
        console.log("-----");
        console.log("This route is called first.");
        return {
          path:["_view", 123], 
          value: $ref(['productsById', 123])
        };
      }
    }
  ]);
}))




// var $ref = falcor.Model.ref;
// var model = new falcor.Model({
//   cache: {
//       productsById: {
//            1: {
//                name: "Product ABC from backend haha",
//                otherAdd: "something 1"
//            },
//       },
//       _view: [ $ref('productsById[1]') ],
//       _cart: []
//   }
// });


// // serve static files from current directory
// app.use(express.static(__dirname + '/'));

// app.use('/model.json', falcorExpress.dataSourceRoute(function(req, res) {
//   // data source interface goes here
//   return model.asDataSource();
// }))


app.listen(3001);
console.log("Listening on http://localhost:3001");