import blogService from '../services/blogs'
import { useMutation, useQueryClient } from 'react-query'

const BlogView = ({ blogId, blogs }) => {
  const queryClient = useQueryClient()

  const likeBlogMutation = useMutation(blogService.updateLikes, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
    },
  })

  const addCommentMutation = useMutation(blogService.addComment, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
    },
  })

  if (blogs.isLoading) {
    return <div>loading data...</div>
  }

  if (blogs.isError) {
    return <div>user service not available due to problems in server</div>
  }

  const blog = blogs.data.find((blog) => blog.id === blogId)

  if (!blog) {
    return <div>Sorry, unable to find such blog</div>
  }

  const commentHandler = (event) => {
    event.preventDefault()

    const comment = event.target.comment.value
    event.target.comment.value = ''
    addCommentMutation.mutate({ id: blog.id, comment: comment })
  }

  return (
    <>
      <>
        <h2>
          {blog.title} - {blog.author}
        </h2>
        <a href={`${blog.url}`}>{blog.url}</a>
        <div>
          {blog.likes} likes
          <button
            className='btn btn-success btn-rounded m-2'
            onClick={() => likeBlogMutation.mutate(blog)}
          >
            like
          </button>
        </div>
        <p>added by {blog.user.username}</p>
      </>
      <div>
        <h2>Comments</h2>
        <div>
          <form onSubmit={commentHandler}>
            <input type='text' name='comment' />
            <button>Add comment</button>
          </form>
        </div>
        <ul>
          {blog.comments.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default BlogView
