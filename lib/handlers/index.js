const db = require("../../config/connection")
const cTable = require("console.table")

const viewHandlers = require("./view")
const addHandlers = require("./add")
const updateHandlers = require("./update")
const deleteHandlers = require("./delete")

const view = async query => {
  return db
    .promise()
    .query(query)
    .then(([rows]) => {
      console.log(`\n`)
      console.table(rows)
      console.log(`\n`)
    })
    .catch(err => console.log(`\n ${err} \n`))
}

const execute = async (sql, message) => {
  return db
    .promise()
    .execute(sql)
    .then(() => {
      console.log(`\n ${message} \n`)
    })
    .catch(err => console.log(`\n ${err} \n`))
}

async function testDepartments() {
  return view(queries.view.departments)
}

const handlers = {
  view: viewHandlers(view),
  add: addHandlers(view, execute),
  update: updateHandlers(view, execute),
  delete: deleteHandlers(view, execute),
}

module.exports = handlers
