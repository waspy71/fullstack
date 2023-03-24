import { useState } from 'react'

const Button = (props) => {
  return (
    <button onClick={props.action}>
      {props.text}
    </button>
  )
}


function getRandInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const Display = ({votes, selected}) => {
  if (votes[selected] === 0) {
    return (
      <div>
        has no votes
      </div>
    )
  } else if (votes[selected] === 1) {
      return (
          <div>
            has 1 vote
          </div>
        )
  } else {
    return (
      <div>
        has {votes[selected]} votes
      </div>
    )
  }
}

const MostVotes = ({votes, anecdotes}) => {
  let temp = 0
  let top_vote = 0

  for (let i = 0; i < 8; i++) {
    if (votes[i] > temp) {
      temp = votes[i]
      top_vote = i
    }
  }

  return (
    <div>
      <h1>Anecdote with the most Votes</h1>
      {anecdotes[top_vote]}
      <Display votes={votes} selected={top_vote} />
    </div>
  )
}


const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(getRandInt(0, 7))
  const [vote, setVote] = useState(Array(8).fill(0))

  const copy = [...vote]

  const handleVote = () => {
    copy[selected] += 1
    setVote(copy)
  }

  const handleSelect = () => {
    const number = getRandInt(0, 7)
    setSelected(number)
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]}
      <br/>
      <Display votes={vote} selected={selected} />
      <br/>
      <Button  action={handleVote} text='Vote' />
      <Button  action={handleSelect} text='Next anecdote' />
      <MostVotes votes={vote} anecdotes={anecdotes} />
    </div>
  )
}

export default App