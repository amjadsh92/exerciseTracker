/* eslint-disable */

import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import { useState } from 'react'
import { Card } from 'primereact/card';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css'; // or another theme like 'lara-light-blue'
import 'primereact/resources/primereact.min.css';          // PrimeReact core
import 'primeicons/primeicons.css'; 
import 'primeflex/primeflex.css';   

import './App.css'

function App() {
  

  return (
    <>
    
    <div className="flex justify-content-center align-items-center min-h-screen bg-gray-100">
      <Card title="Add User" className="w-17rem h-20rem">
        <form className="p-fluid">
          <div className="field mb-4">
            <FloatLabel>
              <InputText id="username" />
              <label htmlFor="username">Username</label>
            </FloatLabel>
          </div>
          <Button label="Submit" type="submit" className="w-full" />
        </form>
      </Card>
      
    </div>
      
    </>
  )
}

export default App
