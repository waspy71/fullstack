import { useNotificationValue } from '../reducers/DataContext'
import { Alert } from 'react-bootstrap'

const Notification = () => {
  const info = useNotificationValue()
  if (!info) {
    return
  }

  const alertStyle = info.error === 'error' ? 'danger' : 'success'

  return <Alert variant={alertStyle}>{info.message}</Alert>
}

export default Notification
