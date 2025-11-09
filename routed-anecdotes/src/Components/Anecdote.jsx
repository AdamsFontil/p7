const Anecdote = ({ anecdote }) => {
  console.log(anecdote);
  console.log(anecdote.info);
  console.log(anecdote.votes);
  console.log(anecdote.content);
  return (
    <div>
      <h2>
        {anecdote.content} by {anecdote.auhor}
      </h2>
      <p>has {anecdote.votes} votes</p>
      <p>
        for more info see <a href={anecdote.info}>{anecdote.info}</a>{" "}
      </p>
    </div>
  );
};

export default Anecdote;
