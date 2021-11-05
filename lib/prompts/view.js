module.exports = {
  roles: {
    type: "list",
    name: "sort",
    message: "How would you like to sort this list of roles?",
    choices: [
      { name: "By department", value: "ORDER BY department ASC" },
      { name: "By salary", value: "ORDER BY salary DESC" },
    ],
  },
  employees: {
    type: "list",
    name: "sort",
    message: "How would you like to sort this list of employees?",
    choices: [
      { name: "By id", value: "ORDER BY id ASC" },
      { name: "By first name", value: "ORDER BY first_name ASC" },
      { name: "By last name", value: "ORDER BY last_name ASC" },
      { name: "By department", value: "ORDER BY department ASC" },
      { name: "By manager", value: `ORDER BY manager_id ASC` },
    ],
  },
}
