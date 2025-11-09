import { useState } from "react";
import { useField } from "../hooks";
const CreateNew = (props) => {
  const { reset: resetContent, ...content } = useField("content");
  const { reset: resetAuthor, ...author } = useField("author");
  const { reset: resetInfo, ...info } = useField("info");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("what are props before", props);
    props.addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0,
    });
    console.log("what are props", props);
    console.log("what is e", e);
    console.log("content is ", content.value);
  };

  const handleReset = (e) => {
    e.preventDefault();
    console.log("need to reset props", props);
    resetAuthor();
    resetContent();
    resetInfo();
  };
  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content} />
        </div>
        <div>
          author
          <input {...author} />
        </div>
        <div>
          url for more info
          <input {...info} />
        </div>
        <button type="submit">create</button>
        <button type="button" onClick={handleReset}>
          reset
        </button>
      </form>
    </div>
  );
};

export default CreateNew;
