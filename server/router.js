var jsonGraph = require('falcor-json-graph');
var $ref = jsonGraph.ref;
var $error = jsonGraph.error;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


var viewAddResponsePromise = new Promise(function(resolve, reject) {
  // This is only mocked mongo promise
  if (true) {
    resolve("Promise resolved");
  }
  else {
    reject(Error("It broke"));
  }
});


var Router = require('falcor-router'),
  mockedMongoDB = require('./mocked-mongo'),
  ProductsRouter = Router.createClass([{
      route: '_view.length',
      get: () => {
        /*
            Remember, that FalcorJS isn't a query language like SQL or Relay/GraphQL.

            This has some advantages so keep calm :-)

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
            var currentProductRef;

            // checking if mongoDbProductId isn't a ref
            if(mongoDbProductId.value !== undefined) {
              currentProductRef = mongoDbProductId; // mongoDbProductId is already a ref
            } else {
              currentProductRef = $ref(['productsById', [mongoDbProductId]]);
            }
            
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
        var productIds = pathSet[1];
        var results = [];

        productIds.forEach(productIndex => {
          var productValue = mockedMongoDB[0]["productsById"][productIndex]; // mocking fetch from DB

          if(productValue === undefined) { 
            console.warn("Warning: productValue is undefined");
            return;  // no product found with this ID
          }

          productValue.name = "[FROM productById("+productIndex+")]"+productValue.name;
          results.push({
            path: ["productsById", productIndex],
            value: productValue
          });
        });
        console.log("3) *************** \n *************** \n ****** THIRD (on-server-side only) the falcor-router follow-up the $ref from the _view[{integers}] route. It has been optimized, so this router's query is done only on the server (WOW-Falcor-Does-The-Optimization-For-US!). \n\n This Falcor's feature lower's client/backend http's requests latency! WOW!  \n  *************** \n ");
        console.log(JSON.stringify(results, null, 5));
        return results;
      }
    }, {
      route: '_view.add',
      call: (callPath, args) => {
        /* 
          NOT-READY-YET
          
          This function is not optimised yet.

         */
        var newProductName = args[0];

        // Mongoose return a Promise, so we keep this Promise below only
        // for presentation purposes, it's not fully functional DB query, 
        // yet (just demo, how it may work with Mongoose) 
        return viewAddResponsePromise.then(function(respoved) {
          var randomMockedMongoId = getRandomInt(1, 1000000);
          var results = [];
          // now we have the id randomMockedMongoId of the newProduct
          newProductName = newProductName+" (this has been added on backend (router.js) - please note that this comes from async mocked call to DB)";

          /*
            FIRST step: push the newProduct into productsByIds (products collection in mongo)
           */
          var newItemInProductsById = {
            path: ['productsById', randomMockedMongoId],
            value: { 
              "name": newProductName,  
              otherAdd: "something with id "+randomMockedMongoId
            }
          }


          // MOCKING SAVING/INSERTING TO MONGODB:
          mockedMongoDB[0]["productsById"][randomMockedMongoId] = { 
            "name": newProductName,  
            otherAdd: "something with id "+randomMockedMongoId
          }


          /* 
            SECOND step: push the $ref of that product into the _view array in our model
           */
          var newProductRef = $ref(['productsById', randomMockedMongoId]);
          

          var beforeViewLenght = mockedMongoDB[0]._view.length;
          // mocking adding a record to the DB
          mockedMongoDB[0]._view.push(newProductRef);
          var afterViewLenght = mockedMongoDB[0]._view.length;
          results = [{
              path: ['_view', afterViewLenght - 1],
              value: newProductRef // and also updating the Falcor's route
            }
            , {
              path: ['_view', 'length'],
              value: afterViewLenght
            }
          ];
          
          return results;
        }, function(err) {
          console.log(err); // Error: "It has broken"
        });
      }
    }
  ])

module.exports = ProductsRouter