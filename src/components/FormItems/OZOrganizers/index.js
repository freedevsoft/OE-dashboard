import React, { Component } from 'react'
import { Form, Button, Icon, Row, Col } from 'antd'
import _ from 'lodash'
import DocumentTypesSelectV2 from 'containers/Selects/DocumentTypesSelectV2'

class OZOrganizers extends Component {
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
      name: '',
    })
    setFieldsValue({ [keysField]: nextKeys })
  }

  render() {
    const { label, getFieldDecorator, getFieldValue, initialValue, keysField, arrayField, validator } = this.props

    getFieldDecorator(keysField, { initialValue })
    const items = getFieldValue(keysField)
    const currentIds = items
      ? items.map((item, index) => {
          const ref = getFieldValue(`${arrayField}[${index}].ref`)

          return ref ? ref._id : ref
        })
      : []

    const formItems =
      items &&
      items.map((item, index) => {
        getFieldDecorator(`${arrayField}[${index}].ref`, { initialValue: _.get(initialValue[index], 'ref') })

        return (
          <Form.Item label={index === 0 ? label : ''} key={index} style={{ fontWeight: 'bold' }}>
            <Row gutter={16}>
              <Col span={2}>
                <Icon
                  className="dynamic-delete-button"
                  type="minus-circle"
                  style={{ fontSize: '24px', marginTop: '7px', marginLeft: '10px' }}
                  onClick={() => this.remove(index, keysField, arrayField)}
                />
              </Col>
              <Col span={12}>
                {getFieldDecorator(`${arrayField}[${index}].ref`, { initialValue: _.get(initialValue[index], 'ref') })(
                  <DocumentTypesSelectV2
                    collectionName="ConfigurationsData"
                    type="organizer-collection"
                    placeholder="Organizer Collection"
                    style={{ width: '300px', marginLeft: '1rem' }}
                    excludeIds={currentIds.slice(0, index)}
                  />,
                )}
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

export default OZOrganizers
