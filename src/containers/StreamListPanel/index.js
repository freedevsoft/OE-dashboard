import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Upload, Spin, notification } from 'antd'
import { graphql, withApollo } from 'react-apollo'
import * as compose from 'lodash.flowright'
import HLSSource from 'components/HLSSource'
import { Player } from 'video-react'
import { uploadFileToS3 } from 'utils/index'
import * as mutations from 'utils/mutations'
import { videoDataQuery } from 'utils/queries'
import _ from 'lodash'
import AddModal from './AddModal'

import './index.scss'

const { Dragger } = Upload
const collectionName = 'VideoData'
const type = 'Default'

const openNotificationWithIcon = (type, message, description) => {
  notification[type]({
    message,
    description,
    placement: 'bottomRight',
  })
}

class StreamListPanel extends React.Component {
  imageFile = null

  panelEnd = null

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      showAddModal: false,
      info: null,
      muted: true,
      autoPlay: false,
      preload: "none"
    }
  }

  addToResourceCollection = (url, newName, watermark) => {
    const { createVideoData, header, updateVideoData, client } = this.props

    return new Promise(async (resolve, reject) => {
      const newDocument = {
        name: newName,
        videoFileInput: url,
        data: {},
        params: {
          thumbnails: {
            framerate: 30,
            framegap: 60,
            maxCaptures: 10,
          },
          imageOverlays: watermark
            ? [
                {
                  layer: 1,
                  top: 50,
                  left: 100,
                  startTime: '00:00:00:00',
                  fileLocation: watermark,
                },
              ]
            : [],
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
            if (type) {
              const { data: typeData } = await client.query({
                query: videoDataQuery,
                variables: { collectionName, types: [type], clientId: _.get(header, 'client._id') },
              })
              proxy.writeQuery({
                query: videoDataQuery,
                variables: { collectionName, types: [type], clientId: _.get(header, 'client._id') },
                data: { videoData: [...typeData.videoData, createVideoData] },
              })
            }
          } catch (error) {
            console.error(error)
          }
        },
      })
        .then(res => {
          const createVideoData = res?.data?.createVideoData

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
          resolve()
        })
        .catch(err => {
          openNotificationWithIcon('error', 'Failed to add a new one!', 'There was an error while adding.')
          reject(err)
        })
    })
  }

  onDagger = info => {
    const { status, type: filetype } = info.file
    console.log(status)
    if (status !== 'uploading') {
      if (filetype !== 'video/mp4') {
        openNotificationWithIcon('error', 'Bad format', 'Please upload MP4 format file.')

        return
      }

      this.setState({ showAddModal: true, info })
    }
  }

  onAddFromModal = values => {
    const { info } = this.state
    const { status, name: filename, type: filetype } = info.file
    const { onAddStream, addToUploadedFolder } = this.props

    this.setState({ showAddModal: false })

    if (status !== 'uploading') {
      this.setState({ loading: true })
      uploadFileToS3(info.file)
        .then(url => {
          onAddStream(url)

          return this.addToResourceCollection(url, values?.name, values?.watermark)
        })
        .finally(() => {
          this.setState({ loading: false })
        })
    }
  }

  render() {
    const { loading, showAddModal } = this.state
    const { streamList, onDrop, onShowStreamPanel, onDeleteStream } = this.props

    const daggerProps = {
      name: 'file',
      multiple: false,
      onChange: this.onDagger,
      showUploadList: false,
    }

    return (
      <>
        <AddModal
          title="Add a new stream"
          visible={showAddModal}
          onCancel={() => this.setState({ showAddModal: false })}
          onUpdate={this.onAddFromModal}
        />
        <div className="oe-streams-list">
          <div
            className="oe-streams-list-panel"
            onDragOver={e => {
              e.preventDefault()
            }}
            onDrop={onDrop}
          >
            {loading && (
              <div
                style={{
                  position: 'absolute',
                  height: '100%',
                  width: '100%',
                  zIndex: '3',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                }}
              >
                <Spin tip="Loading..." id="LayoutCreatorSpin" />
              </div>
            )}
            {streamList?.map((item, index) => (
              <div className="oe-streams-list-panel__item" key={index}>
                <Player muted autoPlay={this.state.autoPlay} preload={this.state.preload} ref={playerRef => {this.player = playerRef}}  style={{ width: '100%', margin: '10px 0' }}>
                  <HLSSource isVideoChild src={item.url} />
                </Player>
                {/* <Player src={item.url} style={{ width: '100%', margin: '10px 0' }} playsInline /> */}
                <div className="oe-streams-list-panel__item__mask">
                  <button type="button" className="oe-streams-list-panel__item__mask__close" onClick={() => onDeleteStream(index)}>
                    X
                  </button>
                </div>
              </div>
            ))}

            <div className="oe-streams-list-panel__item">
              <Dragger {...daggerProps}>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">Drag and Drop MP4 file</p>
              </Dragger>
            </div>
            <div
              style={{ float: 'right', clear: 'both' }}
              ref={el => {
                this.panelEnd = el
              }}
            />
          </div>
          <div className="oe-streams-list-add-container">
            <button type="button" onClick={onShowStreamPanel}>
              +
            </button>
          </div>
        </div>
      </>
    )
  }
}

StreamListPanel.propTypes = {
  streamList: PropTypes.array,
}

StreamListPanel.defaultProps = {
  streamList: [],
}

export default compose(
  graphql(mutations.dataMutation, { name: 'dataMutation' }),
  graphql(mutations.createVideoData, { name: 'createVideoData' }),
  graphql(mutations.updateVideoData, { name: 'updateVideoData' }),
  withApollo,
)(StreamListPanel)
