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
        createdOn:{type: Date,
        required: true},
        droneSerialNumber: String,
        firstName: String,
        lastName: String,
        phoneNumber: String,
        email: String,
        distance: Number,
    
    },{timestamps:true})

    personAndDistanceSchema.index({createdOn: 1}, {expireAfterSeconds: 600})

    personAndDistanceSchema.set('toJSON', {
        transform: (document, returnedObject) => {
          returnedObject.id = returnedObject._id.toString()
          delete returnedObject._id
          delete returnedObject.__v
          
        }
      })

    module.exports = mongoose.model('PersonAndDistance', personAndDistanceSchema)


