import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Upload, Spin } from 'antd'
import { graphql, withApollo } from 'react-apollo'
import * as compose from 'lodash.flowright'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { Player } from 'video-react'

import { uploadFileToS3 } from 'utils/index'
import * as constants from 'utils/constants'
import * as mutations from 'utils/mutations'
import * as queries from 'utils/queries'

import './index.scss'

const { Dragger } = Upload

class MediaListPanel extends React.Component {
  imageFile = null

  panelEnd = null

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
    }
  }

  componentDidUpdate() {
    this.scrollToRight()
  }

  scrollToRight = () => {
    if (this.panelEnd) {
      this.panelEnd.scrollLeft = 100
    }
  }

  addToResourceCollection = (url, filename) => {
    const { panelDocType } = this.props

    return new Promise(async (resolve, reject) => {
      const { dataMutation } = this.props

      let collectionName = null
      let type = null
      switch (panelDocType) {
        case constants.organizer.Image.docType:
          collectionName = 'ImagesData'
          type = 'StockImage'
          break
        case constants.organizer.Video.docType:
          collectionName = 'VideosData'
          type = 'StockVideo'
          break
        default:
          reject(null)

          return
      }
      try {
        const result = await dataMutation({
          variables: {
            collectionName,
            name: filename,
            type,
            data: {
              url,
            },
          },
          update: (proxy, { data: { upsertData } }) => {
            try {
              const data = proxy.readQuery({
                query: queries.dataQuery,
                variables: {
                  collectionName,
                  types: [type],
                },
              })

              data.data.push(upsertData)

              proxy.writeQuery({
                query: queries.dataQuery,
                variables: {
                  collectionName,
                  types: [type],
                },
                data,
              })
            } catch (error) {
              console.error(error)
            }
          },
        })
        resolve(result)
      } catch (e) {
        reject(e)
      }
    })
  }

  onDagger = info => {
    const { status, name: filename } = info.file
    const { onAddAsset, addToUploadedFolder, panelDocType } = this.props

    if (status !== 'uploading') {
      this.setState({ loading: true })
      uploadFileToS3(info.file)
        .then(url => {
          onAddAsset(url)

          return this.addToResourceCollection(url, filename)
        })
        .then(() => {
          addToUploadedFolder(panelDocType, null)
          this.setState({ loading: false })
          this.scrollToRight()
        })
        .catch(err => {
          console.log(err)
          this.setState({ loading: false })
        })
    }
  }

  render() {
    const { loading } = this.state
    const { assets, panelDocType, onDrop, onShowThirdPanel, onDeleteAsset } = this.props

    const daggerProps = {
      name: 'file',
      multiple: false,
      onChange: this.onDagger,
      showUploadList: false,
    }

    return (
      <>
        <div className="oe-assets-list">
          <div
            className="oe-assets-list-panel"
            onDragOver={e => {
              e.preventDefault()
            }}
            onDrop={ev => {
              console.log(ev)
              onDrop(ev, panelDocType)
            }}
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
            {assets &&
              assets.map((item, index) => {
                if (panelDocType === constants.organizer.Image.docType) {
                  return (
                    <div className="oe-assets-list-panel__item" key={index}>
                      <img src={item.url} alt="item" />
                      <div className="oe-assets-list-panel__item__mask">
                        <button type="button" className="oe-assets-list-panel__item__mask__close" onClick={() => onDeleteAsset(index)}>
                          X
                        </button>
                      </div>
                    </div>
                  )
                }

                return (
                  <div className="oe-assets-list-panel__item" key={index}>
                    <Player src={item.url} style={{ width: '100%', margin: '10px 0' }} playsInline />
                    <div className="oe-assets-list-panel__item__mask">
                      <button type="button" className="oe-assets-list-panel__item__mask__close" onClick={() => this.props.onDeleteAsset(index)}>
                        X
                      </button>
                    </div>
                  </div>
                )
              })}

            <div className="oe-assets-list-panel__item">
              <Dragger {...daggerProps}>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">
                  Upload&nbsp;
                  {panelDocType === constants.organizer.Image.docType ? 'Image' : 'Video'}
                </p>
              </Dragger>
            </div>
            <div
              style={{ float: 'right', clear: 'both' }}
              ref={el => {
                this.panelEnd = el
              }}
            />
          </div>
          <div className="oe-assets-list-add-container">
            <button onClick={() => onShowThirdPanel(panelDocType)}>
              <FontAwesomeIcon icon={faChevronRight} color="#000" size="2x" />
            </button>
            {/* <button type="button" onClick={() => onShowThirdPanel(panelDocType)}>
              +
            </button> */}
          </div>
        </div>
      </>
    )
  }
}

MediaListPanel.propTypes = {
  assets: PropTypes.array,
}

MediaListPanel.defaultProps = {
  assets: [],
}

export default compose(graphql(mutations.dataMutation, { name: 'dataMutation' }), withApollo)(MediaListPanel)
