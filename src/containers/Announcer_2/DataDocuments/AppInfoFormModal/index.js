import React from 'react'
import PropTypes from 'prop-types'
import {
  Icon, Button, Dropdown, Menu, Form, Input, InputNumber, Row, Col, Divider, Modal,
} from 'antd'

import GroupingSettingsFormModalInnerPresentation from './Inner/presentation'
import GroupingSettingsFormModalInnerMajorMinor from './Inner/majorminor'
import GroupingSettingsFormModalInnerIcon from './Inner/icon'
import GroupingSettingsFormModalInnerNotification from './Inner/notification'

import './index.scss'

class MyForm extends React.Component {
    static defaultProps = {
      loading: false,
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.currentKey != nextProps.currentKey) {
        nextProps.form.resetFields()
      }
    }

    render() {
      const {
        style, comp, onCancel, onUpdate, visible, title, loading, _id,
      } = this.props
      const { getFieldDecorator } = this.props.form

      return (
        <Modal
          visible={visible}
          title={title}
          onOk={e => this.props.onUpdate(e, this.props.form)}
          onCancel={onCancel}
          width={800}
          footer={[
            <Button key="back" onClick={onCancel}>
                        Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={e => onUpdate(e, this.props.form)}>
                        Update
            </Button>,
          ]}
        >
          <Form className="announcer-info-modal-form">
            <GroupingSettingsFormModalInnerNotification
              data={comp && comp.notification ? comp.notification : ''}
              field="comp.notification"
              form={this.props.form}
            />
            <GroupingSettingsFormModalInnerIcon
              data={comp && comp.iconURL ? comp.iconURL : undefined}
              field="comp.iconURL"
              form={this.props.form}
            />
            <GroupingSettingsFormModalInnerPresentation
              data={comp && comp.presentation ? comp.presentation : {}}
              field="comp.presentation"
              form={this.props.form}
            />
            <GroupingSettingsFormModalInnerMajorMinor
              data={comp && comp.majorMinor ? comp.majorMinor : {}}
              field="comp.majorMinor"
              form={this.props.form}
            />
          </Form>
        </Modal>
      )
    }
}
const AppInfoFormModal = Form.create()(MyForm)
export default AppInfoFormModal
