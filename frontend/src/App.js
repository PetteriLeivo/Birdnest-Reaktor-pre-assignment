import React, { useState, useEffect } from 'react'
import axios from "axios"
import Canvas from './components/Canvas'

const Drones = (props) => {
  const [drones, setDrones] = useState([])
  const [serialNumberWithCoordinates, setSerialNumberWithCoordinates] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dronesData = await axios.get("http://localhost:3001")
        const droneCapture = dronesData.data.report.capture.map(x => x.drone)
        const droneInfo = droneCapture[0].map(x => x)
        const coordinates = await droneInfo.map(x => {
          let serialNumberandCoordinateObject = { serialNumber: x.serialNumber, coordinateX: x.positionX / 1000, coordinateY: x.positionY }
          return serialNumberandCoordinateObject
        })
        console.log("koordinaatit", coordinates)
        //setSerialNumberWithCoordinates(coordinates)
      }
      catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [serialNumberWithCoordinates])
  return (
    <div></div>
  )
}



const App = () => {

  return (
    <div>
      <h1>Birdnest</h1>
      <Canvas width="500px" height="500px" />
      <Drones />

    </div>
  )
}

export default App;


