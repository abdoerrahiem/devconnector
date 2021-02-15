import React from 'react'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import { connect } from 'react-redux'
import { addLike, removeLike, deletePost } from '../../actions/post'

const PostItem = ({
  post: { _id, text, name, avatar, user, likes, comments, date },
  auth,
  addLike,
  removeLike,
  deletePost,
  showActions,
}) => {
  return (
    <div className='post bg-white p-1 my-1'>
      <div>
        <Link to={`/profile/${user}`}>
          <img className='round-img' src={avatar} alt='' />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className='my-1'>{text}</p>
        <p className='post-date'>
          Posted on <Moment format='YYYY/MM/DD'>{date}</Moment>
        </p>
        {showActions && (
          <>
            <button
              type='button'
              className='btn btn-light'
              onClick={(e) => addLike(_id)}
            >
              <i className='fas fa-thumbs-up' />{' '}
              {likes.length > 0 && <span>{likes.length}</span>}
            </button>
            <button
              type='button'
              className='btn btn-light'
              onClick={(e) => removeLike(_id)}
            >
              <i className='fas fa-thumbs-down' />
            </button>
            <Link to={`/posts/${_id}`} className='btn btn-primary'>
              Discussion{' '}
              {comments.length > 0 && (
                <span className='comment-count'>{comments.length}</span>
              )}
            </Link>
            {!auth.loading && user === auth.user._id && (
              <button
                type='button'
                className='btn btn-danger'
                onClick={(e) => deletePost(_id)}
              >
                <i className='fas fa-times' />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

PostItem.defaultProps = {
  showActions: true,
}

const mapStateToProps = (state) => ({
  auth: state.auth,
})

export default connect(mapStateToProps, { addLike, removeLike, deletePost })(
  PostItem
)
