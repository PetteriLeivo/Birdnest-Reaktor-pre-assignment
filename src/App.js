import React, { useState, useEffect } from 'react'
import axios from "axios"
import Canvas from './components/Canvas'



const App = () => {

  return (
    <div>
      <h1>Birdnest</h1>
      <Canvas width="500px" height="500px"/>


    </div>
  )
}

export default App;


