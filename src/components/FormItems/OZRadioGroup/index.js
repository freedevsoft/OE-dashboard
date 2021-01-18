import React from 'react'
import { Form, Radio } from 'antd'
import PropTypes from 'prop-types'
import { getDepthValue } from '../../../utils'

const OZRadioGroup = ({
    label, extra, initialValue, field, getFieldDecorator, required, combines, labelCol, wrapperCol, style,
}) => (
    <Form.Item label={label} extra={extra} labelCol={labelCol} wrapperCol={wrapperCol} style={style}>
        {getFieldDecorator(field, {
            initialValue: getDepthValue(initialValue),
            rules: [{ required, message: 'This field is required' }],
        })(
            <Radio.Group>
                {combines.map(item => <Radio value={item.value} key={item.value}>{item.label}</Radio>)}
            </Radio.Group>,
        )}
    </Form.Item>
)

OZRadioGroup.propTypes = {
    extra: PropTypes.string,
    label: PropTypes.string,
    required: PropTypes.bool,
}

OZRadioGroup.defaultProps = {
    extra: '',
    label: '',
    required: true,
}
export default OZRadioGroup
