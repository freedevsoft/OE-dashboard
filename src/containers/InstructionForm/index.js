import React, { useState } from 'react'
import { Button } from 'antd'
import HTMLEditModal from 'containers/Assets/Edit/Article/Modal/html'
import './index.scss'

const InstructionForm = ({ data, setFieldsValue }) => {
  console.log('data', data)
  const [bShowHTMLEditModal, setBShowHTMLEditModal] = useState(false)
  return (
    <div className="oe-instruction-form">
      <div className="editable-button">
        <Button type="default" icon="edit" onClick={() => setBShowHTMLEditModal(true)} />
      </div>
      {<div className="instruction-form-view" dangerouslySetInnerHTML={{ __html: data }} />}
      {bShowHTMLEditModal && (
        <HTMLEditModal
          visible={bShowHTMLEditModal}
          onCancel={() => setBShowHTMLEditModal(false)}
          data={data}
          onUpdate={newBody => {
            setFieldsValue({ [`comp.data.instruction`]: newBody })
            setBShowHTMLEditModal(false)
          }}
        />
      )}
    </div>
  )
}

export default InstructionForm
