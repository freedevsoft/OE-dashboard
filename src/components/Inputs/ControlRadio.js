import React from 'react'

export default class ControlRadio extends React.Component {
  render() {
    const {
      label, value, radioValue, keyName, onValueChangeFunc, name,
    } = this.props

    return (
      <>
        <input
          type="radio"
          name={name}
          style={{ width: '15px', height: '15px' }}
          defaultChecked={value === radioValue}
          onClick={ev => onValueChangeFunc(radioValue, keyName)}
          disabled={this.props.disabled}
        />
        <strong style={{
          display: 'inline', marginLeft: '5px', marginTop: '2px', marginRight: '20px',
        }}
        >
          {' '}
          {label}
          {' '}
        </strong>
      </>
    )
  }
}
