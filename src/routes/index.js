import React, { Component } from 'react'
import { Auth } from 'aws-amplify'
import { Route, Switch, Router, Redirect } from 'react-router-dom'
import Announcer_2 from 'containers/Announcer_2'
import AnnouncerWrapper from 'containers/Announcer_2/wrapper'
import 'video-react/dist/video-react.css'
import './index.scss'

class Routes extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      fontSize: '14px',
    }
  }

  componentDidMount() {
    Auth.currentAuthenticatedUser({
      bypassCache: false,
    })
      .then(user => this.setState({ user }))
      .catch(err => console.log(err))
  }

  onChangeFont = () => {
    const { fontSize } = this.state
    if (fontSize == '14px') {
      this.setState({ fontSize: '11px' })
    } else {
      this.setState({ fontSize: '14px' })
    }
  }

  render() {
    const { history } = this.props
    const { user, fontSize } = this.state

    if (!user) {
      return 'Not authorized!'
    }

    return (
      <Router history={history}>
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            fontSize,
            flexDirection: 'column',
          }}
        >
          <Switch>
            <Route path="/logout">
              {() => {
                Auth.signOut()
                  .then(data => console.log(data))
                  .catch(err => console.log(err))

                return <Redirect to="/" />
              }}
            </Route>
            <Route path="/">
              <AnnouncerWrapper>
                <Announcer_2 onChangeFont={this.onChangeFont} font={fontSize} />
              </AnnouncerWrapper>
            </Route>

            <Redirect to="/" />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default Routes
