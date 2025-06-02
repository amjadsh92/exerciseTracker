const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});



const { Pool } = require("pg");

const pool = new Pool({
  user: "amjad",
  password: "123",
  host: "localhost",
  port: 5432,
  database: "exercise_tracker",
});


const connectToDatabase = async () => {
  await pool.connect();
  console.log("Connected to Postgres database");
  listenToServer()
  
};


const listenToServer = () =>{
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
}


connectToDatabase()