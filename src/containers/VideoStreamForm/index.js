import React, { useState } from 'react'
import { Input, Tag, Select, Button, Upload, Icon, Spin, notification, Empty, Modal } from 'antd'
import { uploadFileToS3 } from 'utils/index'
import { graphql, withApollo } from 'react-apollo'
import * as compose from 'lodash.flowright'
import * as queries from 'utils/queries'
import * as mutations from 'utils/mutations'
import { Player } from 'video-react'
import _ from 'lodash'
import './index.scss'

const { Option } = Select
const { Dragger } = Upload

const collectionName = 'VideoData'
const type = 'GroupStream'

const renderConversionState = conversionState => {
  if (conversionState === 'COMPLETE') return <Tag color="green">Completed</Tag>
  if (conversionState === 'SUBMITTED') return <Tag color="blue">Submitted</Tag>
  if (conversionState === 'ERROR') return <Tag color="red">Error</Tag>

  return <Tag color="gold">Uploaded</Tag>
}

const openNotificationWithIcon = (type, message, description) => {
  notification[type]({
    message,
    description,
    placement: 'bottomRight',
  })
}

const VideoStreamForm = ({ videoDataQuery: { loading, videoData, error }, form: { setFieldsValue, getFieldValue }, field, createVideoData, updateVideoData, header }) => {
  const [newName, setNewName] = useState('')
  const [newTemplate, setNewTemplate] = useState(undefined)
  const [newUrl, setNewUrl] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState(null)

  // const update = (index, internal, value) => {
  //   setFieldsValue({ [`${field}.list`]: [...list.slice(0, index), { ...list[index], [internal]: value }, ...list.slice(index + 1)] })
  // }

  const list = getFieldValue(field)

  const addDocumentToList = _id => {
    setFieldsValue({ [field]: [...list, _id] })
  }

  const removeDocumentFromList = _id => {
    setFieldsValue({ [field]: list.filter(item => item !== _id) })
  }

  const onDagger = info => {
    const { status, name: filename } = info.file

    if (status !== 'uploading') {
      setUploading(true)
      uploadFileToS3(info.file)
        .then(url => {
          setNewUrl(url)
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => setUploading(false))
    }
  }

  const daggerProps = {
    name: 'file',
    multiple: false,
    onChange: onDagger,
    showUploadList: false,
    disabled: submitting || uploading || loading,
  }

  const addDocument = e => {
    e.preventDefault()

    setSubmitting(true)
    const newDocument = {
      name: newName,
      videoFileInput: newUrl,
      data: {},
      params: {
        thumbnails: {
          framerate: 30,
          framegap: 60,
          maxCaptures: 10,
        },
        // imageOverlays: [
        //   {
        //     layer: 1,
        //     top: 50,
        //     left: 100,
        //     startTime: '00:00:00:00',
        //     fileLocation: 's3://oz-media-convert-input/oelement_logo.png',
        //   },
        // ],
      },
    }

    createVideoData({
      variables: {
        collectionName,
        type,
        ...newDocument,
        clientId: _.get(header, 'client._id'),
      },
      update: async (proxy, { data: { createVideoData } }) => {
        try {
          // const { data } = await client.query({
          //   query: queries.videoDataQuery,
          //   variables: { collectionName, types: null, clientId: _.get(header, 'client._id') },
          // })
          // proxy.writeQuery({
          //   query: queries.videoDataQuery,
          //   variables: { collectionName, types: null, clientId: _.get(header, 'client._id') },
          //   data: { videoData: [...data.videoData, createVideoData] },
          // })
          // if (type) {
          //   const { data: typeData } = await client.query({
          //     query: queries.videoDataQuery,
          //     variables: { collectionName, types: [type], clientId: _.get(header, 'client._id') },
          //   })
          //   proxy.writeQuery({
          //     query: queries.videoDataQuery,
          //     variables: { collectionName, types: [type], clientId: _.get(header, 'client._id') },
          //     data: { videoData: [...typeData.videoData, createVideoData] },
          //   })
          // }
        } catch (error) {
          console.error(error)
        }
      },
    })
      .then(res => {
        const createVideoData = res?.data?.createVideoData
        addDocumentToList(createVideoData._id)

        return updateVideoData({
          variables: {
            _id: createVideoData._id,
            collectionName,
            type,
            ...newDocument,
            clientId: _.get(header, 'client._id'),
            initiateConversion: true,
          },
        })
      })
      .then(() => {
        openNotificationWithIcon('success', 'Created Successfully!', `${newDocument.name} is created successfully!`)
      })
      .catch(() => {
        openNotificationWithIcon('error', 'Failed to add a new one!', 'There was an error while adding.')
      })
      .finally(() => {
        setNewName('')
        setNewTemplate(undefined)
        setNewUrl(null)
        setSubmitting(false)
      })
  }

  const onSelect = document => {
    if (document) {
      setSelectedDoc(document)
      setShowModal(true)
    }
  }

  const disabled = submitting || loading

  return (
    <div className="video-streams-form">
      {showModal && (
        <Modal visible={showModal} width={700} onCancel={() => setShowModal(false)} footer="" className="video-streams-form-modal">
          <Player src={selectedDoc?.videoFileInput} style={{ width: '100%', margin: '10px 0' }} playsInline />
        </Modal>
      )}
      <ul>
        {loading && (
          <div className="loading">
            <Spin />
          </div>
        )}
        {error && <div>Something went wrong! Please refresh!</div>}
        {!loading && !error && !list?.length ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> : ''}
        {!loading &&
          !error &&
          list?.map(_id => {
            const document = videoData.find(item => item._id === _id)
            const conversionState = document?.conversionState

            return (
              <li key={_id}>
                {document && <span className="state">{renderConversionState(conversionState)}</span>}
                <div className="title" onClick={() => onSelect(document)}>
                  {document ? document.name : `${_id} (removed on admin panel)`}
                </div>
                <Button icon="delete" onClick={() => removeDocumentFromList(_id)} />
              </li>
            )
          })}
        <li>
          <span className="state" />
          <div className="title">
            <Input placeholder="Add New (edit name here)" value={newName} onChange={e => setNewName(e.target.value)} disabled={disabled} />
          </div>
        </li>
      </ul>

      <div className="actions">
        <div className="actions-template">
          <span className="label">Template: </span>
          <Select placeholder="Select a template" disabled={disabled} value={newTemplate} onChange={setNewTemplate}>
            <Option value="template1">Template 1</Option>
            <Option value="template2">Template 2</Option>
          </Select>
        </div>
        {newUrl && (
          <div style={{ width: '300px', height: 'auto', marginLeft: 'auto', marginRight: 'auto' }}>
            <Player src={newUrl} style={{ width: '100%', margin: '10px 0' }} playsInline />
          </div>
        )}
        {!newUrl && (
          <Dragger {...daggerProps}>
            {uploading ? (
              <Spin />
            ) : (
              <>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">Upload a Video</p>
              </>
            )}
          </Dragger>
        )}

        <Button type="primary" className="btn-convert" block disabled={disabled} onClick={addDocument}>
          Save & Convert
        </Button>
      </div>
    </div>
  )
}

export default compose(
  graphql(queries.videoDataQuery, {
    name: 'videoDataQuery',
    options: ({ header, form: { getFieldValue }, field }) => {
      const list = getFieldValue(field)

      return {
        variables: {
          collectionName,
          types: [type],
          clientId: _.get(header, 'client._id'),
          ids: list || [],
        },
      }
    },
  }),
  graphql(mutations.deleteMutation, { name: 'deleteMutation' }),
  graphql(mutations.createVideoData, { name: 'createVideoData' }),
  graphql(mutations.updateVideoData, { name: 'updateVideoData' }),
  withApollo,
)(VideoStreamForm)
