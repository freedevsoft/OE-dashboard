import React from 'react'
import { Form, Row, Col, Icon, Input, Button } from 'antd'
import { groupingQuery } from 'utils/queries'
import { useQuery } from '@apollo/react-hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { getDepthValue } from 'utils'

import './index.scss'
import { forEach } from 'lodash'

const SetForm = ({
  data,
  form: { getFieldDecorator, getFieldValue, setFieldsValue },
  field,
  initialValue = {
    list: [],
  },
  groupIds,
}) => {
  const register = key => {
    getFieldDecorator(`${field}.${key}`, { initialValue: getDepthValue(data, key, initialValue[key]) })
  }

  register('list')

  const list = getFieldValue(`${field}.list`)

  const { loading, error, data: groupingQueryData } = useQuery(groupingQuery, {
    variables: {
      ids: list?.map(item => item.iconURL.find(icon => { return icon })),
    },
  })

  const update = (index, internal, value) => {
    setFieldsValue({ [`${field}.list`]: [...list.slice(0, index), { ...list[index], [internal]: value }, ...list.slice(index + 1)] })
  }

  const removeItem = index => {
    setFieldsValue({ [`${field}.list`]: [...list.slice(0, index), ...list.slice(index + 1)] })
  }

  const remove = (index, _id) => {
    let clonelist = list[index].iconURL
    list[index].iconURL = clonelist.filter(function (list) {
      return list != _id
    })
    setFieldsValue({ [`${field}.list`]: [...list] })
  }

  const add = (index, _id) => {
    let clonesublist = list[index].iconURL
    // let clonelist = [...list]
    for (let i = 0; i < list.length; i++) {
      if (list[i].iconURL.includes(_id)) {
        return false
      }
    }
    clonesublist.push(_id)
    setFieldsValue({ [`${field}.list`]: [...list] })
  }
  const addItem = () => {
    setFieldsValue({ [`${field}.list`]: [...list, { name: '', iconURL: [] }] })
  }
  return (
    <div className="form-inside-set">
      <div className="form-inside-set-list">
        {list?.map((_id, index) => {
          const { name } = _id
          return (
            <Form.Item className="form-item-groups" key={index}>
              <div className="form-item-groups-inline">
                <span onClick={() => removeItem(index)}>
                  <FontAwesomeIcon icon={faTrashAlt} />
                </span>
              </div>
              <div className="form-item-groups-body">
                <Input
                  value={name}
                  placeholder="Name"
                  onChange={e => update(index, 'name', e.target.value)}
                  style={{ width: '100%', marginBottom: '6px' }}
                />
                {list[index] && list[index].iconURL?.map((item, subindex) => {
                  const group = groupingQueryData?.grouping?.find(group => group._id === item)
                  return (
                    <div className="form-subitem-groups-inline" key={subindex}>
                      <Icon className="dynamic-delete-button" type="minus-circle" onClick={() => remove(index, item)} />
                      <span>{group ? group.name : item}</span>
                    </div>
                  )
                })}
                <div
                  className="form-inside-set-dnd-container"
                  draggable
                  onDrop={e => {
                    // onDropItem(e, parseInt(e.dataTransfer.getData('drag_index'), 10), dataList.length)
                    const dragIndex = parseInt(e.dataTransfer.getData('drag_index'), 10)
                    const dragName = e.dataTransfer.getData('drag_name')
                    if (dragName && !dragName.endsWith('/') && groupIds[dragIndex]) {
                      add(index, groupIds[dragIndex])
                    }
                  }}
                  onDragOver={e => {
                    e.stopPropagation()
                    e.preventDefault()
                  }}
                >
                  Drag & Drop a Document
                </div>
              </div>
            </Form.Item>
          )
        })}
        {/* {loading && list?.length ? <div className="form-inside-set-list-loading">Loading...</div> : ''} */}

      </div>


      <div style={{ marginTop: '30px' }}>
        <Row gutter={16} style={{ display: 'flex', justifyContent: 'center' }}>
          <Col span={12}>
            <Button type="dashed" onClick={addItem} style={{ width: '100%' }}>
              <Icon type="plus" /> Add another
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default SetForm
