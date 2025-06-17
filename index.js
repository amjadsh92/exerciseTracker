const express = require("express");
const { v4: uuidv4 } = require("uuid");
const app = express();
const cors = require("cors");
require("dotenv").config();
app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_FCC_NAME
});

const connectToDatabase = async () => {
  await pool.connect();
  console.log("Connected to Postgres database");
  handleAPIs();
  listenToServer();
};

const listenToServer = () => {
  const listener = app.listen(process.env.SERVER_PORT || 3000, () => {
    console.log("Your app is listening on port " + listener.address().port);
  });
};

const handleAPIs = () => {
  app.get("/api/users/", async function (req, res) {
    const selectAllUsers = `SELECT * FROM users`;
    const allUsersResult = await pool.query(selectAllUsers);
    const arrayOfAllUsers = allUsersResult.rows;
    res.json(arrayOfAllUsers);
  });

  app.get("/api/users/:_id/logs", async function (req, res) {
    const _id = req.params._id;

    const selectUserQuery = "SELECT username FROM users WHERE _id=$1";
    const usernameResult = await pool.query(selectUserQuery, [`${_id}`]);
    const usernameExists = usernameResult.rows.length;

    // if (!usernameExists) {
    //   res
    //     .status(400)
    //     .json({ error: "This _id doesn't correspond to any username" });
    //   return;
    // }

    const username = usernameResult.rows[0].username;

    let startDate = req.query.from;
    let endDate = req.query.to;
    let limit = req.query.limit;

    if (limit) {
      limit = limit.trim();
    }

    // if (startDate && isNaN(new Date(startDate).getTime())) {
    //   res.status(400).json({ error: "The date is invalid" });
    //   return;
    // }

    // if (startDate && startDate.match(/^-?\d+$/)) {
    //   res.status(400).json({ error: "The date is invalid" });
    //   return;
    // }

    // if (endDate && isNaN(new Date(endDate).getTime())) {
    //   res.status(400).json({ error: "The date is invalid" });
    //   return;
    // }

    // if (endDate && endDate.match(/^-?\d+$/)) {
    //   res.status(400).json({ error: "The date is invalid" });
    //   return;
    // }

    // if (startDate && endDate && startDate > endDate) {
    //   res
    //     .status(400)
    //     .json({ error: "The start date can't be larger than the end date" });
    //   return;
    // }

    // if (limit && !limit.match(/^\d+$/)) {
    //   res
    //     .status(400)
    //     .json({
    //       error: "The number of exercises should be a positive integer",
    //     });
    //   return;
    // }

    let query = `SELECT description, duration, date FROM exercises WHERE _id = $1`;
    const params = [_id];

    if (startDate && !isNaN(new Date(startDate).getTime())) {
      params.push(startDate);
      query += ` AND date >= $${params.length}`;
    }

    if (endDate && !isNaN(new Date(endDate).getTime())) {
      params.push(endDate);
      query += ` AND date <= $${params.length}`;
    }

    if (limit && !isNaN(Number(limit))) {
      query += ` LIMIT $${params.length + 1}`;
      params.push(Number(limit));
    }
    const exercisesResult = await pool.query(query, params);
    const exercises = exercisesResult.rows;

    for (const exercise of exercises) {
      exercise.duration = Number(exercise.duration);
      exercise.date = exercise.date.toDateString();
    }

    const countQuery = `SELECT COUNT(*) FROM exercises WHERE _id=$1`;
    const countResult = await pool.query(countQuery, [`${_id}`]);
    const count = Number(countResult.rows[0].count);

    res.json({ _id, count, username, log: exercises });
  });

  app.post("/api/users/", async function (req, res) {
    let username = req.body.username;
    username = username.trim();
    // if (!username) {
    //   res.status(400).json({ error: "Can't enter an empty username!" });
    //   return;
    // }
    // if (username.length >= 40) {
    //   res
    //     .status(400)
    //     .json({
    //       error: "The number of characters of the username can't exceed 40",
    //     });
    //   return;
    // }
    const selectUsername = `SELECT _id FROM users WHERE username=$1`;
    const selectResult = await pool.query(selectUsername, [`${username}`]);
    const usernameExists = selectResult.rows.length;
    // if (usernameExists) {
    //   const _id = selectResult.rows[0]._id;
    //   res
    //     .status(400)
    //     .json({
    //       _id,
    //       username: username,
    //       error: `Username ${username} already exists.`,
    //     });
    //   return;
    // }

    const _id = uuidv4();
    const insertQuery = `INSERT INTO users(_id,username) VALUES($1,$2)`;
    const insertResult = await pool.query(insertQuery, [
      `${_id}`,
      `${username}`,
    ]);
    res.json({
      _id,
      username,
      message: `We have added ${username} to our list! His _id is ${_id} `,
    });
  });

  app.post("/api/users/:_id/exercises", async function (req, res) {
    let _id = req.params._id;
    let { description, duration, date } = req.body;

    // if (!description) {
    //   res.status(400).json({ error: "Please provide a description" });
    //   return;
    // }

    // if (description.length >= 500) {
    //   res
    //     .status(400)
    //     .json({
    //       error:
    //         "You exceeded the maximum number of characters allowed. The maximum number is 500",
    //     });
    //   return;
    // }

    // if (!duration) {
    //   res.status(400).json({ error: "Please provide a duration" });
    //   return;
    // }

    duration = duration.trim().replace(/\s+/g, "");
    duration = Number(duration);
    // if (!Number.isInteger(duration) || duration <= 0) {
    //   res.status(400).json({ error: "Duration must be a positive integer." });
    //   return;
    // }

    // _id = _id.trim();

    const selectQuery = `SELECT username FROM users WHERE _id=$1`;
    const result = await pool.query(selectQuery, [`${_id}`]);
    const usernameExists = result.rows.length;
    // if (!usernameExists) {
    //   res
    //     .status(400)
    //     .json({
    //       error: `The _id '${_id}' doesn't correspond to any username.`,
    //     });
    //   return;
    // }

    let username = result.rows[0].username;
    let submittedDate = new Date(date);
    let isValidDate = !isNaN(submittedDate?.getTime());
    let currentDate;

    if (!date) {
      const now = new Date();
      currentDate = now.toDateString();
      const insertQuery = `INSERT INTO exercises(_id,description, duration, date) VALUES($1,$2,$3,$4)`;
      const insertResult = await pool.query(insertQuery, [
        _id,
        description,
        duration,
        currentDate,
      ]);
      res.json({ _id, description, duration, date: currentDate, username });
    } else {
      let formattedDate = submittedDate.toDateString();
      const insertQuery = `INSERT INTO exercises(_id,description, duration, date) VALUES($1,$2,$3,$4)`;
      const insertResult = await pool.query(insertQuery, [
        _id,
        description,
        duration,
        formattedDate,
      ]);
      res.json({ _id, description, duration, date: formattedDate, username });
    }
  });

  app.delete("/api/users/:_id", async function (req, res) {
    let _id = req.params._id;

    if (!_id) {
      res.status(400).json({ error: "An_id should be provided" });
      return;
    }
    _id = _id.trim();
    const selectQuery = `SELECT username FROM users WHERE _id=$1`;
    const result = await pool.query(selectQuery, [`${_id}`]);
    const usernameExists = result.rows.length;
    if (!usernameExists) {
      res
        .status(400)
        .json({
          error: `The _id '${_id}' doesn't correspond to any username.`,
        });
      return;
    }
    let username = result.rows[0].username;
    const deleteQuery = `DELETE FROM users WHERE _id=$1`;
    const deleteResult = await pool.query(deleteQuery, [_id]);
    res.json({ message: `We have deleted ${username} from our list.` });
  });
};

connectToDatabase();