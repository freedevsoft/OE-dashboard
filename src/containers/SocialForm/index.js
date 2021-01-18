import React from 'react'
import { Form } from 'antd'
import OZTextArea from 'components/FormItems/OZTextArea'
import TypesSelect from 'containers/Selects/TypesSelect'
import { getDepthValue, inlineStyle } from 'utils'
import './index.scss'

const SocialForm = ({
  data,
  form: { getFieldDecorator },
  field,
  initialValue = {
    sms: 'Testing SMS Text',
    twitter: null,
    facebook: null,
    instagram: null,
  },
}) => {
  const register = key => {
    getFieldDecorator(`${field}.${key}`, { initialValue: getDepthValue(data, key, initialValue[key]) })
  }

  const initial = key => getDepthValue(data, key, initialValue[key])


  register('sms')
  register('twitter')
  register('facebook')
  register('instagram')

  return (
    <div className="oe-desc-form">
      <OZTextArea label="SMS" field={`${field}.sms`} initialValue={initial('sms')} getFieldDecorator={getFieldDecorator} {...inlineStyle} />
      <OZTextArea label="Twitter" field={`${field}.twitter`} initialValue={initial('twitter')} getFieldDecorator={getFieldDecorator} {...inlineStyle} />
      <OZTextArea label="Facebook" field={`${field}.facebook`} initialValue={initial('facebook')} getFieldDecorator={getFieldDecorator} {...inlineStyle} />
      <OZTextArea label="Instagram" field={`${field}.instagram`} initialValue={initial('instagram')} getFieldDecorator={getFieldDecorator} {...inlineStyle} />
    </div>
  )
}

export default SocialForm
