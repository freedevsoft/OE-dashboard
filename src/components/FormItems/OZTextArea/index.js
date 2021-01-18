import React from 'react'
import { Form, Input } from 'antd'
import PropTypes from 'prop-types'
import { getDepthValue } from '../../../utils'

const { TextArea } = Input
const OZTextArea = ({
    label, extra, initialValue, field, getFieldDecorator, required, labelCol, wrapperCol, style, placeholder, disabled, validator, autoSize,
}) => (
        <Form.Item label={label} extra={extra} labelCol={labelCol} wrapperCol={wrapperCol} style={style}>
            {getFieldDecorator(field, {
                initialValue: getDepthValue(initialValue),
                rules: [{ required, message: 'This field is required' }, ...validator],
            })(
                <TextArea placeholder={placeholder} disabled={disabled} autoSize={autoSize} />,
            )}
        </Form.Item>
    )

OZTextArea.propTypes = {
    extra: PropTypes.string,
    label: PropTypes.string,
    required: PropTypes.bool,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    validator: PropTypes.array,
    autoSize: PropTypes.object,
}

OZTextArea.defaultProps = {
    extra: '',
    label: '',
    required: false,
    placeholder: '',
    disabled: false,
    validator: [],
    autoSize: { minRows: 1, maxRows: 7 },
}
export default OZTextArea
