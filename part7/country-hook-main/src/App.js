import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {
  const [country, setCountry] = useState(null)


  useEffect(() => {
    if (!country && name) {
      axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name.toLowerCase()}`).then(res => {
        setCountry({ ...res.data, found: true, oldName: name })
        })
        .catch(e => {
          setCountry({ found: false, oldName: name })
        })
    } else if (country && country.oldName !== name) {
      axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name.toLowerCase()}`).then(res => {
        setCountry({ ...res.data, found: true, oldName: name })
        })
        .catch(e => {
          setCountry({ found: false, oldName: name })
        })   
    }
  },[country, name])

  return country
}

const Country = ({ country }) => {
  if (!country) {
    return null
  }
  
  if (!country.found) {
    return (
      <div>
        not found...
      </div>
    )
  }

  return (
    <div>
      <h3>{country.name.common} </h3>
      <div>capital {country.capital} </div>
      <div>population {country.population}</div> 
      <img src={country.flags.png} height='100' alt={`${country.flags.alt}`}/>  
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)


  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App