const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to ', url)

mongoose.connect(url)
  .then(result => {
    console.log('connect to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB: ', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    required: true,
    minLength: 8,
    validate: {
      validator: function(phone) {
        return /^(\d{2}|\d{3})-\d*$/.test(phone)
      },
      message: "Provide proper number pattern like this 111-22222 or 33-44444+, with length of at least 8 digits"
    }
  }
})

personSchema.set('toJSON',{
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
