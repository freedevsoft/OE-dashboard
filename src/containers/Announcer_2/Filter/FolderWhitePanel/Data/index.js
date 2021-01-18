import React from 'react'
import {
  DatePicker, TimePicker, Radio, Form, Input, Select, InputNumber, Checkbox, Col, Row,
} from 'antd'
import OZInput from 'components/FormItems/OZInput'
import OZSelectItem from 'components/FormItems/OZSelectItem'
import OZInputNumber from 'components/FormItems/OZInputNumber'
import { getDepthValue } from 'utils/index'
import GroupsSelect from 'containers/Selects/GroupsSelect'

class ComponentTypeItem extends React.Component {
  render() {
    const { data, form: { getFieldDecorator, getFieldValue }, field } = this.props

    const inlineStyle = {
      labelCol: { md: { span: 8 }, sm: { span: 12 } },
      wrapperCol: { md: { span: 16 }, sm: { span: 12 } },
    }

    return (
      <>
        <OZSelectItem
          label="Operator"
          field={`${field}.operator`}
          initialValue={getDepthValue(data, 'operator')}
          getFieldDecorator={getFieldDecorator}
          combines={[
            { label: 'AND', value: 'and' },
            { label: 'OR', value: 'or' },
          ]}
          {...inlineStyle}
          required={false}
        />
        <Form.Item label="Group Name:" {...inlineStyle}>
          {getFieldDecorator(`${field}.groupName`, {
            initialValue: getDepthValue(data, 'groupName'),
          })(
            <GroupsSelect />,
          )}
        </Form.Item>
      </>
    )
  }
}
export default ComponentTypeItem
