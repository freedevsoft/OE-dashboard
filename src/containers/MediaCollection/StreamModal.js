import React, { useEffect, useRef } from 'react'
import { Form, Modal, Button, Tag } from 'antd'
import HLSSource from 'components/HLSSource'
import OZInput from 'components/FormItems/OZInput'
import _ from 'lodash'

import { Player } from 'video-react'
import './AddModal.scss'

const renderConversionState = conversionState => {
  if (conversionState === 'COMPLETE') return <Tag color="green">Completed</Tag>
  if (conversionState === 'SUBMITTED') return <Tag color="blue">Submitted</Tag>
  if (conversionState === 'ERROR') return <Tag color="red">Error</Tag>

  return <Tag color="gold">Uploaded</Tag>
}

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
  getFieldDecorator('videoFileInput', { initialValue: _.get(initialValue, 'videoFileInput') })

  useEffect(() => {
    form.resetFields()
  }, [visible])

  const URL = getFieldValue('videoFileInput')

  const onConvert = e => {
    e.preventDefault()
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        onUpdate({ ...initialValue, ...values })
      }
    })
  }

  const videoPlayer = useRef(null)
  const hlsVideoPlayer = useRef(null)

  function onModalCancel() {
    if (videoPlayer && videoPlayer.current) {
      videoPlayer.current.pause()
    }
    if (hlsVideoPlayer && hlsVideoPlayer.current) {
      hlsVideoPlayer.current.pause()
    }
    onCancel()
  }

  return (
    <Modal
      visible={visible}
      title={title}
      onOk={onConvert}
      onCancel={onModalCancel}
      width={600}
      centered
      destroyOnClose
      footer={[
        <Button key="back" onClick={onModalCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={onConvert}>
          Save & Convert
        </Button>,
      ]}
    >
      <Form className="oe-media-list-add-modal-form" {...formItemLayout}>
        <OZInput label="ID" field="_id" initialValue={_.get(initialValue, '_id')} getFieldDecorator={getFieldDecorator} readOnly />
        <OZInput label="Name" field="name" initialValue={_.get(initialValue, 'name')} getFieldDecorator={getFieldDecorator} />
        <Form.Item label="Status">{renderConversionState(_.get(initialValue, 'conversionState'))}</Form.Item>
        <OZInput label="URL" field="videoFileInput" initialValue={_.get(initialValue, 'videoFileInput')} getFieldDecorator={getFieldDecorator} />
        {initialValue?.conversionState === 'COMPLETE' && (
          <OZInput
            label="HLS"
            field="videoFileOutput"
            initialValue={_.get(initialValue, 'videoFileOutput.hlsFile')}
            getFieldDecorator={getFieldDecorator}
            readOnly
          />
        )}
        {initialValue?.conversionState === 'COMPLETE' ? (
          <Player ref={hlsVideoPlayer}>
            <HLSSource isVideoChild src={initialValue?.videoFileOutput?.hlsFile} />
          </Player>
        ) : (
            <Player src={URL} style={{ width: '100%', margin: '10px 0' }} playsInline ref={videoPlayer} />
          )}
      </Form>
    </Modal>
  )
}
const StreamModal = Form.create()(MyForm)
export default StreamModal
