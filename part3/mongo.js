const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('')
  console.log("Proper usage: 'node mongo.js <password> <name> <number>' --- to add person")
  console.log("Proper usage: 'node mongo.js <password>                  --- to list people in phonebook")
  process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://dihad24057:${password}@cluster0.9nbzn6q.mongodb.net/person?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  console.log('\nphonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })

} else if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then(result => {
    console.log(`person ${process.argv[3]} with number ${process.argv[4]} has been added to phonebook`)
    mongoose.connection.close()
  })


} else if (process.argv.length < 5) {
  console.log("Proper usage: 'node mongo.js <password> <name> <number>'")
  process.exit(1)

} else if (process.argv.length > 5) {
  console.log('too many arguments, name should be typed like "John Smith" and number 123-456-789 (with no spaces)')
  process.exit(1)
}