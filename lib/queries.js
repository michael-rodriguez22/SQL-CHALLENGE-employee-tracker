const idOnly = /[0-9]+/

module.exports = {
  view: {
    departments: `
        SELECT
            d.id
            , d.name
            , SUM(r.salary) total_utilized_budget
        FROM
            departments d
            LEFT JOIN roles r ON r.department_id = d.id
        GROUP BY
            d.id
            , d.name
    `,
    roles: ({ sort }) => `
        SELECT
            r.id
            , r.title
            , d.name department
            , r.salary
        FROM
            roles r
            JOIN departments d ON r.department_id = d.id
        ${sort}
    `,
    employees: ({ sort }) => `
        SELECT
            e.id
            , e.first_name
            , e.last_name
            , d.name department
            , r.id role_id
            , r.title role
            , r.salary salary
            , m.id manager_id
            ,CONCAT (m.first_name, ' ', m.last_name) manager_name
        FROM
            employees e
            LEFT JOIN roles r ON e.role_id = r.id
            LEFT JOIN departments d on d.id = r.department_id
            LEFT JOIN employees m ON m.id = e.manager_id
        ${sort}
    `,
  },

  add: {
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
        , ${department.match(idOnly)})
    `,
    employee: ({ firstName, lastName, manager, roleId, isManager }) => `
      INSERT INTO 
        employees (first_name, last_name, manager_id, role_id, is_manager)
      VALUES (
        "${firstName}"
        , "${lastName}"
        , ${manager ? manager.match(idOnly) : null}
        , ${roleId.match(idOnly)}, ${isManager})
    `,
  },

  update: {
    role: answers => `
      UPDATE 
        roles 
      SET 
        salary = ${answers.salary} 
      WHERE 
        id = ${answers.role.match(regex.idOnly)}
    `,
    employee: (answers, targetEmployee) => `
        UPDATE 
            employees
        SET
            first_name = "${answers.firstName || targetEmployee.first_name}"
            , last_name = "${answers.lastName || targetEmployee.last_name}"
            , manager_id = ${
              answers.managerId
                ? answers.managerId.match(idOnly)
                : targetEmployee.manager_id
            }
            , role_id = ${
              answers.roleId
                ? answers.roleId.match(idOnly)
                : targetEmployee.role_id
            }
            , is_manager = ${answers.isManager} 
            WHERE 
              id = ${answers.id}
    `,
  },

  delete: {
    department: answers => `
      DELETE FROM 
        departments 
      WHERE 
        id = ${answers.department.match(idOnly)}
    `,
    role: answers => `
      DELETE FROM 
        roles 
      WHERE 
        id = ${answers.role.match(idOnly)}
    `,
    employee: answers => `
      DELETE FROM 
        employees 
      WHERE 
        id = ${answers.employee.match(idOnly)}
    `,
  },
}
