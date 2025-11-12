import { createContext, useReducer } from 'react'


const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.payload
    case 'CLEAR_NOTIFICATION':
      return null
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer, null
  )

 const notify = (message, messageType = type || 'info', duration = time || 5000) => {
    console.log('everything', message, messageType, duration);
    notificationDispatch({
      type: 'SET_NOTIFICATION',
      payload: { message, messageType },
    });

    // Clear automatically after duration
    setTimeout(() => {
      notificationDispatch({ type: 'CLEAR_NOTIFICATION' });
    }, duration);
  };


  return (
    <NotificationContext.Provider value={{ notification, notify }}>
      {props.children}
    </NotificationContext.Provider>
  )
}


export default NotificationContext
