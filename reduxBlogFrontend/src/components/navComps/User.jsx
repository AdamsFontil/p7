import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../services/users";

const User = () => {
  const id = useParams().id;

  const result = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  if (result.isLoading) {
    return <div>loading data...</div>;
  }

  const users = result.data;
  console.log("users are", users);

  const user = users?.find((u) => {
    console.log("what is u", typeof u.id);
    return u.id === id;
  });
  if (!user) return <div>User not found</div>;

  console.log("who are users", users);
  console.log("id is what", id);
  console.log("found user", user);
  console.log("user blogs", user.blogs);
  const userBlogs = user.blogs || [];
  return (
    <div>
      <h3>added blogs</h3>
      <ul>
        {userBlogs.map((blog) => (
          <li key={blog.id}> {blog.title} </li>
        ))}
      </ul>
    </div>
  );
};

export default User;
