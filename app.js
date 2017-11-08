var inquirer = require("inquirer");


var customer = require("./controllers/customerController");
var manager = require("./controllers/managerController");
var supervisor = require("./controllers/supervisorController");

 

cliSelectRole();

function cliSelectRole(){
  inquirer.prompt([
    {
      name: "choice",
      message: "Please select your app role",
      type: "list",
      choices: [
        "1. Customer",
        "2. Manager",
        "3. Supervisor",
        "4. None of the above"
      ]
    }
  ]).then((input)=>{
    var choice = parseInt(input.choice.charAt(0));
    switch(choice){
      case 1:
        customer();
      break;
      case 2:
        manager();
      break;
      case 3:
        supervisor();
      break;
      case 4:
        console.log("Que Pasa!  Que Quieres?");
      break;
      default:
        console.log("Your selection didn't register.  Please try again.");
      break;
    } // end switch
  })
}