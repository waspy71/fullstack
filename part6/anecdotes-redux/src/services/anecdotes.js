import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const addAnecdote = async (content) => {
    const object = { content, votes: 0 }
    const response = await axios.post(baseUrl, object)
    return response.data
}

const addVote = async (anecdoteChanged) => {
    const response = await axios.put(`${baseUrl}/${anecdoteChanged.id}`, anecdoteChanged)
    return response.data
}

export default {
    getAll,
    addAnecdote,
    addVote
}