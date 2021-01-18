import React from 'react'
import { SignIn } from 'aws-amplify-react'
import './Login.scss'
import { configProps } from './configProps'

export default class CustomSignIn extends SignIn {
  constructor(props) {
    super(props)
    this._validAuthStates = ['signIn', 'signedOut', 'signedUp']
  }

  showComponent(theme) {
    const loginStyle = {
      // backgroundImage: `url("${configProps.backgroundURL}")`,
      backgroundColor: '#fff',
      color: 'white',
    }

    return (
      <div className="login" style={loginStyle}>
        <div className="container">
          <div className="row">
            <div className="col-md-3 col-mt-4 col-ml-5 col-mb-5">
              <a href="http://www.openznet.com/">
                <img className="img-fluid" src={configProps.logoURL} style={{ height: '50px' }} alt="OpenZNet" />
              </a>
            </div>
          </div>
        </div>
        <div className="wrap">
          <div className="user pb-5">
            <div className="form-wrap">
              <div className="tabs-content">
                <div id="login-tab-content" className="active">
                  <form name="form" form="form">
                    <div className="row">
                      <label
                        className="col-md-3 mt-4"
                        style={{
                          fontWeight: 'bold',
                          color: '#325CB3',
                        }}
                      >
                        Username
                      </label>
                      <div className="col-md-9">
                        <input type="text" className="input" id="username" name="username" placeholder="Username" onChange={this.handleInputChange} />
                      </div>
                    </div>
                    <div className="row">
                      <label
                        className="col-md-3 mt-4"
                        id="label"
                        style={{
                          fontWeight: 'bold',
                          color: '#325CB3',
                        }}
                      >
                        Password
{' '}
                      </label>
                      <div className="col-md-9">
                        <input type="password" className="input" id="password" name="password" placeholder="Password" onChange={this.handleInputChange} />
                      </div>
                    </div>
                    <div className="action-btn">
                      {!configProps.login && (
                        <a href="/register" className="registerbtn" style={{ marginLeft: '137px' }}>
                          Register as Subscriber
                        </a>
                      )}
                      {configProps.login && (
                        <button type="button" className="button loginbtn" onClick={() => super.signIn()}>
                          Login
                        </button>
                      )}

                      <p
                        className="mt-3 text-secondary text-more"
                        style={{
                          marginLeft: '137px',
                          color: '#656666',
                          fontWeight: '550',
                          fontSize: '12px',
                        }}
                      >
                        For more information
{' '}
                        <a
                          className="text-secondary"
                          href="mailto:info@openznet.com?subject=SweetWords
                        &body=Please send me a copy of your new program!"
                        >
                          contact us
                        </a>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer_login">
          <small
            style={{
              marginLeft: '35px',
              fontStyle: 'italic',
              marginRight: '10px',
            }}
          >
            Powered By
          </small>
          <img src={configProps.poweredByURL} style={{ display: 'inline', height: '24px' }} alt="OpenZNet" />
          <small style={{ marginRight: '35px', marginLeft: 'auto' }}>
            &copy;
            {configProps.copyRight}
          </small>
        </div>
      </div>
    )
  }
}
