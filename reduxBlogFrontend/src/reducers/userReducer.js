import { createSlice } from "@reduxjs/toolkit";
import loginService from "../services/login";
import blogService from "../services/blogs"
import { setNotification } from "./notificationReducer";

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser( state, action ) {
      return action.payload
    }
  }
})

export const { setUser } = userSlice.actions

export const loginUser = (username, password) => {
  return async (dispatch) => {
    console.log('from reducer', username, password);
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogUser", JSON.stringify(user));
      blogService.setToken(user.token);
      dispatch(setUser(user));
      console.log("login success", user);
      dispatch(setNotification({ message: `Login succeeded ${user.username} is in`, messageType: 'info' }))

    } catch (error) {
      console.log("login failed", error);
      dispatch(setNotification({ message: error.response.data.error, messageType: 'error' }));
    }
  }
}

export const logoutUser = () => {
  return async (dispatch) => {
    window.localStorage.removeItem("loggedBlogUser");
    blogService.setToken(null);
    dispatch(setUser(null));
    console.log("log out complete");
  }
}
// logout
// initializeUser

export default userSlice.reducer
