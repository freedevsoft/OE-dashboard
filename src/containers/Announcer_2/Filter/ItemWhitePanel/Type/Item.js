import React from 'react'
import OZRules from 'components/FormItems/OZRules'

const ComponentTypeItem = ({
  data, form: { getFieldDecorator, getFieldValue, setFieldsValue }, field,
}) => (
    <>
      <OZRules
        getFieldDecorator={getFieldDecorator}
        getFieldValue={getFieldValue}
        setFieldsValue={setFieldsValue}
        initialValue={data && data.list ? data.list : []}
        arrayField={`${field}.list`}
        keysField={`${field}.temp_list`}
      />
    </>
  )

export default ComponentTypeItem
