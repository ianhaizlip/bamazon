// Require
const mysql = require("mysql2");
const inquirer = require("inquirer");

//mySQL Connection
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	database: 'bamazon'
	});

//make connection
connection.connect(function(error) {
  	if (error) {
  		console.log('connect error:\n',error);
  	}
  	else{
  		console.log('connected')
  		customer();
  	}
});

//---------------
// functions
//---------------
function customer(){
	connection.query("SELECT item_id, product_name, department_name, price FROM products",
	 function(err, results) {
	    if (err) {
	    	console.log('display table error:\n',err);
	    }
	    else {
	    	console.log(results);
	    	nextStep();
	    }
	});
}

function nextStep(){
	inquirer.prompt(
		//customer input
		[{
		  	name: "id",
			type: "input",
			message: "Which item yould you like? (please input the id)"
		},
		{
			name: "quantity",
			type: "input",
			message: "How many of this item would you like?"
		}])
    .then(function(answer) {
      	//get quanity of item
      	console.log('id:', answer.id);
      	let currentId = answer.id;
      	console.log('quantity:', answer.quantity);
      	let num = answer.quantity;
      	connection.query(`SELECT stock, price, department_name FROM products WHERE item_id = ${currentId}`,
      		// { currentId },
      	 function(err, result) {
	    	console.log(result);
	    	if (err) {
	    		console.log('get stock error:\n',err);
		    }
		    //not enough stock
		    else if(answer.quantity>result[0].stock){
		    	console.log('Insufficient stock!');
		    }
		    //update stock
		    else{
		    	let newQuantity = result[0].stock - answer.quantity;
		    	console.log('new stock: ',newQuantity);
		    	let purchase = num * result[0].price;
		    	console.log('cost of purchse: ',purchase);
		    	let department_name = result[0].department_name;
		    	console.log('department: ', department_name)

		    	connection.query(`UPDATE products SET stock = ${newQuantity} WHERE item_id = ${currentId}`,
	            // [{newQuantity}, {currentId}],
	            function(error) {
	              	if (error) {
	              		console.log('update stock error:\n',error);
	              	}
	              	else{
		              	connection.query(`UPDATE products SET product_sales = (product_sales + ${purchase}) 
		              		WHERE item_id = ${answer.id}`),
		              		function(err){
		              			if(err){
		              				console.log('update sales error:\n',err)
		              			}
		              		};

		              	console.log(`Your purchse will cost ${purchase}`);
	                }
	            });
		    }
		});
    });
}