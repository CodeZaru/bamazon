# bamazon - a sample online e-commerce website.

Technology: a CLI application developed in JavaScript and featuring nodeJS, Inquirer and mysql npm packages among others.  Also includes a mySql db and associated SQL code. 

The UI is simple, offering the user several different roles from which to choose:

1. Customer
2. Manager
3. Supervisor
4. None of the above.

## 1) Customer View: allows customers to view products, select desired item for purchase, select quantity desired, and make the purchase.  The purchase will repond with a confirmation amount, and will remove items purchased from existing inventories.
![customer](/images/bamazonCustomer.gif)

## 2) Manager View: enables managers to view products for sale, view low inventory, order inventory as needed (which updates the db accordingly), or add new products to the inventory (which also updates the db accordingly).
![manager](/images/bamazonManager.gif)

## 3) Supervisor View: can view how the various departments are performing from a financial perspective.
![supervisor](/images/bamazonSupervisor.gif)