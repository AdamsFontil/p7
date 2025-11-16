import { useEffect } from "react";
import Blog from "./components/Blog";
import Togglable from "./components/Togglable";
import CreateBlogForm from "./components/CreateBlogForm";
import { useDispatch, useSelector } from "react-redux";
import { initializeBlogs } from "./reducers/blogReducer";
import { logoutUser, initializeUser } from "./reducers/userReducer";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";

const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector( state => state.blogs)
  const user = useSelector( state => state.user)

  console.log('blogs', blogs);
  console.log('user from reference', user);
  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch]);

  useEffect(() => {
    dispatch(initializeUser())
  }, [dispatch]);



  if (user === null) { return <LoginForm />}


  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <p>
        {" "}
        {user.name} is logged in <button onClick={() => dispatch(logoutUser())}>logout</button>
      </p>
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
  );
};

export default App;
