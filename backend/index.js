require('dotenv').config()
const express = require('express')
const PersonAndDistance = require('./models/PersonAndDistance')
const cors = require('cors')
const app = express()
app.use(cors())
const xml2js = require('xml2js')
const axios = require('axios')




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
        //console.log(response)
        res.send(response.data)
    }
    catch (error) {
        console.log(error)
    }
})

app.put('/latestrulebreakers/', async (req, res) => {
    

})


const PORT = process.env.PORT
app.listen(PORT, () => { console.log(`Server running on port ${PORT}`) 
})