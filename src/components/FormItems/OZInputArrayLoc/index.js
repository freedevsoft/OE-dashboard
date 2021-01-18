import React, { Component } from 'react'
import { Form, Button, Icon, Row, Col } from 'antd'
import OZInput from '../OZInput'
import { getDepthValue } from '../../../utils/index'

class OZInputArrayLoc extends Component {
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
      value: '',
    })
    setFieldsValue({ [keysField]: nextKeys })
  }

  render() {
    const { label, getFieldDecorator, getFieldValue, initialValue, keysField, arrayField, validator } = this.props

    getFieldDecorator(keysField, { initialValue })
    const items = getFieldValue(keysField)

    const formItems =
      items &&
      items.map((item, index) => {
        getFieldDecorator(`${arrayField}[${index}].value`, { initialValue: getDepthValue(initialValue[index], 'value') })

        return (
          <Form.Item label={index === 0 ? label : ''} key={index} style={{ fontWeight: 'bold' }}>
            <div style={{ display: 'flex' }}>
              <Icon
                className="dynamic-delete-button"
                type="minus-circle"
                style={{ fontSize: '24px', marginTop: '7px', marginRight: '5px', width: '50px' }}
                onClick={() => this.remove(index, keysField, arrayField)}
              />
              <div style={{ flexGrow: '1' }}>
                <OZInput
                  field={`${arrayField}[${index}].value`}
                  initialValue={getDepthValue(initialValue[index], 'value')}
                  getFieldDecorator={getFieldDecorator}
                  required={false}
                  validator={validator}
                />
              </div>
            </div>
          </Form.Item>
        )
      })

    return (
      <>
        {formItems}
        <Row gutter={16}>
          <Col span={8} offset={6}>
            <Button type="dashed" onClick={() => this.add(keysField)}>
              <Icon type="plus" />
              Add another
            </Button>
          </Col>
        </Row>
      </>
    )
  }
}

export default OZInputArrayLoc
