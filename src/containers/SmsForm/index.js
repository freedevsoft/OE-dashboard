import React, { useState, useEffect } from 'react'
import { Button, Select } from 'antd'
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
import { faPencilAlt, faListUl, faPaperPlane, faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons'
import HTMLEditModal from 'containers/Assets/Edit/Article/Modal/html'
import './index.scss'

const SmsForm = ({
  data,
  form: { getFieldDecorator, getFieldValue, setFieldsValue },
  field,
  initialValue = {
    subject: '',
  },
  _id,
  collectionName,
  list,
  onEmailPublish,
  header,
  groupingQuery,
  templateQuery,
}) => {
  const [showList, setShowList] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0)
  const [templateCombine, setTemplateCombine] = useState([])
  const [listCombine, setListCombine] = useState([])
  const register = key => {
    getFieldDecorator(`${field}.${key}`, { initialValue: getDepthValue(data, key, initialValue[key]) })
  }

  const initial = key => getDepthValue(data, key, initialValue[key])
  register('subject')
  register('to')
  // register('template')

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
        email: list[index],
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
                emails: prev.grouping[0].emails?.filter(phone => phone !== list[index]),
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
    })
    setTemplateCombine(template)
  }, [templateQuery])
  return (
    <div className="oe-sms-form">
      <div className="oe-sms-form-buttongroup">
        <span onClick={() => setShowList(false)} className="oe-sms-form-buttongroup-button">
          <FontAwesomeIcon icon={faPencilAlt} />
        </span>
        <span onClick={() => setShowList(true)} className="oe-sms-form-buttongroup-button">
          <FontAwesomeIcon icon={faListUl} />
        </span>
        <span onClick={onEmailPublish} className="oe-sms-form-buttongroup-endbutton">
          <FontAwesomeIcon icon={faCloudUploadAlt} />
        </span>
        <span onClick={onEmailPublish} className="oe-sms-form-buttongroup-button">
          <FontAwesomeIcon icon={faPaperPlane} />
        </span>
      </div>
      {!showList ? (
        <>
          <div className="oe-sms-form-template">
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
        </>
      ) : (
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
    </div>
  )
}
export default compose(
  graphql(queries.groupingQuery, {
    name: 'groupingQuery',
    options: ({ header }) => ({
      variables: {
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
        clientId: _.get(header, 'client._id'),
        type: '/emails/template/',
      },
      fetchPolicy: 'cache-and-network',
    }),
  }),
)(SmsForm)
