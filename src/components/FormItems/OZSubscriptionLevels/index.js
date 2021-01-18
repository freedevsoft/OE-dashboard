import React, { Component } from 'react'
import { Form, Button, Icon, Row, Col } from 'antd'
import { getDepthValue } from 'utils/index'
import WidgetsSelect from 'containers/Selects/WidgetsSelect'
import OZInput from '../OZInput'

class OZSubscriptionLevels extends Component {
  static defaultProps = {
    extra: '',
    label: '',
    required: true,
  }

  remove = (k, keysField, dataField) => {
    const { getFieldValue, setFieldsValue } = this.props
    const keys = getFieldValue(keysField)
    const data = getFieldValue(dataField)
    if (keys.length === 1) {
      return
    }

    keys.splice(k, 1)
    data.splice(k, 1)

    setFieldsValue({
      [keysField]: keys,
      [dataField]: data,
    })
  }

  add = keysField => {
    const { getFieldValue, setFieldsValue } = this.props
    const keys = getFieldValue(keysField)
    const nextKeys = keys.concat({
      name: 'Widget',
      data: {
        type: null,
        value: null,
      },
    })
    setFieldsValue({ [keysField]: nextKeys })
  }

  render() {
    const { label, getFieldDecorator, getFieldValue, initialValue, keysField, arrayField } = this.props

    getFieldDecorator(keysField, { initialValue })
    const items = getFieldValue(keysField)

    const formItems = items.map((item, index) => {
      getFieldDecorator(`${arrayField}[${index}].name`, { initialValue: getDepthValue(initialValue[index], 'name', 'Widget') })
      getFieldDecorator(`${arrayField}[${index}].data.ref`, { initialValue: getDepthValue(initialValue[index], 'data.ref') })
      getFieldDecorator(`${arrayField}[${index}].data.value`, { initialValue: getDepthValue(initialValue[index], 'data.value') })

      return (
        <Form.Item label={index === 0 ? label : ''} key={index} style={{ marginBottom: '10px' }}>
          <Row gutter={16}>
            <Col span={2}>
              <Icon
                className="dynamic-delete-button"
                type="minus-circle"
                style={{ fontSize: '24px', marginTop: '7px', marginLeft: '10px' }}
                onClick={() => this.remove(index, keysField, arrayField)}
              />
            </Col>
            <Col span={8}>
              {getFieldDecorator(`${arrayField}[${index}].data.ref`, { initialValue: getDepthValue(initialValue[index], 'data.ref') })(
                <WidgetsSelect onChange={this.selectComponent} labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} required={false} style={{ marginBottom: '0px' }} />,
              )}
            </Col>
            <Col span={8}>
              <OZInput
                field={`${arrayField}[${index}].data.value`}
                initialValue={getDepthValue(initialValue[index], 'data.value')}
                getFieldDecorator={getFieldDecorator}
                placeholder="Value"
                required={false}
                style={{ marginBottom: '0px' }}
              />
            </Col>
          </Row>
        </Form.Item>
      )
    })

    return (
      <>
        {formItems}
        <Row gutter={16}>
          <Col span={8} offset={2}>
            <Button type="dashed" onClick={() => this.add(keysField)}>
              <Icon type="plus" /> Add another
            </Button>
          </Col>
        </Row>
      </>
    )
  }
}

export default OZSubscriptionLevels
