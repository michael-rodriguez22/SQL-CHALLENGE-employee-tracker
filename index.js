const db = require("./config/connection");
const inquirer = require("inquirer");
const {
  allDepartments,
  allEmployees,
  allRoles,
  allManagers,
} = require("./queries");

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
    .catch((err) => console.log(err));
};

const execute = (sql, message) => {
  db.promise()
    .execute(sql)
    .then(() => {
      console.log(message);
      mainPrompt();
    })
    .catch((err) => console.log(err));
};

// -------------PROMPTS---------------------------
const mainPrompt = async () => {
  const choices = [
    "Exit",
    "View all departments",
    "View all roles",
    "View all employees",
    "Add a department",
    "Add a role",
    "Add an employee",
    "Update an employee",
  ];
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "opening",
      message: "What would you like to do?",
      choices: choices,
      pageSize: 4,
    },
  ]);
  switch (answers.opening) {
    case choices[0]:
      console.log("Goodbye!");
      return db.end();
    case choices[1]:
      return view(allDepartments);
    case choices[2]:
      return view(allRoles);
    case choices[3]:
      return view(allEmployees);
    case choices[4]:
      return addDepPrompt();
    case choices[5]:
      return addRolePrompt();
    case choices[6]:
      return addEmployeePrompt();
    case choices[7]:
    //
  }
};

const addDepPrompt = async () => {
  const answers = await inquirer.prompt({
    type: "input",
    name: "name",
    message: "Please enter a name for the department you would like to add.",
    validate: (name) => {
      if (name.match(/^[a-zA-Z\ ]+$/)) return true;
      return false;
    },
  });
  const sql = `INSERT INTO departments (name)
                    VALUES ("${answers.name}")`;
  const message = `\n ${answers.name} has been added to departments. \n`;
  execute(sql, message);
};

const addRolePrompt = async () => {
  const departments = await db
    .promise()
    .query(allDepartments)
    .then(([rows]) => rows);
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "Please enter a title for the role you would like to add.",
      validate: (title) => {
        if (title.match(/^[a-zA-Z\ ]+$/)) return true;
        return false;
      },
    },
    {
      type: "integer",
      name: "salary",
      message: "What is the salary for this position? (whole dollars only)",
      validate: (salary) => {
        if (salary <= 1000000000000000) return true;
      },
    },
    {
      type: "list",
      name: "department",
      message: "What department does this employee belong to?",
      choices: departments.map(department => `${department.id} ${department.name}`),
    },
  ]);
  const sql = `INSERT INTO roles (title, salary, department_id)
                      VALUES ("${answers.title}", "${
    answers.salary
  }", "${parseInt(answers.department)}")`;
  const message = `\n ${
    answers.title
  } has been added as a role in the ${answers.department.match(
    /\b[^\d\s]+/
  )} department. \n`;
  execute(sql, message);
};

const addEmployeePrompt = async () => {
  const roles = await db
    .promise()
    .query(allRoles)
    .then(([rows]) => rows);

  const managers = await db
    .promise()
    .query(allManagers)
    .then(([rows]) => {
      console.log(rows);
      return rows;
    });
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "first_name",
      message: "What is this employee's first name?",
      validate: (first_name) => {
        if (first_name.match(/^[a-zA-Z]+$/)) return true;
        return false;
      },
    },
    {
      type: "input",
      name: "last_name",
      message: "What is this employee's last name?",
      validate: (last_name) => {
        if (last_name.match(/^[a-zA-Z]+$/)) return true;
        return false;
      },
    },
    {
      type: "confirm",
      name: "is_manager",
      message: "Is this an employee a manager?",
      default: false,
    },
    {
      type: "confirm",
      name: "has_manager",
      message: "Does this employee have a manager?",
      default: false,
    },
    {
      type: "list",
      name: "manager",
      message: "Who is this employee's manager?",
      choices: managers.map(manager => `${manager.id} ${manager.first_name} ${manager.last_name}`),
      when: (answers) => answers.has_manager !== false,
    },
    {
      type: "list",
      name: "role_id",
      message: "What is this employee's role?",
      choices: roles.map(role => `${role.id} ${role.title}`),
    },
  ]);
  if (answers.is_manager === true) answers.is_manager = 1;
  else answers.is_manager = 0; 
  const sql = `INSERT INTO employees (first_name, last_name, manager_id, role_id, is_manager)
                      VALUES ("${answers.first_name}", "${answers.last_name}", ${answers.manager ? answers.manager.match(/\b[^a-zA-Z\s]+/): null}, ${answers.role_id.match(/\b[^a-zA-Z\s]+/)}, ${answers.is_manager})`;
  const message = `\n ${answers.first_name} ${answers.last_name} has been added to employees. \n`;
  execute(sql, message);
};

mainPrompt();

module.exports = mainPrompt;
