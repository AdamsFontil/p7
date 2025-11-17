import Blog from "../defaultComps/Blog";
import Togglable from "../defaultComps/Togglable";
import CreateBlogForm from "../defaultComps/CreateBlogForm";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { initializeBlogs } from "../../reducers/blogReducer";
import { initializeUser } from "../../reducers/userReducer";


const Home = () => {
  const dispatch = useDispatch()
    const blogs = useSelector( state => state.blogs)
    const user = useSelector( state => state.user)

      useEffect(() => {
        dispatch(initializeBlogs())
      }, [dispatch]);

        useEffect(() => {
          dispatch(initializeUser())
        }, [dispatch]);

          console.log('blogs from home', blogs);
  return (
    <div>
      <Togglable buttonLabelShow="create new blog" buttonLabelCancel="cancel">
        <CreateBlogForm />
      </Togglable>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            user={user}
          />
        ))}
    </div>
  )
}


export default Home
