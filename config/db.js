const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: process.env.user,
  password: process.env.password,
  database: process.env.database_name,
});

const connectDB = () => {
  connection.connect((err) => {
    if (err) {
      console.error("Error connecting to MySQL:", err.stack);
      return;
    }
    console.log("Connected to MySQL as id", connection.threadId);
  });

  connection.query('SET autocommit = 0', (err) => {
    if (err) {
      console.error("Error disabling auto-commit:", err.stack);
    }
  });
};

module.exports = { connection, connectDB };
