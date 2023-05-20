import { useSelector, useDispatch } from "react-redux";
import { changeVote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const Anecdote = ({ anecdote, handleClick }) => {
  
    return (
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={handleClick}>vote</button>
          </div>
        </div>
    )
}

const AnecdoteList = () => {
    const dispatch = useDispatch()

    const anecdotes = useSelector(({ filter, anecdotes}) => {
      if (filter !== '') {
        return anecdotes.filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))
      }
      return [...anecdotes]
    })
    
    return (
        <>
            {anecdotes.sort((x, y) => y.votes - x.votes)
            .map(a => 
            <Anecdote 
                key={a.id}
                anecdote={a}
                handleClick={() => 
                    {
                      dispatch(changeVote(a))
                      dispatch(setNotification(`Like added to: ${a.content}`, 5))
                  }
                }
            />
            )}
        </>
    )
}

export default AnecdoteList