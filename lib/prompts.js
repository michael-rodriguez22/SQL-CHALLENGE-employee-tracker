const validateString = string => (string.match(/^[a-zA-Z\ ]+$/) ? true : false)

const prompts = {
  // first question
  opening: {
    type: "list",
    name: "opening",
    message: "What would you like to do?",
    choices: [
      "Exit",
      "View all departments",
      "View all roles",
      "View all employees",
      "Add a department",
      "Add a role",
      "Add an employee",
      "Update an employee",
      "Delete department",
      "Delete role",
      "Delete employee",
    ],
    pageSize: 5,
  },

  //   add departments, roles, and employees
  add: {
    department: {
      type: "input",
      name: "name",
      message: "Please enter a name for the department you would like to add.",
      validate: name => validateString(name),
    },
    role: departmentData => {
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
          validate: salary => {
            if (salary <= 10000000000000) return true
          },
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
    employee: (roleData, employeeData) => {
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
          name: "hasManager",
          message: "Does this employee have a manager?",
          default: false,
        },
        {
          type: "list",
          name: "manager",
          message: "Who is this employee's manager?",
          choices: employeeData.map(
            employee =>
              `${employee.id} ${employee.first_name} ${employee.last_name}`
          ),
          when: answers => answers.has_manager !== false,
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
            "Are you sure you would like to delete this department? This cannot be undone.",
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
            "Are you sure you would like to delete this role? This cannot be undone.",
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
            employee => `${employee.id} ${employee.name}`
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

  // update employee (manager, role)
  update: {
    employee: (employeeData, roleData) => {
      return [
        {
          type: "list",
          name: "employee",
          message: "Which employee's information would you like to update?",
          choices: employeeData.map(
            employee =>
              `${employee.id} ${employee.first_name} ${employee.last_name}`
          ),
        },
        {
          type: "list",
          name: "updateOption",
          message: "What would you like to update?",
          choices: [
            "Change this employee's manager.",
            "Change this employee's role",
          ],
        },
        {
          type: "list",
          name: "newManager",
          message: "Please select a new manager for this employee.",
          choices: employeeData.map(
            employee =>
              `${employee.id} ${employee.first_name} ${employee.last_name}`
          ),
        },
        {
          type: "list",
          name: "newRole",
          message: "Please select this employee's new role.",
          choices: roleData.map(role => `${role.id} ${role.title}`),
          when: updateOption === "Change this employee's role",
        },
      ]
    },
  },
}

module.exports = prompts
