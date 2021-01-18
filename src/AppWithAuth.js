import React from 'react'
import App from './App'
import AuthContainer from './components/AuthContainer'

class AppWithAuth extends React.Component {
  render() {
    return (
      <AuthContainer changeUserName={this.changeUserName}>
        <App />
      </AuthContainer>
    )
  }
}

export default AppWithAuth
