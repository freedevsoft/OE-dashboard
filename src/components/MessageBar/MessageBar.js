import React, { Component } from 'react'
import PropTypes from 'prop-types'

class MessageBar extends Component {
  render() {
    const barStyle = {
      width: this.props.width ? this.props.width : '80%',
      height: this.props.height ? this.props.height : '60px',
      background: this.props.background,
      color: this.props.color,
      padding: '5px 10px',
      // boxShadow: "0 0 20px rgba(0, 0, 0, 0.55)",
      borderRadius: '1px',
      border: 'none',
      borderTop: '1px solid black',
    }

    return (
      <textarea
        style={barStyle}
        value={this.props.message.join('\n')}
        disabled
      />
    )
  }
}

MessageBar.propTypes = {
  message: PropTypes.array,
  width: PropTypes.string,
  height: PropTypes.string,
  background: PropTypes.string,
}

MessageBar.defaultProps = {
  message: '',
  width: '100%',
  height: '60px',
  background: 'grey',
  color: 'white',
  overflow: 'auto',
}

export default MessageBar
