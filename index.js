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

  app.get("/api/users/",async function(req,res){

    const selectAllUsers = `SELECT * FROM users`
    
    const allUsersResult = await pool.query(selectAllUsers)

    const arrayOfAllUsers  = allUsersResult.rows

    res.json(arrayOfAllUsers)

}




)
  app.post("/api/users/", async function(req,res){

    let username = req.body.username
    username = username.trim()
    if(!username){
      res.status(400).json({message:"Can't enter an empty username!"})
      return
    }
    const selectUsername = `SELECT _id FROM users WHERE username=$1`
    const selectResult = await pool.query(selectUsername, [`${username}`])
    const usernameExists = selectResult.rows.length
    if(usernameExists){
      const _id = selectResult.rows[0]._id;
      res.json({_id, username: username, message:`Username ${username} already exists.`})
      return
    } 

    const _id = uuidv4() 
    const insertQuery = `INSERT INTO users(_id,username) VALUES($1,$2)`
    const insertResult  = await pool.query(insertQuery,[`${_id}`,`${username}`] )
    res.json({_id, username: username, message:`We have added ${username} to our list!`})

  })

  app.post("/api/users/:_id/exercises", async function (req, res){

    let _id = req.params._id
    let {description, duration, date} = req.body

    if(!description){
      res.status(400).json({error:"Please provide a description"})
      return
    }

    if(!duration){
      res.status(400).json({error:"Please provide a duration"})
      return
    }
    
    duration = duration.trim().replace(/\s+/g,"");
    duration = Number(duration)
    if (!Number.isInteger(duration) || duration <= 0) {
      res.status(400).json({ error: "Duration must be a positive integer." });
      return;
    }

    _id = _id.trim()
    
    const selectQuery = `SELECT username FROM users WHERE _id=$1`
    const result = await pool.query(selectQuery, [`${_id}`])
    const usernameExists =  result.rows.length
    if(!usernameExists){
      res.status(400).json({error:`The _id '${_id}' doesn't correspond to any username.`})
      return
    }
    
    let username = result.rows[0].username
    let submittedDate = new Date (date)
    let isValidDate = !isNaN(submittedDate?.getTime())     
    let currentDate;
    

    if (!date){
      
      const now = new Date();
      currentDate = now.toDateString();
      const insertQuery = `INSERT INTO exercises(_id,description, duration, date) VALUES($1,$2,$3,$4)`
      const insertResult = await pool.query(insertQuery,[_id,description,duration,currentDate])
      res.json({_id, description, duration, date:currentDate, username})
    }
    else if(date.match(/^-?\d+$/) || !isValidDate){
      
      res.status(400).json({error:`The date is invalid`})
      return
    }

    else{
            
      let formattedDate = submittedDate.toDateString();
      res.json({_id, description, duration, date:formattedDate, username})
    }
    
})
}

connectToDatabase()