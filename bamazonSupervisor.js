// Require
const mysql = require("mysql");
const inquirer = require("inquirer");

//mySQL Connection
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	database: 'bamazon'
	});

//make connection
connection.connect(function(err) {
  	if (err){
  		console.log('connection error:\n', err);
  	}
  	else{
  		console.log('You are connected.');
  		supervisor();
  	}
});

function supervisor(){

	inquirer.prompt(
		//customer input
		[{
	      	name: "list",
	      	type: "supervisor",
	      	message: "What would you like to do?",
	      	choices: ["View product sales by department", "Create New Department"]
	    }])
    .then(function(answer) {
      	//get quanity of item
      	console.log('answer:', answer.supervisor);
	    if(answer.supervisor == 'View product sales by department'){
	    	//show supervisor table
	      	connection.query(`SELECT department_id, department_name, overhead_cost, products.product_sales,
	      		SUM(IF(departments.department_name = products.department_name), products.product_sales ,AS product_sales),
				SUM(product_sales) - over_head_costs) AS total_profit,
	      		FROM departments 
	      		JOIN LEFT products 
	      		ON (departments.department_name = products.department_name)
	      		GROUP BY department_id`,
	      	 function(err, result) {
		    	if (err) {
		    		console.log('get stock error:\n',err);
			    }
			    else{
			    	console.log(result);
			    }
			    
			});
		}
		if(answer.supervisor == 'Create New Department'){
			inquirer.prompt(
			[{
				name: "input",
		      	type: "department_name",
		      	message: "What is the name of the new department?"
		    },
		    {
				name: "input",
		      	type: "overhead_cost",
		      	message: "What is the over head of the new department?"
	      	}]).then(
	      		connection.query(`INSERT INTO (department_name, overhead_cost) VALUES ?`,
	      		[answer], 
	      		function(err, result) {
				    if (err) {
				    	console.log('New department error:\n',err);
				    }
				    else{
				    	console.log('New department created.')
				    }

				});
	      	);
			
		}
    });


}