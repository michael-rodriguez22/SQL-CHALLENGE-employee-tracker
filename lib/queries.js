const regex = require("./regex")

const queries = {
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
            , r.title role
            , r.salary salary,
            CONCAT (m.first_name, ' ', m.last_name) AS manager
        FROM
            employees e
            JOIN roles r ON e.role_id = r.id
            JOIN departments d on d.id = r.department_id
            LEFT JOIN employees m ON m.id = e.manager_id
        ${sort}
    `,
  },

  add: {
    department: ({ name }) =>
      `INSERT INTO departments (name) VALUES ("${name}")`,
    role: ({ title, salary, department }) =>
      `INSERT INTO roles (title, salary, department_id) 
        VALUES ("${title}", ${salary}, ${department.match(regex.idOnly)})`,
    employee: ({ firstName, lastName, manager, roleId, isManager }) =>
      `INSERT INTO employees (first_name, last_name, manager_id, role_id, is_manager)
        VALUES ("${firstName}", "${lastName}", ${
        manager ? manager.match(regex.idOnly) : null
      }, ${roleId.match(regex.idOnly)}, ${isManager})`,
  },

  allDepartments: `SELECT * FROM departments`,

  allRoles: `SELECT roles.id, roles.title, departments.name AS department, roles.salary
                    FROM roles
                    JOIN departments ON departments.id = roles.department_id`,

  allEmployees: `SELECT emp.id, emp.first_name, emp.last_name,
                        departments.name AS department, roles.title AS role, roles.salary AS salary,
                        CONCAT (manager.first_name, ' ', manager.last_name) AS manager
                        FROM employees AS emp
                        JOIN roles ON emp.role_id = roles.id
                        JOIN departments ON departments.id = roles.department_id
                        LEFT JOIN employees AS manager ON manager.id = emp.manager_id`,

  allManagers: `SELECT emp.id, emp.first_name, emp.last_name,
                        departments.name AS department, roles.title AS role, roles.salary AS salary,
                        CONCAT (manager.first_name, ' ', manager.last_name) AS manager
                        FROM employees AS emp
                        JOIN roles ON emp.role_id = roles.id
                        JOIN departments ON departments.id = roles.department_id
                        LEFT JOIN employees AS manager ON manager.id = emp.manager_id
                        WHERE emp.is_manager = 1`,
}

module.exports = queries
