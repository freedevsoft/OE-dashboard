import React from 'react'
import { Form, Divider } from 'antd'
import IconsSelect from 'containers/Selects/IconsSelect'

class GroupingSettingsFormModalInnerIcon extends React.Component {
  render() {
    const { data, form: { getFieldDecorator, getFieldValue }, field } = this.props
    const inlineStyle = {
      labelCol: { md: { span: 4 }, sm: { span: 12 } },
      wrapperCol: { md: { span: 20 }, sm: { span: 12 } },
    }

    return (
      <>
        <Form.Item label="IconURL:" {...inlineStyle}>
          {getFieldDecorator(field, {
            initialValue: data,
          })(
            <IconsSelect />,
          )}
        </Form.Item>

      </>
    )
  }
}
export default GroupingSettingsFormModalInnerIcon
