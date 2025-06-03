const express = require('express')
const { v4: uuidv4 } = require('uuid');
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
  handleAPIs()
  listenToServer()
  
};


const listenToServer = () =>{
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
}


const handleAPIs =() =>{


  app.post("/api/users/", async function(req,res){

    const username = req.body.username

    const selectUsername = `SELECT id FROM users WHERE username=$1`
    const selectResult = await pool.query(selectUsername, [`${username}`])
    const usernameExists = selectResult.rows.length
    if(usernameExists){
      const id = selectResult.rows[0]._id;
      res.json({_id: id, username: username, message:`Username ${username} already exists.`})
      return
    } 

    const id = uuidv4() 
    const insertQuery = `INSERT INTO users(id,username) VALUES($1,$2)`
    
    const insertResult  = await pool.query(insertQuery,[`${id}`,`${username}`] )

    res.json({_id: id, username: username, message:`We have added ${username} to our list!`})

  })
}

connectToDatabase()