const express = require('express')
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

app.get('/rulebreaker/:drone', (request, response) => {
    const drone = request.params.droneSerialNumber
    //https://assignments.reaktor.com/birdnest/pilots/SN-3OuE1-2lqV
})


const PORT = 3001
app.listen(PORT)