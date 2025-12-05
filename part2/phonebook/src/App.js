import { useState, useEffect } from 'react'
import services from './services/persons'
import './index.css'

const Display = ({ person , deletePerson }) => {
  return(
    <p>
      Name: {person.name} {person.number}
      <button onClick={() => deletePerson(person.id)}>delete</button>
    </p>
  )
}


const Persons = ({persons, filter, deletePerson}) => {
  return (
    persons.filter(person => person.name.toLowerCase()
    .includes(filter.toLowerCase()))
    .map(person => <Display key={person.name} person={person} deletePerson={deletePerson} />)
  )
}


const ShowFiltered = ({data}) => {
  return (
      <Form key={data.text} data={data} />
  )
}


const PersonForm = ({formData}) => {
  return (
    <form onSubmit={formData[0].onSubmit}>
      {formData.slice(1).map(data => <Form key={data.text} data={data} />)}
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Form = ({data}) => {
    return (
      <div>
        {data.text} <input
          value={data.value}
          onChange={data.onChange}
        />
      </div>
    )
}


const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={message[1]}>
      {message[0]}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [number, setNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)


  useEffect(() => {
    services
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])


  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)

    if (window.confirm(`delete ${person.name}?`)) {
      services
        .delPerson(person.id)
        .then(response => {
          setPersons(persons.filter(person => person.id !== id))
          setErrorMessage(
            [`${person.name} has been deleted`, "failure"]
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
        .catch(error => {        
          setErrorMessage(
            [`${person.name} has already been deleted`, 'failure']
            )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          setPersons(persons.filter(person => person.id !== id))
        })
      }
    }

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: number
    }

    if (persons.filter(person => person.name.toLowerCase() === personObject.name.toLowerCase())[0]) {
      if (window.confirm(`${personObject.name} already exist, would you like to replace the old number with a new one?` )) {
        const person = persons.find(p => p.name === personObject.name)
        const changedNumber = {...person, number: personObject.number}

        services
          .addNumber(person.id, changedNumber)
          .then(response => {
            setPersons(persons.map(p => p.id === response.id ? response : p))
            setErrorMessage(
              [`${changedNumber.name} number has been changed to ${changedNumber.number}`, 'success']
              )
              setTimeout(() => {
                setErrorMessage(null)
              }, 5000)
            })
            //added error catching during number change
            //can change already existing(patterned) number into wrong one
          .catch(error => {
            setErrorMessage(
              [`${error.response.data.error}`, 'failure']
              )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            console.log(error)
          })
      }

    } else {
      //1.1
      services
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setErrorMessage(
            [`${returnedPerson.name} has been added`, 'success']
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            //setPersons(persons.concat(personObject)) //changed position from 1.1
        })
        //HERE
        .catch(error => {
          setErrorMessage(
            [`${error.response.data.error}`, 'failure']
            )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          console.log(error)
        })

      setNewName('')
      setNumber('')
    }
  }

  const handleNewPerson = (event) => {
    setNewName(event.target.value)
  }

  const handleNumber = (event) => {
    setNumber(event.target.value)
  }

  const handleFilter = (event) => {
    setFilter(event.target.value)
  }
 
  const formData = [
    {onSubmit: addPerson},
    {text: 'name:',  value: newName, onChange: handleNewPerson},
    {text: 'number:',  value: number, onChange: handleNumber},
  ]
  
  const data = {text: 'filter shown with:',  value: filter, onChange: handleFilter}

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />
      <ShowFiltered data={data} />
      <h2>Add a new</h2>
      <PersonForm formData={formData} />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} deletePerson={deletePerson}/>
    </div>
  )
}

export default App