import React, { useState, useEffect } from 'react'
import { Form, Row, Col, Icon, Input, Button, Radio } from 'antd'
import { getDepthValue, inlineStyle } from 'utils'
import { groupingQuery } from 'utils/queries'
import { useQuery } from '@apollo/react-hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import './index.scss'

const WorkflowForm = ({
  data,
  form: { getFieldDecorator, getFieldValue, setFieldsValue },
  field,
  initialValue = {
    list: [],
    selectedNumber: ''
  },
  groupIds,
}) => {
  const [value, setValue] = useState('')
  const register = key => {
    getFieldDecorator(`${field}.${key}`, { initialValue: getDepthValue(data, key, initialValue[key]) })
  }

  register('list')
  register('selectedNumber')

  useEffect(() => {
    setValue(newValue)
  }, [])

  const list = getFieldValue(`${field}.list`)
  const newValue = getFieldValue(`${field}.selectedNumber`)

  const update = (index, key, value) => {
    setFieldsValue({
      [`${field}.list`]: [...list.slice(0, index), { ...list[index], [key]: value }, ...list.slice(index + 1)],
    })
  }

  const remove = index => {
    setFieldsValue({ [`${field}.list`]: [...list.slice(0, index), ...list.slice(index + 1)] })
  }

  const onChange = e => {
    setValue(e.target.value)
    list.map((item, index) => {

      if (index == e.target.value) {
        update(index, 'state', true)
      } else {
        update(index, 'state', false)
      }
    })
    setFieldsValue({
      [`${field}.selectedNumber`]: e.target.value + 1
    })
  };
  return (
    <div className="oe-workflow-form">
      <Form.Item {...inlineStyle}>
        <Radio.Group onChange={onChange} value={value}>
          {list?.map((item, index) => {
            const { state, name } = item
            return (
              <Row gutter={16} key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                <Radio value={index + 1}>
                  <Input
                    value={name}
                    onChange={e => update(index, 'name', e.target.value)}
                    style={{ width: '90%', marginLeft: '10px', marginBottom: '6px' }}
                  />
                  <span onClick={() => remove(index)}>
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </span>
                </Radio>
              </Row>
            )
          })}
        </Radio.Group>
        <Row gutter={16}>
          <Col span={8} offset={2}>
            <Button
              type="dashed"
              onClick={() => {
                setFieldsValue({ [`${field}.list`]: [...list, { name: '', state: false }] })
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

export default WorkflowForm
