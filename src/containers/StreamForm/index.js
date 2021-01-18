import React, { useState } from 'react'
import { Checkbox, Input, Button, Row, Col, Icon } from 'antd'
import { getDepthValue } from 'utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import './index.scss'
const { TextArea } = Input

const StreamForm = ({
  data,
  form: { getFieldDecorator, getFieldValue, setFieldsValue },
  field,
  initialValue = {
    list: [],
  },
}) => {
  const [inputValue, setInputValue] = useState('')
  const register = key => {
    getFieldDecorator(`${field}.${key}`, { initialValue: getDepthValue(data, key, initialValue[key]) })
  }

  register('list')

  const list = getFieldValue(`${field}.list`)

  const update = (index, internal, value) => {
    setFieldsValue({ [`${field}.list`]: [...list.slice(0, index), { ...list[index], [internal]: value }, ...list.slice(index + 1)] })
  }

  const remove = index => {
    setFieldsValue({ [`${field}.list`]: [...list.slice(0, index), ...list.slice(index + 1)] })
  }

  const add = (value) => {
    setFieldsValue({ [`${field}.list`]: [...list, { text: value, timestamp: '' }] })
  }

  const onAdd = e => {
    if (e.keyCode === 13) {
      e.preventDefault()
      add(e.target.value)
      setInputValue('')
    }
  }

  return (
    <div className="stream-form">
      {list?.map((item, index) => {
        const { timestamp, text } = item

        return (
          <div key={index} className="stream-form-row">
            <div className="stream-form-inline">
              <Icon className="dynamic-delete-button" type="minus-circle" onClick={() => remove(index)} />
              <TextArea value={text} onChange={e => update(index, 'text', e.target.value)} className="stream-form-inline-textarea" />
              <Input
                className="stream-form-inline-timestamp"
                placeholder="timestamp"
                value={timestamp}
                onChange={e => update(index, 'timestamp', e.target.value)}
                style={{ width: '200px', marginLeft: '10px', marginBottom: '6px' }}
              />
            </div>
            {/* <div style={{ width: '90%', marginLeft: '20px' }}>
              <Checkbox checked={checked} onChange={e => update(index, 'checked', e.target.checked)} />
            </div>
            <Button onClick={() => remove(index)}>
              <FontAwesomeIcon icon={faTrashAlt} />
            </Button> */}
          </div>
        )
      })}
      <div style={{ marginTop: '30px' }}>
        <div className="add-new">
          <input
            type="text"
            placeholder="Add New Scroll Text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={onAdd}
          // disabled={upserting}
          />
        </div>
      </div>
    </div>
  )
}

export default StreamForm
