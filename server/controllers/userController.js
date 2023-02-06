const mysql = require("mysql2");
// Connection pool
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// View students
exports.view = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("Connected as ID " + connection.threadId);
    // student connection
    connection.query(
      'SELECT * FROM student WHERE status="active"',
      (err, rows) => {
        connection.release();
        if (!err) {
          let removedUser = req.query.removed;
          res.render("home", { rows, removedUser });
        } else {
          console.log(err);
        }
        console.log("The data from user table: \n", rows);
      }
    );
  });
};
// find by search
exports.find = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("Connected as ID " + connection.threadId);
    let searchTerm = req.body.search;
    // connection
    connection.query(
      "SELECT * FROM student WHERE first_name LIKE ? OR last_name LIKE ?",
      ["%" + searchTerm + "%", "%" + searchTerm + "%"],
      (err, rows) => {
        connection.release();
        if (!err) {
          res.render("home", { rows });
        } else {
          console.log(err);
        }
        console.log("The data from user table: \n", rows);
      }
    );
  });
};

exports.form = (req, res) => {
  res.render("add-user");
};

// add new student
exports.create = (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("Connected as ID " + connection.threadId);
    // student connection
    connection.query(
      "INSERT INTO student SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?",
      [first_name, last_name, email, phone, comments],
      (err, rows) => {
        connection.release();
        if (!err) {
          res.render("add-user", { alert: "Сурагч амжилттай бүртгэгдлээ!" });
        } else {
          console.log(err);
        }
        console.log("The data from user table: \n", rows);
      }
    );
  });
};

// Edit
exports.edit = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("Connected as ID " + connection.threadId);
    // student connection
    connection.query(
      "SELECT * FROM student WHERE id = ?",
      [req.params.id],
      (err, rows) => {
        connection.release();
        if (!err) {
          res.render("edit-user", { rows });
        } else {
          console.log(err);
        }
        console.log("The data from user table: \n", rows);
      }
    );
  });
};

// Update
exports.update = (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("Connected as ID " + connection.threadId);
    connection.query(
      "UPDATE student SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE id = ?",
      [first_name, last_name, email, phone, comments, req.params.id],
      (err, rows) => {
        connection.release();
        if (!err) {
          pool.getConnection((err, connection) => {
            if (err) throw err;
            console.log("Connected as ID " + connection.threadId);
            // student connection
            connection.query(
              "SELECT * FROM student WHERE id = ?",
              [req.params.id],
              (err, rows) => {
                connection.release();
                if (!err) {
                  res.render("edit-user", {
                    rows,
                    alert: "Мэдээлэл шинэчлэгдлээ!",
                  });
                } else {
                  console.log(err);
                }
                console.log("The data from user table: \n", rows);
              }
            );
          });
        } else {
          console.log(err);
        }
        console.log("The data from user table: \n", rows);
      }
    );
  });
};

// Delete
exports.delete = (req, res) => {
  //   pool.getConnection((err, connection) => {
  //     if (err) throw err;
  //     console.log("Connected as ID " + connection.threadId);
  //     // student connection
  //     connection.query(
  //       "DELETE FROM student WHERE id = ?",
  //       [req.params.id],
  //       (err, rows) => {
  //         connection.release();
  //         if (!err) {
  //           res.redirect("/");
  //         } else {
  //           console.log(err);
  //         }
  //         console.log("The data from user table: \n", rows);
  //       }
  //     );
  //   });

  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      "UPDATE student SET status = ? WHERE id = ?",
      ["removed", req.params.id],
      (err, rows) => {
        connection.release();
        if (!err) {
          let removedUser = encodeURIComponent("Мэдээлэл устгагдлаа!");
          res.redirect("/?removed=" + removedUser);
        } else {
          console.log(err);
        }
        console.log("The data from user table: \n", rows);
      }
    );
  });
};

// View
exports.viewall = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("Connected as ID " + connection.threadId);
    // student connection
    connection.query(
      "SELECT * FROM student WHERE id = ?",
      [req.params.id],
      (err, rows) => {
        connection.release();
        if (!err) {
          res.render("view-user", { rows });
        } else {
          console.log(err);
        }
        console.log("The data from user table: \n", rows);
      }
    );
  });
};
