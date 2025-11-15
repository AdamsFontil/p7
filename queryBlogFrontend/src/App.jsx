import { useState, useEffect, useContext } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Togglable from "./components/Togglable";
import CreateBlogForm from "./components/CreateBlogForm";
import NotificationContext from "../notificationContext";
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'


const App = () => {
  const queryClient = useQueryClient()
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { notification, notify } = useContext(NotificationContext)
  console.log('what is notification', notification);



  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
      console.log("log in saved---", user);
    }
  }, []);


  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false
  })


  console.log(JSON.parse(JSON.stringify(result)))

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  const blogs = result.data
  console.log('blogs2', blogs);

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
      notify(`Login succeeded ${user.username} is in`, 'info', 3000);
    } catch (error) {
      console.log("login failed", error);
      console.log("login failed", error.response.data.error);
      console.log("login failed", typeof error.response.data.error);
      notify(error.response.data.error, 'error', 7000)
    }
  };

  const likeBlog = async (blogToUpdate) => {
    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
      user: blogToUpdate.user?.id,
    };

    console.log(updatedBlog);

    try {
      const returnedBlog = await blogService.update(
        blogToUpdate.id,
        updatedBlog,
      );

      const updatedBlogs = blogs.map((blog) => {
        return blog.id === returnedBlog.id ? returnedBlog : blog;
      });

      setBlogs(updatedBlogs);
      console.log("what is updatedBlogs", updatedBlogs);
      setNotification({ message: `You liked '${returnedBlog.title}'` });
      setTimeout(() => setNotification(null), 5000);
    } catch (error) {
      console.error("Failed to like blog:", error);
      setNotification({ message: "Failed to like blog", error: true });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleRemove = async (blog) => {
    if (
      !window.confirm(
        `Are you sure you want to remove "${blog.title}" by ${blog.author}?`,
      )
    ) {
      return;
    }
    try {
      const removeBlog = await blogService.remove(blog.id);
      console.log("Blog removed:", removeBlog);
      const removeBlogFromUI = blogs.filter((b) => b.id !== blog.id);
      setBlogs(removeBlogFromUI);
    } catch (error) {
      console.error("Something went wrong", error);
    }
  };

  const handleLogout = async (event) => {
    console.log("logging out", user);
    event.preventDefault();
    window.localStorage.removeItem("loggedBlogUser");
    blogService.setToken(null);
    setUser(null);
    console.log("logged out complete");
  };


  const notificationComp = () =>
    notification.error ? (
      <div className="error">{notification.message}</div>
    ) : (
      <div className="note">{notification.message}</div>
    );

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
        <CreateBlogForm />
      </Togglable>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={likeBlog}
            user={user}
            handleRemove={handleRemove}
          />
        ))}
    </div>
  );
};

export default App;
