import React from 'react'
import ReactDOM from 'react-dom'
import AppWithAuth from './AppWithAuth'

import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/styles.scss'
import 'antd/dist/antd.less'

import * as serviceWorker from './serviceWorker'

ReactDOM.render(<AppWithAuth />, document.getElementById('root'))

if (module.hot) {
  module.hot.accept('./AppWithAuth', () => {
    const AppWithAuth = require('./AppWithAuth').default
    render(AppWithAuth)
  })
}

// ?? Problem with Cloudfront Refresh ??  OF-283  190612.1133

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA

serviceWorker.unregister()
