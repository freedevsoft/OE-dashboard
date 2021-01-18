import React from 'react'

import { Input } from 'antd'

export default class PanelInlineItem extends React.Component {
  render() {
    const { label, value, onValueChangeFunc } = this.props

    return (
      <div className="inline-item">
        <label>{label}</label>
        <Input
          placeholder="Please enter"
          value={value || ''}
          onChange={onValueChangeFunc}
        />
      </div>
    )
  }
}
