const inquirer = require("inquirer");
const db = require("./config/connection");
require("console.table");

const mainPrompt = async () => {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'opening',
            message: 'What would you like to do?',
            choices: [
                'Exit',
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee'
            ],
            pageSize: 4
        }
    ]);
    switch (answers.opening) {
        case 'Exit': return db.end();
        case 'View all departments': return view(allDepartments);
        case 'View all roles': return view(allRoles); 
        case 'View all employees': return view(allEmployees);
    }
}

// ------------- QUERIES ----------------------------
const allDepartments = `SELECT * FROM departments`;

const allRoles = `SELECT roles.id, roles.title, departments.name AS department, roles.salary
                    FROM roles
                    JOIN departments ON departments.id = roles.department_id`

const allEmployees = `SELECT emp.id, emp.first_name, emp.last_name,
                        roles.title AS role, departments.name AS department, roles.salary AS salary,
                        CONCAT (manager.first_name, ' ', manager.last_name) AS manager
                        FROM employees AS emp
                        JOIN roles ON emp.role_id = roles.id
                        JOIN departments ON departments.id = roles.department_id
                        LEFT JOIN employees AS manager ON manager.id = emp.manager_id`;

// -------------- VIEW ----------------------------
const view = (query) => {
    db.promise()
        .query(query)
        .then(([rows, fields]) => {
            console.log(`\n`);
            console.table(rows);
            console.log(`\n`);
            mainPrompt();
        })
        .catch(err => console.log(err));
}

mainPrompt();