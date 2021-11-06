const cTable = require("console.table")
const inquirer = require("inquirer")
const { handlers } = require("./lib")

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
      return handlers.end()

    case openingChoices[1]:
      await handlers.view.departments()
      break

    case openingChoices[2]:
      await handlers.view.roles()
      break

    case openingChoices[3]:
      await handlers.view.employees()
      break

    case openingChoices[4]:
      await handlers.add.department()
      break

    case openingChoices[5]:
      await handlers.add.role()
      break

    case openingChoices[6]:
      await handlers.add.employee()
      break

    case openingChoices[7]:
      await handlers.update.role()
      break

    case openingChoices[8]:
      await handlers.update.employee()
      break

    case openingChoices[9]:
      await handlers.delete.department()
      break

    case openingChoices[10]:
      await handlers.delete.role()
      break

    case openingChoices[11]:
      await handlers.delete.employee()
      break
  }

  return initializeApp()
}

initializeApp()
