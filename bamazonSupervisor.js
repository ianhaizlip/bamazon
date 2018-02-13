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
	      	name: "supervisor",
	      	type: "list",
	      	message: "What would you like to do?",
	      	choices: ["View product sales by department", "Create New Department"]
	    }])
    .then(function(answer) {
      	//get quanity of item
      	console.log('answer:', answer.supervisor);
	    if(answer.supervisor == 'View product sales by department'){
	    	//show supervisor table
	      	connection.query(`SELECT departments.department_id, departments.department_name,
	      	  	departments.overhead_costs, SUM(product_sales),
	      	  	(SUM(product_sales) - over_head_costs) AS total_profit FROM departments 
	      	  	INNER JOIN products ON (departments.department_name = products.department_name) 
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
				name: "department_name",
		      	type: "input",
		      	message: "What is the name of the new department?"
		    },
		    {
				name: "overhead_cost",
		      	type: "input",
		      	message: "What is the over head of the new department?"
	      	}]).then(function (answer){

	      		insertDepartment(answer);
	      		console.log('New department created.');
	      		
	      	});
			
		}
    });


}

function insertDepartment(input){
	connection.query(`INSERT INTO departments (department_name, overhead_cost) VALUES ?`, [input],
	      		function(err, result) {
				    if (err) {
				    	console.log('New department error:\n',err);
				    }
				    else{
				    	console.log('New department created.')
				    }

				});
}