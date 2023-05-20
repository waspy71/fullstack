import { useQueryClient, useMutation } from 'react-query'
import { createAnecdote } from '../requests'

import { useNotificationDispatch } from '../NotificationContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const newAnecdoteMutation = useMutation(createAnecdote, {
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData('anecdotes')
      queryClient.setQueriesData('anecdotes', anecdotes.concat(newAnecdote))
      dispatch({ type: 'NOTIFY', payload: `New anecdote added: ${newAnecdote.content}` })
      setTimeout(() => {
        dispatch({ type: 'RESET' })
      }, 5 * 1000)
    },
    onError: (error) => {
      dispatch({ type: 'NOTIFY', payload: `ERROR: ${error.response.data.error}` })
      setTimeout(() => {
        dispatch({ type: 'RESET' })
      }, 5 * 1000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0})
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
