const mysql = require('mysql2');
const table = require('console.table');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'company_db'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database.');
});

const inquirer = require('inquirer');

inquirer.prompt([
  {
    type: 'list',
    name: 'menu',
    message: 'What would you like to do?',
    choices: [
      'View all departments',
      'View all roles',
      'View all employees',
      'Add a department',
      'Add a role',
      'Add an employee',
      'Update an employee role'
    ]
  }
]).then((answer) => {
  console.log(answer.menu);
  // Handle the user's choice here
});



connection.query('SELECT * FROM department', (err, res) => {
  if (err) throw err;
  console.table(res);
});
