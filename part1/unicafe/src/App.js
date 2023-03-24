import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)
//BP
const StatisticLine = (props) => {
  //console.log('data', props.data.stats[0].text)
  return (
    <tr>
      <td>
      {props.data.text}
      </td>
      <td>
      {props.data.value}
      </td>
    </tr>
  )
} 

const Statistics = (props) => {
  if (props.data.total.value === 0)
  return (
    <div>
      <p>No feedback Given</p>
    </div>
  )
  return (
    <table>
      <tbody>
        <StatisticLine data={props.data.stats[0]} />
        <StatisticLine data={props.data.stats[1]} />
        <StatisticLine data={props.data.stats[2]} />
        <StatisticLine data={props.data.average} />
        <StatisticLine data={props.data.positive} />
      </tbody>
    </table>
    )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const total = good + neutral + bad
  const average = (good - bad) / total
  const positive = (good * 100) / total + '%'

  const handleGoodClick = () => {
    const updateGood = good + 1
    console.log('good feedback' ,updateGood)
    setGood(updateGood)
  }

  const handleNeutralClick = () => {
    const updateNeutral = neutral + 1
    console.log('neutral feedback', updateNeutral)
    setNeutral(updateNeutral)

  }
  const handleBadClick = () => {
    const updateBad = bad + 1
    console.log('bad feedback', updateBad)
    setBad(updateBad)
  }

  const data = {

    total: {
      text: 'all',
      value: total
      },

    average: {
      text: 'average',
      value: average
      },

    positive: {
      text: 'positive',
      value: positive
      },
      
    stats: [
      { 
        text: 'good',
        value: good
      },
      { 
        text: 'neutral',
        value: neutral
      },
      { 
        text: 'bad',
        value: bad
      }
    ]
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleGoodClick} text='good' />
      <Button handleClick={handleNeutralClick} text='neutral' />
      <Button handleClick={handleBadClick} text='bad' />
      <h1>statistics</h1>
      <Statistics data={data} />
    </div>
  )
}

export default App