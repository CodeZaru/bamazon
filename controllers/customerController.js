var mysql = require("mysql");
var inquirer = require("inquirer");
var clear = require("clear");
require("console.table");


// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3307,//I use 3307 because I've got another db on 3306

  // Your username
  user: "???",

  // Your password
  password: "???",
  database: "bamazon_db",
  multipleStatements: true 
});

/////////////////////////////////////////////////////////////////////
// SQL queries to move to model
//will need to add require stmt
/////////////////////////////////////////////////////////////////////

//Retrieves all products
var getAllProducts = function(){
  return new Promise(function(resolve, reject){
    connection.query("SELECT * FROM product;", function(err, data, fields){
      if (err) reject(err);
      resolve(data);
    });
  });
}

/////////////////////////////////////////////////////////////////////
// SQL queries to move to model
//will need to add require stmt
/////////////////////////////////////////////////////////////////////

//retrieves inventory by id
var getAvailableInventory = function(id){
  return new Promise(function(resolve, reject){

    connection.query("SELECT stockQuantity, productName, id, price FROM product WHERE id = ?", [id], function(err, data){
     if (err) reject(err);
     resolve(data[0]);

    }); 
  }); 
}; 

/////////////////////////////////////////////////////////////////////
// SQL queries to move to model
//will need to add require stmt
/////////////////////////////////////////////////////////////////////

//order dialog
var orderProcessingDialog = function(orderObj){
  return new Promise((resolve, reject)=>{
    var id = orderObj.id;
    var quantity = orderObj.quantity;
    connection.query("UPDATE product set stockQuantity = stockQuantity - ? WHERE id = ?;", [quantity, id], function(err, data){
      if (err) reject(err);
      connection.query("INSERT INTO sale (quantityPurchased, productId) VALUES (?, ?);",[quantity, id], function(err, data){
        if (err) reject(err);
        resolve(data);
      })
      // resolve(data);
    });
  })
}



var requestedProductId = function(){
  return new Promise((resolve, reject)=>{
    clear();

    // Display products
    getAllProducts().then(function(data){
      // sold out - exit
      if (data.length === 0){
        console.log("Out of stock");
        resolve({valid: false, msg: "Out of stock!"});
      }
      // Display table;
      console.table(data);

      var ids = data.map(function(item){
        return item.id;
      })
      // console.log(ids);

      // Prompt user for the id
      inquirer.prompt([
        {name: "id", message: "Enter item id of product you'd like to buy", type: "input"}
      ]).then(function(input){
        var id = parseInt(input.id);
        if (ids.indexOf(id) !== -1){

          resolve({valid: true, id: id});
        } else {
          resolve({valid: false, msg:`Did not recognize that product id ('${id}')`});
        }
      })

    }, function(err){
      console.log(err);
      console.log("getAllProdcuts generating promise error!");
      reject({valid: false, msg: `${err.stack}`});
    })

  }) // promise
} // closes askProductId 


// Calls the requestedProductId promise and returns another promise ...
var productQuantityRequested = function(id){
  return new Promise((resolve, reject)=>{
    // ask user for product id
    requestedProductId().then((dataObj)=>{
      if (!dataObj.valid) {
        reject( "Invalid ID")
        return; //
      };
      getAvailableInventory(dataObj.id)
      .then((product)=>{
        // console.log(product.stock_quantity);
        var MAX = product.stockQuantity;
        var name = product.productName;

        inquirer.prompt({
          type: "input", 
          message: `What quantity of "${name}"(s) do you want?`,
          name: "quantity",
          validate: function(val){
            if (val > MAX){
              return(`Insufficient inventory: we only have ${MAX} of "${name}"`)
            }
            return true;
          }
        }).then((input)=>{

          var order = {
            id: product.id,
            productName: name,
            quantity: input.quantity,
            price: product.price,
          };
          resolve(order);
        })
      }, (err)=> {
        console.log(err);
        reject(err);
      })
    }) // productQuantityRequested
  }) // promise
};

var checkOut = function(){
  return new Promise((resolve, reject)=>{
    productQuantityRequested().then((order)=> {
     
      //confirm the order
      var total = order.price * order.quantity;
      inquirer.prompt({
        type: "confirm",
        name: "proceed",
        message: `Please confirm that you want to purchase qty ${order.quantity} of "${order.productName}" for a total of: $${total}`
      }, (err)=> {console.log(err)}).then((input)=>{
        //if yes, process order
    
        if (input.proceed){
          orderProcessingDialog(order).then(()=>{
            
          resolve("Transaction completed.");
          });
        } else {
 
          resolve("Transaction not processed.");
        }
      }) // inquirer promise
    }, (err)=> {
      console.log(err);
      connection.end();
    });
  }); //promise
}


module.exports = function(){
  checkOut().then((result)=>{
  console.log(result);
  connection.end();
  }, (err)=>{console.log(err)});
}