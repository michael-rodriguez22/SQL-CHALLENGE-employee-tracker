const db = require("./config/connection");
const inquirer = require("inquirer");
const { allDepartments, allEmployees, allRoles } = require("./queries");

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
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "opening",
      message: "What would you like to do?",
      choices: [
        "Exit",
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee",
      ],
      pageSize: 4,
    },
  ]);
  switch (answers.opening) {
    case "Exit":
      console.log("Goodbye!");
      return db.end();
    case "View all departments":
      return view(allDepartments);
    case "View all roles":
      return view(allRoles);
    case "View all employees":
      return view(allEmployees);
    case "Add a department":
      return addDepPrompt();
    case "Add a role":
      return addRolePrompt();
  }
};

const addDepPrompt = async () => {
  const answers = await inquirer.prompt({
    type: "input",
    name: "name",
    message: "Please enter a name for the department you would like to add.",
    validate: (name) => {
      if (name) return true;
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
        if (title) return true;
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
      choices: departments.map((item) => `${item.id} ${item.name}`),
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

mainPrompt();

module.exports = mainPrompt;
