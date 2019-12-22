const mongoose = require('mongoose')

const Schema = mongoose.Schema

const bookingSchema = new Schema({
    name:{
        type:String
    },
    age:{
        type:String
    },
    bookingID:{
        type:String
    },
    breed:{
        type:String
    },
    recurring:{
        type:Number
    },
    walkdate:{
        type:Date
    }
})

const Booking = mongoose.model('Booking',bookingSchema)

module.exports = {
    Booking
}