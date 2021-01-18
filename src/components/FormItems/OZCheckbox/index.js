import React from 'react'
import { Form, Checkbox } from 'antd'
import PropTypes from 'prop-types'

import { getDepthValue } from '../../../utils'

const OZCheckbox = ({
    label, extra, initialValue, field, getFieldDecorator, itemStyle,
}) => (
    <Form.Item {...itemStyle} label={label} extra={extra}>
        {getFieldDecorator(field, {
            initialValue: getDepthValue(initialValue),
            valuePropName: 'checked',
            rules: [{
                transform: value => (value || undefined), // Those two lines
                type: 'boolean',
            }],
        })(
            <Checkbox />,
        )}
    </Form.Item>
)

OZCheckbox.propTypes = {
    extra: PropTypes.string,
    label: PropTypes.string,
    required: PropTypes.bool,
    itemStyle: PropTypes.object,
}

OZCheckbox.defaultProps = {
    extra: '',
    label: '',
    required: true,
    itemStyle: {},
}
export default OZCheckbox
