const inquirer = require("inquirer")
const prompts = require("../prompts")
const queries = require("../queries")

module.exports = function (view) {
  return {
    departments: async () => view(queries.view.departments),
    roles: async () => {
      const answers = await inquirer.prompt(prompts.view.roles)
      return view(queries.view.roles(answers))
    },
    employees: async () => {
      const answers = await inquirer.prompt(prompts.view.employees)
      return view(queries.view.employees(answers))
    },
  }
}
