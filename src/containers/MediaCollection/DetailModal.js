import React, { useEffect, useRef } from 'react'
import { Form, Modal, Button } from 'antd'
import * as constants from 'utils/constants'
import OZInput from 'components/FormItems/OZInput'
import _ from 'lodash'

import { Player } from 'video-react'
import './DetailModal.scss'
// import './AddModal.scss'

const MyForm = ({ onCancel, onUpdate, visible, title, form, initialValue, type }) => {
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

  
  getFieldDecorator('_id', { initialValue: _.get(initialValue, '_id') })
  getFieldDecorator('name', { initialValue: _.get(initialValue, 'name') })
  getFieldDecorator('data.url', { initialValue: _.get(initialValue, 'data.url') })

  useEffect(() => {
    form.resetFields()
  }, [visible])

  const URL = getFieldValue('data.url')

  const videoPlayer = useRef(null)

  function onModalCancel() {
    if (videoPlayer && videoPlayer.current) {
      videoPlayer.current.pause()
    }
    onCancel()
  }

  return (
    <Modal
      visible={visible}
      title={title}
      onOk={e => onUpdate(e, form)}
      onCancel={onModalCancel}
      width={600}
      centered
      footer={[
        <Button key="back" onClick={onModalCancel}>
          Cancel
        </Button>,
      ]}
    >
      <Form className="oe-media-list-add-modal-form" {...formItemLayout}>
        <OZInput label="ID" field="_id" initialValue={_.get(initialValue, '_id')} getFieldDecorator={getFieldDecorator} readOnly style={{ borderWidth: '0px' }} />
        <OZInput label="Name" field="name" initialValue={_.get(initialValue, 'name')} getFieldDecorator={getFieldDecorator} />
        <OZInput label="URL" field="data.url" initialValue={_.get(initialValue, 'data.url')} getFieldDecorator={getFieldDecorator} />
        {(type === 'StockImage' || type === 'Icon' || type === 'Logo') ? <img src={URL} alt="Upload" style={{ height: '120px' }} /> : <Player src={URL} style={{ width: '100%', margin: '10px 0' }} playsInline ref={videoPlayer} />}
      </Form>
    </Modal>
  )
}
const DetailFormModal = Form.create()(MyForm)
export default DetailFormModal
