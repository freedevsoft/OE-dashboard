import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faBars, faFolderPlus } from '@fortawesome/free-solid-svg-icons'
import './CollapseButton.scss'

import * as constants from 'utils/constants'

export default class CollapseButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mouseHover: false,
    }
  }

  setMouseHover = mouseHover => {
    if (this.props.disabled) return
    this.setState({ mouseHover })
  };

  render() {
    const { bgcolor, fgcolor } = this.props

    let style = 'btn myPanelRightHand'
    if (this.props.collapsed) style += ' myPanelRightHandCollapsed'
    const inlineStyle = {
      color: fgcolor,
      backgroundColor: this.state.mouseHover
        ? constants.getHoverColor(bgcolor)
        : bgcolor,
    }

    return (
      <button
        type="button"
        onClick={this.props.onClick}
        className={style}
        style={inlineStyle}
      >
        <FontAwesomeIcon
          icon={this.props.collapsed ? faFolderPlus : faBars}
          size={this.props.collapsed ? 'lg' : 'sm'}
        />
      </button>
    )
  }
}
