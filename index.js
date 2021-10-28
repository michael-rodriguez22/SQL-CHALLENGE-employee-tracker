const db = require("./config/connection")
const cTable = require("console.table")
const inquirer = require("inquirer")
const { prompts, queries, regex } = require("./lib")

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
      return handle.add.department()

    case openingChoices[5]:
      return handle.add.role()

    case openingChoices[6]:
      return handle.add.employee()

    case openingChoices[7]:
      return updateEmployeePrompt()
  }
}

initializeApp()

const view = query => {
  db.promise()
    .query(query)
    .then(([rows, fields]) => {
      console.log(`\n ${cTable.getTable(rows)} \n`)
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
      view(queries.view.roles(answers))
    },
    employees: async () => {
      const answers = await inquirer.prompt(prompts.view.employees)
      view(queries.view.employees(answers))
    },
  },

  add: {
    department: async () => {
      const answers = await inquirer.prompt(prompts.add.department)
      const sql = queries.add.department(answers)
      const message = `\n ${answers.name} has been added to departments. \n`
      execute(sql, message)
    },
    role: async () => {
      const departments = await db
        .promise()
        .query(queries.view.departments)
        .then(([rows]) => rows)
      const answers = await inquirer.prompt(prompts.add.role(departments))
      const sql = queries.add.role(answers)
      const message = `\n ${
        answers.title
      } has been added as a role in the ${answers.department.match(
        regex.textOnly
      )} department. \n`
      execute(sql, message)
    },
    employee: async () => {
      const roles = await db
        .promise()
        .query(queries.view.roles({ sort: "" }))
        .then(([rows]) => rows)

      const managers = await db
        .promise()
        .query(queries.view.employees({ sort: "WHERE e.is_manager = 1" }))
        .then(([rows]) => rows)

      const answers = await inquirer.prompt(
        prompts.add.employee(roles, managers)
      )
      answers.isManager = answers.isManager ? 1 : 0
      const sql = queries.add.employee(answers)
      const message = `\n ${answers.firstName} ${answers.lastName} has been added to employees. \n`
      execute(sql, message)
    },
  },
}
