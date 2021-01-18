import React from 'react'
import { Form, Checkbox, Row, Col, Button, DatePicker, TimePicker, Input, Icon } from 'antd'
import OZTextArea from 'components/FormItems/OZTextArea'
import TypesSelect from 'containers/Selects/TypesSelect'
import OZInput from 'components/FormItems/OZInput/index'
import { getDepthValue, inlineStyle } from 'utils'
import moment from 'moment'
import './index.scss'

const ReminderForm = ({
  data,
  form: { getFieldDecorator, getFieldValue, setFieldsValue },
  field,
  initialValue = {
    timelines: [],
  },
}) => {
  const register = key => {
    getFieldDecorator(`${field}.${key}`, { initialValue: getDepthValue(data, key, initialValue[key]) })
  }

  const initial = key => getDepthValue(data, key, initialValue[key])

  register('timelines')
  register('call')

  const checkboxStyle = {
    // display: 'block',
    marginLeft: '20px',
  }


  const timelines = getFieldValue(`${field}.timelines`)

  return (
    <div className="oe-contact-form">
      <Form.Item label="Method" {...inlineStyle}>
        {getFieldDecorator(`${field}.bSMS`, {
          initialValue: initial('bSMS'),
          valuePropName: 'checked',
        })(<Checkbox style={checkboxStyle}>SMS/Text</Checkbox>)}
        <br />
        {getFieldDecorator(`${field}.bCall`, {
          initialValue: initial('bCall'),
          valuePropName: 'checked',
        })(<Checkbox style={checkboxStyle}>Call</Checkbox>)}
        {getFieldValue(`${field}.bCall`) && (
          <OZInput field={`${field}.call`} initialValue={initial('call')} getFieldDecorator={getFieldDecorator} style={{ width: '400px', display: 'inline-block', marginLeft: '20px' }} />
        )}
      </Form.Item>
      <Form.Item label="List of reminders" {...inlineStyle}>
        {timelines.map((item, index) => {
          const datetime = item.datetime || moment.utc().format()
          const { text } = item

          const onDatetimeChange = date => {
            setFieldsValue({
              [`${field}.timelines`]: [...timelines.slice(0, index), { ...timelines[index], datetime: date.utc().format() }, ...timelines.slice(index + 1)],
            })
          }
          const onTextChange = event => {
            setFieldsValue({
              [`${field}.timelines`]: [...timelines.slice(0, index), { ...timelines[index], text: event.target.value }, ...timelines.slice(index + 1)],
            })
          }

          return (
            <Row gutter={16} key={index}>
              {/* <Col span={2}> */}
              <Icon type="minus-circle" className="dynamic-delete-button" style={{ fontSize: '24px', marginTop: '7px', marginLeft: '10px' }} onClick={() => { }} />
              {/* </Col>
              <Col span={8}> */}
              <DatePicker value={datetime ? moment.utc(datetime).local() : moment()} onChange={onDatetimeChange} style={{ marginLeft: '10px', marginRight: '10px' }} />
              <TimePicker value={datetime ? moment.utc(datetime).local() : moment()} onChange={onDatetimeChange} format="HH:mm" style={{ marginRight: '10px' }} />
              <Input value={text} onChange={onTextChange} style={{ width: '310px', marginLeft: '45px' }} />
              {/* </Col> */}
            </Row>
          )
        })}
        <Row gutter={16}>
          <Col span={8} offset={2}>
            <Button
              type="dashed"
              onClick={() => {
                setFieldsValue({ [`${field}.timelines`]: [...timelines, { datetime: moment.utc().format(), text: '' }] })
              }}
            >
              <Icon type="plus-circle" />
              Add another
            </Button>
          </Col>
        </Row>
      </Form.Item>
    </div>
  )
}

export default ReminderForm
