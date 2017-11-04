var inquirer = require("inquirer");
var clear = require("clear");
require("console.table");


var Query = require("./models/managerModel");

module.exports = function(){
  inquirer.prompt([
    {
      name: "choice",
      message: "Choice an option: ",
      type: "list",
      choices: [
        "1) View Products for Sale",
        "2) View Low Inventory",
        "3) Add to Inventory",
        "4) Add New Product"
      ]
    }
  ]).then((input)=>{
    var choice = parseInt(input.choice.charAt(0));

    clear();
    switch(choice){
      case 1:
      //View Products for Sale
        Query.viewAll().then((products)=>{
          console.table(products);
        });
        Query.close();
      break;

      case 2:
      //View Low Inventory
        Query.viewLow().then((products)=>{
          console.table(products)
        })
        Query.close();
      break;

      case 3:
        // Add to Inventory:
        inquirer.prompt([
          {name: "id", type: "input", message: "Enter productID? (refer to: View Products for Sale option)" },
          {name: "quantity", type: "input", message: "Quantity to add?"}
        ]).then((input)=>{

          Query.restock(input.id, input.quantity).then((result)=>{
            if (result) console.log("Inventory Added!");
            Query.close();
          })
        })
      break;

      case 4:
      //Add New Product
        inquirer.prompt([
          {name: "productName", type: "input", message: "Please provide the productName."},
          {name: "departmentId", type: "input", message: "Please provide the departmentId."},
          {name: "price", type: "input", message: "Please provide the price." },
          {name: "stockQuantity", type: "input", message: "Please provide the quantity to add."}
        ]).then((input)=>{
          Query.newProduct(input).then((result)=>{
            if (result.affectedRows == 1) console.log("Product Successfully Added!");
            Query.close();
          });
        })
      break;

      default:
        console.log("Don't know how you ended up here, but you are screwed now!");
      break;
    } // end switch
  }) // end .then
}