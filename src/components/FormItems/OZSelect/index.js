import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'

const { Option } = Select

const OZSelect = React.forwardRef(({ values, labels, combines, placeholder, onChange, disabled, style, loading, ...rest }, ref) => (
  <Select
    placeholder={placeholder}
    showSearch
    {...rest}
    onChange={onChange}
    optionFilterProp="children"
    disabled={disabled}
    loading={loading}
    style={style}
    ref={ref}
  >
    {combines === undefined
      ? values.map((value, index) => (
          <Option value={value} key={index}>
            {labels[index]}
          </Option>
        ))
      : combines.map((item, index) => (
          <Option value={item.value} key={index}>
            {item.label}
          </Option>
        ))}
  </Select>
))

OZSelect.propTypes = {
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  style: PropTypes.object,
  loading: PropTypes.bool,
}

OZSelect.defaultProps = {
  placeholder: 'Select an Option',
  disabled: false,
  style: {},
  loading: false,
}

OZSelect.displayName = 'OZSelectItem'
export default OZSelect
