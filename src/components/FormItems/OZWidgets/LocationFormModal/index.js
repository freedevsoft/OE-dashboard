import React from 'react'
import { Modal } from 'antd'
import LocationForm from 'containers/LocationForm'

import './index.scss'

const LocationFormModal = ({ data, field, onUpdate, visible, title, form }) => {
  return (
    <Modal visible={visible} title={title} onOk={onUpdate} onCancel={onUpdate} width={1200} footer={[]} className="oz-widgets-location-form-modal">
      <LocationForm data={data} field={field} form={form} />
    </Modal>
  )
}

export default LocationFormModal
