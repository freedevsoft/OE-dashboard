import React from 'react'
import { SignIn, Greetings, Authenticator } from 'aws-amplify-react'
import config from './aws-exports'
import CustomSignIn from './Login'

const AuthContainer = ({ children }) => (
  <div>
    <Authenticator hide={[SignIn, Greetings]} amplifyConfig={config}>
      <CustomSignIn />
      {children}
    </Authenticator>
  </div>
)

export default AuthContainer
