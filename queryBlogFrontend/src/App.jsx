import { useState, useEffect, useContext } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Togglable from "./components/Togglable";
import CreateBlogForm from "./components/CreateBlogForm";
import NotificationContext from "../notificationContext";
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import UserContext from "../userContext";


const App = () => {
  const queryClient = useQueryClient()
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { notification, notify } = useContext(NotificationContext)
  const { user, userDispatch } = useContext(UserContext)
  console.log('is this working', user);
  console.log('what is notification', notification);



  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      userDispatch({
      type: "SET_USER",
      payload: user
    });
      blogService.setToken(user.token);
      console.log("log in saved---", user);
    }
  }, []);


  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false
  })

    const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))
      notify(`successfully added "${newBlog.title}" to blogs`, 'info', 3000)
    },
    onError: (error) => {
      notify(`Error: ${error}`, 'error', 5000)
    }
  })


  const likeBlogMutation = useMutation({
  mutationFn: ({ id, updatedBlog }) => blogService.update(id, updatedBlog),
  onSuccess: (updatedBlog) => {
    const blogs = queryClient.getQueryData(['blogs'])
    const updatedBlogs = blogs.map((blog) => {
      return blog.id === updatedBlog.id ? updatedBlog : blog;
    });
    queryClient.setQueryData(['blogs'], updatedBlogs);
    notify(`Liked "${updatedBlog.title}"`, 'info', 3000)
  },
  onError: (error) => {
  const message = error?.response?.data?.error || error.message || 'Failed to like blog';
  notify(message, 'error', 5000)
}
})

const removeBlogMutation = useMutation({
  mutationFn: blogService.remove,
  onSuccess: (blog) => {
    queryClient.invalidateQueries({ queryKey: ['blogs']})
  },
  onError: (error) => {
    console.error("Something went wrong", error);
    const message = error?.response?.data?.error || error.message || 'Failed to like blog';
    notify(message, 'error', 5000)
  }

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
      userDispatch({
      type: "SET_USER",
      payload: user
    });
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

  const likeBlog = (blogToUpdate) => {
  likeBlogMutation.mutate({
    id: blogToUpdate.id,
    updatedBlog: {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
      user: blogToUpdate.user?.id
    }
  })
}


  const handleRemove = async (blog) => {
    if (
      !window.confirm(
        `Are you sure you want to remove "${blog.title}" by ${blog.author}?`,
      )
    ) {
      return;
    }
   removeBlogMutation.mutate(blog.id)
  };

  const handleLogout = async (event) => {
    console.log("logging out", user);
    event.preventDefault();
    window.localStorage.removeItem("loggedBlogUser");
    blogService.setToken(null);
    userDispatch({
      type: "REMOVE_USER",
    });
    console.log("logged out complete");
  };

  const addBlog = async (blogObject) => {
    console.log("blogObject received", blogObject);
    newBlogMutation.mutate(blogObject)
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
        <CreateBlogForm createBlog={addBlog} />
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
