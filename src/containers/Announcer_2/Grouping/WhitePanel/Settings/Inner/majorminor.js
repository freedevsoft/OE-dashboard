import React from 'react'
import { Form, Checkbox } from 'antd'
import { inlineStyle, getDepthValue } from 'utils'

const GroupingSettingsMajorMinor = ({ data, form: { getFieldDecorator }, field }) => {
  getFieldDecorator(`${field}.increaseMajor`, { initialValue: false })
  getFieldDecorator(`${field}.increaseMinor`, { initialValue: false })

  return (
    <Form.Item label="Version:" {...inlineStyle}>
      <Form.Item>
        {getFieldDecorator(`${field}.increaseMajor`, {
          initialValue: false,
          valuePropName: 'checked',
        })(
          <Checkbox>{`Major change (Current: ${getDepthValue(data, 'major', 0)})`}</Checkbox>,
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator(`${field}.increaseMinor`, {
          initialValue: false,
          valuePropName: 'checked',
        })(
          <Checkbox>{`Minor change (Current: ${getDepthValue(data, 'minor', 0)})`}</Checkbox>,
        )}
      </Form.Item>
    </Form.Item>
  )
}
export default GroupingSettingsMajorMinor
