import React, { useEffect, useState } from 'react'
import { Button, Form, Modal, Upload, Icon } from 'antd'
import OZInput from 'components/FormItems/OZInput'
import { uploadFileToS3 } from 'utils/index'
import './AddModal.scss'

const { Dragger } = Upload

const MyForm = ({ onCancel, onUpdate, visible, title, form }) => {
  const [uploading, setUploading] = useState(false)
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
  getFieldDecorator('data.url')

  const name = getFieldValue('name')
  const imgURL = getFieldValue('data.url')

  useEffect(() => {
    form.resetFields()
  }, [visible])

  const onDagger = info => {
    const { status, name: filename } = info.file

    if (status !== 'uploading') {
      setUploading(true)
      uploadFileToS3(info.file)
        .then(url => {
          if (!name || !name.length) setFieldsValue({ name: filename })
          setFieldsValue({ 'data.url': url })
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => setUploading(false))
    }
  }

  const validURL = str => {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i',
    ) // fragment locator
    return !!pattern.test(str)
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
        <Button key="back" disabled={uploading} onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" disabled={uploading} type="primary" onClick={e => onUpdate(e, form)}>
          Upload
        </Button>,
      ]}
    >
      <Form className="oe-media-list-add-modal-form" {...formItemLayout}>
        <OZInput label="Name" field="name" getFieldDecorator={getFieldDecorator} placeholder="Enter Name" disabled={uploading} autoFocus />
        <OZInput label="URL" field="data.url" getFieldDecorator={getFieldDecorator} placeholder="You can manually input the media URL" disabled={uploading} required />
        <Dragger name="file" multiple={false} onChange={onDagger} showUploadList={false}>
          {imgURL && validURL(imgURL) ? (
            <img src={imgURL} alt="Upload" style={{ height: '120px' }} />
          ) : (
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
          )}
          <p className="ant-upload-text">Click here to upload or Drag and Drop</p>
        </Dragger>
      </Form>
    </Modal>
  )
}
const AddFormModal = Form.create()(MyForm)
export default AddFormModal
