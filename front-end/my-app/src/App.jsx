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
      <Card title="Add User" className="w-17rem h-27rem m-2">
        <form className="p-fluid">
          <div className="field mb-4">
            <FloatLabel className="mb-4">
              <InputText id="username" />
              <label htmlFor="username">Username</label>
            </FloatLabel>
          </div>
          <Button label="Add" type="submit" className="w-full" />
        </form>
      </Card>
      <Card title="Add Exercises" className="w-17rem h-27rem m-4">
        <form className="p-fluid">
          <div className="field mb-4">
            <FloatLabel className="mb-5">
              <InputText id="username" />
              <label htmlFor="username">_id</label>
            </FloatLabel >
            <FloatLabel className="mb-5">
              <InputText id="description" />
              <label htmlFor="description">description*</label>
            </FloatLabel>
            <FloatLabel className="mb-5">
              <InputText id="duration" />
              <label htmlFor="duration">duration*(min.)</label>
            </FloatLabel>
            <FloatLabel className="mb-5">
              <InputText id="data" />
              <label htmlFor="date">date(yyyy-mm-dd)</label>
            </FloatLabel>
          </div>
          <Button label="Add" type="submit" className="w-full" />
        </form>
      </Card>

      <Card title="Show User Details" className="w-17rem h-27rem m-4">
        <form className="p-fluid">
          <div className="field mb-4">
            <FloatLabel className="mb-4">
              <InputText id="username" />
              <label htmlFor="username">Username</label>
            </FloatLabel>
          </div>
          <Button label="Show" type="submit" className="w-full" />
        </form>
      </Card>

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
      
    </div>
      
    </>
  )
}

export default App
