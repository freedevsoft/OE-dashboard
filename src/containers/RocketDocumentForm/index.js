import React from 'react'
import SingleLayerForm from 'containers/SingleLayerForm'

const RocketDocumentForm = ({ groupName, data, form, field, header }) => {
  return (
    <div className="oe-rocket-document-form">
      <SingleLayerForm data={data ? data[0] : null} form={form} field={`${field}[0]`} header={header} show />
    </div>
  )
}

export default RocketDocumentForm
