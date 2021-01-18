import React from 'react'
import { Form, Radio, Checkbox, InputNumber, Input } from 'antd'
import ColorPicker from 'components/ColorPicker'
import { inlineStyle, getDepthValue } from 'utils'
import BackgroundsSelect from 'containers/Selects/BackgroundsSelect'
import OZInput from 'components/FormItems/OZInput'
import './index.scss'

const ShowfieldForm = ({
  data,
  form: { getFieldDecorator, getFieldValue, setFieldsValue },
  field,
  disabled,
  initialValue = {
    timestamp: '',
    schedule: '',
    count: '',
    short: '',
    tooltip: {
      text: '',
    },
  },
}) => {
  const changeHandler = (field, value) => {
    const key = field
    setFieldsValue({ [key]: value })
  }

  const register = key => {
    getFieldDecorator(`${field}.${key}`, { initialValue: getDepthValue(data, key, initialValue[key]) })
  }

  const initial = key => getDepthValue(data, key, initialValue[key])

  register('timestamp')
  register('schedule')
  register('count')
  register('short')
  register('tooltip.text')

  let bChanged = false

  Object.keys(initialValue).forEach(key => {
    if (getFieldValue(`${field}.${key}`) !== initialValue[key]) bChanged = true
  })

  const checkboxStyle = {
    display: 'block',
    marginLeft: '20px',
  }

  return (
    <div className="bits-form-style-v2">
      <Form.Item label="Show" className="primary-label">
        {getFieldDecorator(`${field}.timestamp`, {
          initialValue: initial('timestamp'),
          valuePropName: 'checked',
        })(<Checkbox style={checkboxStyle}>Timestamp</Checkbox>)}
        {getFieldDecorator(`${field}.schedule`, {
          initialValue: initial('schedule'),
          valuePropName: 'checked',
        })(<Checkbox style={checkboxStyle}>Schedule</Checkbox>)}
        {getFieldDecorator(`${field}.count`, {
          initialValue: initial('count'),
          valuePropName: 'checked',
        })(<Checkbox style={checkboxStyle}>Count</Checkbox>)}
        {getFieldDecorator(`${field}.short`, {
          initialValue: initial('short'),
          valuePropName: 'checked',
        })(<Checkbox style={checkboxStyle}>Short</Checkbox>)}
      </Form.Item>
      <Form.Item label="Tooltip" className="primary-label">
        <span style={{ width: '7rem', display: 'inline-block', textAlign: 'right', paddingRight: '1rem' }}>Text:</span>
        {getFieldDecorator(`${field}.tooltip.text`, {
          initialValue: initial('tooltip.text'),
        })(<Input autoComplete="off" style={{ width: 'calc(100% - 7rem)' }} disabled={disabled} />)}
      </Form.Item>
    </div>
  )
}

export default ShowfieldForm
