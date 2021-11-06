const db = require("../../db/connection")

const viewHandlers = require("./view")
const addHandlers = require("./add")
const updateHandlers = require("./update")
const deleteHandlers = require("./delete")

const display = async query => {
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

const select = async query => {
  return db
    .promise()
    .query(query)
    .then(([rows]) => rows)
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

const textOnly = /[a-zA-Z]+[\s\w]+/

const handlers = {
  end: () => db.end(),
  view: viewHandlers(display),
  add: addHandlers(select, textOnly, execute),
  update: updateHandlers(select, execute),
  delete: deleteHandlers(select, textOnly, execute),
}

module.exports = handlers
