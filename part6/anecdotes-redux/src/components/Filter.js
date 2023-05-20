
import { filterChange } from "../reducers/filterReduer"
import { useDispatch } from 'react-redux'



const Filter = () => {
    const dispatch = useDispatch()


    const handleChange = (event) => {
      dispatch(filterChange(event.target.value))
    }
    const style = {
      marginBottom: 10
    }
  
    return (
      <div style={style}>
        filter <input onChange={handleChange} />
      </div>
    )
  }
  
  export default Filter