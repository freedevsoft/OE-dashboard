import React from 'react'
import './CollapsedBarContent.scss'

import styled from 'styled-components'
import * as constants from 'utils/constants'

export default class CollapsedBar extends React.Component {
  render() {
    const { bgcolor, fgcolor } = this.props
    const style = {
      color: fgcolor,
      backgroundColor: bgcolor,
    }

    return (
      <div className="collapsedPanelContent">
        <h4 style={style}>{this.props.children}</h4>
      </div>
    )
  }
}
