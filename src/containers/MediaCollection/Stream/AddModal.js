import React, { useEffect } from 'react'
import { Button, Form, Modal } from 'antd'
import OZInput from 'components/FormItems/OZInput'
import LogosSelect from 'containers/Selects/LogosSelect'
import './AddModal.scss'

const MyForm = ({ onCancel, onUpdate, visible, title, form }) => {
  const formItemLayout = {
    layout: 'vertical',
    labelCol: {
      xs: { span: 24 },
    },
    wrapperCol: {
      sm: { span: 24 },
    },
  }

  const { getFieldDecorator, setFieldsValue, getFieldValue } = form

  getFieldDecorator('name')
  getFieldDecorator('type')

  useEffect(() => {
    form.resetFields()
  }, [visible])

  const update = e => {
    e.preventDefault()
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        onUpdate(values)
      }
    })
  }

  return (
    <Modal
      visible={visible}
      title={title}
      onOk={update}
      onCancel={onCancel}
      width={600}
      centered
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={update}>
          Convert
        </Button>,
      ]}
    >
      <Form className="oe-stream-add-modal-form" {...formItemLayout}>
        <OZInput label="Name" field="name" getFieldDecorator={getFieldDecorator} placeholder="Enter Name" autoFocus />
        <Form.Item label="Watermark">{getFieldDecorator('watermark')(<LogosSelect />)}</Form.Item>
      </Form>
    </Modal>
  )
}
const AddFormModal = Form.create()(MyForm)
export default AddFormModal
