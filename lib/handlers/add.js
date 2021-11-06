const inquirer = require("inquirer")
const prompts = require("../prompts")
const queries = require("../queries")

module.exports = function (select, textOnly, execute) {
  return {
    department: async () => {
      const answers = await inquirer.prompt(prompts.add().department)
      const sql = queries.add.department(answers)
      const message = `${answers.name} has been added to departments.`
      return execute(sql, message)
    },

    role: async () => {
      const departments = await select(queries.view.departments)
      const answers = await inquirer.prompt(prompts.add().role(departments))
      const sql = queries.add.role(answers)
      const message = `${
        answers.title
      } has been added as a role in the ${answers.department.match(
        textOnly
      )} department.`
      return execute(sql, message)
    },

    employee: async () => {
      const roles = await select(queries.view.roles({ sort: "" }))
      const managers = await select(
        queries.view.employees({ sort: "WHERE e.is_manager = 1" })
      )
      const answers = await inquirer.prompt(
        prompts.add().employee(roles, managers)
      )
      answers.isManager = answers.isManager ? 1 : 0
      const sql = queries.add.employee(answers)
      const message = `${answers.firstName} ${answers.lastName} has been added to employees.`
      return execute(sql, message)
    },
  }
}
