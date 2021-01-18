import React from 'react'
import { Button, Form, Modal } from 'antd'

import { getDepthValue } from 'utils/index'
import PresentationForm from 'containers/PresentationForm'

import GroupingSettingsFormModalInnerMajorMinor from './Inner/majorminor'
import GroupingSettingsFormModalInnerIcon from './Inner/icon'
import GroupingSettingsFormModalInnerNotification from './Inner/notification'

import './index.scss'

class MyForm extends React.Component {
  static defaultProps = {
    loading: false,
  }

  componentWillReceiveProps(nextProps) {
    const { currentKey } = this.props
    if (currentKey !== nextProps.currentKey) {
      nextProps.form.resetFields()
    }
  }

  render() {
    const {
      comp, onCancel, onUpdate, visible, title, form,
    } = this.props

    return (
      <Modal
        visible={visible}
        title={title}
        onOk={e => onUpdate(e, form)}
        onCancel={onCancel}
        width={800}
        footer={[
          <Button key="back" onClick={onCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={e => onUpdate(e, form)}>
            Update
          </Button>,
        ]}
      >
        <Form className="grouping-settings-modal-form">
          <GroupingSettingsFormModalInnerNotification
            data={getDepthValue(comp, 'notification', '')}
            field="comp.notification"
            form={form}
          />
          <GroupingSettingsFormModalInnerIcon
            data={getDepthValue(comp, 'iconURL')}
            field="comp.iconURL"
            form={form}
          />
          <PresentationForm
            data={getDepthValue(comp, 'presentationMode', {})}
            field="comp.presentationMode"
            form={form}
          />
          <GroupingSettingsFormModalInnerMajorMinor
            data={getDepthValue(comp, 'majorMinor', {})}
            field="comp.majorMinor"
            form={form}
          />

        </Form>
      </Modal>
    )
  }
}
const GroupingSettingsFormModal = Form.create()(MyForm)
export default GroupingSettingsFormModal
