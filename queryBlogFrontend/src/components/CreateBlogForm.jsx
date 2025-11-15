import { useState, useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import blogService from "../services/blogs";
import NotificationContext from "../../notificationContext";

const CreateBlogForm = () => {
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");

  const { notify } = useContext(NotificationContext);
  const queryClient = useQueryClient();

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

  const handleCreate = (event) => {
    event.preventDefault();
    console.log("creating new blog");
    console.log("values are", author, url, title);

    const blogObject = { title, author, url}
    newBlogMutation.mutate(blogObject)
    console.log('newBlog Mutated');

    setAuthor("");
    setUrl("");
    setTitle("");
  };

  return (
    <form
      onSubmit={handleCreate}
      style={{ border: "2px solid blue", padding: "10px" }}
    >
      <div>
        <label>
          title
          <input
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          author
          <input
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          url
          <input
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </label>
      </div>
      <button type="submit">create</button>
    </form>
  );
};

export default CreateBlogForm;
