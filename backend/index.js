const express = require('express')
const app = express()
const xml2js = require('xml2js')
const axios = require('axios')

app.get('/', async (req, res) => {
    try {
        const response = await axios.get("https://assignments.reaktor.com/birdnest/drones")
        console.log("vastaus", response.data)
        xml2js.parseString(response.data, (err, result) => {
            if (err) {
                throw err
            }
            console.log("result", result)    
            const json = JSON.stringify(result)
            console.log(json)
        })   
    }
    catch (error) {
        console.log(error)
    }
})


const PORT = 3001
app.listen(PORT)