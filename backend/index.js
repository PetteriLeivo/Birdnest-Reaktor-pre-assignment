require('dotenv').config()
const express = require('express')
const PersonAndDistance = require('./models/PersonAndDistance')
const cors = require('cors')
const app = express()
app.use(cors())
const xml2js = require('xml2js')
const axios = require('axios')
const bodyParser = require('body-parser')
const { response } = require('express')
app.use(bodyParser.json())




app.get('/', async (req, res) => {
    try {
        const response = await axios.get("https://assignments.reaktor.com/birdnest/drones")
        xml2js.parseString(response.data, (err, result) => {
            if (err) {
                throw err
            }
            const json = JSON.stringify(result)
            res.send(json)
        })
    }
    catch (error) {
        console.log(error)
    }
})

app.get(`/latestrulebreaker/`, async (req, res) => {
    const url = `https://assignments.reaktor.com/birdnest/pilots/${req.query.serialNumber}`
    try {
        const response = await axios.get(url)
        res.send(response.data)
    }
    catch (error) {
        console.log(error)
    }
})

app.get(`/latestrulebreakerlist/`, async (req, res) => {
    PersonAndDistance.find({}).then(personAndDistances => {
        console.log("lista", personAndDistances)
        res.send(personAndDistances)
    }).catch(error => {
        console.log(error)
    })
})

app.put('/latestrulebreakers/', (req, res) => {
    res.send('Got a PUT request at /latestrulebreakers')
    req.body.forEach(element => {
        const findBySerialNumber = element.serialNumber
        const personAndDistance = new PersonAndDistance({
            createdOn : new Date(),
            droneSerialNumber: element.serialNumber,
            firstName: element.firstName,
            lastName: element.lastName,
            phoneNumber: element.phoneNumber,
            email: element.email,
            distance: element.distance
        })
        PersonAndDistance.findOne({ droneSerialNumber: findBySerialNumber }).then(foundPerson => {
            if (foundPerson == null) {
                personAndDistance.save().then(savedpersonAndDistance => {
                    console.log("saved new Person")
                })
            }
            if (foundPerson != null) {
                foundPerson.createdOn = new Date()
                if (foundPerson.distance > element.distance) {
                    console.log("Lesser distance found")
                    console.log("Old value", foundPerson.distance)
                    console.log("New value", element.distance)
                    foundPerson.distance = element.distance
                    foundPerson.save().then(foundPerson => {
                        console.log(foundPerson, "saved")
                    }).catch((error) => {
                        console.log("Save operation failed", error)
                    })
                }
            }

        }).catch(error => {
            console.log(error)
        })


    });

})


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})