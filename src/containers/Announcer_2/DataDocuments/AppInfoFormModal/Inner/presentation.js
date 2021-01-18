import React from 'react'
import { Radio, Form, Divider } from 'antd'

class GroupingSettingsFormModalInnerPresentation extends React.Component {
  render() {
    const { data, form: { getFieldDecorator, getFieldValue }, field } = this.props
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
      marginTop: '5px',
    }
    const inlineStyle = {
      labelCol: { md: { span: 4 }, sm: { span: 12 } },
      wrapperCol: { md: { span: 20 }, sm: { span: 12 } },
    }
    const presentations = ['none', 'notification', 'banner', 'detail']
    getFieldDecorator(`${field}.mode`, { initialValue: data.mode ? data.mode : undefined })

    return (
      <>
        <Form.Item label="Presentation:" {...inlineStyle}>
          {getFieldDecorator(`${field}.mode`, {
            initialValue: data.mode ? data.mode : undefined,
          })(
            <Radio.Group>
              {presentations.map((item, index) => (
                <Radio style={radioStyle} key={index} value={item}>
                  {item}
                </Radio>
              ))}
            </Radio.Group>,
          )}
        </Form.Item>

      </>
    )
  }
}
export default GroupingSettingsFormModalInnerPresentation
