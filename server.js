var falcorExpress = require('falcor-express');
var Router = require('falcor-router');
var falcor = require('falcor');
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));


var $ref = falcor.Model.ref;
var model = new falcor.Model({
  cache: {
      productsById: {
           1: {
               name: "Product ABC from backend",
               otherAdd: "something 1"
           },

      },
      _view: [ $ref('productsById[1]') ],
      _cart: []
  }
});


// serve static files from current directory
app.use(express.static(__dirname + '/'));

app.use('/model.json', falcorExpress.dataSourceRoute(function(req, res) {
  // data source interface goes here
  return model.asDataSource();
}))




app.listen(3001);
console.log("Listening on http://localhost:3001");
