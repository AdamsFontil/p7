import Blog from "../defaultComps/Blog";
import Togglable from "../defaultComps/Togglable";
import CreateBlogForm from "../defaultComps/CreateBlogForm";
import { useSelector } from "react-redux";

const Home = () => {
  const blogs = useSelector((state) => state.blogs);

  console.log("blogs from home", blogs);
  return (
    <div>
      <Togglable buttonLabelShow="create new blog" buttonLabelCancel="cancel">
        <CreateBlogForm />
      </Togglable>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
    </div>
  );
};

export default Home;
