import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Videos from './pages/Videos'
import Audios from './pages/Audios'
import Planes from './pages/Planes'
import Contacto from './pages/Contacto'
import MiCuenta from './pages/Usuario/MiCuenta'
import Dashboard from './pages/Dashboard/Dashboard'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <div>
      <Home />

    </div>
  )

}

export default App
