import React from 'react'
import { Form, Checkbox, Divider } from 'antd'

class GroupingSettingsFormModalInnerMajorMinor extends React.Component {
  render() {
    const { data, form: { getFieldDecorator, getFieldValue }, field } = this.props
    const inlineStyle = {
      labelCol: { md: { span: 4 }, sm: { span: 12 } },
      wrapperCol: { md: { span: 20 }, sm: { span: 12 } },
    }

    return (
      <>
        <Form.Item label="Version:" {...inlineStyle}>
          <Form.Item>
            {getFieldDecorator(`${field}.increaseMajor`, {
              initialValue: false,
            })(
              <Checkbox>{`Major change (Current: ${data && data.major ? data.major : 0})`}</Checkbox>,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator(`${field}.increaseMinor`, {
              initialValue: false,
            })(
              <Checkbox>{`Minor change (Current: ${data && data.minor ? data.minor : 0})`}</Checkbox>,
            )}
          </Form.Item>
        </Form.Item>
      </>
    )
  }
}
export default GroupingSettingsFormModalInnerMajorMinor
