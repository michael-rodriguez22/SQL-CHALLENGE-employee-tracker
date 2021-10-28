const db = require("../config/connection")
const queries = require("./queries")
const prompts = require("./prompts")
const mainPrompt = require("../index")

const view = query => {
  db.promise()
    .query(query)
    .then(([rows, fields]) => {
      console.log(`\n`)
      console.table(rows)
      console.log(`\n`)
      //   mainPrompt(prompts.opening)
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

const handlers = {
  view: {
    departments: async callback => {
      await view(queries.allDepartments)
      return callback()
    },
  },
}

module.exports = handlers
