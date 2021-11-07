module.exports = {
  department: answers => `
      DELETE FROM 
        departments 
      WHERE 
        id = ${answers.department.match(/[0-9]+/)}
    `,

  role: answers => `
      DELETE FROM 
        roles 
      WHERE 
        id = ${answers.role.match(/[0-9]+/)}
    `,

  employee: answers => `
      DELETE FROM 
        employees 
      WHERE 
        id = ${answers.employee.match(/[0-9]+/)}
    `,
}
