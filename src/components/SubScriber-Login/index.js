import React from 'react'
import { SignIn } from 'aws-amplify-react'
import './Login.scss'

export default class CustomSignIn extends SignIn {
  constructor(props) {
    super(props)
    this._validAuthStates = ['signIn', 'signedOut', 'signedUp']
  }

  showComponent(theme) {
    return (
      <div className="login">
        <div className="wrap">
          <div className="content">
            <div id="slideshow">
              <div className="one">
                <h2>
                  <img
                    alt=""
                    src="https://assets.oelement.openznet.com/images/OpenZNet-Logo-white-small.png"
                  />
                </h2>
              </div>
            </div>
          </div>
          <div className="user">
            <div className="form-wrap">
              <div className="tabs">
                <h3 className="login-tab">
                  <span>Login</span>
                </h3>
              </div>
              <div className="tabs-content">
                <div id="login-tab-content" className="active">
                  <form name="form" form="form">
                    <input
                      type="text"
                      className="input"
                      id="username"
                      name="username"
                      placeholder="Username"
                      onChange={this.handleInputChange}
                    />
                    <input
                      type="password"
                      className="input"
                      id="password"
                      name="password"
                      placeholder="Password"
                      onChange={this.handleInputChange}
                    />
                    <div className="action-btn">
                      <button
                        type="button"
                        className="button loginbtn"
                        onClick={() => super.signIn()}
                      >
                        Login
                      </button>
                      {/* <a to="/forgot" className="registerbtn">
                        Forgot Password
                      </a> */}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
