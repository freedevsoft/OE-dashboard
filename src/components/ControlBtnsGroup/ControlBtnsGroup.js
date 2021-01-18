import React from 'react'
import './ControlBtnsGroup.scss'

const ControlBtnsGroup = props => {
  const { children, style, ...rest } = props
  const childrenWithProps = React.Children.map(children, child => (child ? React.cloneElement(child, { ...rest, ...child.props }) : ''))

  return (
    <div id="btnGroupResult" className="row" style={style}>
      {childrenWithProps}
    </div>
  )
}

export default ControlBtnsGroup
