import React from 'react'
import { Form, Switch } from 'antd'
import PropTypes from 'prop-types'

import { getDepthValue } from '../../../utils'

const OZSwitch = ({ label, extra, initialValue, field, getFieldDecorator, itemStyle, style, onChange }) => (
  <Form.Item {...itemStyle} label={label} extra={extra} style={style}>
    {getFieldDecorator(field, {
      initialValue: getDepthValue(initialValue),
      valuePropName: 'checked',
      rules: [
        {
          transform: value => value || undefined, // Those two lines
          type: 'boolean',
        },
      ],
    })(<Switch onChange={onChange} />)}
  </Form.Item>
)

OZSwitch.propTypes = {
  extra: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  itemStyle: PropTypes.object,
}

OZSwitch.defaultProps = {
  extra: '',
  label: '',
  required: true,
  itemStyle: {},
}
export default OZSwitch
