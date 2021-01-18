import React, { useState } from 'react'
import { Form, Row, Col, Button, TimePicker, InputNumber, Icon, Select } from 'antd'
import { getDepthValue, inlineStyle } from 'utils'
import { groupingQuery } from 'utils/queries'
import { useQuery } from '@apollo/react-hooks'
import moment, { duration } from 'moment'
import './index.scss'

const OffsetForm = ({
  data,
  form: { getFieldDecorator, getFieldValue, setFieldsValue },
  field,
  initialValue = {
    list: [],
    type: 'visibility',
  },
  groupIds,
}) => {
  console.log("Data::", data)
  const [layer, setLayer] = useState(0)
  const register = key => {
    getFieldDecorator(`${field}.${key}`, { initialValue: getDepthValue(data, key, initialValue[key]) })
  }
  const grouplist = [
    { __id: 'none', name: 'No Layer' },
    { __id: '1', name: 'Layer1' },
    { __id: '2', name: 'Layer2' },
    { __id: '3', name: 'Layer3' },
    { __id: '4', name: 'Layer4' },
    { __id: '5', name: 'Layer5' },
    { __id: '6', name: 'Layer6' },
    { __id: '7', name: 'Layer7' },
    { __id: '8', name: 'Layer8' },
    { __id: '9', name: 'Layer9' },
    { __id: '10', name: 'Layer10' },
  ]
  register('list')
  register('type')
  const list = getFieldValue(`${field}.list`)

  const offsetType = getFieldValue(`${field}.type`)

  const { loading, error, data: groupingQueryData } = useQuery(groupingQuery, {
    variables: {
      ids: list?.map(item => item.groupId),
    },
  })

  const update = (index, key, value) => {
    setFieldsValue({
      [`${field}.list`]: [...list.slice(0, index), { ...list[index], [key]: value }, ...list.slice(index + 1)],
    })
  }

  const removeDrag = index => {
    let clonelist = [...list]
    clonelist[0].groupId = ''
    setFieldsValue({ [`${field}.list`]: clonelist })
  }

  const remove = index => {
    setFieldsValue({ [`${field}.list`]: [...list.slice(0, index), ...list.slice(index + 1)] })
  }

  const initialDateTime = offsetType !== 'clock' ? moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }) : moment()
  const initialDurationTime = offsetType !== 'clock' ? moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }) : moment()

  return (
    <div className="oe-offset-form">
      <Form.Item label="Offset Type:" {...inlineStyle}>
        <Select className="offset-type" value={offsetType} onChange={value => setFieldsValue({ [`${field}.type`]: value })} placeholder="Operator">
          <Select.Option value="clock">Clock</Select.Option>
          <Select.Option value="visibility">Visibility</Select.Option>
          <Select.Option value="video">Video Playback</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item {...inlineStyle}>
        {list?.map((item, index) => {

          const datetime = item.datetime || initialDateTime
          const duration = item.duration || initialDurationTime
          const { groupId } = item
          const group = grouplist?.find(group => group.__id === groupId)

          const onDatetimeChange = (date, target) => {
            if (date) update(index, 'datetime', date.format())
          }
          const onDurationChange = date => {
            if (date) update(index, 'duration', date.format())
          }

          return (
            <Row gutter={16} key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
              <Icon
                type="minus-circle"
                className="dynamic-delete-button"
                style={{ fontSize: '24px', marginLeft: '10px', marginRight: '10px' }}
                onClick={() => remove(index)}
              />
              <TimePicker
                value={datetime ? moment(datetime) : initialDateTime}
                onChange={onDatetimeChange}
                format="HH:mm:ss"
                style={{ marginRight: '10px' }}
              />
              {/* <InputNumber value={duration} min={0} max={99} onChange={onDurationChange} /> */}
              <TimePicker
                value={duration ? moment(duration) : initialDurationTime}
                onChange={onDurationChange}
                format="HH:mm:ss"
                style={{ marginRight: '10px' }}
              />
              <div>
                <Select className="layer" value={group ? group.name : 'No Layer'} onChange={value => update(index, 'groupId', value)} placeholder="Operator" style={{
                  width: '150px',
                  display: 'inline-block',
                  lineHeight: '40px',
                  marginBottom: '0px',

                }}>
                  {grouplist.map(groupitem => {
                    return (<Select.Option value={groupitem.__id}>{groupitem.name}</Select.Option>)
                  })}
                </Select>
              </div>
              {/* <div
                className="zone"
                draggable
                onDrop={e => {
                  // onDropItem(e, parseInt(e.dataTransfer.getData('drag_index'), 10), dataList.length)
                  const dragIndex = parseInt(e.dataTransfer.getData('drag_index'), 10)
                  const dragName = e.dataTransfer.getData('drag_name')
                  if (dragName && !dragName.endsWith('/') && groupIds[dragIndex]) {
                    update(index, 'groupId', groupIds[dragIndex])
                  }
                }}
                onDragOver={e => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
              >
                {group ? group.name : 'Drag and Drop a Document'}
                {item && item.groupId != '' && (
                  <div className="oe-offset-form-imagebox-item-mask">
                    <button type="button" className="oe-offset-form-imagebox-item-mask-close" onClick={() => removeDrag(index)}>
                      X
                    </button>
                  </div>
                )}
              </div> */}
            </Row>
          )
        })}
        <Row gutter={16}>
          <Col span={8} offset={2}>
            <Button
              type="dashed"
              onClick={() => {
                setFieldsValue({ [`${field}.list`]: [...list, { datetime: initialDateTime.format(), text: '' }] })
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

export default OffsetForm
