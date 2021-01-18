import React, { useState } from 'react'
import { Tag, notification } from 'antd'
import { graphql, withApollo } from 'react-apollo'
import * as compose from 'lodash.flowright'
import * as queries from 'utils/queries'
import * as mutations from 'utils/mutations'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { uploadToS3UsingPresignedUrl, openNotification } from 'utils/index'
import _ from 'lodash'
import StreamAddModal from './Stream/AddModal'
import StreamsPanel from './StreamsPanel'
import StreamModal from './StreamModal'

const collectionName = 'VideoData'

const openNotificationWithIcon = (type, message, description) => {
  notification[type]({
    message,
    description,
    placement: 'bottomRight',
  })
}

const renderConversionState = conversionState => {
  if (conversionState === 'COMPLETE') return <Tag color="green">Completed</Tag>
  if (conversionState === 'SUBMITTED') return <Tag color="blue">Submitted</Tag>
  if (conversionState === 'ERROR') return <Tag color="red">Error</Tag>

  return <Tag color="gold">Uploaded</Tag>
}

const StreamDocuments = ({
  width,
  minWidth,
  maxWidth,
  options,
  selectedAppIndex,
  type,
  header,
  panelIndex,
  onSelectFunc,
  onAddMediaToArticle,
  parentPanelIndex,
}) => {
  const [currentStream, setCurrentStream] = useState({})
  const [showAddModal, setShowAddModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [streamType, setStreamType] = useState('Default')
  const [bShowDetailModal, showDetailModal] = useState(false)
  const { loading, error, data: queryData, refetch, networkStatus } = useQuery(queries.videoDataQuery, {
    variables: {
      collectionName,
      types: [streamType],
      clientId: _.get(header, 'client._id'),
    },
    pollInterval: 1000,
  })

  const [deleteMutation] = useMutation(mutations.deleteMutation)
  const [createVideoData] = useMutation(mutations.createVideoData)
  const [updateVideoData] = useMutation(mutations.updateVideoData)

  const data = queryData?.videoData || []

  const more = {
    width,
    minWidth,
    maxWidth,
    options,
    panelIndex,
  }

  if (networkStatus === 4 || loading || uploading) {
    return <StreamsPanel loading {...more} />
  }
  if (error || !data) {
    return ''
  }

  const onSelectAppFunc = index => {
    if (!data[index]) {
      onSelectFunc(0, data[0]._id)

      return
    }

    onSelectFunc(index, data[index]._id)

    if (options.isMobile) {
      const mediaURL = _.get(data[index], 'videoFileInput')
      if (mediaURL) {
        onAddMediaToArticle(mediaURL)
        options.togglePanel(parentPanelIndex, true)
      }
    } else {
      showDetailModal(true)
    }
  }

  const onConvertAppFunc = newDocument => {
    updateVideoData({
      variables: {
        _id: newDocument._id,
        collectionName,
        type,
        ...newDocument,
        initiateConversion: true,
      },
    })
      .then(() => {
        openNotificationWithIcon('success', 'Converted triggered!', `${newDocument.name} is triggered to convert!`)
      })
      .catch(err => {
        openNotificationWithIcon('error', 'Failed!', 'There was an error while converting.')
        console.log(err)
      })
  }

  const onAddAppFunc = newDocument => {
    createVideoData({
      variables: {
        // _id: data._id,
        collectionName,
        type: streamType,
        ...newDocument,
        // version: data.version
      },
    })
      .then(res => {
        openNotificationWithIcon('success', 'Done!', 'Video Uploaded successfully!')
        setCurrentStream(res?.data?.createVideoData)
        setShowAddModal(true)
      })
      .catch(() => {
        openNotificationWithIcon('error', 'Failed!', 'There was an error while uploading.')
      })
      .finally(() => setUploading(false))
  }

  const onDeleteAppFunc = index => {
    if (!data[index]) {
      console.log('apps data modified by others')

      return
    }

    deleteMutation({
      variables: {
        collectionName,
        _id: data[index]._id,
      },
    })
      .then(() => console.log('delete app success'))
      .catch(() => console.log('delete app fail'))
  }

  const onDagger = info => {
    const { status, name: filename, type: filetype } = info.file
    openNotification('open', 0, 'Preparing', 'Please wait ...')
    if (status !== 'uploading') {
      if (filetype !== 'video/mp4') {
        openNotificationWithIcon('error', 'Bad format', 'Please upload MP4 format file.')
        return
      }
      // setUploading(true)
      uploadToS3UsingPresignedUrl(info.file)
        .then(url => {
          onAddAppFunc({
            name: 'Stream',
            videoFileInput: url,
            data: {},
            params: {
              thumbnails: {
                framerate: 30,
                framegap: 60,
                maxCaptures: 10,
              },
            },
          })
        })
        .catch(() => {
          setUploading(false)
        })
    }
  }

  const onConvertFromModal = values => {
    showDetailModal(false)
    onConvertAppFunc(values)
  }

  const onConvertFromAddModal = values => {
    showDetailModal(false)
    setShowAddModal(false)
    updateVideoData({
      variables: {
        _id: currentStream._id,
        collectionName,
        type,
        ...currentStream,
        ...values,
        initiateConversion: true,
        params: {
          thumbnails: {
            framerate: 30,
            framegap: 60,
            maxCaptures: 10,
          },
          imageOverlays: values?.watermark
            ? [
              {
                layer: 1,
                top: 50,
                left: 100,
                startTime: '00:00:00:00',
                fileLocation: values?.watermark,
              },
            ]
            : [],
        },
      },
    })
      .then(() => {
        openNotificationWithIcon('success', 'Converted triggered!', `${values.name} is triggered to convert!`)
      })
      .catch(err => {
        openNotificationWithIcon('error', 'Failed!', 'There was an error while converting.')
        console.log(err)
      })
  }

  const appsPanelParams = {
    dataList: data.map(app => ({
      name: app.name,
      addon: renderConversionState(_.get(app, 'conversionState')),
      maxIconHeight: '27px',
      maxIconWidth: '45px',
    })),
    selectedIndex: selectedAppIndex,
    selectItem: onSelectAppFunc,
    onDropItem: () => { },
    onDragItemFunc: (e, index) => {
      if (!_.get(data, `${index}.videoFileInput`) || _.get(data, `${index}.conversionState`) !== 'COMPLETE') return
      console.log(data[index]?.videoFileOutput?.hlsFile)
      e.dataTransfer.setData('drag_url', data[index]?.videoFileOutput?.hlsFile)
      e.dataTransfer.setData('drag_doc_type', type)
    },
    more,
    onUploadFile: onDagger,
    onSyncFunc: () => {
      refetch()
    },
    onItemDeleteFunc: onDeleteAppFunc,
    type: streamType,
    onChangeType: setStreamType,
  }

  const document = data[selectedAppIndex]

  return (
    <>
      <StreamsPanel {...appsPanelParams} />
      <StreamModal
        title="Detail View"
        type={type}
        visible={bShowDetailModal}
        initialValue={document}
        onCancel={() => showDetailModal(false)}
        onUpdate={onConvertFromModal}
      />
      <StreamAddModal
        title="Select Watermark and Convert"
        visible={showAddModal}
        onCancel={() => setShowAddModal(false)}
        onUpdate={onConvertFromAddModal}
        initialValue={currentStream}
      />
    </>
  )
}

export default StreamDocuments
