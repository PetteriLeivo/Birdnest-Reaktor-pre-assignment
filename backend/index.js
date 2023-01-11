require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.static('build'))
const PersonAndDistance = require('./models/PersonAndDistance')
const cors = require('cors')
app.use(cors())
const xml2js = require('xml2js')
const axios = require('axios')
const bodyParser = require('body-parser')
app.use(bodyParser.json())




app.get('/api/', async (req, res, next) => {
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
        next(error)
    }
})

app.get(`/api/latestrulebreaker/`, async (req, res, next) => {
    const url = `https://assignments.reaktor.com/birdnest/pilots/${req.query.serialNumber}`
    try {
        const response = await axios.get(url)
        res.send(response.data)
    }
    catch (error) {
        next(error)
    }
})

app.get(`/api/latestrulebreakerlist/`, async (req, res, next) => {
    PersonAndDistance.find({}).then(personAndDistances => {
        res.send(personAndDistances)
    }).catch(error => {
        next(error)
    })
})

app.put('/api/latestrulebreakers/', (req, res, next) => {
    if (req.body != null) {
        req.body.forEach(element => {
            const findBySerialNumber = element.serialNumber
            const personAndDistance = new PersonAndDistance({
                createdOn: new Date(),
                droneSerialNumber: element.serialNumber,
                firstName: element.firstName,
                lastName: element.lastName,
                phoneNumber: element.phoneNumber,
                email: element.email,
                distance: element.distance
            })
            PersonAndDistance.findOne({ droneSerialNumber: findBySerialNumber }).then(foundPerson => {
                if (foundPerson == null) {
                    personAndDistance.save()
                }
            
                else if (foundPerson != null) {
                    foundPerson.createdOn = new Date()
                    if (foundPerson.distance > element.distance) {
                        foundPerson.distance = element.distance
                        foundPerson.save()
                    }
                }
            }).catch(error => {
                next(error)
            })


        })
        res.sendStatus(200);
    }

})


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})