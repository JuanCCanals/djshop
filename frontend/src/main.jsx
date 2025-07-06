import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import Login from './pages/Login'
import DashboardLayout from './components/DashboardLayout'
import Generos from './components/Dashboard/Generos'
import Productos from './components/Dashboard/Productos'
import AgregarProducto from './components/Dashboard/AgregarProducto'
import Videos from './pages/Videos'
import Audios from './pages/Audios'
import Planes from './pages/Planes'
import Contacto from './pages/Contacto'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path = "/" element = {<App />}></Route>
      <Route path="/login" element={<Login />} />
      <Route path = "/dashboard" element = {<DashboardLayout />}>
          <Route path = "productos" element = {<Productos />}></Route>
          <Route path = "agregarproducto" element = {<AgregarProducto />}></Route>
          <Route path = "generos" element = {<Generos />}></Route>
      </Route>
      
      <Route path = "/videos" element = {<Videos />}></Route>
      <Route path = "/audios" element = {<Audios />}></Route>
      <Route path = "/planes" element = {<Planes />}></Route>
      <Route path = "/contacto" element = {<Contacto />}></Route>
    </Routes>
  </BrowserRouter>
)

