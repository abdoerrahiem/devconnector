import * as types from './types'
import { setAlert } from './alert'
import axios from 'axios'
import setAuthToken from '../utils/setAuthToken'

export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token)
  }

  try {
    const res = await axios.get('/auth')

    dispatch({
      type: types.USER_LOADED,
      payload: res.data.user,
    })
  } catch (err) {
    dispatch({ type: types.AUTH_ERROR })
  }
}

export const register = ({ name, email, password }) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const body = JSON.stringify({ name, email, password })

  try {
    const res = await axios.post('/users', body, config)

    dispatch({
      type: types.REGISTER_SUCCESS,
      payload: res.data,
    })

    dispatch(loadUser())
  } catch (err) {
    const errors = err.response.data.errors
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')))
    }

    dispatch({
      type: types.REGISTER_FAIL,
    })
  }
}

export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const body = JSON.stringify({ email, password })

  try {
    const res = await axios.post('/auth', body, config)

    dispatch({
      type: types.LOGIN_SUCCESS,
      payload: res.data,
    })

    dispatch(loadUser())
  } catch (err) {
    const errors = err.response.data.errors
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')))
    }

    dispatch({
      type: types.LOGIN_FAIL,
    })
  }
}

export const logout = () => (dispatch) => {
  dispatch({ type: types.CLEAR_PROFILE })
  dispatch({ type: types.LOGOUT })
}
