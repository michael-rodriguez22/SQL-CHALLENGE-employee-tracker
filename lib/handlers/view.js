const inquirer = require("inquirer")
const prompts = require("../prompts")
const queries = require("../queries")

module.exports = function (display) {
  return {
    departments: async () => display(queries.view.departments),

    roles: async () => {
      const answers = await inquirer.prompt(prompts.view.roles)
      return display(queries.view.roles(answers))
    },

    employees: async () => {
      const answers = await inquirer.prompt(prompts.view.employees)
      return display(queries.view.employees(answers))
    },
  }
}
