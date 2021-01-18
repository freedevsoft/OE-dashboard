import React from 'react'

export default class ControlRadiosGroup extends React.Component {
  render() {
    const childrenWithProps = React.Children.map(this.props.children, child => React.cloneElement(child, {
      name: this.props.name,
      disabled: this.props.disabled,
    }))

    return (
      <div style={{ height: '20px', paddingTop: '10px', ...this.props.style }}>
        {childrenWithProps}
      </div>
    )
  }
}
