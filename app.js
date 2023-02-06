const bodyParser = require("body-parser");
const express = require("express");
const exphbs = require("express-handlebars");
const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});
// connect to DB
pool.getConnection((err, connection) => {
  if (err) throw err;
  console.log("Connected as ID " + connection.threadId);
});
const app = express();
const port = process.env.port || 3000;

// Parsing middleware
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.urlencoded({ extended: true }));

// Parse application/json
app.use(bodyParser.json());
// app.use(express.json());

// Static Files
app.use(express.static("public"));

const handlebars = exphbs.create({ extname: ".hbs" });
app.engine(".hbs", handlebars.engine);
app.set("view engine", ".hbs");

//router
const routes = require("./server/routes/user");
app.use("/", routes);

app.listen(port, () => console.log(`Listening on port ${port}`));
