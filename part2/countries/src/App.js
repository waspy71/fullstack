import { useState, useEffect } from 'react'
import axios from 'axios'


const MatchDetails = ({ details, api_key }) => {
  
  const [weatherData, setWeatherData] = useState(null)
  const lat = details.capitalInfo.latlng[0]
  const lng = details.capitalInfo.latlng[1]

  useEffect(() => {
    
    if (!weatherData) {
      axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${api_key}&units=metric`)
      .then(response => {
        setWeatherData(response.data)
      })
    } 
  }, [])

  if (weatherData) {
    return (
      <>
        <h2>{details.name.common}</h2>
        <p>Capital: {details.capital}</p>
        <p>area: {details.area}</p>
        <br></br>
        <h4>Languages :</h4>
        <ul>
          {Object.values(details.languages).map(l => <li key={l} >{l}</li>)}
        </ul>
        <br></br>
        <img src={details.flags.png} />
        <h3>Weather in {details.capital[0]}</h3>
        <p>Temperature {weatherData.main.temp} Celcius</p>
        <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0]['icon']}@2x.png`} />
        <p>wind {weatherData.wind.speed} m/s</p>
    </>
    )
  }
}


const Display = ({ country, handleView }) => {
  return (
    <>{country.name.common}
    <button onClick={() => handleView(country.name.common)}>Show</button><br></br></>
  )
}


const ShowMatches = ({countries, filter, handleView, api_key }) => {
  
  const filteredMatches = countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))

  if (filteredMatches.length > 10){
    return (
      <p>too many matches, specify another filter</p>
    )
  } else if (filteredMatches.length === 1) {
    return (
      <>
      <MatchDetails  
        details={filteredMatches[0]} 
        api_key={api_key}  
      />
      </>
    )
  } else {
    return (
      filteredMatches.map(country => 
      <Display key={country.name.common} country={country} handleView={handleView} /> )
    )
  }
}


const App = () => {
  const [countries, setCounries] = useState([])
  const [filter, setFilter] = useState('')



  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
      .then( response => {
        setCounries(response.data)
      })
  }, [])


  const handleFilter = (event) => {
    setFilter(event.target.value)
  }

  const handleView = (name) => {
    setFilter(name)
  }

  const api_key = process.env.REACT_APP_API_KEY

  return (
    <div>
      <form>
        find countries <input 
          value={filter}
          onChange={handleFilter}
        />
      </form>
      <ShowMatches 
        countries={countries} 
        filter={filter} 
        handleView={handleView} 
        api_key={api_key} 
      />
    </div>
  );
}

export default App;
