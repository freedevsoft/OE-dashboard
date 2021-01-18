import React, { useEffect } from 'react'
import { Button, Form, Modal } from 'antd'
import OZInput from 'components/FormItems/OZInput'

const MyForm = ({ onCancel, onUpdate, visible, title, form, loading, initialValue }) => {
  const formItemLayout = {
    layout: 'vertical',
    labelCol: {
      xs: { span: 24 },
    },
    wrapperCol: {
      sm: { span: 24 },
    },
  }

  const { getFieldDecorator } = form

  useEffect(() => {
    form.resetFields()
  }, [visible])

  function onKeyDown(e) {
    if (e.keyCode === 13) {
      onUpdate(e, form)
    }
  }

  return (
    <Modal
      visible={visible}
      title={title}
      onOk={e => onUpdate(e, form)}
      onCancel={onCancel}
      width={600}
      centered
      footer={[
        <Button key="back" loading={loading} onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" loading={loading} type="primary" onClick={e => onUpdate(e, form)}>
          Add
        </Button>,
      ]}
    >
      <Form className="announcer-group-add-modal-form" {...formItemLayout}>
        <OZInput field="name" initialValue={initialValue} getFieldDecorator={getFieldDecorator} placeholder="Please type the Notice name" disabled={loading} autoFocus onKeyDown={onKeyDown} />
      </Form>
    </Modal>
  )
}
const GroupAddFormModal = Form.create()(MyForm)
export default GroupAddFormModal
