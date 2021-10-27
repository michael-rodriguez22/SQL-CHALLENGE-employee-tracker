const db = require("./config/connection")
const inquirer = require("inquirer")
const {
  allDepartments,
  allEmployees,
  allRoles,
  allManagers,
} = require("./queries")
const { prompts, queries, regex } = require("./lib")
// -------------- UTIL ----------------------------
const view = query => {
  db.promise()
    .query(query)
    .then(([rows, fields]) => {
      console.log(`\n`)
      console.table(rows)
      console.log(`\n`)
      mainPrompt(prompts.opening)
    })
    .catch(err => console.log(err))
}

const execute = (sql, message) => {
  db.promise()
    .execute(sql)
    .then(() => {
      console.log(message)
      mainPrompt(prompts.opening)
    })
    .catch(err => console.log(err))
}

// -------------PROMPTS---------------------------
const mainPrompt = async ({ question, choices }) => {
  const answers = await inquirer.prompt(question)
  switch (answers.opening) {
    case choices[0]:
      console.log("Goodbye!")
      return db.end()
    case choices[1]:
      return view(allDepartments)
    case choices[2]:
      return view(allRoles)
    case choices[3]:
      return view(allEmployees)
    case choices[4]:
      return addDepPrompt()
    case choices[5]:
      return addRolePrompt()
    case choices[6]:
      return addEmployeePrompt()
    case choices[7]:
      return updateEmployeePrompt()
  }
}

const addDepPrompt = async () => {
  const answers = await inquirer.prompt(prompts.add.department)
  const sql = `INSERT INTO departments (name)
                    VALUES ("${answers.name}")`
  const message = `\n ${answers.name} has been added to departments. \n`
  execute(sql, message)
}

const addRolePrompt = async () => {
  const departments = await db
    .promise()
    .query(allDepartments)
    .then(([rows]) => rows)

  const answers = await inquirer.prompt(prompts.add.role(departments))
  const sql = `INSERT INTO roles (title, salary, department_id)
                      VALUES ("${answers.title}", "${
    answers.salary
  }", "${parseInt(answers.department)}")`
  const message = `\n ${
    answers.title
  } has been added as a role in the ${answers.department.match(
    regex.textOnly
  )} department. \n`
  execute(sql, message)
}

const addEmployeePrompt = async () => {
  const roles = await db
    .promise()
    .query(allRoles)
    .then(([rows]) => rows)

  const managers = await db
    .promise()
    .query(allManagers)
    .then(([rows]) => {
      return rows
    })

  const answers = await inquirer.prompt(prompts.add.employee(roles, managers))
  answers.isManager = answers.isManager ? 1 : 0
  const sql = `INSERT INTO employees (first_name, last_name, manager_id, role_id, is_manager)
                      VALUES ("${answers.firstName}", "${answers.lastName}", ${
    answers.manager ? answers.manager.match(regex.idOnly) : null
  }, ${answers.roleId.match(regex.idOnly)}, ${answers.isManager})`
  const message = `\n ${answers.firstName} ${answers.lastName} has been added to employees. \n`
  execute(sql, message)
}

const updateEmployeePrompt = async () => {
  const employees = await db
    .promise()
    .query(allEmployees)
    .then(([rows]) => rows)

  const roles = await db
    .promise()
    .query(allRoles)
    .then(([rows]) => rows)

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "employee",
      message: "Which employee's role would you like to update?",
      choices: employees.map(
        employee =>
          `${employee.id} ${employee.first_name} ${employee.last_name}`
      ),
    },
    {
      type: "list",
      name: "new_role",
      message: "Please select this employee's new role.",
      choices: roles.map(role => `${role.id} ${role.title}`),
    },
  ])
  const sql = `UPDATE employees SET role_id = ${answers.new_role.match(
    regex.idOnly
  )} WHERE id = ${answers.employee.match(regex.idOnly)}`
  const message = `\n ${answers.employee.match(
    regex.textOnly
  )} has had their role changed to ${answers.new_role.match(
    regex.textOnly
  )}. \n`
  execute(sql, message)
}

mainPrompt(prompts.opening)
