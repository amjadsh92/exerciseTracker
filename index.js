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
    console.log(req.body)
    const username = req.body.username
    const id = uuidv4() 
    const insertQuery = `INSERT INTO users(id,username) VALUES($1,$2)`
    
    const result  = await pool.query(insertQuery,[`${id}`,`${username}`] )

    res.json({result: result})

  })
}

connectToDatabase()