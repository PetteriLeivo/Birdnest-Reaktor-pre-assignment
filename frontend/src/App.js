import React, { useState, useEffect, useRef } from 'react'
import axios from "axios"
import Canvas from './components/Canvas'
import { v4 } from 'uuid'

const SerialNumberWithCoordinates = ({serialWithCoordinates}) => {
  if (serialWithCoordinates.length > 0) {
    console.log("true")
    const serialNumberWithCoordinatesElement = serialWithCoordinates.map(x => <div key={v4()}> {x.serialNumber} {x.coordinateX / 1000} {x.coordinateY/1000}</div>)
    return <div>{serialNumberWithCoordinatesElement}</div>
  }
  console.log("false")

  return <div>Ladataan</div>

}

const RuleBreakers = ({serialWithCoordinates}) => {

  if (serialWithCoordinates.length > 0) {
   const rulebreakers =  serialWithCoordinates.map(element => {
      if(checkIfAboveNest(element.coordinateX/1000, element.coordinateY/1000)) {

        


        return <div key={v4()}>{element.serialNumber}</div>
      }
      return <div key={v4()}></div>
    })
    return (
      <div>{rulebreakers}</div>
    )
  }
  return (
    <div>Ei näytettävää</div>
  )
}

const checkIfAboveNest = (x, y) => {
  if (Math.pow((x-250), 2) + Math.pow((y-250), 2) <= Math.pow(100, 2)) {
    return true
  }
  return false

}

const App = () => {
  const serialWithCoordinatesRef = useRef();
  const [serialWithCoordinates, setSerialWithCoordinates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dronesData = await axios.get("http://localhost:3001")
        const droneCapture = dronesData.data.report.capture.map(x => x.drone)
        console.log(droneCapture)
        console.log(droneCapture[0])
        const droneInfo = droneCapture[0].map(x => {
          const serialNumberandCoordinateObject = { serialNumber: x.serialNumber, coordinateX: x.positionX, coordinateY: x.positionY }
          return serialNumberandCoordinateObject
        })
        serialWithCoordinatesRef.current = droneInfo
        setSerialWithCoordinates(serialWithCoordinatesRef.current)
      }
      catch (error) {
        console.log(error)
      }
    }
    const interval = setInterval(() => {
      fetchData()


    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const draw = ctx => {
    ctx.beginPath()
    ctx.arc(250, 250, 100, 0, 2 * Math.PI)
    ctx.fillStyle = "green"
    if (serialWithCoordinates.length > 0) {
      serialWithCoordinates.forEach(element => {
        ctx.fillRect(Math.floor(element.coordinateX/1000), Math.floor(element.coordinateY/1000), 5, 5)
      })
    }
    ctx.stroke() 
}



  return (
    <div>
      <h1>Birdnest</h1>
      <Canvas width="500px" height="500px" draw={draw}/>
      <SerialNumberWithCoordinates serialWithCoordinates={serialWithCoordinates} />
      <h2>Rule breakers</h2>

      <RuleBreakers serialWithCoordinates={serialWithCoordinates} />
    </div>
  )
}

export default App;


