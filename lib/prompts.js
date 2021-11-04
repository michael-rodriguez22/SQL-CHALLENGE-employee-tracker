const regex = require("./regex")

const validateString = string =>
  string.match(regex.validString) ? true : false

const prompts = {
  // view options for roles and employees
  view: {
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
  },

  //   add departments, roles, and employees
  add: {
    department: {
      type: "input",
      name: "name",
      message: "Please enter a name for the department you would like to add.",
      validate: name => validateString(name),
    },
    role: function (departmentData) {
      return [
        {
          type: "input",
          name: "title",
          message: "Please enter a title for the role you would like to add.",
          validate: title => validateString(title),
        },
        {
          type: "integer",
          name: "salary",
          message: "What is the salary for this role? (whole dollars only)",
          validate: salary => (salary <= 10000000000000 ? true : false),
        },
        {
          type: "list",
          name: "department",
          message: "What department does this role belong to?",
          choices: departmentData.map(
            department => `${department.id} ${department.name}`
          ),
        },
      ]
    },
    employee: (roleData, managerData) => {
      return [
        {
          type: "input",
          name: "firstName",
          message: "What is this employee's first name?",
          validate: firstName => validateString(firstName),
        },
        {
          type: "input",
          name: "lastName",
          message: "What is this employee's last name?",
          validate: lastName => validateString(lastName),
        },
        {
          type: "confirm",
          name: "isManager",
          message: "Is this employee a manager?",
          default: false,
        },
        {
          type: "confirm",
          name: "hasManager",
          message: "Does this employee have a manager?",
          default: false,
        },
        {
          type: "list",
          name: "manager",
          message: "Who is this employee's manager?",
          choices: managerData.map(
            manager =>
              `${manager.id} ${manager.first_name} ${manager.last_name}`
          ),
          when: answers => answers.hasManager !== false,
          pageSize: 5,
        },
        {
          type: "list",
          name: "roleId",
          message: "What is this employee's role?",
          choices: roleData.map(role => `${role.id} ${role.title}`),
        },
      ]
    },
  },

  // update employee (manager, role)
  update: {
    role: roleData => {
      return [
        {
          type: "list",
          name: "role",
          message: "Which role's salary would you like to update?",
          choices: roleData.map(
            role => `${role.id} ${role.title} | current salary: $${role.salary}`
          ),
          pageSize: 5,
        },
        {
          type: "integer",
          name: "salary",
          message: "What is the new salary for this role? (whole dollars only)",
          validate: salary => (salary <= 10000000000000 ? true : false),
        },
      ]
    },
    employee: (employeeData, managerData, roleData) => {
      return [
        {
          type: "list",
          name: "id",
          message: "Which employee's information would you like to update?",
          choices: employeeData.map(employee => {
            return {
              value: employee.id,
              name: `${employee.id} ${employee.first_name} ${employee.last_name} | manager: ${employee.manager_name} role: ${employee.role}`,
            }
          }),
        },
        {
          type: "checkbox",
          name: "updateOptions",
          message:
            "What information would you like to update for this employee?",
          choices: [
            { value: "f", name: "Change first name" },
            { value: "l", name: "Change last name" },
            { value: "m", name: "Change manager" },
            { value: "r", name: "Change role" },
            {
              value: "s",
              name: "Change whether or not this employee is a manager",
            },
          ],
        },
        {
          type: "input",
          name: "firstName",
          message: "What is this employee's new first name?",
          validate: firstName => validateString(firstName),
          when: answers => answers.updateOptions.includes("f"),
        },
        {
          type: "input",
          name: "lastName",
          message: "What is this employee's new last name?",
          validate: lastName => validateString(lastName),
          when: answers => answers.updateOptions.includes("l"),
        },
        {
          type: "list",
          name: "managerId",
          message: "Please select a new manager for this employee.",
          choices: managerData.map(
            manager =>
              `${manager.id} ${manager.first_name} ${manager.last_name}`
          ),
          when: answers => answers.updateOptions.includes("m"),
        },
        {
          type: "list",
          name: "roleId",
          message: "Please select this employee's new role.",
          choices: roleData.map(role => `${role.id} ${role.title}`),
          when: answers => answers.updateOptions.includes("r"),
        },
        {
          type: "confirm",
          name: "isManager",
          message: "Is this employee a manager now?",
          default: false,
          when: answers => answers.updateOptions.includes("s"),
        },
      ]
    },
  },

  //   delete departments, roles, and employees
  delete: {
    department: departmentData => {
      return [
        {
          type: "list",
          name: "department",
          message: "Which department would you like to delete?",
          choices: departmentData.map(
            department => `${department.id} ${department.name}`
          ),
        },
        {
          type: "confirm",
          name: "confirmDelete",
          message:
            "Are you sure you would like to delete this department? This cannot be undone. All associated roles will no longer have a department.",
        },
      ]
    },
    role: roleData => {
      return [
        {
          type: "list",
          name: "role",
          message: "Which role would you like to delete?",
          choices: roleData.map(role => `${role.id} ${role.title}`),
        },
        {
          type: "confirm",
          name: "confirmDelete",
          message:
            "Are you sure you would like to delete this role? This cannot be undone. All associated employees will no longer have a role.",
        },
      ]
    },
    employee: employeeData => {
      return [
        {
          type: "list",
          name: "employee",
          message: "Which employee would you like to delete?",
          choices: employeeData.map(
            employee =>
              `${employee.id} ${employee.first_name} ${employee.last_name}`
          ),
        },
        {
          type: "confirm",
          name: "confirmDelete",
          message:
            "Are you sure you would like to delete this employee? This cannot be undone.",
        },
      ]
    },
  },
}

module.exports = prompts
