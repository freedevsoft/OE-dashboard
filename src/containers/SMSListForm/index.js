import React, { useState } from 'react'
import { groupingQuery } from 'utils/queries'
import { upsertPhoneNumberMutation, deletePhoneNumberMutation } from 'utils/mutations'
import { useMutation } from '@apollo/react-hooks'
import AccordionList from 'components/AccordionList/AccordionList'
import './index.scss'

const SMSListForm = ({ _id, collectionName, list }) => {
  const [inputValue, setInputValue] = useState('')
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0)

  const upsertPhoneNumberCache = (cache, { data }) => {
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
            phoneNumbers: [...(prev.grouping[0].phoneNumbers || []), inputValue],
          },
        ],
      },
    })
    setInputValue('')
  }

  const [upsertPhoneNumber, { loading: upserting, error: upsertError }] = useMutation(upsertPhoneNumberMutation, {
    update: upsertPhoneNumberCache,
  })

  const [deletePhoneNumber, { loading: deleting, error: deleteError }] = useMutation(deletePhoneNumberMutation)

  const add = phoneNumber => {
    upsertPhoneNumber({
      variables: {
        _id,
        collectionName,
        phoneNumber,
      },
    }).then(() => {})
  }

  const onRemoveGroupType = index => {
    deletePhoneNumber({
      variables: {
        _id,
        collectionName,
        phoneNumber: list[index],
      },
      update: cache => {
        const prev = cache.readQuery({
          query: groupingQuery,
          variables: {
            ids: [_id],
            collectionName,
          },
        })
        // const newComment = data?.upsertComment
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
                phoneNumbers: prev.grouping[0].phoneNumbers?.filter(phone => phone !== list[index]),
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
    <div className="sms-list-form">
      <AccordionList
        dataList={list?.map(item => ({ name: item }))}
        selectItem={() => {}}
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

export default SMSListForm
