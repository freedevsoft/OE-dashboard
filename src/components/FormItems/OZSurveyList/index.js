import React, { Component } from 'react'
import { Form, Button, Icon, Row, Col } from 'antd'

import { getDepthValue } from 'utils'
import OZInput from '../OZInput'

class OZSurveyList extends Component {
  static defaultProps = {
    extra: '',
    label: '',
    required: true,
  }

  remove = (k, keysField, dataField) => {
    const { getFieldValue, setFieldsValue } = this.props
    const keys = getFieldValue(keysField)
    const data = getFieldValue(dataField)

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
      name: null,
      iconURL: null,
      label: null,
      url: null,
      token: null,
    })
    setFieldsValue({ [keysField]: nextKeys })
  }

  render() {
    const { label, getFieldDecorator, getFieldValue, initialValue, keysField, arrayField } = this.props

    getFieldDecorator(keysField, { initialValue })
    const items = getFieldValue(keysField)

    const formItems = items.map((item, index) => {
      getFieldDecorator(`${arrayField}[${index}].name`, { initialValue: getDepthValue(initialValue[index], 'name') })
      getFieldDecorator(`${arrayField}[${index}].desc`, { initialValue: getDepthValue(initialValue[index], 'desc') })

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
            <Col span={4}>
              <OZInput
                field={`${arrayField}[${index}].name`}
                initialValue={getDepthValue(initialValue[index], 'name')}
                getFieldDecorator={getFieldDecorator}
                placeholder="Name"
                required={false}
                style={{ marginBottom: '0px' }}
              />
            </Col>
            <Col span={10}>
              <OZInput
                field={`${arrayField}[${index}].desc`}
                initialValue={getDepthValue(initialValue[index], 'desc')}
                getFieldDecorator={getFieldDecorator}
                placeholder="Description"
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

export default OZSurveyList
