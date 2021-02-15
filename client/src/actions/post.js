import axios from 'axios'
import { setAlert } from './alert'
import * as types from './types'

export const getPosts = () => async (dispatch) => {
  try {
    const res = await axios.get('/posts')

    dispatch({
      type: types.GET_POSTS,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: types.POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}

export const addLike = (id) => async (dispatch) => {
  try {
    const res = await axios.put(`/posts/like/${id}`)

    dispatch({
      type: types.UPDATE_LIKES,
      payload: { id, likes: res.data },
    })
  } catch (err) {
    dispatch({
      type: types.POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}

export const removeLike = (id) => async (dispatch) => {
  try {
    const res = await axios.put(`/posts/unlike/${id}`)

    dispatch({
      type: types.UPDATE_LIKES,
      payload: { id, likes: res.data },
    })
  } catch (err) {
    dispatch({
      type: types.POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}

export const deletePost = (id) => async (dispatch) => {
  try {
    await axios.delete(`/posts/${id}`)

    dispatch({
      type: types.DELETE_POST,
      payload: id,
    })

    dispatch(setAlert('Post removed', 'success'))
  } catch (err) {
    dispatch({
      type: types.POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}

export const addPost = (formData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  try {
    const res = await axios.post('/posts', formData, config)

    dispatch({
      type: types.ADD_POST,
      payload: res.data,
    })

    dispatch(setAlert('Post added', 'success'))
  } catch (err) {
    dispatch({
      type: types.POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}

export const getPost = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/posts/${id}`)

    dispatch({
      type: types.GET_POST,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: types.POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}

export const addComment = (postId, formData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  try {
    const res = await axios.post(`/posts/comment/${postId}`, formData, config)

    dispatch({
      type: types.ADD_COMMENT,
      payload: res.data,
    })

    dispatch(setAlert('Comment added', 'success'))
  } catch (err) {
    dispatch({
      type: types.POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}

export const deleteComment = (postId, commentId) => async (dispatch) => {
  try {
    await axios.delete(`/posts/comment/${postId}/${commentId}`)

    dispatch({
      type: types.REMOVE_COMMENT,
      payload: commentId,
    })

    dispatch(setAlert('Comment removed', 'success'))
  } catch (err) {
    dispatch({
      type: types.POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}
