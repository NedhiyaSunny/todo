const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "todo",
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const sql = "SELECT * FROM users WHERE email= ? AND pass = ?";
  db.query(sql, [email, password], (err, data) => {
    if (err) return res.json("fetching Failed");
    if (data.length > 0) {
      return res.json(data);
    } else {
      return res.json(err);
    }
  });
});

app.post("/signup", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const sql = "SELECT * FROM users WHERE email= ?";
  db.query(sql, [email], (err, data) => {
    if (err) return res.json("fetching Failed");
    if (data.length < 1) {
      db.query(
        "INSERT INTO `users`( `name`, `email`, `pass`) VALUES ( ?, ?, ?)",
        [name, email, password],
        (err, data) => {
          if (err) return res.json("registrations failed", err);
          if (data) return res.json(data);
        }
      );
    } else {
      return res.json(err);
    }
  });
});

app.post("/single", (req, res) => {
  const sql = "SELECT * FROM tasks WHERE id= ?";

  db.query(sql, [req.body.itemId], (err, data) => {
    if (err) return res.json("fetching Failed");
    if (data.length > 0) {
      return res.json(data);
    } else {
      return res.json("No Records");
    }
  });
});

app.post("/completed_single", (req, res) => {
  const sql = "SELECT * FROM completed_tasks WHERE id= ?";

  db.query(sql, [req.body.itemId], (err, data) => {
    if (err) return res.json("fetching Failed");
    if (data.length > 0) {
      return res.json(data);
    } else {
      return res.json("No Records");
    }
  });
});

app.post("/add", (req, res) => {
  const title = req.body.title;
  const userId = req.body.userId;
  const sql = "INSERT INTO `tasks`( `user_id`, `title`) VALUES (?, ?)";
  db.query(sql, [userId, title], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/revert", (req, res) => {
  const id = req.body.id;
  const title = req.body.title;
  const user_id = req.body.user_id;
  const description = req.body.description;
  const created_date = req.body.created_date;
  const updated_date = req.body.updated_date;
  const sql =
    "INSERT INTO `tasks`( `id`,`user_id`,`title`,`description`,`created_date`,`updated_date`,`is_completed`) VALUES ( ?, ?, ?, ?, ?, ?, 'false')";
  db.query(
    sql,
    [id, user_id, title, description, created_date, updated_date],
    (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    }
  );
});
app.post("/complete", (req, res) => {
  const id = req.body.id;
  const title = req.body.title;
  const user_id = req.body.user_id;
  const description = req.body.description;
  const created_date = req.body.created_date;
  const updated_date = req.body.updated_date;
  const sql =
    "INSERT INTO `completed_tasks`( `id`,`user_id`,`title`,`description`,`created_date`,`updated_date`,`is_completed`) VALUES ( ?, ?, ?, ?, ?, ?, 'true')";
  db.query(
    sql,
    [id, user_id, title, description, created_date, updated_date],
    (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    }
  );
});

app.post("/update", (req, res) => {
  const id = req.body.id;
  const title = req.body.title;
  const description = req.body.description;
  const sql =
    "UPDATE `tasks` SET `title`= ?,`description`= ?,`updated_date`= CURRENT_TIMESTAMP() WHERE id = ? ";
  db.query(sql, [title, description, id], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/update-completed", (req, res) => {
  const id = req.body.id;
  const title = req.body.title;
  const description = req.body.description;
  const sql =
    "UPDATE `completed_tasks` SET `title`= ?,`description`= ?,`updated_date`= CURRENT_TIMESTAMP() WHERE id = ? ";
  db.query(sql, [title, description, id], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/remove", (req, res) => {
  const { id } = req.body;
  const sql = "DELETE FROM `tasks` WHERE id = ?";
  db.query(sql, [id], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/completed_remove", (req, res) => {
  const { id } = req.body;
  const sql = "DELETE FROM `completed_tasks` WHERE id = ?";
  db.query(sql, [id], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/tasks", (req, res) => {
  const { userId } = req.query;
  const sql = "SELECT * FROM tasks WHERE user_id = ?";
  db.query(sql, [userId], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/single_task", (req, res) => {
  const { id } = req.query;
  const sql = "SELECT * FROM completed_tasks WHERE id= ?";
  db.query(sql, [id], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/uncompleted-single-task", (req, res) => {
  const { id } = req.query;
  const sql = "SELECT * FROM tasks WHERE id= ?";
  db.query(sql, [id], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/completed_tasks", (req, res) => {
  const { userId } = req.query;
  const sql = "SELECT * FROM completed_tasks WHERE user_id = ?";
  db.query(sql, [userId], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.listen(8081, () => {
  console.log("listening");
});
