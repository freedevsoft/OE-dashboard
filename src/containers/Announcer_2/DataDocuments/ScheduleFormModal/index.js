import React from 'react'
import PropTypes from 'prop-types'
import {
  Icon, Button, Dropdown, Menu, Form, Input, InputNumber, Row, Col, Divider, Modal,
} from 'antd'

import ScheduleForm from '../../../ScheduleForm'
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
        comp, onCancel, onUpdate, visible, title, loading,
      } = this.props
      const { getFieldDecorator } = this.props.form
      const formItemLayout = {
        layout: 'vertical',
        labelCol: {
          xs: { span: 24 },
        },
        wrapperCol: {
          sm: { span: 24 },
        },

      }

      return (
        <Modal
          visible={visible}
          title={title}
          onOk={e => this.props.onUpdate(e, this.props.form)}
          onCancel={onCancel}
          width={900}
          footer={[
            <Button key="back" onClick={onCancel}>
                        Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={e => onUpdate(e, this.props.form)}>
                        Update
            </Button>,
          ]}
        >
          <Form className="announcer-schedule-modal-form" {...formItemLayout}>
            <ScheduleForm
              data={comp.schedule}
              field="comp.schedule"
              form={this.props.form}
            />
          </Form>
        </Modal>
      )
    }
}
const GroupingScheduleFormModal = Form.create()(MyForm)
export default GroupingScheduleFormModal
