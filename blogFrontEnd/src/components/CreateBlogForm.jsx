import { useState } from 'react'

const CreateBlogForm = ({ createBlog }) => {
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')

  const handleCreate = (event) => {
    event.preventDefault()
    console.log('creating new blog')
    console.log('values are', author, url, title)

    createBlog({
      title: title,
      author: author,
      url: url
    })
    setAuthor('')
    setUrl('')
    setTitle('')
  }

  return (
    <form onSubmit={handleCreate}   style={{ border: '2px solid blue', padding: '10px' }}>
      <div>
        <label>
            title
          <input type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)} />
        </label>
      </div>
      <div>
        <label>
            author
          <input type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)} />
        </label>
      </div>
      <div>
        <label>
            url
          <input type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)} />
        </label>
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default CreateBlogForm
