import React from 'react'
import _ from 'lodash'
import { Form, Input, InputNumber, Checkbox, TimePicker } from 'antd'
import OZSelectItem from 'components/FormItems/OZSelectItem'
import OZPageLayout from 'components/FormItems/OZPageLayout'
import moment from 'moment'
import './index.scss'

const initialItem = {
  layer: undefined,
  visible: false,
  canvas: {
    width: 1280,
    height: undefined,
    transparency: 0,

    interval: undefined,
    rate: undefined,
    desc: '',
    row: undefined,
    col: undefined,
  },
  position: {
    horizontal: undefined,
    vertical: undefined,
  },
  transition: {
    enter: undefined,
    exit: undefined,
  },
  rows: [],
}

const SingleLayerForm = ({
  data,
  form: { getFieldDecorator, getFieldValue, setFieldsValue },
  field,
  header,
  initialValue = initialItem,
  show,
  bLayout = true,
}) => {

  const initial = key => _.get(data, key) || _.get(initialValue, key)

  const register = key => {
    getFieldDecorator(`${field}.${key}`, { initialValue: initial(key) })
  }

  register('visible')
  register('canvas.width')
  register('canvas.height')
  register('canvas.transparency')
  register('canvas.interval')
  register('canvas.rate')
  register('canvas.row')
  register('canvas.col')
  register('canvas.desc')
  register('position.horizontal')
  register('position.vertical')
  register('transition.enter')
  register('transition.exit')
  register('rows')

  const interval = getFieldValue(`${field}.canvas.interval`)

  const onDatetimeChange = date => {
    setFieldsValue({
      [`${field}.canvas.interval`]: date.format(),
    })
  }

  // console.log(interval.format())

  return (
    <div className="oe-single-layer-form" style={{ display: show ? 'inherit' : 'none' }}>
      <Form.Item label="Canvas" className="primary-label">
        <div>
          <span style={{ width: '6rem', display: 'inline-block', marginLeft: '30px' }}>Show:</span>
          {getFieldDecorator(`${field}.visible`, {
            initialValue: initial('visible'),
            valuePropName: 'checked',
          })(<Checkbox />)}
        </div>
        <div>
          <span style={{ width: '6rem', display: 'inline-block', marginLeft: '30px' }}>Interval Timer:</span>
          <TimePicker
            value={interval ? moment(interval) : moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 })}
            onChange={onDatetimeChange}
            format="HH:mm:ss"
            style={{ marginRight: '10px' }}
          />
        </div>
        <div>
          <span style={{ width: '6rem', display: 'inline-block', marginLeft: '30px' }}>Carousel Rate:</span>
          {getFieldDecorator(`${field}.canvas.rate`, {
            initialValue: initial('canvas.rate'),
          })(<InputNumber min={0} max={100} />)}
        </div>
        <div>
          <span style={{ width: '6rem', display: 'inline-block', marginLeft: '30px' }}>Description:</span>
          {getFieldDecorator(`${field}.canvas.desc`, {
            initialValue: initial('canvas.desc'),
          })(<Input style={{ maxWidth: 'calc(100% - 150px)' }} />)}
        </div>
        <div>
          <span style={{ width: '6rem', display: 'inline-block', marginLeft: '30px' }}>Rows:</span>
          {getFieldDecorator(`${field}.canvas.row`, {
            initialValue: initial('canvas.row'),
          })(<InputNumber min={0} max={100} />)}
        </div>
        <div>
          <span style={{ width: '6rem', display: 'inline-block', marginLeft: '30px' }}>Columns:</span>
          {getFieldDecorator(`${field}.canvas.col`, {
            initialValue: initial('canvas.col'),
          })(<InputNumber min={0} max={100} />)}
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
      <Form.Item label="Transitions" className="primary-label">
        <div>
          <span style={{ width: '6rem', display: 'inline-block', marginLeft: '30px' }}>Enter:</span>
          <OZSelectItem
            field={`${field}.transition.enter`}
            initialValue={initial('transition.enter')}
            getFieldDecorator={getFieldDecorator}
            combines={[
              { label: 'Slow Fade', value: 'slowFade' },
              { label: 'Fast Fade', value: 'fastFade' },
              { label: 'Scroll Left', value: 'scrollLeft' },
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
          <span style={{ width: '6rem', display: 'inline-block', marginLeft: '30px' }}>Exit:</span>
          <OZSelectItem
            field={`${field}.transition.exit`}
            initialValue={initial('transition.exit')}
            getFieldDecorator={getFieldDecorator}
            combines={[
              { label: 'Slow Fade', value: 'slowFade' },
              { label: 'Fast Fade', value: 'fastFade' },
              { label: 'Scroll Left', value: 'scrollLeft' },
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

      {bLayout && (
        <Form.Item label="Layout" className="primary-label">
          <OZPageLayout
            keysField={`${field}.rows`}
            initialValue={initial('rows')}
            getFieldDecorator={getFieldDecorator}
            getFieldValue={getFieldValue}
            setFieldsValue={setFieldsValue}
            type="WebPage"
            header={header}
          />
        </Form.Item>
      )}
    </div>
  )
}

export default SingleLayerForm
