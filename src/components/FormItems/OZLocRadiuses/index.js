import React, { Component } from 'react'
import { Form, Button, Icon, Row, Col } from 'antd'
import _ from 'lodash'
import OZInputNumber from '../OZInputNumber'

class OZLocRadiuses extends Component {
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
    const { getFieldValue, setFieldsValue, defaultValue } = this.props
    const keys = getFieldValue(keysField)
    const nextKeys = keys.concat({
      lat: defaultValue.lat,
      lng: defaultValue.lng,
      radius: 10,
    })
    setFieldsValue({ [keysField]: nextKeys })
  }

  render() {
    const { label, getFieldDecorator, getFieldValue, initialValue, keysField, arrayField, goToPosition } = this.props

    const items = getFieldValue(keysField)

    const zoneStyle = {
      color: 'black',
      textDecoration: 'underline',
    }

    const formItems =
      items &&
      items.map((item, index) => {
        return (
          <Form.Item label={index === 0 ? label : ''} key={index} style={{ fontWeight: 'bold' }}>
            <Row gutter={0} style={{ marginBottom: '0px', lineHeight: '32px' }}>
              <Col span={3}>
                <Icon
                  className="dynamic-delete-button"
                  type="minus-circle"
                  style={{ fontSize: '24px', marginTop: '7px', marginRight: '10px', float: 'right' }}
                  onClick={() => this.remove(index, keysField, arrayField)}
                />
              </Col>
              <Col span={6}>
                <OZInputNumber
                  field={`${arrayField}[${index}].lat`}
                  initialValue={_.get(initialValue[index], 'lat') || item.lat}
                  min={-180}
                  max={180}
                  getFieldDecorator={getFieldDecorator}
                  required={false}
                  inputStyle={{ width: '100%' }}
                />
              </Col>
              <Col span={6}>
                <OZInputNumber
                  field={`${arrayField}[${index}].lng`}
                  initialValue={_.get(initialValue[index], 'lng') || item.lng}
                  min={-180}
                  max={180}
                  getFieldDecorator={getFieldDecorator}
                  required={false}
                  inputStyle={{ width: '100%' }}
                />
              </Col>
              <Col span={6}>
                <OZInputNumber
                  field={`${arrayField}[${index}].radius`}
                  initialValue={_.get(initialValue[index], 'radius') || item.radius}
                  min={0}
                  max={10000}
                  getFieldDecorator={getFieldDecorator}
                  required={false}
                  inputStyle={{ width: '100%' }}
                />
              </Col>
              <Col span={3}>
                <Button
                  style={{ padding: '0 12px', marginTop: '4px' }}
                  type="primary"
                  onClick={() => goToPosition({ lat: getFieldValue(`${arrayField}[${index}].lat`), lng: getFieldValue(`${arrayField}[${index}].lng`) })}
                >
                  Go
                </Button>
              </Col>
            </Row>
          </Form.Item>
        )
      })

    return (
      <>
        <Row style={{ marginBottom: '8px' }}>
          <Col span={3} align="right" style={{ ...zoneStyle, padding: '0px 8px' }}>
            {/* Coordinates: */}
          </Col>
          <Col span={6} align="center" style={zoneStyle}>
            Latitude
          </Col>
          <Col span={6} align="center" style={zoneStyle}>
            Longitude
          </Col>
          <Col span={6} align="center" style={zoneStyle}>
            Radius
          </Col>
        </Row>
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

export default OZLocRadiuses
