var inquirer = require("inquirer");
var clear = require("clear");
require("console.table");


var Query = require("../models/supervisorModel");

module.exports = function(){
  Query.salesByDepartment().then((results)=>{
    console.table(results);
    Query.end();
  })
}