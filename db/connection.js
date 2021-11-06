const mysql = require('mysql2');

require('dotenv').config();

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: "butterfly_cms",
  },
  console.log("connected to the butterfly_cms database")
);

module.exports = db;