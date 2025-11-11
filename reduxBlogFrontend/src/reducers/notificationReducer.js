import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name:'notification',
  initialState: null,
  reducers: {
    setNotification(state, action) {
      console.log('from reducer slice');
      console.log('what is state??', state);
      console.log('what is action', action);
      return action.payload
    },
  }
})

export const { setNotification } = notificationSlice.actions
export default notificationSlice.reducer
