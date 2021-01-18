import React, { Component } from 'react'
import { Form, Button, Icon, Row, Col } from 'antd'
import WidgetsSelect from 'containers/Selects/WidgetsSelect'
import TypesSelect from 'containers/Selects/TypesSelect'
import _ from 'lodash'
import LocationFormModal from './LocationFormModal'

class OZWidgets extends Component {
  static defaultProps = {
    extra: '',
    label: '',
    required: true,
  }

  constructor(props) {
    super(props)
    this.state = {
      showLocationModal: false,
      selected: 0,
    }
  }

  remove = (k, keysField, dataField) => {
    const {
      form: { getFieldValue, setFieldsValue },
    } = this.props
    const keys = getFieldValue(keysField)
    const data = getFieldValue(dataField)
    // if (keys.length === 1) {
    //   return
    // }

    keys.splice(k, 1)
    data.splice(k, 1)

    setFieldsValue({
      [keysField]: keys,
      [dataField]: data,
    })
  }

  add = keysField => {
    const {
      form: { getFieldValue, setFieldsValue },
    } = this.props
    const keys = getFieldValue(keysField)
    const nextKeys = keys.concat({
      name: 'Widget',
      data: {
        ref: null,
        value: null,
        location: {},
      },
    })
    setFieldsValue({ [keysField]: nextKeys })
  }

  render() {
    const { label, form, initialValue, keysField, arrayField } = this.props
    const { getFieldDecorator, getFieldValue } = form
    const { showLocationModal, selected } = this.state

    getFieldDecorator(keysField, { initialValue })

    const items = getFieldValue(keysField)

    const formItems = items.map((item, index) => {
      getFieldDecorator(`${arrayField}[${index}].name`, { initialValue: _.get(initialValue[index], 'name') || 'Widget' })
      getFieldDecorator(`${arrayField}[${index}].data.ref`, { initialValue: _.get(initialValue[index], 'data.ref') })
      getFieldDecorator(`${arrayField}[${index}].data.value`, { initialValue: _.get(initialValue[index], 'data.value') })

      const ref = getFieldValue(`${arrayField}[${index}].data.ref`)

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
              {getFieldDecorator(`${arrayField}[${index}].data.ref`, { initialValue: _.get(initialValue[index], 'data.ref') })(
                <WidgetsSelect labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} required={false} style={{ marginBottom: '0px' }} />,
              )}
            </Col>
            <Col span={8}>
              {_.get(ref, 'type') === 'image' &&
                getFieldDecorator(`${arrayField}[${index}].data.value`, { initialValue: _.get(initialValue[index], 'data.value') })(
                  <TypesSelect collectionName="ImagesData" type="StockImage" placeholder="Please select a StockImage" />,
                )}
              {_.get(ref, 'type') === 'audio' &&
                getFieldDecorator(`${arrayField}[${index}].data.value`, { initialValue: _.get(initialValue[index], 'data.value') })(
                  <TypesSelect collectionName="AudioosData" type="StockAudio" thumbnail={false} placeholder="Please select a StockAudio" />,
                )}
              {_.get(ref, 'type') === 'video' &&
                getFieldDecorator(`${arrayField}[${index}].data.value`, { initialValue: _.get(initialValue[index], 'data.value') })(
                  <TypesSelect collectionName="VideosData" type="StockVideo" thumbnail={false} placeholder="Please select a StockVideo" />,
                )}
              {_.get(ref, 'type') === 'map' && (
                <>
                  <Button
                    type="primary"
                    onClick={() => {
                      this.setState({ showLocationModal: true, selected: index })
                    }}
                  >
                    ...
                  </Button>
                  <LocationFormModal
                    visible={showLocationModal && selected === index}
                    title="Select Location"
                    data={getFieldValue(`${arrayField}[${index}].data.location`)}
                    field={`${arrayField}[${index}].data.location`}
                    form={form}
                    onUpdate={() => {
                      this.setState({ showLocationModal: false })
                    }}
                  />
                </>
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
              <Icon type="plus" />
              &nbsp;Add another
            </Button>
          </Col>
        </Row>
      </>
    )
  }
}

export default OZWidgets
