module.exports = {
  department: ({ name }) => `
      INSERT INTO 
        departments (name) 
      VALUES 
        ("${name}")
    `,

  role: ({ title, salary, department }) => `
      INSERT INTO 
        roles (title, salary, department_id) 
      VALUES (
        "${title}"
        , ${salary}
        , ${department.match(/[0-9]+/)})
    `,

  employee: ({ firstName, lastName, manager, roleId, isManager }) => `
      INSERT INTO 
        employees (first_name, last_name, manager_id, role_id, is_manager)
      VALUES (
        "${firstName}"
        , "${lastName}"
        , ${manager ? manager.match(/[0-9]+/) : null}
        , ${roleId.match(/[0-9]+/)}, ${isManager})
    `,
}
