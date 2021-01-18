import React from 'react'
import OZInput from 'components/FormItems/OZInput'
import { getDepthValue, inlineStyle } from 'utils'

const ProgramInfoForm = ({
  data, form: { getFieldDecorator }, field,
  initialValue = {
    season: '',
    episode: '',
    length: '',
    rating: '',
    closedCaption: '',
    aired: '',
  },
}) => {
  const register = key => {
    getFieldDecorator(`${field}.${key}`, { initialValue: getDepthValue(data, key, initialValue[key]) })
  }

  const initial = key => getDepthValue(data, key, initialValue[key])

  register('season')
  register('episode')
  register('length')
  register('rating')
  register('closedCaption')
  register('aired')

  return (
    <>
      <OZInput
        label="Season"
        field={`${field}.season`}
        initialValue={initial('season')}
        getFieldDecorator={getFieldDecorator}
        required={false}
        {...inlineStyle}
      />
      <OZInput
        label="Episode"
        field={`${field}.episode`}
        initialValue={initial('episode')}
        getFieldDecorator={getFieldDecorator}
        required={false}
        {...inlineStyle}
      />
      <OZInput
        label="Length"
        field={`${field}.length`}
        initialValue={initial('length')}
        getFieldDecorator={getFieldDecorator}
        required={false}
        {...inlineStyle}
      />
      <OZInput
        label="Rating"
        field={`${field}.rating`}
        initialValue={initial('rating')}
        getFieldDecorator={getFieldDecorator}
        required={false}
        {...inlineStyle}
      />
      <OZInput
        label="Closed Caption"
        field={`${field}.closedCaption`}
        initialValue={initial('closedCaption')}
        getFieldDecorator={getFieldDecorator}
        required={false}
        {...inlineStyle}
      />
      <OZInput
        label="Aired"
        field={`${field}.aired`}
        initialValue={initial('aired')}
        getFieldDecorator={getFieldDecorator}
        required={false}
        {...inlineStyle}
      />
    </>
  )
}

export default ProgramInfoForm
