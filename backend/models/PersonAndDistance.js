const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('coonecting to', url)

mongoose.connect(url).
    then((result) => {
        console.log("connected to MongoDB")
    }).catch((error) => {
        console.log("error connecting to MongoDB: ", error.message)
    })

    const rulebreakerSchema = new mongoose.Schema({
        firstName: String,
        lastName: String,
        distance: Number,
    
    })

    const PersonAndDistance = mongoose.model('PersonAndDistance', rulebreakerSchema)

    const personAndDistance = new PersonAndDistance({
        firstName: "Jukka",
        lastName: "testi",
        distance: "11.5"

    })

    personAndDistance.save().then(result => {
        console.log('saved')
        mongoose.connection.close()
    })


