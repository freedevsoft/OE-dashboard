import React from 'react'
import { Form, Checkbox } from 'antd'
import PropTypes from 'prop-types'

import { getDepthValue } from '../../../utils'

const OZCheckboxGroup = ({
    label, extra, initialValue, field, getFieldDecorator, required, combines, labelCol, wrapperCol, style,
}) => (
        <Form.Item label={label} extra={extra} labelCol={labelCol} wrapperCol={wrapperCol} style={style}>
            {getFieldDecorator(field, {
                initialValue: getDepthValue(initialValue),
                rules: [{ required, message: 'This field is required' }],
            })(
                <Checkbox.Group>
                    {combines.map(item => <Checkbox value={item.value} key={item.value}>{item.label}</Checkbox>)}
                </Checkbox.Group>,
            )}
        </Form.Item>
    )

OZCheckboxGroup.propTypes = {
    extra: PropTypes.string,
    label: PropTypes.string,
    required: PropTypes.bool,
}

OZCheckboxGroup.defaultProps = {
    extra: '',
    label: '',
    required: true,
}
export default OZCheckboxGroup
