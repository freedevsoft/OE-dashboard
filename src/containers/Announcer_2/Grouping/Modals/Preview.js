import React from 'react'
import { Button, Modal } from 'antd'
import Iframe from 'react-iframe'

const Preview = ({ onCancel, visible, title, client }) => {
  if (!client || !client._id) {
    return (
      <Modal
        visible={visible}
        title={title}
        onCancel={onCancel}
        width={600}
        footer={[
          <Button key="back" onClick={onCancel}>
            Cancel
          </Button>,
        ]}
      >
        Please select ClientID to see the Preview
      </Modal>
    )
  }

  return (
    <Modal
      visible={visible}
      title={title}
      onCancel={onCancel}
      width={1200}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
      ]}
    >
      <Iframe url={`https://${client.name}?launchMode=preview`} width="100%" height="600px" id="myId" className="myClassname" display="initial" position="relative" />
    </Modal>
  )
}
export default Preview
