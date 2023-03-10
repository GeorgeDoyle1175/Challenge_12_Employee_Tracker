const inquirer = require('inquirer');
const mysql = require('mysql2');

// Set up database connection
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employee_trackerDB',
});

// Connect to the database
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to database!');
});

// Prompt the user to select an option
function promptUser() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'option',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit'
            ]
        }
    ]).then((answer) => {
        switch (answer.option) {
            case 'View all departments':
                viewAllDepartments();
                break;
            case 'View all roles':
                viewAllRoles();
                break;
            case 'View all employees':
                viewAllEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            case 'Exit':
                connection.end();
                break;
        }
    });
}

// View all departments
function viewAllDepartments() {
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.table(res);
        promptUser();
    });
}

// View all roles
function viewAllRoles() {
    connection.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        console.table(res);
        promptUser();
    });
}

// View all employees
function viewAllEmployees() {
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        console.table(res);
        promptUser();
    });
}
//Add Department
function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the name of the department:'
        }
    ]).then((answer) => {
        connection.query('INSERT INTO department SET ?', { name: answer.name }, (err, res) => {
            if (err) throw err;
            console.log(`Department '${answer.name}' added successfully!`);
            promptUser();
        });
    });
}

// Add a role
function addRole() {
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        const departments = res.map((department) => {
            return {
                name: department.name,
                value: department.id
            };
        });
        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Enter the title of the role:'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the salary of the role:'
            },
            {
                type: 'list',
                name: 'department',
                message: 'Select the department for the role:',
                choices: departments
            }
        ]).then((answer) => {
            connection.query('INSERT INTO role SET ?', {
                title: answer.title,
                salary: answer.salary,
                department_id: answer.department
            }, (err, res) => {
                if (err) throw err;
                console.log(`Role '${answer.title}' added successfully!`);
                promptUser();
            });
        });
    });
}

// Add an employee
function addEmployee() {
    connection.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        const roles = res.map((role) => {
            return {
                name: role.title,
                value: role.id
            };
        });
        inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: 'Enter the employees first name: '
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'Enter the employees last name: '
            },
            {
                type: 'list',
                name: 'role',
                message: 'Select the employees role: ',
                choices: roles
            },
            {
                type: 'input',
                name: 'manager',
                message: 'Enter the employees manager ID: '
            }
        ]).then((answer) => {
            connection.query('INSERT INTO employee SET ?', {
                first_name: answer.firstName,
                last_name: answer.lastName,
                role_id: answer.role,
                manager_id: answer.manager
            }, (err, res) => {
                if (err) throw err;
                console.log(`Employee '${answer.firstName} ${answer.lastName}' added successfully!`);
                promptUser();
            });
        });
    });
}

/// Update an employee role
function updateEmployeeRole() {
    connection.query('SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id', (err, res) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Select the employee you want to update:',
                choices: res.map((employee) => `${employee.first_name} ${employee.last_name}, ${employee.title}`)
            },
            {
                type: 'list',
                name: 'role',
                message: 'Select the employee\'s new role:',
                choices: () => {
                    return new Promise((resolve, reject) => {
                        connection.query('SELECT * FROM role', (err, res) => {
                            if (err) throw err;
                            resolve(res.map((role) => role.title));
                        });
                    });
                }
            }
        ]).then((answer) => {
            const employeeId = res.find((employee) => `${employee.first_name} ${employee.last_name}, ${employee.title}` === answer.employee).id;
            const roleId = res.find((employee) => employee.title === answer.role).role_id;
            connection.query('UPDATE employee SET ? WHERE ?', [
                {
                    role_id: roleId
                },
                {
                    id: employeeId
                }
            ], (err, res) => {
                if (err) throw err;
                console.log('Employee role updated successfully!');
                promptUser();
            });
        });
    });
}


// Call the function to start the application
promptUser();
