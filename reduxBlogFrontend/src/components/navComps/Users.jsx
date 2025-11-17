import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsers } from "../../services/users";

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
  console.log("type users are", typeof users);

  const usersArray = Object.values(users);
  console.log("userArray", usersArray);
  console.log("type of usersArray", typeof usersArray);

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
              <td>{user.name}</td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
