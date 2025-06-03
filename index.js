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

    let username = req.body.username
    username = username.trim()
    if(!username){
      res.json({_id:'0',username:username, message:"Can't enter an empty username!"})
      return
    }
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

  app.post("/api/users/:_id/exercises", async function (req, res){

    let id = req.params._id
    let {description, duration, date} = req.body
    duration = Number(duration)
    id = id.trim()
    
    if(id === ":_id" || !id){
      res.json({message:"id is not provided"})
      return
    }

    const selectQuery = `SELECT username FROM users WHERE id=$1`
    const result = await pool.query(selectQuery, [`${id}`])
    const usernameExists =  result.rows.length
    if(!usernameExists){
      res.json({message:`The _id '${id}' doesn't exist in our list.`})
      return
    }
    
    let username = result.rows[0].username

    const insertQuery = `INSERT INTO exercises(id,description, duration, date) VALUES($1,$2,$3,$4)`
    const insertResult = await pool.query(insertQuery,[id,description,duration,date])
    res.json({_id:id, description, duration, date, message:`The exercise with,\nDescription:${description}\nDuration:${duration}\nDate:${date}\nhas been added to ${username}'s list of exercises.`})



})
}

connectToDatabase()