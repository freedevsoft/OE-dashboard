import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as constants from 'utils/constants'

import './index.scss'

export default class ConfirmDialog extends React.Component {
  static defaultProps = {
    title: 'Publish to Device(s) Successful!',
    subtitle: 'Event will appear on scheduledtime.',
  };

  constructor(props) {
    super(props)
  }

  render() {
    const { onClick, title, subtitle } = this.props

    return (
      <div className="oe-confirm-dialog-wrapper">
        <div className="oe-confirm-dialog">
          <img className="mark-icon" src="/images/icons/confirm-dialog-icon.png" />
          <div className="oe-confirm-dialog__content">
            <h2>{title}</h2>
            <h3>{subtitle}</h3>
            <button onClick={onClick}>OK</button>
          </div>
        </div>
      </div>

    )
  }
}
