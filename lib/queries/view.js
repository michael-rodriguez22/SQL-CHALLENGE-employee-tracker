module.exports = {
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
}
