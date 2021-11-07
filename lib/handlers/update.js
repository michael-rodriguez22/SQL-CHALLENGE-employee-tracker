const inquirer = require("inquirer")
const prompts = require("../prompts")
const queries = require("../queries")

module.exports = function (select, execute) {
  return {
    role: async () => {
      const roles = await select(
        queries.view.roles({ sort: "ORDER BY department ASC" })
      )
      const answers = await inquirer.prompt(prompts.update().role(roles))
      const sql = queries.update.role(answers)
      const message = `This role's salary has been successfully updated to ${answers.salary}.`
      return execute(sql, message)
    },

    employee: async () => {
      const employees = await select(queries.view.employees({ sort: "" }))
      const managers = await select(
        queries.view.employees({ sort: "WHERE e.is_manager = 1" })
      )
      const roles = await select(queries.view.roles({ sort: "" }))
      const answers = await inquirer.prompt(
        prompts.update().employee(employees, managers, roles)
      )
      answers.isManager = answers.isManager ? 1 : 0
      const targetEmployee = employees.filter(
        employee => employee.id === answers.id
      )[0]
      const sql = queries.update.employee(answers, targetEmployee)
      const message = `Employee ${answers.id} has had their information successfully updated.`
      return execute(sql, message)
    },
  }
}
