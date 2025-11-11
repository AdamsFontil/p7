import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Togglable from "./components/Togglable";
import CreateBlogForm from "./components/CreateBlogForm";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "./reducers/notificationReducer";
import { appendBlog, initializeBlogs } from "./reducers/blogReducer";

const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector( state => state.blogs)
  const notification = useSelector( state => state.notification)
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  console.log('blogs', blogs);
  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
      console.log("log in saved---", user);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      console.log("login success", user);
      dispatch(setNotification({ message: `Login succeeded ${user.username} is in`, messageType: 'info' }))

      // setNotification({ message: `Login succeeded ${user.username} is in` });
      setTimeout(() => {
        dispatch(removeNotification());
      }, 5000);
    } catch (error) {
      console.log("login failed", error);
      console.log("login failed", error.response.data.error);
      console.log("login failed", typeof error.response.data.error);
      dispatch(setNotification({ message: error.response.data.error, messageType: 'error' }));
      setTimeout(() => {
        dispatch(removeNotification())
      }, 5000);
    }
  };


  const handleLogout = async (event) => {
    console.log("logging out", user);
    event.preventDefault();
    window.localStorage.removeItem("loggedBlogUser");
    blogService.setToken(null);
    setUser(null);
    console.log("log out complete");
  };

  const addBlog = async (blogObject) => {
    try {
      dispatch(appendBlog(blogObject))
      console.log('what is blogObject', blogObject);
      dispatch(setNotification({
        message: `a new blog ${blogObject.title} by ${blogObject.author} added`,
      }));
      setTimeout(() => {
        dispatch(setNotification(null));
      }, 5000);
    } catch (error) {
      console.error("Error creating blog:", error);
      setNotification({ message: error, messageType: 'error' });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
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
        <form onSubmit={handleLogin}>
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
        {user.name} is logged in <button onClick={handleLogout}>logout</button>
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
