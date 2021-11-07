const inquirer = require("inquirer")
const prompts = require("../prompts")
const queries = require("../queries")

module.exports = function (select, textOnly, execute) {
  return {
    department: async () => {
      const departments = await select(queries.view.departments)
      const answers = await inquirer.prompt(
        prompts.delete.department(departments)
      )
      const sql = queries.delete.department(answers)
      const message = `The ${answers.department.match(
        textOnly
      )} department has been successfully deleted.`
      return execute(sql, message)
    },

    role: async () => {
      const roles = await select(queries.view.roles({ sort: "" }))
      const answers = await inquirer.prompt(prompts.delete.role(roles))
      const sql = queries.delete.role(answers)
      const message = `The ${answers.role.match(
        textOnly
      )} role has been successfully deleted.`
      return execute(sql, message)
    },

    employee: async () => {
      const employees = await select(queries.view.employees({ sort: "" }))
      const answers = await inquirer.prompt(prompts.delete.employee(employees))
      const sql = queries.delete.employee(answers)
      const message = `The employee ${answers.employee.match(
        textOnly
      )} has been successfully deleted.`
      return execute(sql, message)
    },
  }
}
