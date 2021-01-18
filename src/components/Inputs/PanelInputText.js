import React from 'react'

import { Input } from 'antd'

export default class PanelInputText extends React.Component {
  render() {
    const {
      label,
      defaultValue,
      keyName,
      onValueChangeFunc,
      readOnly,
      required,
    } = this.props

    return (
      <div style={{ display: 'flex', margin: '5px 10px 10px 0px' }}>
        <div style={{ margin: '5px 5px 5px 10px' }}>
          {label}
          {required ? <span style={{ color: 'red' }}>*</span> : ''}
        </div>
        {/* <input
          type="text"
          style={{ marginLeft: "10px", width: "calc(100% - 20px)" }}
          value={defaultValue ? defaultValue : ""}
          onChange={e => onValueChangeFunc(e.target.value, keyName)}
          readOnly={readOnly}
        /> */}
        <Input
          placeholder="Please enter"
          style={{ flexGrow: '1', background: 'transparent' }}
          value={defaultValue || ''}
          onChange={e => onValueChangeFunc(e.target.value, keyName)}
          readOnly={readOnly}
        />
      </div>
    )
  }
}
