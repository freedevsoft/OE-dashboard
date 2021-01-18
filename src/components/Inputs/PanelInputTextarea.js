import React from 'react'

import { Input } from 'antd'

export default class PanelInputTextarea extends React.Component {
  render() {
    const {
      label, defaultValue, keyName, onValueChangeFunc,
    } = this.props

    return (
      <div>
        <div style={{ margin: '5px 10px' }}>{label}</div>
        {/* <textarea
          style={{ width: "calc(100% - 20px)", marginLeft: '10px' }}
          value={defaultValue ? defaultValue : ""}
          onChange={e => onValueChangeFunc(e.target.value, keyName)}
        /> */}
        <Input.TextArea rows={4} value={defaultValue || ''} style={{ width: 'calc(100% - 20px)', marginLeft: '10px' }} onChange={e => onValueChangeFunc(e.target.value, keyName)} placeholder="please enter" />
      </div>
    )
  }
}
