import React from 'react'
import { SketchPicker } from 'react-color'

class ColorPicker extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      openPicker: false,
    }
  }

  onTrigger = () => {
    console.log('trigger')
    this.setState({ openPicker: !this.state.openPicker })
  }

  render() {
    const { color, disabled, wrapperStyle, field, onValueChange } = this.props
    const triggerStyle = { backgroundColor: color }
    const popover = {
      position: 'absolute',
      zIndex: '2',
    }
    const cover = {
      position: 'fixed',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
    }

    return (
      <div style={wrapperStyle}>
        <div
          className="colorTrigger"
          style={triggerStyle}
          onClick={() => {
            if (disabled) return
            this.onTrigger()
          }}
        />
        {this.state.openPicker ? (
          <div style={popover}>
            <div style={cover} onClick={this.onTrigger} />
            <SketchPicker color={color} onChangeComplete={color => onValueChange(field, color.hex)} />
          </div>
        ) : null}
      </div>
    )
  }
}

export default ColorPicker
