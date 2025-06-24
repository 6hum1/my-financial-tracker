import { useState } from 'react'
import { BrowserRouter,Routes,Navigate,Route } from 'react-router-dom' 
import Signup from './pages/Auth/Signup'   
import Login from './pages/Auth/Login'  
import Home from './pages/Dashboard/Home'
import Income from './pages/Dashboard/Income'
import Expense from './pages/Dashboard/Expense'
import './App.css'
import UserProvider from './context/useContext'
import { Toaster } from 'react-hot-toast'

function App() {

  return (
    <>
      <UserProvider>
        <div>
          <BrowserRouter>
          <Routes>
            <Route path='/' element={<Root/>}/>
            <Route path='/login' exact element={<Login/>}/>
            <Route path='/signup' exact element={<Signup/>}/>
            <Route path='/dashboard' exact element={<Home/>}/>
            <Route path='/income' exact element={<Income/>}/>
            <Route path='/expense' exact element={<Expense/>}/>
          </Routes>
          </BrowserRouter>
        </div>

        <Toaster 
          toastOptions={{
            className:"",
            style:{
              fontSize:"13px"
            },
          }}
          />
      </UserProvider>
    </>
  )
}

export default App


const Root = () =>{
  //check if token exist in localStorage
  const isAuthenticated  = !!localStorage.getItem('token');

  console.log(isAuthenticated);
  //Redirect to dashboard if authenticated ,otherwise login
  return isAuthenticated ? (
    <Navigate to='/dashboard'/>
  ):(<Navigate to='/login'/>)
  

};