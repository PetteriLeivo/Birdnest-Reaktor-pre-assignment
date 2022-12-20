const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('coonecting to', url)

mongoose.connect(url).
    then((result) => {
        console.log("connected to MongoDB")
    }).catch((error) => {
        console.log("error connecting to MongoDB: ", error.message)
    })

    const personAndDistanceSchema = new mongoose.Schema({
        droneSerialNumber: String,
        firstName: String,
        lastName: String,
        distance: Number,
    
    })

    personAndDistanceSchema.set('toJSON', {
        transform: (document, returnedObject) => {
          returnedObject.id = returnedObject._id.toString()
          delete returnedObject._id
          delete returnedObject.__v
        }
      })

    module.exports = mongoose.model('PersonAndDistance', personAndDistanceSchema)


