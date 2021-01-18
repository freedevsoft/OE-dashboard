import React from 'react'
import _ from 'lodash'
import { Form, InputNumber, Checkbox } from 'antd'
import OZSelectItem from 'components/FormItems/OZSelectItem'
import OZPageLayout2 from 'components/FormItems/OZPageLayout2'
import './index.scss'

const initialItem = {
  layer: undefined,
  visible: false,
  canvas: {
    width: 1280,
    height: undefined,
    transparency: 0,
  },
  position: {
    horizontal: undefined,
    vertical: undefined,
  },
  rows: [],
}

const MenuForm = ({ data, form: { getFieldDecorator, getFieldValue, setFieldsValue }, field, header, initialValue = initialItem, show }) => {
  const initial = key => _.get(data, key) || _.get(initialValue, key)

  const register = key => {
    getFieldDecorator(`${field}.${key}`, { initialValue: initial(key) })
  }

  register('visible')
  register('canvas.width')
  register('canvas.height')
  register('canvas.transparency')
  register('position.horizontal')
  register('position.vertical')
  register('rows')

  return (
    <div className="oe-menu-form" style={{ display: show ? 'inherit' : 'none' }}>
      <Form.Item label="Canvas" className="primary-label">
        <div>
          <span style={{ width: '6rem', display: 'inline-block', marginLeft: '30px' }}>Show:</span>
          {getFieldDecorator(`${field}.visible`, {
            initialValue: initial('visible'),
            valuePropName: 'checked',
          })(<Checkbox />)}
        </div>
        <div>
          <span style={{ width: '6rem', display: 'inline-block', marginLeft: '30px' }}>Width:</span>
          {getFieldDecorator(`${field}.canvas.width`, {
            initialValue: initial('canvas.width'),
          })(<InputNumber min={0} max={10000} />)}
        </div>
        <div>
          <span style={{ width: '6rem', display: 'inline-block', marginLeft: '30px' }}>Height:</span>
          {getFieldDecorator(`${field}.canvas.height`, {
            initialValue: initial('canvas.height'),
          })(<InputNumber min={0} max={10000} />)}
        </div>
        <div>
          <span style={{ width: '6rem', display: 'inline-block', marginLeft: '30px' }}>Transparency:</span>
          {getFieldDecorator(`${field}.canvas.transparency`, {
            initialValue: initial('canvas.transparency'),
          })(<InputNumber min={0} max={100} />)}
        </div>
      </Form.Item>
      <Form.Item label="Position" className="primary-label">
        <div>
          <span style={{ width: '6rem', display: 'inline-block', marginLeft: '30px' }}>Horizontal:</span>
          <OZSelectItem
            field={`${field}.position.horizontal`}
            initialValue={initial('position.horizontal')}
            getFieldDecorator={getFieldDecorator}
            combines={[
              { label: 'Left', value: 'left' },
              { label: 'Right', value: 'right' },
              { label: 'Center', value: 'center' },
            ]}
            style={{
              width: '225px',
              display: 'inline-block',
              lineHeight: '40px',
              marginBottom: '0px',
            }}
          />
        </div>
        <div>
          <span style={{ width: '6rem', display: 'inline-block', marginLeft: '30px' }}>Vertical:</span>
          <OZSelectItem
            field={`${field}.position.vertical`}
            initialValue={initial('position.vertical')}
            getFieldDecorator={getFieldDecorator}
            combines={[
              { label: 'Top', value: 'top' },
              { label: 'Bottom', value: 'bottom' },
              { label: 'Middle', value: 'middle' },
            ]}
            style={{
              width: '225px',
              display: 'inline-block',
              lineHeight: '40px',
              marginBottom: '0px',
            }}
          />
        </div>
      </Form.Item>
      <Form.Item label="Layout" className="primary-label">
        <OZPageLayout2
          keysField={`${field}.rows`}
          initialValue={initial('rows')}
          getFieldDecorator={getFieldDecorator}
          getFieldValue={getFieldValue}
          setFieldsValue={setFieldsValue}
          type="WebPage"
          header={header}
        />
      </Form.Item>
    </div>
  )
}

export default MenuForm
