import React, { useEffect } from 'react'
import { Button, Drawer, Form } from 'antd'
import _ from 'lodash'

import Default from './Default'
import './index.scss'

const MyForm = ({ visible, initialValue, onApply, onCancel, currentKey, form }) => {
  useEffect(() => {
    form.resetFields()
  }, [currentKey])

  const onOk = () => {
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        onApply(values)
        onCancel()
      }
    })
  }

  const cellType = _.get(initialValue, 'cellType')
  const info = _.get(initialValue, `${cellType}`) || {}

  const params = {
    info,
    form,
    currentKey,
  }

  return (
    <Drawer
      title={`Edit ${cellType}`}
      width={650}
      placement="left"
      onClose={onCancel}
      visible={visible}
      bodyStyle={{ padding: '0px 10px', height: 'calc(100% - 110px)', overflowY: 'auto' }}
    >
      <Form className="oe-page-layout-detail-modal-form">
        <Default {...params} />
        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
          }}
        >
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button onClick={onOk} type="primary">
            Apply
          </Button>
        </div>
      </Form>
    </Drawer>
  )
}

const DetailModal = Form.create()(MyForm)
export default DetailModal
