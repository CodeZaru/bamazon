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


exports.salesByDepartment = function(){

  return new Promise((resolve, reject)=>{
    var query = `
    SELECT p.departmentId, d.departmentName, d.overheadCost, SUM(s.quantityPurchased * p.price) as productSales,
    (SUM(s.quantityPurchased * p.price) - d.overheadCost) as totalProfit
    FROM sale s LEFT JOIN product p ON s.productId = p.id
    INNER JOIN department d ON p.departmentId = d.id
    GROUP BY p.departmentId
    ORDER BY totalProfit DESC;`;
    connection.query(query, function(error, results){
      resolve(results);
    })
  })
}


//Helpers
exports.end = function(){
  connection.end();
}