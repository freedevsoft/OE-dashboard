import React from 'react'
import { Form, Row, Col, Icon } from 'antd'
import { groupingQuery } from 'utils/queries'
import { useQuery } from '@apollo/react-hooks'
import { getDepthValue } from 'utils'
import './index.scss'

const DocumentListForm = ({
  data,
  form: { getFieldDecorator, getFieldValue, setFieldsValue },
  field,
  initialValue = {
    users: [],
  },
  groupIds,
}) => {
  const register = key => {
    getFieldDecorator(`${field}.${key}`, { initialValue: getDepthValue(data, key, initialValue[key]) })
  }

  register('users')

  const list = getFieldValue(`${field}.users`)

  const { loading, error, data: groupingQueryData } = useQuery(groupingQuery, {
    variables: {
      ids: list,
    },
  })

  const update = (index, internal, value) => {
    setFieldsValue({ [`${field}.users`]: [...list.slice(0, index), { ...list[index], [internal]: value }, ...list.slice(index + 1)] })
  }

  const remove = index => {
    setFieldsValue({ [`${field}.users`]: [...list.slice(0, index), ...list.slice(index + 1)] })
  }

  const add = _id => {
    setFieldsValue({ [`${field}.users`]: [...list, _id] })
  }

  return (
    <div className="form-inside-groups">
      <div className="form-inside-groups-list">
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
        {loading && list?.length ? <div className="form-inside-groups-list-loading">Loading...</div> : ''}
      </div>

      <Row gutter={16}>
        <Col span={24}>
          <div
            className="form-inside-groups-dnd-container"
            draggable
            onDrop={e => {
              // onDropItem(e, parseInt(e.dataTransfer.getData('drag_index'), 10), dataList.length)
              const dragIndex = parseInt(e.dataTransfer.getData('drag_index'), 10)
              const dragName = e.dataTransfer.getData('drag_name')
              if (dragName && !dragName.endsWith('/') && groupIds[dragIndex]) {
                add(groupIds[dragIndex])
              }
            }}
            onDragOver={e => {
              e.stopPropagation()
              e.preventDefault()
            }}
          >
            Drag & Drop a User here
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default DocumentListForm
