import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeBlogs } from "./reducers/blogReducer";
import { logoutUser, initializeUser } from "./reducers/userReducer";
import Notification from "./components/defaultComps/Notification";
import LoginForm from "./components/defaultComps/LoginForm";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Users from "./components/navComps/Userspage";
import Home from "./components/navComps/Homepage";
import User from "./components/navComps/Userpage";
import Blog from "./components/navComps/Blogpage";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(initializeUser());
    dispatch(initializeBlogs());
  }, [dispatch]);

  if (user === null) {
    return <LoginForm />;
  }

  const padding = {
    padding: 5,
  };

  return (
    <Router>
      <div>
        <Link style={padding} to="/">
          blogs
        </Link>
        <Link style={padding} to="/users">
          users
        </Link>
        {/* {user
      ? <em>{user} logged in</em>
      : <Link style={padding} to="/login">login</Link>
    } */}
        <span>
          {" "}
          {user.name} is logged in{" "}
          <button onClick={() => dispatch(logoutUser())}>logout</button>
        </span>
      </div>
      <h2>blog app </h2>
      <Notification />

      <Routes>
        <Route path="/users/:id" element={<User />} />
        <Route path="/blogs/:id" element={<Blog />} />
        <Route path="/users" element={<Users />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
