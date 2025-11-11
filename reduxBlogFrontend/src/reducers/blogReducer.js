import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs"


const blogSlice = createSlice({
  name: 'blog',
  initialState: [],
  reducers: {
    createBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    }
  }
})

const { createBlog, setBlogs } = blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
    console.log('reducer dispatched', blogs);
  }
}

export const appendBlog = (blogObject) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blogObject)
    dispatch(createBlog(newBlog))
  }

}



// export const { toggleImportanceOf } = noteSlice.actions

export default blogSlice.reducer
