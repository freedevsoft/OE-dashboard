import React, { useState } from 'react'
import { upsertEmailMutation, deleteEmailMutation } from 'utils/mutations'
import { useMutation } from '@apollo/react-hooks'
import AccordionList from 'components/AccordionList/AccordionList'
import './index.scss'

const EmailListForm = ({ _id, collectionName, list }) => {
  const [inputValue, setInputValue] = useState('')
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0)
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

  return (
    <div className="email-list-form">
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
    </div>
  )
}



export default EmailListForm
