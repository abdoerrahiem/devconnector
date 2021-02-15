import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { setAlert } from '../../actions/alert'
import { register } from '../../actions/auth'

const Register = ({ setAlert, register, isAuth }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  })

  const { name, email, password, password2 } = formData

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger', 3000)
      return
    }

    register({ name, email, password })
  }

  if (isAuth) {
    return <Redirect to='/dashboard' />
  }

  return (
    <>
      <h1 className='large text-primary'>Sign Up</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Create Your Account
      </p>
      <form className='form' onSubmit={(e) => handleSubmit(e)}>
        <div className='form-group'>
          <input
            name='name'
            type='text'
            placeholder='Name'
            value={name}
            // required
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            name='email'
            type='email'
            placeholder='Email Address'
            value={email}
            onChange={(e) => handleChange(e)}
            // required
          />
          <small className='form-text'>
            This site uses Gravatar, so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className='form-group'>
          <input
            name='password'
            type='password'
            placeholder='Password'
            // minLength='6'
            value={password}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            name='password2'
            type='password'
            placeholder='Confirm Password'
            // minLength='6'
            value={password2}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Register' />
      </form>
      <p className='my-1'>
        Already have an account? <Link to='/login'>Sign In</Link>
      </p>
    </>
  )
}

const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuth,
})

export default connect(mapStateToProps, { setAlert, register })(Register)
