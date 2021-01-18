import React from 'react'
import { Form } from 'antd'
import IconsSelect from 'containers/Selects/IconsSelect'
import { inlineStyle } from 'utils'

const GroupingSettingsIcon = ({ data, form: { getFieldDecorator }, field }) => (
    <Form.Item label="Icon:" {...inlineStyle}>
        {getFieldDecorator(field, {
            initialValue: data,
        })(
            <IconsSelect />,
        )}
    </Form.Item>
)

export default GroupingSettingsIcon
