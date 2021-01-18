import React from 'react'
import { Form, InputNumber } from 'antd'
import PropTypes from 'prop-types'
import { getDepthValue } from '../../../utils'

const OZInputNumber = ({
    label, extra, initialValue, field, getFieldDecorator, required, labelCol, wrapperCol, style, placeholder, min, max, inputStyle,
}) => (
    <Form.Item label={label} extra={extra} labelCol={labelCol} wrapperCol={wrapperCol} style={style}>
        {getFieldDecorator(field, {
            initialValue: getDepthValue(initialValue),
            rules: [{ required, message: 'This field is required' }],
        })(
            <InputNumber min={min} max={max} placeholder={placeholder} style={inputStyle} />,
        )}
    </Form.Item>
)
OZInputNumber.propTypes = {
    extra: PropTypes.string,
    label: PropTypes.string,
    required: PropTypes.bool,
    placeholder: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
}

OZInputNumber.defaultProps = {
    extra: '',
    label: '',
    required: true,
    placeholder: '',
    min: 0,
    max: 100,
}
export default OZInputNumber
