import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'


const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteAction(state, action) {
      const id = action.payload.id

      return state.map(anecdote =>
        anecdote.id !== id ? anecdote : action.payload)
    },
    setAnecdote(state, action) {
      return action.payload
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    }
  }
})

export const { voteAction, setAnecdote, appendAnecdote } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdote(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.addAnecdote(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const changeVote = (anecdote) => {
  return async dispatch => {
    const anecdoteChanged = {
      ...anecdote,
      votes: anecdote.votes + 1
    }
    const response = await anecdoteService.addVote(anecdoteChanged)

    dispatch(voteAction(response))
  }
}
export default anecdoteSlice.reducer
