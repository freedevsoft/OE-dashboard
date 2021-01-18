import React, { Component } from 'react'
import { Form, Button, Icon, Row, Col } from 'antd'

import { getDepthValue } from 'utils'
import TypesSelect from 'containers/Selects/TypesSelect'
import OZInput from '../OZInput'
import OZTextArea from '../OZTextArea'
import OZSelectItem from '../OZSelectItem'

import './index.scss'

class OZWebLinks extends Component {
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
      type: null,
      url: null,
      icon: null,
    })
    setFieldsValue({ [keysField]: nextKeys })
  }

  render() {
    const { label, getFieldDecorator, getFieldValue, initialValue, keysField, arrayField } = this.props

    getFieldDecorator(keysField, { initialValue })
    const items = getFieldValue(keysField)

    const formItems = items.map((item, index) => {
      getFieldDecorator(`${arrayField}[${index}].name`, { initialValue: getDepthValue(initialValue[index], 'name') })
      getFieldDecorator(`${arrayField}[${index}].type`, { initialValue: getDepthValue(initialValue[index], 'type') })
      getFieldDecorator(`${arrayField}[${index}].url`, { initialValue: getDepthValue(initialValue[index], 'url') })
      getFieldDecorator(`${arrayField}[${index}].icon`, { initialValue: getDepthValue(initialValue[index], 'icon') })

      return (
        <Form.Item className="form-item-oz-links" label={index === 0 ? label : ''} key={index}>
          <div className="form-item-oz-links-inline">
            <Icon className="dynamic-delete-button" type="minus-circle" onClick={() => this.remove(index, keysField, arrayField)} />
            <div className="form-item-oz-links-inline-pickers">
              <OZSelectItem
                field={`${arrayField}[${index}].type`}
                initialValue={getDepthValue(initialValue[index], 'type')}
                getFieldDecorator={getFieldDecorator}
                combines={[
                  { value: 'Web', label: 'Web' },
                  { value: 'Share', label: 'Share' },
                ]}
                labelCol={{ span: 0 }}
                wrapperCol={{ span: 24 }}
                placeholder="Link Type"
                style={{ width: '50%', paddingRight: '10px' }}
              />
              {getFieldDecorator(`${arrayField}[${index}].icon`, { initialValue: getDepthValue(initialValue[index], 'icon') })(
                <TypesSelect collectionName="ImagesData" type="LinkIcon" placeholder="Select an Icon" style={{ width: '50%' }} />,
              )}
              <OZTextArea field={`${arrayField}[${index}].name`} initialValue={getDepthValue(initialValue[index], 'name')} getFieldDecorator={getFieldDecorator} placeholder="Enter Display Text" />

              <OZTextArea field={`${arrayField}[${index}].url`} initialValue={getDepthValue(initialValue[index], 'url')} getFieldDecorator={getFieldDecorator} placeholder="Enter URL" />
            </div>
          </div>
        </Form.Item>
      )
    })

    return (
      <>
        {formItems}
        <Row gutter={16}>
          <Col span={8}>
            <Button type="dashed" onClick={() => this.add(keysField)}>
              <Icon type="plus" /> Add another
            </Button>
          </Col>
        </Row>
      </>
    )
  }
}

export default OZWebLinks
