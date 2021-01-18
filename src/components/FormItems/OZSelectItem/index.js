import React from 'react'
import { Form } from 'antd'
import PropTypes from 'prop-types'
import OZSelect from '../OZSelect'
import { getDepthValue } from '../../../utils'

const OZSelectItem = React.forwardRef(
  (
    {
      label,
      extra,
      initialValue,
      field,
      getFieldDecorator,
      required,
      labels,
      values,
      combines,
      labelCol,
      wrapperCol,
      style,
      placeholder,
      onChange,
      disabled,
    },
    ref,
  ) => (
    <Form.Item label={label} extra={extra} labelCol={labelCol} wrapperCol={wrapperCol} style={style}>
      {getFieldDecorator(field, {
        initialValue: getDepthValue(initialValue),
        rules: [{ required, message: 'This field is required' }],
      })(
        <OZSelect combines={combines} values={values} labels={labels} placeholder={placeholder} onChange={onChange} disabled={disabled} ref={ref} />,
      )}
    </Form.Item>
  ),
)

OZSelect.propTypes = {
  extends: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
}

OZSelect.defaultProps = {
  extra: '',
  label: '',
  required: true,
  placeholder: 'Select an Option',
}

OZSelectItem.displayName = 'OZSelectItem'
export default OZSelectItem
