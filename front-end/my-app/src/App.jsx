/* eslint-disable */

import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import { useState } from 'react'
import { Card } from 'primereact/card';

import './App.css'

function App() {
  

  return (
    <>
    <div id="app" className="app">
      <div id="title" className="title">
        Exercise Tracker
      </div>

      <div id="forms" className="forms">

      

        <div id="addUserForm" className="addUserForm">
        <p className="user-title"> Create a new user</p>
        <form id="user">
        <label htmlFor="user-name" className="user-name-label">Username:</label>
        <input id="user-name" type="text" className="user-name" />
        <button type="submit" className="userSubmit">Submit</button>
        </form>

        </div>

        
    

      

        

        <div id="addExerciseForm" className="addExerciseForm" >
          
        </div>
        <div id="showUserForm" className="showUserForm" >

        </div>

      </div>


    </div>

      
    </>
  )
}

export default App
