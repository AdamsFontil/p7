import { useState } from "react";
import {
  appendComment,
  likeBlog,
  removeBlog,
} from "../../reducers/blogReducer";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const Blogpage = () => {
  const id = useParams().id;

  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);
  const [newComment, setNewComment] = useState("");

  console.log("blogs received from redux", blogs);

  const blog = blogs.find((b) => b.id === id);
  if (!blog) return <div>Loading blog...</div>;

  console.log("blog info i need user as well", blog);
  console.log("who is user", user);
  const canDelete = user?.username === blog?.user?.username;
  const comments = blog?.comments;
  console.log("comments???", comments);
  console.log("what are blogs from BLOGPAGE", blogs);

  const handleAddComment = async () => {
    const comment = newComment;
    console.log("comment sent---", comment);
    dispatch(appendComment(blog.id, newComment));
    setNewComment("");
  };

  return (
    <div>
      <div>
        <h2>{blog.title}</h2>
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}{" "}
            <button onClick={() => dispatch(likeBlog(blog))}>like</button>
          </div>
          <div>{blog?.user?.name}</div>
          {canDelete && (
            <div>
              <button onClick={() => dispatch(removeBlog(blog))}>remove</button>
            </div>
          )}
        </div>
        <div>
          <h4>comments</h4>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={handleAddComment}>add comment</button>
          <ul>
            {comments.map((comment, index) => (
              <li key={index}> {comment} </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Blogpage;
