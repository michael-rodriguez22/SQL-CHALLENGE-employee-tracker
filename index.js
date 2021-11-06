const db = require("./config/connection")
const inquirer = require("inquirer")
const { prompts, queries } = require("./lib")
const testHandlers = require("./lib/handlers")

const textOnly = /[a-zA-Z]+[\s\w]+/

const initializeApp = async () => {
  const openingChoices = [
    "Exit",
    "View all departments",
    "View all roles",
    "View all employees",
    "Add a department",
    "Add a role",
    "Add an employee",
    "Update a role's salary",
    "Update an employee's information",
    "Delete a department",
    "Delete a role",
    "Delete an employee",
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
      await testHandlers.view.departments()
      break

    case openingChoices[2]:
      await testHandlers.view.roles()
      break

    case openingChoices[3]:
      await testHandlers.view.employees()
      break

    case openingChoices[4]:
      await testHandlers.add.department()
      break

    case openingChoices[5]:
      await testHandlers.add.role()
      break

    case openingChoices[6]:
      await testHandlers.add.employee()
      break

    case openingChoices[7]:
      return handle.update.role()

    case openingChoices[8]:
      return handle.update.employee()

    case openingChoices[9]:
      return handle.delete.department()

    case openingChoices[10]:
      return handle.delete.role()

    case openingChoices[11]:
      return handle.delete.employee()
  }
  return initializeApp()
}

initializeApp()

const view = query => {
  db.promise()
    .query(query)
    .then(([rows]) => {
      console.log(`\n ${cTable.getTable(rows)} \n`)
      initializeApp()
    })
    .catch(err => console.log(err))
}

const execute = (sql, message) => {
  db.promise()
    .execute(sql)
    .then(() => {
      console.log(`\n ${message} \n`)
      initializeApp()
    })
    .catch(err => console.log(err))
}

const handle = {
  view: {
    departments: async () => view(queries.view.departments),
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
      const answers = await inquirer.prompt(prompts.add().department)
      const sql = queries.add.department(answers)
      const message = `${answers.name} has been added to departments.`
      execute(sql, message)
    },
    role: async () => {
      const departments = await db
        .promise()
        .query(queries.view.departments)
        .then(([rows]) => rows)
      const answers = await inquirer.prompt(prompts.add().role(departments))
      const sql = queries.add.role(answers)
      const message = `${
        answers.title
      } has been added as a role in the ${answers.department.match(
        textOnly
      )} department.`
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
        prompts.add().employee(roles, managers)
      )
      answers.isManager = answers.isManager ? 1 : 0
      const sql = queries.add.employee(answers)
      const message = `${answers.firstName} ${answers.lastName} has been added to employees.`
      execute(sql, message)
    },
  },

  update: {
    role: async () => {
      const roles = await db
        .promise()
        .query(queries.view.roles({ sort: "ORDER BY department ASC" }))
        .then(([rows]) => rows)
      const answers = await inquirer.prompt(prompts.update().role(roles))
      const sql = queries.update.role(answers)
      const message = `This role's salary has been successfully updated to ${answers.salary}.`
      execute(sql, message)
    },
    employee: async () => {
      const employees = await db
        .promise()
        .query(queries.view.employees({ sort: "" }))
        .then(([rows]) => rows)
      const managers = await db
        .promise()
        .query(queries.view.employees({ sort: "WHERE e.is_manager = 1" }))
        .then(([rows]) => rows)
      const roles = await db
        .promise()
        .query(queries.view.roles({ sort: "" }))
        .then(([rows]) => rows)
      const answers = await inquirer.prompt(
        prompts.update().employee(employees, managers, roles)
      )
      answers.isManager = answers.isManager ? 1 : 0
      const targetEmployee = employees.filter(
        employee => employee.id === answers.id
      )[0]
      const sql = queries.update.employee(answers, targetEmployee)
      const message = `Employee ${answers.id} has had their information successfully updated.`
      execute(sql, message)
    },
  },

  delete: {
    department: async () => {
      const departments = await db
        .promise()
        .query(queries.view.departments)
        .then(([rows]) => rows)
      const answers = await inquirer.prompt(
        prompts.delete.department(departments)
      )
      const sql = queries.delete.department(answers)
      const message = `The ${answers.department.match(
        textOnly
      )} department has been successfully deleted.`
      execute(sql, message)
    },
    role: async () => {
      const roles = await db
        .promise()
        .query(queries.view.roles({ sort: "" }))
        .then(([rows]) => rows)
      const answers = await inquirer.prompt(prompts.delete.role(roles))
      const sql = queries.delete.role(answers)
      const message = `The ${answers.role.match(
        textOnly
      )} role has been successfully deleted.`
      execute(sql, message)
    },
    employee: async () => {
      const employees = await db
        .promise()
        .query(queries.view.employees({ sort: "" }))
        .then(([rows]) => rows)
      const answers = await inquirer.prompt(prompts.delete.employee(employees))
      const sql = queries.delete.employee(answers)
      const message = `The employee ${answers.employee.match(
        textOnly
      )} has been successfully deleted.`
      execute(sql, message)
    },
  },
}
