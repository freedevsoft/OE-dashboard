import React from 'react'
import { Checkbox, Input, Button, Row, Col, Icon, Form } from 'antd'
import { getDepthValue } from 'utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { groupingQuery } from 'utils/queries'
import { useQuery } from '@apollo/react-hooks'
import './index.scss'

const { TextArea } = Input

const QuizForm = ({
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
      ids: list?.map(item => item.groupId),
    },
  })
  // const { loading, error, data: groupingQueryData } = useQuery(groupingQuery, {
  //   variables: {
  //     ids: list,
  //   },
  // })
  const update = (index, internal, value) => {
    setFieldsValue({ [`${field}.list`]: [...list.slice(0, index), { ...list[index], [internal]: value }, ...list.slice(index + 1)] })
  }

  const remove = index => {
    setFieldsValue({ [`${field}.list`]: [...list.slice(0, index), ...list.slice(index + 1)] })
  }
  const removeDrag = index => {
    let clonelist = [...list]
    clonelist[0].groupId = ''
    setFieldsValue({ [`${field}.list`]: clonelist })
  }
  const add = () => {
    setFieldsValue({ [`${field}.list`]: [...list, { checked: false, name: '', text: '' }] })
  }
  return (
    <div className="quiz-form">
      {list?.map((item, index) => {
        const { checked, name, text, groupId } = item
        const group = groupingQueryData?.grouping?.find(group => group._id === groupId)
        return (
          <div key={index} className="quiz-form-row">
            <div style={{ width: '90%', marginLeft: '20px', position: 'relative' }}>
              <Checkbox checked={checked} onChange={e => update(index, 'checked', e.target.checked)} />
              <Input
                value={name}
                onChange={e => update(index, 'name', e.target.value)}
                style={{ width: '200px', marginLeft: '10px', marginBottom: '6px' }}
              />
              <TextArea value={text} onChange={e => update(index, 'text', e.target.value)} />
              {item && item.groupId != undefined && item.groupId != '' ? (
                <div className="quiz-form-inside-list">
                  <Form.Item className="form-item-groups" key={index}>
                    <div className="form-item-groups-inline">
                      <Icon className="dynamic-delete-button" type="minus-circle" onClick={() => removeDrag(index)} />
                      <span>{group ? group.name : groupId}</span>
                    </div>
                  </Form.Item>
                  {loading && list?.length ? <div className="quiz-form-inside-list-loading">Loading...</div> : ''}
                </div>
              ) : (
                  <div
                    className="quiz-form-inside-dnd-container"
                    draggable
                    onDrop={e => {
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
                    Drag & Drop a Document
                  </div>
                )}
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
                {item && item.groupId != undefined &&
                  <div className="quiz-form-row-imagebox-item-mask">
                    <button type="button" className="quiz-form-row-imagebox-item-mask-close" onClick={() => removeDrag(index)}>
                      X
                    </button>
                  </div>
                }
              </div> */}
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

export default QuizForm
