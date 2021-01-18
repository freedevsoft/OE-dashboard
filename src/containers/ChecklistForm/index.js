import React from 'react'
import { Checkbox, Input, Button, Row, Col, Icon } from 'antd'
import { getDepthValue } from 'utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import './index.scss'
const { TextArea } = Input

const ChecklistForm = ({
  data,
  form: { getFieldDecorator, getFieldValue, setFieldsValue },
  field,
  initialValue = {
    list: [],
  },
}) => {
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

  const add = () => {
    setFieldsValue({ [`${field}.list`]: [...list, { checked: false, name: '', text: '' }] })
  }

  return (
    <div className="checklist-form">
      {list?.map((item, index) => {
        const { checked, name, text } = item

        return (
          <div key={index} className="checklist-form-row">
            <div style={{ width: '90%', marginLeft: '20px' }}>
              <Checkbox checked={checked} onChange={e => update(index, 'checked', e.target.checked)} />
              <Input
                value={name}
                onChange={e => update(index, 'name', e.target.value)}
                style={{ width: '200px', marginLeft: '10px', marginBottom: '6px' }}
              />
              <TextArea value={text} onChange={e => update(index, 'text', e.target.value)} />
            </div>
            <Button onClick={() => remove(index)}>
              <FontAwesomeIcon icon={faTrashAlt} />
            </Button>
          </div>
        )
      })}
      <div style={{ marginTop: '30px' }}>
        <Row gutter={16} style={{ display: 'flex', justifyContent: 'center' }}>
          <Col span={12}>
            <Button type="dashed" onClick={add} style={{ width: '100%' }}>
              <Icon type="plus" /> Add another
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default ChecklistForm
