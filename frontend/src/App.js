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

const RuleBreakersFromLast10Minutes = ({ ruleBreakersFromLast10Minutes }) => {

  const ruleBreakersFromLast10MinutesElement = ruleBreakersFromLast10Minutes.map(x => <tr key={v4()}> <td> Name: {x.firstName} {x.lastName} </td> <td> Phone: {x.phoneNumber} </td> <td> Email: {x.email} </td> <td> Closest distance to nest: {x.distance}</td> <td>meter </td></tr>)
  return <table>{ruleBreakersFromLast10MinutesElement}</table>
}

const calculateDistance = (x, y) => {
  let xOrigin = 250000
  let yOrigin = 250000
  let distanceX = xOrigin - x
  let distanceY = yOrigin - y

  return Math.floor(Math.sqrt(distanceX * distanceX + distanceY * distanceY)) / 1000


}

const checkIfAboveNest = (x, y) => {
  if (Math.pow((x - 250), 2) + Math.pow((y - 250), 2) <= Math.pow(100, 2)) {
    return true
  }
  return false

}

const App = () => {
  const [serialWithCoordinates, setSerialWithCoordinates] = useState([]);
  const userInfoAndDistanceRef = useRef([])
  const [rulebreakers, setrulebreakers] = useState([]);
  const [ruleBreakersPutResponse, setRuleBreakersPutResponse] = useState([]);
  const [ruleBreakersFromLast10Minutes, setRuleBreakersFromLast10Minutes] = useState([]);




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


  useEffect(() => {
    console.log(userInfoAndDistanceRef.current)
    serialWithCoordinates.forEach(element => {
      if (checkIfAboveNest(element.coordinateX / 1000, element.coordinateY / 1000)) {
        axios.get('http://localhost:3001/latestrulebreaker/', {
          params: { serialNumber: element.serialNumber }
        }).then((response) => {
          let distance = calculateDistance(element.coordinateX, element.coordinateY)
          userInfoAndDistanceRef.current.push({ serialNumber: element.serialNumber.toString(), firstName: response.data.firstName, lastName: response.data.lastName, phoneNumber: response.data.phoneNumber, email: response.data.email, distance: distance })
        }).catch((error) => {
          console.log(error)
        })
      }
    })
    setrulebreakers(userInfoAndDistanceRef.current)
    userInfoAndDistanceRef.current = []
  }, [serialWithCoordinates])

  useEffect(() => {
    if (rulebreakers.length > 0) {
      axios.put('http://localhost:3001/latestrulebreakers/', rulebreakers)
        .then((putResponse) => {
          console.log("put", putResponse)
          setRuleBreakersPutResponse(putResponse)
        }).catch((putError) => {
          console.log("puterror", putError)
        })
    }
  }, [rulebreakers])

  useEffect(() => {
    axios.get('http://localhost:3001/latestrulebreakerlist/')
      .then((getResponse) => {
        console.log("lista", getResponse)
        console.log("avaimet", Object.keys(getResponse.data))
        setRuleBreakersFromLast10Minutes(getResponse.data)

      }).catch((getError) => {
        console.log("geterror", getError)
      })



  }, [ruleBreakersPutResponse])



  const drawDrones = ctx => {

    if (serialWithCoordinates.length > 0) {

      serialWithCoordinates.forEach(element => {
        const image = new Image();
        image.src = droneicon
        image.onload = () => {
          ctx.drawImage(image, 1.5 * Math.floor(element.coordinateX / 1000 - 12, 5), 1.5 * Math.floor(element.coordinateY / 1000 - 12, 5), 1.5 * 25, 1.5 * 25)
        }
      })
    }
    // ctx.stroke()
    ctx.clearRect(0, 0, 750, 750)
  }

  const drawBirdAndZone = ctx => {
    const birdImage = new Image();
    birdImage.src = birdicon
    birdImage.onload = () => {
      ctx.arc(1.5 * 250, 1.5 * 250, 1.5 * 100, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.drawImage(birdImage, 1.5 * 230, 1.5 * 230, 1.5 * 40, 1.5 * 40)
    }
  }


  //<div style={{ textAlign: "center" }}></div>

  return (
    <div>
      <h1>Birdnest</h1>
      <h2>Users that violated violated the NDZ perimeter</h2>
      <div style={{ display: "flex" }}> <RuleBreakersFromLast10Minutes ruleBreakersFromLast10Minutes={ruleBreakersFromLast10Minutes} />
        <Canvas style={{zIndex:0, position: "absolute", top: 100, left: 900}} width="750px" height="750px" draw={drawDrones} />
        <Canvas style={{zIndex:1, position: "absolute", top: 100, left: 900}} width="750px" height="750px" draw={drawBirdAndZone} />
      </div>
    </div>
  )
}

export default App;


