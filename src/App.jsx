import React,{ useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Components/Home'
import ProductDetails from './Components/ProductDetails'

function App() {

  return (
    <Router>
    <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route path="/products/:productName" element={<ProductDetails/>} />
    </Routes>
</Router>
  )
}

export default App
