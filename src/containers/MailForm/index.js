import React, { useState, useEffect } from 'react'
import { Form, Radio, Col, Row, Icon, Input, Button, Select } from 'antd'
import { graphql, withApollo } from 'react-apollo'
import * as compose from 'lodash.flowright'
import * as queries from 'utils/queries'
import OZTextArea from 'components/FormItems/OZTextArea/index'
import { getDepthValue, inlineStyle } from 'utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { upsertEmailMutation, deleteEmailMutation } from 'utils/mutations'
import { useMutation } from '@apollo/react-hooks'
import OZSelectItem from 'components/FormItems/OZSelectItem/index'
import AccordionList from 'components/AccordionList/AccordionList'
import { faPencilAlt, faListUl, faBriefcase, faPaperPlane, faCloudUploadAlt, faTrashAlt, faCog } from '@fortawesome/free-solid-svg-icons'
import HTMLEditModal from 'containers/Assets/Edit/Article/Modal/html'
import './index.scss'

const MailForm = ({
  data,
  htmldata,
  form: { getFieldDecorator, getFieldValue, setFieldsValue },
  field,
  initialValue = {
    subject: '',
    list: [],
    selectedNumber: ''
  },
  _id,
  collectionName,
  maillist,
  onEmailPublish,
  header,
  groupingQuery,
  templateQuery,
}) => {
  const [bShowHTMLEditModal, setBShowHTMLEditModal] = useState(false)
  const [showList, setShowList] = useState('origin')
  const [inputValue, setInputValue] = useState('')
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0)
  const [templateCombine, setTemplateCombine] = useState([])
  const [listCombine, setListCombine] = useState([])
  const [value, setValue] = useState('')
  const register = key => {
    getFieldDecorator(`${field}.${key}`, { initialValue: getDepthValue(data, key, initialValue[key]) })
  }

  const initial = key => getDepthValue(data, key, initialValue[key])
  register('subject')
  register('to')
  register('list')
  register('selectedNumber')
  // register('template')

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

  const upsertEmailCache = (cache, { data }) => {
    const prev = cache.readQuery({
      query: groupingQuery,
      variables: {
        ids: [_id],
        collectionName,
      },
    })
    cache.writeQuery({
      query: groupingQuery,
      variables: {
        ids: [_id],
        collectionName,
      },
      data: {
        grouping: [
          {
            ...prev.grouping[0],
            emails: [...(prev.grouping[0].emails || []), inputValue],
          },
        ],
      },
    })
    setInputValue('')
  }

  const [upsertEmail, { loading: upserting, error: upsertError }] = useMutation(upsertEmailMutation, {
    update: upsertEmailCache,
  })

  const [deleteEmail, { loading: deleting, error: deleteError }] = useMutation(deleteEmailMutation)

  const add = email => {
    upsertEmail({
      variables: {
        _id,
        collectionName,
        email,
      },
    }).then(() => { })
  }

  const onRemoveGroupType = index => {
    deleteEmail({
      variables: {
        _id,
        collectionName,
        email: maillist[index],
      },
      update: cache => {
        const prev = cache.readQuery({
          query: groupingQuery,
          variables: {
            ids: [_id],
            collectionName,
          },
        })
        cache.writeQuery({
          query: groupingQuery,
          variables: {
            ids: [_id],
            collectionName,
          },
          data: {
            grouping: [
              {
                ...prev.grouping[0],
                emails: prev.grouping[0].emails?.filter(phone => phone !== maillist[index]),
              },
            ],
          },
        })
      },
    })
  }

  const onAdd = e => {
    if (e.keyCode === 13) {
      e.preventDefault()

      add(e.target.value)
    }
  }

  useEffect(() => {
    let list = []
    groupingQuery?.grouping?.map((item, index) => {
      list.push({ label: item.name, value: item.name, _id: item._id })
    })
    setListCombine(list)
  }, [groupingQuery])

  useEffect(() => {
    let template = []
    templateQuery?.grouping?.map((item, index) => {
      template.push(item.name)
      // template.push({ label: item.name, value: item.name, _id: item._id })
    })
    setTemplateCombine(template)
  }, [templateQuery])

  return (
    <div className="oe-mail-form">
      <div className="oe-mail-form-buttongroup">
        <span
          onClick={() => setShowList('origin')}
          className="oe-mail-form-buttongroup-button"
          style={{ backgroundColor: showList === 'origin' ? 'rgb(36, 45, 60)' : null }}
        >
          <FontAwesomeIcon
            icon={faPencilAlt}
            color={showList === 'origin' ? '#FFF' : 'rgba(0, 0, 0, 0.65)'}
          />
        </span>
        <span
          onClick={() => setShowList('list')}
          className="oe-mail-form-buttongroup-button"
          style={{ backgroundColor: showList === 'list' ? 'rgb(36, 45, 60)' : null }}
        >
          <FontAwesomeIcon
            icon={faListUl}
            color={showList === 'list' ? '#FFF' : 'rgba(0, 0, 0, 0.65)'}
          />
        </span>
        <span onClick={onEmailPublish} className="oe-mail-form-buttongroup-endbutton">
          <FontAwesomeIcon icon={faCloudUploadAlt} />
        </span>
        <span onClick={onEmailPublish} className="oe-mail-form-buttongroup-button">
          <FontAwesomeIcon icon={faPaperPlane} />
        </span>
        <span
          onClick={() => setShowList('workflow')}
          className="oe-mail-form-buttongroup-button"
        >
          <FontAwesomeIcon icon={faCog} />
        </span>
      </div>
      {showList == 'origin' && (
        <>
          {/* {templateCombine != undefined &&
            <OZSelectItem
              label="Template:"
              field={`${field}.template`}
              initialValue={initial('template')}
              getFieldDecorator={getFieldDecorator}
              combines={templateCombine}
              required={false} />
          } */}
          <div className="oe-mail-form-template" style={{ marginBottom: '8px' }}>
            <p>Publish:</p>
            <Select style={{ width: '75%' }} placeholder="Please select an option">
              {templateCombine?.map(groupType => (
                <Option key={groupType} value={groupType}>
                  {groupType}
                </Option>
              ))}
            </Select>
          </div>
          <div className="oe-mail-form-template">
            <p>Template:</p>
            <Select style={{ width: '75%' }} placeholder="Please select an option">
              {templateCombine?.map(groupType => (
                <Option key={groupType} value={groupType}>
                  {groupType}
                </Option>
              ))}
            </Select>
          </div>
          {listCombine != undefined && (
            <OZSelectItem
              label="To:"
              field={`${field}.to`}
              initialValue={initial('to')}
              getFieldDecorator={getFieldDecorator}
              combines={listCombine}
              required={false}
            />
          )}
          <OZTextArea
            label="Subject"
            field={`${field}.subject`}
            initialValue={initial('subject')}
            getFieldDecorator={getFieldDecorator}
            {...inlineStyle}
          />
          <div className="editable-button">
            <p>Body:</p>
            <Button type="default" icon="edit" onClick={() => setBShowHTMLEditModal(true)} />
          </div>
          {htmldata != '' && <div className="oe-mail-form-view" dangerouslySetInnerHTML={{ __html: htmldata }} />}
          {bShowHTMLEditModal && (
            <HTMLEditModal
              visible={bShowHTMLEditModal}
              onCancel={() => setBShowHTMLEditModal(false)}
              data={htmldata}
              onUpdate={newBody => {
                setFieldsValue({ 'comp.data.mail.html': newBody })
                setBShowHTMLEditModal(false)
              }}
            />
          )}
          <div className="editable-button">
            <p>Attachment:</p>
          </div>
        </>
      )}
      {showList == 'list' &&
        (
          <>
            <AccordionList
              dataList={list?.map(item => ({ name: item }))}
              selectItem={() => { }}
              selectedIndex={selectedGroupIndex}
              selectItemName={setSelectedGroupIndex}
              onItemDeleteFunc={deleteIndex => {
                setSelectedGroupIndex(deleteIndex === list?.length - 1 ? deleteIndex - 1 : deleteIndex)
                onRemoveGroupType(deleteIndex)
              }}
              bottomArea={false}
            />
            <div className="add-new">
              <input
                type="text"
                placeholder="Add new"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={onAdd}
                disabled={upserting}
              />
            </div>
          </>
        )}
      {showList == 'workflow' &&
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
      }
    </div>
  )
}
export default compose(
  graphql(queries.groupingQuery, {
    name: 'groupingQuery',
    options: ({ header }) => ({
      variables: {
        // ids: filterGroupId ? [filterGroupId] : null,
        clientId: _.get(header, 'client._id'),
        type: '/emails/lists/',
      },
      fetchPolicy: 'cache-and-network',
    }),
  }),
  graphql(queries.groupingQuery, {
    name: 'templateQuery',
    options: ({ header }) => ({
      variables: {
        // ids: filterGroupId ? [filterGroupId] : null,
        clientId: _.get(header, 'client._id'),
        type: '/emails/template/',
      },
      fetchPolicy: 'cache-and-network',
    }),
  }),
)(MailForm)
// export default MailForm
