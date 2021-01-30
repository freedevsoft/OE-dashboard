import React from 'react'
import { Modal, Button } from 'antd'

const ConfirmModal = ({
  title,
  visible,
  bodyText,
  onConfirm,
  onCancel,
}) => {
  const handleOKClicked = () => onConfirm()
  const handleCancelClicked = () => onCancel()

  return (
    <Modal
      title={title}
      centered
      visible={visible}
      onOk={handleOKClicked}
      onCancel={handleCancelClicked}
      footer={[
        <Button key="back" onClick={handleCancelClicked}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="danger"
          onClick={handleOKClicked}
        >
          Delete
        </Button>,
      ]}
    >
      <p>{bodyText}</p>
    </Modal>
  )
}

export default ConfirmModal
