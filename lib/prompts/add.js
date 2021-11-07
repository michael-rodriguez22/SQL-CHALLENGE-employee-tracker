module.exports = function (validateString) {
  return {
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
  }
}
