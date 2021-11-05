module.exports = {
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
}
