import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Togglable from "./components/Togglable";
import CreateBlogForm from "./components/CreateBlogForm";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "./reducers/notificationReducer";
import { appendBlog, initializeBlogs } from "./reducers/blogReducer";
import { loginUser, logoutUser, initializeUser } from "./reducers/userReducer";

const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector( state => state.blogs)
  const notification = useSelector( state => state.notification)
  const user = useSelector( state => state.user)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  console.log('blogs', blogs);
  console.log('user from reference', user);
  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch]);

  useEffect(() => {
    dispatch(initializeUser())
  }, [dispatch]);


  const addBlog = async (blogObject) => {
    try {
      dispatch(appendBlog(blogObject))
      console.log('what is blogObject', blogObject);
      dispatch(setNotification({
        message: `a new blog ${blogObject.title} by ${blogObject.author} added`,
      }));

    } catch (error) {
      console.error("Error creating blog:", error);
      setNotification({ message: error, messageType: 'error' });
    }
  };

  const notificationComp = () =>
  notification.messageType === 'error'
  ? <div className="error">{notification.message}</div>
  : <div className="note">{notification.message}</div>

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {notification && notificationComp()}
        <form onSubmit={(e) => {
          e.preventDefault();
          dispatch(loginUser(username, password));
          setUsername('');
          setPassword('');
        }}>
          <div>
            <label>
              username
              <input
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input
                type="text"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </label>
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      {notification && notificationComp()}
      <p>
        {" "}
        {user.name} is logged in <button onClick={() => dispatch(logoutUser())}>logout</button>
      </p>
      <Togglable buttonLabelShow="create new blog" buttonLabelCancel="cancel">
        <CreateBlogForm createBlog={addBlog} />
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
