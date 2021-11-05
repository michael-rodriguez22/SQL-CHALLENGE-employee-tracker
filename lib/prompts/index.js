const view = require("./view")
const add = require("./add")
const update = require("./update")
const remove = require("./delete")

const regex = require("../regex")

const validateString = string =>
  string.match(regex.validString) ? true : false

const prompts = {
  view: view,
  add: () => add(validateString),
  update: () => update(validateString),
  delete: remove,
}

module.exports = prompts
