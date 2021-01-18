import React from 'react'
import { Radio, Form } from 'antd'
import { getDepthValue, radioStyle, inlineStyle } from 'utils'

const GroupingSettingsPresentation = ({ data, form: { getFieldDecorator }, field }) => {
    const presentations = ['none', 'notification', 'banner', 'detail']

    getFieldDecorator(`${field}.mode`, { initialValue: getDepthValue(data, 'mode') })

    return (
        <Form.Item label="Presentation:" {...inlineStyle}>
            {getFieldDecorator(`${field}.mode`, {
                initialValue: getDepthValue(data, 'mode'),
            })(
                <Radio.Group>
                    {presentations.map(item => (
                        <Radio style={radioStyle} key={item} value={item}>
                            {item}
                        </Radio>
                    ))}
                </Radio.Group>,
            )}
        </Form.Item>
    )
}

export default GroupingSettingsPresentation
