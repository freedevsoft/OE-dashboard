import React from 'react'
import OZInputNumber from 'components/FormItems/OZInputNumber'
import OZInput from 'components/FormItems/OZInput'
import { getDepthValue, inlineStyle } from 'utils'

const TooltipForm = ({
  data, form: { getFieldDecorator }, field,
  initialValue = {
    time: '5',
    content: '',
    label: '',
  },
}) => {
  const register = key => {
    getFieldDecorator(`${field}.${key}`, { initialValue: getDepthValue(data, key, initialValue[key]) })
  }

  const initial = key => getDepthValue(data, key, initialValue[key])

  register('time')
  register('content')
  register('label')

  return (
    <>
      <OZInputNumber
        label="Delay Time"
        field={`${field}.time`}
        initialValue={initial('time')}
        min={0}
        max={100}
        getFieldDecorator={getFieldDecorator}
        {...inlineStyle}
        required={false}
      />
      <OZInput
        label="Content"
        field={`${field}.content`}
        initialValue={initial('content')}
        getFieldDecorator={getFieldDecorator}
        {...inlineStyle}
        required={false}
      />
      <OZInput
        label="Label"
        field={`${field}.label`}
        initialValue={initial('label')}
        getFieldDecorator={getFieldDecorator}
        {...inlineStyle}
        required={false}
      />
    </>
  )
}

export default TooltipForm
