import React from 'react'
import OZSelectItem from 'components/FormItems/OZSelectItem'
import { inlineStyle, getDepthValue } from 'utils'

const GroupComponent = ({ data, form: { getFieldDecorator }, field }) => {
  getFieldDecorator(`${field}.component.type`, { initialValue: getDepthValue(data, 'component.type') })

  return (
    <>
      <OZSelectItem
        label="Type"
        field={`${field}.component.type`}
        initialValue={getDepthValue(data, 'component.type')}
        getFieldDecorator={getFieldDecorator}
        {...inlineStyle}
        required={false}
        combines={[
          { label: 'Type 1', value: 'type-1' },
          { label: 'Type 2', value: 'type-2' },
          { label: 'Type 3', value: 'type-3' },
        ]}
      />
    </>
  )
}

export default GroupComponent
