/* eslint-disable */

import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import { useParams, useLocation } from 'react-router-dom';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
} from 'react-router-dom';
import { useState } from 'react'
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css'; // or another theme like 'lara-light-blue'
import 'primereact/resources/primereact.min.css';          // PrimeReact core
import 'primeicons/primeicons.css'; 
import 'primeflex/primeflex.css';   
import './styles/spaces.css'
import './App.css'

function App() {

  const [exercisesToShow, setExercisesToShow] = useState({})

  function addExercises(exercises){
       
    setExercisesToShow(exercises)
  }
  

  return (
    <Router>
      
      <div className="min-h-screen bg-gray-100 w-full">
      <div id="title" className="title mt-100px text-center text-5xl">Exercise Tracker</div>
      <Routes>
      <Route path="/" element={<Forms exercisesToShow = {exercisesToShow} addExercises={addExercises} />} />
      <Route path="/users/:id/logs" element={<UserDetailsPage exercisesToShow = {exercisesToShow} />} />
      </Routes>
      </div>
      
    </Router>
  )
}



function Forms({exercisesToShow, addExercises}){


  return (


  <div className="flex flex-wrap justify-content-center mt-90px w-11 mx-auto">

    <AddUser />
    <AddExercises />
    <ShowDetails addExercises={addExercises} exercisesToShow = {exercisesToShow}  />
    <DeleteUser />
    
    
  </div>


  )
}


function AddUser(){


  const [username, setUsername] = useState("");
  const [dialog, setDialog] = useState({visible:false, message:""});
  
  const handleChange = (e) => {
    setUsername(
     e.target.value,
    );
  };


  const  handleSubmit = async (e) => {
    e.preventDefault(); 

     try {
      const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({username}),
      });
      if (response.ok)
     { const result = await response.json();
    
      setDialog({visible:true, message: result.message});
     }
     if(!response.ok){

      const result = await response.json();
      setDialog({visible:true, message: result.error});

     }
      
    } catch (error) {
      
      setDialog({visible:true, message:`Failed to add user. Please Try again.`});
      
    }

  }

  
  
  return(

    <Card title="Add User" className="w-17rem h-27rem m-4">
      <form  className="p-fluid">
        <div className="field mb-4">
          <FloatLabel className="mb-4">
            <InputText id="username" onChange={handleChange} />
            <label htmlFor="username">Username</label>
          </FloatLabel>
        </div>
        <Button onClick={handleSubmit} label="Add" type="submit" className="w-full"  />
      </form>

      <Dialog
        header="Submission"
        visible={dialog.visible}
        style={{ width: "350px" }}
        onHide={() => setDialog({...dialog,visible:false})}
        footer={
          <div>
            <Button label="OK" icon="pi pi-check" onClick={() => setDialog({...dialog,visible:false}) } autoFocus />
          </div>
        }
      >
        <p className="m-0">{dialog.message}</p>
      </Dialog>
    </Card>
  )


}  


function AddExercises(){

  const [exercise, setExercise] = useState({description:"", duration:0, date:""});
  const [dialog, setDialog] = useState({visible:false, message:""});
  const [id, setId] = useState("")

  const handleIdChange =(e) =>{
    setId(e.target.value)
  }
  
  const handleChange = (e) => {
    setExercise({...exercise,[e.target.name]:
     e.target.value,}
    );
    
  };


  const  handleSubmit = async (e, id) => {
    e.preventDefault(); 

     try {
      const response = await fetch(`http://localhost:3000/api/users/${id}/exercises`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(exercise),
      });

      if (response.ok){
      const result = await response.json();
      const {description, duration, date, username} = result
      setDialog({visible:true, message: `The exercise with<br/><br/>
      <b>Description:</b> ${description}<br/>
      <b>Duration:</b> ${duration} min<br/>
      <b>Date:</b> ${date}<br/><br />
      has been added to <b>${username}</b>'s list of exercises.`});
      }
      if(!response.ok){
        const result = await response.json();
        setDialog({visible:true, message:result.error})
      }
      
    } catch (error) {
      
      setDialog({visible:true, message: `Failed to add user. Please Try again.`});
      
    }

  }




  return(


    <Card title="Add Exercises" className="w-17rem h-27rem m-4">
      <form className="p-fluid" onSubmit={(e) => handleSubmit(e, id)}>
        <div className="field mb-4">
          <FloatLabel className="mb-5">
            <InputText id="_id" name="_id" onChange={handleIdChange} required />
            <label htmlFor="username">_id</label>
          </FloatLabel >
          <FloatLabel className="mb-5">
            <InputText id="description" name="description" onChange={handleChange} required />
            <label htmlFor="description">description*</label>
          </FloatLabel>
          <FloatLabel className="mb-5">
            <InputText id="duration" name="duration" onChange={handleChange} required />
            <label htmlFor="duration">duration*(min.)</label>
          </FloatLabel>
          <FloatLabel className="mb-5">
            <InputText id="date" name="date" onChange={handleChange} />
            <label htmlFor="date">date(yyyy-mm-dd)</label>
          </FloatLabel>
        </div>
        <Button label="Add" type="submit" className="w-full"  />
      </form>

      <Dialog
        header="Submission"
        visible={dialog.visible}
        style={{ width: "350px" }}
        onHide={() => setDialog({...dialog,visible:false})}
        footer={
          <div>
            <Button label="OK" icon="pi pi-check" onClick={() => setDialog({...dialog,visible:false}) } autoFocus />
          </div>
        }
      >
        
        <div dangerouslySetInnerHTML={{ __html: dialog.message }} />

      </Dialog>

    </Card>
  )
}

function ShowDetails({addExercises, exercisesToShow}){


  const navigate = useNavigate();
  const [dialog, setDialog] = useState({visible:false, message:""});
  const [id, setId] = useState("")
  const [from, setFrom] = useState(null)
  const [to, setTo] = useState(null)
  const [limit, setLimit] = useState(null)

  const handleIdChange =(e) =>{
    setId(e.target.value)
  }


  const handleStartDateChange = (e) =>{
    setFrom(e.target.value)
  }

  const handleEndDateChange = (e) =>{
    setTo(e.target.value)
  }

  const handleLimitChange = (e) =>{
    setLimit(e.target.value)
  }
  
  


  const  handleSubmit = async (e, id, from, to, limit) => {
    e.preventDefault();
    
    const params = new URLSearchParams();

    if (from) params.append("from", from); 
    if (to) params.append("to", to);       
    if (limit) params.append("limit", limit); 

    const url = `http://localhost:3000/api/users/${id}/logs?${params.toString()}`;

     try {
      const response = await fetch(url);

      if (response.ok){
      const result = await response.json();
      const {username,count,log} = result
      addExercises(log)
      // log.forEach((exercise) => console.log(exercise.description+"</br>"))
      // let message = `${username} has ${count}
      // exercises. The exercises are<br/>`
      // log.forEach((exercise) => message += exercise.description + "</br>" )
      //setDialog({visible:true, message});
      navigate(`/users/${id}/logs?${params.toString()}`); 
      }
      if(!response.ok){
        const result = await response.json();
        setDialog({visible:true, message:result.error})
      }
      
    } catch (error) {
      
      setDialog({visible:true, message: `Failed to add user. Please Try again.`});
      
    }

  }


  return(
    <Card title="Show User Exercises" className="w-17rem h-27rem m-4">
      <form className="p-fluid" onSubmit={(e) => handleSubmit(e,id,from, to, limit)}>
        <div className="field mb-4">
          <FloatLabel className="mb-5">
            <InputText id="id" onChange={handleIdChange} required />
            <label htmlFor="id">_id</label>
          </FloatLabel>
          <FloatLabel className="mb-5">
            <InputText id="startDate" onChange={handleStartDateChange} />
            <label htmlFor="startDate">from (yyyy-mm-dd)</label>
          </FloatLabel>
          <FloatLabel className="mb-5">
            <InputText id="endDate" onChange={handleEndDateChange}/>
            <label htmlFor="endDate">to (yyyy-mm-dd)</label>
          </FloatLabel>
          <FloatLabel className="mb-5">
            <InputText id="limit" onChange={handleLimitChange} />
            <label htmlFor="limit">number of exercises</label>
          </FloatLabel>
        </div>
        <Button label="Show" type="submit" className="w-full" />
      </form>
      <Dialog
        header="Submission"
        visible={dialog.visible}
        style={{ width: "350px" }}
        onHide={() => setDialog({...dialog,visible:false})}
        footer={
          <div>
            <Button label="OK" icon="pi pi-check" onClick={() => setDialog({...dialog,visible:false}) } autoFocus />
          </div>
        }
      >
        
        <div dangerouslySetInnerHTML={{ __html: dialog.message }} />

  </Dialog>
  </Card>
    
    
  )
}


function DeleteUser(){


  return(

    <Card title="Delete User" className="w-17rem h-27rem m-4">
      <form className="p-fluid">
        <div className="field mb-4">
          <FloatLabel className="mb-4">
            <InputText id="username" />
            <label htmlFor="username">Username</label>
          </FloatLabel>
        </div>
        <Button label="Delete" type="submit" className="w-full" />
      </form>
    </Card>
  )
}


function UserDetailsPage({ exercisesToShow }) {
  const { id } = useParams();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const from = params.get('from');
  const to = params.get('to');
  const limit = params.get('limit');

  return (
    <div>
      <h2>Exercise Logs for User ID: {id}</h2>
      <p>From: {from}</p>
      <p>To: {to}</p>
      <p>Limit: {limit}</p>
      <h3>Exercises to Show:</h3>
      {exercisesToShow && exercisesToShow.length > 0 ? (
        exercisesToShow.map((exercise, index) => (
          <p key={index}>{exercise.description}</p>
        ))
      ) : (
        <p>No exercises to show.</p>
      )}
    </div>
  );
}



export default App
