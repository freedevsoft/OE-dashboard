import React from 'react'
import { Form, Input } from 'antd'
import PropTypes from 'prop-types'
import { getDepthValue } from 'utils'

const OZInput = ({
  label,
  extra,
  initialValue,
  field,
  getFieldDecorator,
  required,
  labelCol,
  wrapperCol,
  style,
  placeholder,
  type,
  disabled,
  addonBefore,
  addonAfter,
  autoFocus,
  validator,
  onKeyDown,
  readOnly,
}) => (
    <Form.Item label={label} extra={extra} labelCol={labelCol} wrapperCol={wrapperCol} style={style}>
      {getFieldDecorator(field, {
        initialValue: getDepthValue(initialValue),
        rules: [{ required, message: 'This field is required' }, ...validator],
      })(
        <Input
          placeholder={placeholder}
          type={type}
          disabled={disabled}
          addonBefore={addonBefore}
          addonAfter={addonAfter}
          autoFocus={autoFocus}
          onKeyDown={onKeyDown}
          autoComplete="off"
          readOnly={readOnly}
        />,
      )}
    </Form.Item>
  )

OZInput.propTypes = {
  extra: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  autoFocus: PropTypes.bool,
  validator: PropTypes.array,
  readOnly: PropTypes.bool,
}

OZInput.defaultProps = {
  extra: '',
  label: '',
  required: false,
  placeholder: '',
  type: '',
  disabled: false,
  autoFocus: false,
  validator: [],
  readOnly: false,
}
export default OZInput
