import axios from 'axios'
import { setAlert } from './alert'
import * as types from './types'

export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await axios.get('/profile/me')

    dispatch({
      type: types.GET_PROFILE,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: types.PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    })
  }
}

export const getProfiles = () => async (dispatch) => {
  dispatch({ type: types.CLEAR_PROFILE })

  try {
    const res = await axios.get('/profile')

    dispatch({
      type: types.GET_PROFILES,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: types.PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    })
  }
}

export const getProfileById = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/profile/user/${id}`)

    dispatch({
      type: types.GET_PROFILE,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: types.PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    })
  }
}

export const getGithubRepos = (username) => async (dispatch) => {
  try {
    const res = await axios.get(`/profile/github/${username}`)

    dispatch({
      type: types.GET_REPOS,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: types.PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    })
  }
}

export const createProfile = (formData, history, edit = false) => async (
  dispatch
) => {
  try {
    const config = {
      'Content-Type': 'application/json',
    }

    const res = await axios.post('/profile', formData, config)

    dispatch({
      type: types.GET_PROFILE,
      payload: res.data,
    })

    dispatch(setAlert(edit ? 'Profile updated' : 'Profile created', 'success'))

    if (!edit) {
      history.push('/dashboard')
    }
  } catch (err) {
    const errors = err.response.data.errors
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')))
    }

    dispatch({
      type: types.PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    })
  }
}

export const addExperience = (formData, history) => async (dispatch) => {
  try {
    const config = {
      'Content-Type': 'application/json',
    }

    const res = await axios.put('/profile/experience', formData, config)

    dispatch({
      type: types.UPDATE_PROFILE,
      payload: res.data,
    })

    dispatch(setAlert('Experience added', 'success'))
    history.push('/dashboard')
  } catch (err) {
    const errors = err.response.data.errors
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')))
    }

    dispatch({
      type: types.PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    })
  }
}

export const addEducation = (formData, history) => async (dispatch) => {
  try {
    const config = {
      'Content-Type': 'application/json',
    }

    const res = await axios.put('/profile/education', formData, config)

    dispatch({
      type: types.UPDATE_PROFILE,
      payload: res.data,
    })

    dispatch(setAlert('Education added', 'success'))
    history.push('/dashboard')
  } catch (err) {
    const errors = err.response.data.errors
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')))
    }

    dispatch({
      type: types.PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    })
  }
}

export const deleteExperience = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/profile/experience/${id}`)

    dispatch({
      type: types.UPDATE_PROFILE,
      payload: res.data,
    })

    dispatch(setAlert('Experience removed', 'success'))
  } catch (err) {
    dispatch({
      type: types.PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    })
  }
}

export const deleteEducation = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/profile/education/${id}`)

    dispatch({
      type: types.UPDATE_PROFILE,
      payload: res.data,
    })

    dispatch(setAlert('Education removed', 'success'))
  } catch (err) {
    dispatch({
      type: types.PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    })
  }
}

export const deleteAccount = () => async (dispatch) => {
  if (window.confirm('Are you sure? It can not be undo!')) {
    try {
      await axios.delete('/profile')

      dispatch({ type: types.CLEAR_PROFILE })
      dispatch({ type: types.ACCOUNT_DELETED })
      dispatch(setAlert('Your account has been deleted permanently', 'success'))
    } catch (err) {
      dispatch({
        type: types.PROFILE_ERROR,
        payload: {
          msg: err.response.statusText,
          status: err.response.status,
        },
      })
    }
  }
}
