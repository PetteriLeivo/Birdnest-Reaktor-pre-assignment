import React, { useState, useEffect } from 'react'
import axios from "axios"
import Canvas from './components/Canvas'

const Drones = (props) => {
  const [drones, setDrones] = useState([])
  useEffect(() => {
    const fetchData = async () => {
    try {
      const dronesData = await axios.get("http://localhost:3001")
      const droneCapture = dronesData.data.report.capture.map(x => x.drone)
      console.log(Object.keys(droneCapture).length)
      const serialNumbers = droneCapture[0].map(x => x.serialNumber)
      console.log(serialNumbers)
      console.log(droneCapture, droneCapture[0].length)


    }
    catch (error) {
      console.log(error)
    }
  }
  fetchData()
  }, [])
  return (
    <div></div>
  )
}



const App = () => {

  return (
    <div>
      <h1>Birdnest</h1>
      <Canvas width="500px" height="500px" />
      <Drones/>

    </div>
  )
}

export default App;


