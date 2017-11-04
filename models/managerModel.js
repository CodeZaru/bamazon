var mysql = require("mysql");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3307,

  // Your username
  user: "kevin",

  // Your password
  password: "gwbootcamp",
  database: "bamazon_db",
  multipleStatements: true 
});


exports.viewAllProducts = function(){
  return new Promise((resolve, reject)=>{
     connection.query("SELECT * FROM product;", function(err, data, fields){
       if (err) reject (`Error from queries.js: ${err.stack}`);
       resolve(data);
     });
  })
}

exports.viewLowInventory = function(){
  return new Promise((resolve, reject)=>{
     connection.query("SELECT * FROM product WHERE stockQuantity <= 5;", function(err, data, fields){
       if (err) reject (`Error from queries.js: ${err.stack}`);
       resolve(data);
     });
  })
}

exports.addInventory = function(id, quantity){
  return new Promise((resolve, reject)=>{
     connection.query("UPDATE product set stockQuantity = stockQuantity + ? WHERE id = ?;", [quantity, id], function(err, results, fields){
       if (err) reject (`Error from queries.js: ${err.stack}`);
       resolve(results.affectedRows == 1);
     });
  })
}


exports.addNewProduct = function(p){
   return new Promise((resolve, reject)=>{
     connection.query("INSERT INTO product (productName, departmentId, price, stockQuantity) VALUES (?, ?, ?, ?)", 
     [p.productName, p.departmentId, p.price, p.stockQuantity], function(err, results, fields){
        if (err) reject(err);
        resolve(results);
    })
  })
};

//Helper
exports.close = function(){
  connection.end();
}