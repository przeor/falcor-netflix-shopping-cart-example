var jsonGraph = require('falcor-json-graph');
var $ref = jsonGraph.ref;
var $error = jsonGraph.error;


var Router = require('falcor-router'),
  mockedMongoDB = require('./mocked-mongo'),
  ProductsRouter = Router.createClass([{
      route: '_view.length',
      get: () => {
        /*
            Remember, that FalcorJS isn't a query language like SQL or Relay/GraphQL.

            This has some advantages that it isn't so keep calm :-)

            This route _view.length is required, because we need to know how many
            product's items are in the _view array before we will ask for the elemnts.

            IF NOT _view.length then we may get an error if we will ask for an array's number count
            that is out of range (doesn't exsits).

            The _view.length helps us to know how many items are in the array before asking for them specificaly
            in the route _view[{integers}]
         */
        
        var viewArrayLenght = mockedMongoDB[0]._view.length;
        var results = {
          path: ['_view', 'length'],
          value: viewArrayLenght
        };
        console.log("1) *************** \n *************** \n ****** FIRST request in order to get known how many items are in the _view array before asking for specific elements from the array \n  *************** \n ");
        console.log(JSON.stringify(results, null, 5));
        return results;
      }
    }, {
      route: '_view[{integers}]',
      get: (pathSet) => {
        /*
            This is the _view[{integers}] and it $ref to productsById[{integers}].name!

            IMPORTANT TO REMEMBER: if you have a $ref inside a route like here
            and you would put instead of _view[{integers}] a route with .name property like
            _view[{integers}].name - then the Falcor-Router won't match for productsById[{integers}].name

            Generally, this was causing me some troubles as you have to train this as a habit,
            because on the first look it was not intuitive approach for me (so I wasted time to make this lesson).
         */
        var results = [];
        

        // this is a range of how 
        // many products have to be fetched from mongo's products collection
        var productsIndexesIds = pathSet[1];

        productsIndexesIds.forEach(productIndex => {
          if (mockedMongoDB[0]._view.length > productIndex) {
            // mongoDbProductId is a product ID that comes from products' collection 
            // (currently mocked and comes from mocked-mongo.js)
            var mongoDbProductId = mockedMongoDB[0]._view[productIndex];
            var currentProductRef = $ref(['productsById', [mongoDbProductId]]);
            results.push({
              path: ['_view', productIndex],
              value: currentProductRef  // it has to return a $ref here
            })
          }
        });
        console.log("2) *************** \n *************** \n ****** SECOND request in order to fetch $refs for productById \n  *************** \n ");
        console.log(JSON.stringify(results, null, 5));
        return results;
      }
    }, {
      route: "productsById[{integers}].name",
      get: function(pathSet) {
        /* 
          NOT-READY-YET

          This function is not optimised yet.

         */
        var results = [];
        console.log("3) *************** \n *************** \n ****** THIRD (on-server-side only) the falcor-router follow-up the $ref from the _view[{integers}] route. It has been optimized, so this router's query is done only on the server (WOW-Falcor-Does-The-Optimization-For-US!). \n\n This Falcor's feature lower's client/backend http's requests latency! WOW!  \n  *************** \n ");
        // console.log(JSON.stringify(results, null, 5));


        return {
          path: ["productsById", 959],
          value: {
            name: "Product ABC from backend kamilek776464 222",
            otherAdd: "something 1"
          }
        };
      }
    }, {
      route: '_view.add',
      call: (callPath, args) => {
        /* 
          NOT-READY-YET
          
          This function is not optimised yet.

         */
        var newProduct = args[0];
        console.log("ADDDING!", callPath);
        console.log("args!", args);
        mockedMongoDB[0]._view.push({
          name: newProduct
        });

        console.log(JSON.stringify(mockedMongoDB, null, 5));

        return [{
          path: ['_view', mockedMongoDB[0]._view.length - 1, 'name'],
          value: newProduct
        }, {
          path: ['_view', 'length'],
          value: mockedMongoDB[0]._view.length
        }]
      }
    }
  ])

module.exports = ProductsRouter