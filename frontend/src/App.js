import React, { useState, useEffect, useRef } from 'react'
import axios from "axios"
import Canvas from './components/Canvas'
import { v4 } from 'uuid'
import droneicon from './icons/drone.png'
import birdicon from './icons/bird.png'



const SerialNumberWithCoordinates = ({ serialWithCoordinates }) => {
  if (serialWithCoordinates.length > 0) {
    const serialNumberWithCoordinatesElement = serialWithCoordinates.map(x => <div key={v4()}> {x.serialNumber} {x.coordinateX / 1000} {x.coordinateY / 1000}</div>)
    return <div>{serialNumberWithCoordinatesElement}</div>
  }
  return <div>Ladataan</div>

}

const RuleBreakers = ({ serialWithCoordinates, userInfoAndDistanceRef }) => {

  if (serialWithCoordinates.length > 0) {

    serialWithCoordinates.forEach(element => {
      if (checkIfAboveNest(element.coordinateX / 1000, element.coordinateY / 1000)) {
        axios.get('http://localhost:3001/latestrulebreaker/', {
          params: { serialNumber: element.serialNumber }
        }).then((response) => {
          let x = 250000 - element.coordinateX
          let y = 250000 - element.coordinateY
          let distance = Math.floor(Math.sqrt(x * x + y * y)) / 1000
          userInfoAndDistanceRef.current.push({ id: element.serialNumber, firstName: response.data.firstName, lastName: response.data.lastName, distance: distance })
        }).catch((error) => {
          console.log(error)
        })
      }



    })
      const userInfoAndDistance = userInfoAndDistanceRef.current.map(userInfoAndDistance => <div key={v4()}>{userInfoAndDistance.firstName} {userInfoAndDistance.lastName} {userInfoAndDistance.distance}</div>)
      return (
        <div>{userInfoAndDistance}</div>
      )
    

  }

}





const checkIfAboveNest = (x, y) => {
  if (Math.pow((x - 250), 2) + Math.pow((y - 250), 2) <= Math.pow(100, 2)) {
    return true
  }
  return false

}


const App = () => {
  const [serialWithCoordinates, setSerialWithCoordinates] = useState([]);
  const userInfoAndDistanceRef = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dronesData = await axios.get("http://localhost:3001")
        const droneCapture = dronesData.data.report.capture.map(x => x.drone)
        const droneInfo = droneCapture[0].map(x => {
          const serialNumberandCoordinateObject = { serialNumber: x.serialNumber, coordinateX: x.positionX, coordinateY: x.positionY }
          return serialNumberandCoordinateObject
        })

        setSerialWithCoordinates(droneInfo)
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
    ctx.arc(1.5 * 250, 1.5 * 250, 1.5 * 100, 0, 2 * Math.PI)
    const birdImage = new Image();
    birdImage.src = birdicon
    birdImage.onload = () => {
      ctx.drawImage(birdImage, 1.5 * 230, 1.5 * 230, 1.5 * 40, 1.5 * 40)
    }

    if (serialWithCoordinates.length > 0) {
      ctx.clearRect(0, 0, 750, 750)

      serialWithCoordinates.forEach(element => {
        const image = new Image();
        image.src = droneicon
        image.onload = () => {
          ctx.drawImage(image, 1.5 * Math.floor(element.coordinateX / 1000 - 12, 5), 1.5 * Math.floor(element.coordinateY / 1000 - 12, 5), 1.5 * 25, 1.5 * 25)
        }
      })
    }
    ctx.stroke()
    userInfoAndDistanceRef.current = []
  }




  return (
    <div style={{ textAlign: "center" }}>
      <h1>Birdnest</h1>
      <RuleBreakers serialWithCoordinates={serialWithCoordinates} userInfoAndDistanceRef={userInfoAndDistanceRef} />
      <Canvas width="750px" height="750px" draw={draw} />

    </div>
  )
}

export default App;


