import React from 'react'
import { Form, Row, Col, Icon } from 'antd'
import { groupingQuery } from 'utils/queries'
import { useQuery } from '@apollo/react-hooks'
import { getDepthValue } from 'utils'
import './index.scss'

const AssigneeForm = ({
  data,
  form: { getFieldDecorator, getFieldValue, setFieldsValue },
  field,
  initialValue = {
    list: [],
  },
  groupIds,
  title
}) => {
  const register = key => {
    getFieldDecorator(`${field}.${key}`, { initialValue: getDepthValue(data, key, initialValue[key]) })
  }

  register('list')

  const list = getFieldValue(`${field}.list`)

  const { loading, error, data: groupingQueryData } = useQuery(groupingQuery, {
    variables: {
      ids: list,
    },
  })

  const update = (index, internal, value) => {
    setFieldsValue({ [`${field}.list`]: [...list.slice(0, index), { ...list[index], [internal]: value }, ...list.slice(index + 1)] })
  }

  const remove = index => {
    setFieldsValue({ [`${field}.list`]: [...list.slice(0, index), ...list.slice(index + 1)] })
  }

  const add = _id => {
    setFieldsValue({ [`${field}.list`]: [_id] })
  }
  return (
    <div className="form-inside-assignee">
      <p className="form-inside-assignee-title">
        {title}:
      </p>
      {list && list.length > 0 ?
        <div className="form-inside-assignee-list">
          {list?.map((_id, index) => {
            const group = groupingQueryData?.grouping?.find(group => group._id === _id)
            return (
              <Form.Item className="form-item-groups" key={index}>
                <div className="form-item-groups-inline">
                  <Icon className="dynamic-delete-button" type="minus-circle" onClick={() => remove(index)} />
                  <span>{group ? group.name : _id}</span>
                </div>
              </Form.Item>
            )
          })}
          {loading && list?.length ? <div className="form-inside-assignee-list-loading">Loading...</div> : ''}
        </div>
        :
        <div
          className="form-inside-assignee-dnd-container"
          draggable
          onDrop={e => {
            const dragIndex = parseInt(e.dataTransfer.getData('drag_index'), 10)
            const dragName = e.dataTransfer.getData('drag_name')
            if (title == 'Assignee') {
              if (dragName.endsWith('/')) {
                return false
              } else {
                add(groupIds[dragIndex])
              }
            } else {
              if (dragName && dragName.endsWith('/') && groupIds[dragIndex]) {
                add(groupIds[dragIndex])
              }
            }
          }}
          onDragOver={e => {
            e.stopPropagation()
            e.preventDefault()
          }}
        >
          Drag & Drop a Document
      </div>
      }
    </div>
  )
}

export default AssigneeForm
