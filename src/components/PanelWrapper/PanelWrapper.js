import React from 'react'
import MessageBar from '../MessageBar/MessageBar'
import './PanelWrapper.scss'

export default class PanelWrapper extends React.Component {
  render() {
    return (
      <div className="mypanelWrapper">
        <div className="myPanelList row" style={{ height: '100%' }}>
          {this.props.children}
        </div>
      </div>
    )
  }
}
