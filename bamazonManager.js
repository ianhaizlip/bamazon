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
connection.connect(function(err) {
  	if (err) {
  		console.log('connection error:\n', err);
  	}
  	else{
  		console.log('You are connected.');
  		manager();
  	} 	
});

//--------------
// function
//--------------
function manager(){
	inquirer.prompt(
		[{
			type: 'list',
			name: 'option',
			message: 'What do you want to do?',
			choices: ['View products for sale', 
				'View low inventroy', 
				'Add to inventory', 
				'Add new product']
		}]).then(function(answer){
				//Identify action
				if(answer.option == 'View products for sale'){
					connection.query(`SELECT item_id, product_name, stock FROM products`, function(err, result) {
				    	if (err) {
				    		console.log('get stock error:\n',err);
					    }
					    //view product table
					    else{
					    	console.log(result);	
					    }
					});
				}
				if(answer.option == 'View low inventroy'){
					connection.query(`SELECT * FROM products WHERE stock < 50`, function(err, result) {
				    	if (err) {
				    		console.log('low inventroy error:\n',err);
					    }
					    //view product table
					    else{
					    	console.log(result);	
					    }
					});

				}
				if(answer.option == 'Add to inventory'){
					addInventory();
				}
				if(answer.option == 'Add new product'){
					addProduct();
				}
			}
		);
}

//Function to add inventory
function addInventory(){
	connection.query(`SELECT * FROM products`, function(err, result) {
				    	if (err) {
				    		console.log('dislay stock error:\n',err);
					    }
					    //view product table
					    else{
					    	console.log(result);
					    	addStep2();	
					    }
					});
	
}
function addStep2(){
	inquirer.prompt(
		[{
			type: 'input',
			name: 'addId',
			message: 'What item would you like to add? (people input id number)'
		},
		{
			type: 'input',
			name: 'addQuantity',
			message: 'How many would you like to add?'
		}]).then(function(answer){
			//check numbers
			console.log('addId:', answer.addId);
	      	console.log('addQuantity:', answer.addQuantity);
	      	let addQuantity = answer.addQuantity
	      	let addId = answer.addId;
	      	connection.query(`UPDATE products SET stock = ${addQuantity} WHERE item_id = ${addId}`,
	            // [{newQuantity}, {currentId}],
	            function(error) {
	              	if (error) {
	              		console.log('update stock error:\n',error);
	              	}
			    //update stock
			    else{
			    	let increasedQuantity = result + answer.addQuantity;
			    	connection.query("UPDATE products SET ? WHERE ?",
		            [{stock: increasedQuantity}, {id: answer.id}],
		            function(error) {
		              	if (error) {
		              		console.log('increased stock error:\n',error);
		              	}
		              	console.log("Your stock is updated!");
		            });
			    }
			});
		});
}



//Function to add Item
function addProduct(){
	//show table
	connection.query(`SELECT * FROM products`, function(err, result) {
				    	if (err) {
				    		console.log('dislay stock error:\n',err);
					    }
					    //view product table
					    else{
					    	console.log(result);	
					    }
					});

	inquirer.prompt(
		[{
			type: 'input',
			name: 'product_name',
			message: 'What is the name of th item?'
		},
		{
			type: 'input',
			name: 'department_name',
			message: 'What department does the item go in?'
		},
		{
			type: 'input',
			name: 'price',
			message: 'How much does it cost?'
		},
		{
			type: 'input',
			name: 'stock',
			message: 'How many would you like to add?'
		}]).then(function(answer){
	      	connection.query(`INSERT INTO products (product_name, department_name, price, stock) VALUES ?`,
	      		{answer}, 
	      		function(err, res) {
			    	if (err) {
			    		console.log('add item error:\n',err);
				    }
				    //update stock
				    else{
				    	console.log('Your item has been added.')
		            }
			    
			});
		});
}
