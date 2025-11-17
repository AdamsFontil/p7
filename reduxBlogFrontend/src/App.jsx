import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeBlogs } from "./reducers/blogReducer";
import { logoutUser, initializeUser } from "./reducers/userReducer";
import Notification from "./components/defaultComps/Notification";
import LoginForm from "./components/defaultComps/LoginForm";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Users from "./components/navComps/Users";
import Home from "./components/navComps/Home";

const App = () => {
  const dispatch = useDispatch()
  // const blogs = useSelector( state => state.blogs)
  const user = useSelector( state => state.user)

  // console.log('blogs', blogs);
  console.log('user from reference', user);
  // useEffect(() => {
  //   dispatch(initializeBlogs())
  // }, [dispatch]);

  useEffect(() => {
    dispatch(initializeUser())
  }, [dispatch]);



  if (user === null) { return <LoginForm />}

  const padding = {
    padding: 5
  }

  return (
    <Router>
      <h2>blogs</h2>
      <Notification />
      <p>
        {" "}
        {user.name} is logged in <button onClick={() => dispatch(logoutUser())}>logout</button>
      </p>


      <Routes>
        {/* <Route path="/notes" element={<Notes />} /> */}
        <Route path="/users" element={<Users />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
