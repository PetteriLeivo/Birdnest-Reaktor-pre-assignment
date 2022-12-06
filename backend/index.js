const express = require('express')
const app = (express)
const axios = require('axios')

app.get('/', async (req, res) => {
    try {
        const response = await axios.get("assignments.reaktor.com/birdnest/drones")
    }
    catch (error) {
        console.log(error)
    }
})