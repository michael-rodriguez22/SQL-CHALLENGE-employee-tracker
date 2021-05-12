const inquirer = require("inquirer");
const db = require("./config/connection");
require("console.table");

// -------------PROMPTS---------------------------
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
        case 'Add a department': return addDepPrompt();
    }
}

const addDepPrompt = async () => {
    const answers = await inquirer.prompt(
        {
            type: 'input',
            name: 'depName',
            message: 'Please enter a name for the department you would like to add.',
            validate: depName => {
                if (depName) return true;
                return false;
            }
        }
    )
    const sql = `INSERT INTO departments (name)
                    VALUES ("${answers.depName}")`;
    const message = `\n ${answers.depName} has been added to departments. \n`;
    execute(sql, message);
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

// -------------- UTIL ----------------------------
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

const execute = (sql, message) => {
    db.promise()
        .execute(sql)
        .then(() => {
            console.log(message);
            mainPrompt();
        })
        .catch(err => console.log(err));
}

mainPrompt();