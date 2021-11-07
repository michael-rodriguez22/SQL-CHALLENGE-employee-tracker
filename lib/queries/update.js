module.exports = {
  role: answers => `
      UPDATE 
        roles 
      SET 
        salary = ${answers.salary} 
      WHERE 
        id = ${answers.role.match(/[0-9]+/)}
    `,

  employee: (answers, targetEmployee) => `
        UPDATE 
            employees
        SET
            first_name = "${answers.firstName || targetEmployee.first_name}"
            , last_name = "${answers.lastName || targetEmployee.last_name}"
            , manager_id = ${
              answers.managerId
                ? answers.managerId.match(/[0-9]+/)
                : targetEmployee.manager_id
            }
            , role_id = ${
              answers.roleId
                ? answers.roleId.match(/[0-9]+/)
                : targetEmployee.role_id
            }
            , is_manager = ${answers.isManager} 
            WHERE 
              id = ${answers.id}
    `,
}
