import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsers } from "../../services/users";
import { Link } from "react-router-dom";

const Users = () => {
  const result = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  console.log("resulting", JSON.parse(JSON.stringify(result)));

  if (result.isLoading) {
    return <div>loading data...</div>;
  }

  const users = result.data;
  console.log("users are", users);

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Blogs Created</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
