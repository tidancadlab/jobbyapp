import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

export default class Login extends Component {
  state = {isError: ''}

  onInputChange = e => {
    this.setState(pre => ({...pre, [e.target.id]: e.target.value}))
  }

  onLogin = async e => {
    e.preventDefault()
    const {isError, ...rest} = this.state
    const {history} = this.props
    this.setState({isError: ''})
    try {
      const response = await fetch('https://apis.ccbp.in/login', {
        method: 'POST',
        body: JSON.stringify(rest),
      })
      const data = await response.json()
      if (response.ok) {
        Cookies.set('jwt_token', data.jwt_token, {expires: 7})
        history.replace('/')
      } else {
        this.setState({isError: data.error_msg})
      }
    } catch (error) {
      this.setState({isError: 'Username or password is invalid'})
    }
  }

  render() {
    const {isError} = this.state
    if (Cookies.get('jwt_token')) {
      return <Redirect to="/" />
    }
    return (
      <div className="main">
        <div className="container">
          <div className="logo_container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </div>
          <form onSubmit={this.onLogin}>
            <div className="input_container">
              <label htmlFor="username">USERNAME</label>
              <input
                onChange={this.onInputChange}
                type="text"
                id="username"
                placeholder="Username"
              />
            </div>
            <div className="input_container">
              <label htmlFor="password">PASSWORD</label>
              <input
                onChange={this.onInputChange}
                type="password"
                id="password"
                placeholder="Password"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Login
            </button>
            {isError !== '' && (
              <p className="text-console error -mt-3">*{isError}</p>
            )}
          </form>
        </div>
      </div>
    )
  }
}
