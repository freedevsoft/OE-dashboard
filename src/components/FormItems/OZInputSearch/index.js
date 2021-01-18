import React from 'react'
import { Form, Input } from 'antd'
import PropTypes from 'prop-types'
import { getDepthValue } from '../../../utils'

const OZInputSearch = ({ label, extra, initialValue, field, getFieldDecorator, required, labelCol, wrapperCol, style, placeholder, disabled, onSearch, enterButton, validator }) => (
  <Form.Item label={label} extra={extra} labelCol={labelCol} wrapperCol={wrapperCol} style={style}>
    {getFieldDecorator(field, {
      initialValue: getDepthValue(initialValue),
      rules: [{ required, message: 'This field is required' }, ...validator],
    })(<Input.Search placeholder={placeholder} disabled={disabled} enterButton={enterButton} onSearch={onSearch} />)}
  </Form.Item>
)

OZInputSearch.propTypes = {
  extra: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  validator: PropTypes.array,
}

OZInputSearch.defaultProps = {
  extra: '',
  label: '',
  required: true,
  placeholder: '',
  disabled: false,
  validator: [],
}
export default OZInputSearch
