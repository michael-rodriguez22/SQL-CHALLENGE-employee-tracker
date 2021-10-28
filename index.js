const db = require("./config/connection")
const inquirer = require("inquirer")
const { prompts, queries, regex } = require("./lib")

const addDepartment = async () => {
  const answers = await inquirer.prompt(prompts.add.department)
  const sql = `INSERT INTO departments (name)
                    VALUES ("${answers.name}")`
  const message = `\n ${answers.name} has been added to departments. \n`
  execute(sql, message)
}

const addRole = async () => {
  const departments = await db
    .promise()
    .query(queries.allDepartments)
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

const addEmployee = async () => {
  const roles = await db
    .promise()
    .query(queries.allRoles)
    .then(([rows]) => rows)

  const managers = await db
    .promise()
    .query(queries.allManagers)
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
    .query(queries.allEmployees)
    .then(([rows]) => rows)

  const roles = await db
    .promise()
    .query(queries.allRoles)
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

const initializeApp = async () => {
  const openingChoices = [
    "Exit",
    "View all departments",
    "View all roles",
    "View all employees",
    "Add a department",
    "Add a role",
    "Add an employee",
    "Update an employee",
    "Delete department",
    "Delete role",
    "Delete employee",
  ]
  const answers = await inquirer.prompt({
    type: "list",
    name: "opening",
    message: "What would you like to do?",
    choices: openingChoices,
    pageSize: 5,
  })
  switch (answers.opening) {
    case openingChoices[0]:
      console.log("Goodbye!")
      return db.end()

    case openingChoices[1]:
      return handle.view.departments()

    case openingChoices[2]:
      return handle.view.roles()

    case openingChoices[3]:
      return handle.view.employees()

    case openingChoices[4]:
      return addDepartment()

    case openingChoices[5]:
      return addRole()

    case openingChoices[6]:
      return addEmployee()

    case openingChoices[7]:
      return updateEmployeePrompt()
  }
}

initializeApp()

const view = query => {
  db.promise()
    .query(query)
    .then(([rows, fields]) => {
      console.log(`\n`)
      console.table(rows)
      console.log(`\n`)
      initializeApp()
    })
    .catch(err => console.log(err))
}

const execute = (sql, message) => {
  db.promise()
    .execute(sql)
    .then(() => {
      console.log(message)
      initializeApp()
    })
    .catch(err => console.log(err))
}

const handle = {
  view: {
    departments: () => view(queries.view.departments),
    roles: async () => {
      const answers = await inquirer.prompt(prompts.view.roles)
      view(queries.view.roles(answers.sort))
    },
    employees: async () => {
      const answers = await inquirer.prompt(prompts.view.employees)
      view(queries.view.employees(answers.sort))
    },
  },

  add: {
    department: async () => {
      const answers = await inquirer.prompt(prompts.add.department)
      const sql = `INSERT INTO departments (name)
                        VALUES ("${answers.name}")`
      const message = `\n ${answers.name} has been added to departments. \n`
      execute(sql, message)
    },
  },
}
