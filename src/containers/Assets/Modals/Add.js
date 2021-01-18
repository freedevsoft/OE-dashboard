import React, { useEffect } from 'react'
import { Button, Form, Modal } from 'antd'
import OZInput from 'components/FormItems/OZInput'
import OZSelectItem from 'components/FormItems/OZSelectItem'

const MyForm = ({ onCancel, onUpdate, visible, bFolder, form, loading, initialValue, groupTypes }) => {
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
      title={bFolder ? 'Add a new Folder' : 'Add a new Document'}
      onOk={e => onUpdate(e, form)}
      onCancel={onCancel}
      width={600}
      footer={[
        <Button key="back" loading={loading} onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" loading={loading} type="primary" onClick={e => onUpdate(e, form)}>
          Add
        </Button>,
      ]}
    >
      <Form className="assets-add-modal-form" {...formItemLayout}>
        {!bFolder && <OZSelectItem label="Type" field="type" getFieldDecorator={getFieldDecorator} combines={groupTypes?.map(item => ({ value: item, label: item }))} required />}
        <OZInput
          label="Name"
          field="name"
          initialValue={initialValue}
          getFieldDecorator={getFieldDecorator}
          placeholder="Please type here"
          disabled={loading}
          autoFocus
          onKeyDown={onKeyDown}
          style={{ margin: '0' }}
          required
        />
      </Form>
    </Modal>
  )
}
const AddArticleFormModal = Form.create()(MyForm)
export default AddArticleFormModal
