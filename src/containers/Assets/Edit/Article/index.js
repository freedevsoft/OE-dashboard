import React from 'react'
import PropTypes from 'prop-types'

import { graphql, withApollo } from 'react-apollo'
import * as compose from 'lodash.flowright'
import * as queries from 'utils/queries'
import * as mutations from 'utils/mutations'
import * as constants from 'utils/constants'

import { notification } from 'antd'
import _ from 'lodash'
import objectAssignDeep from 'object-assign-deep'

import GrayPanel from 'components/GrayPanel/GrayPanel'
import ControlBtnsGroup from 'components/ControlBtnsGroup/ControlBtnsGroup'
import AccordionList from 'components/AccordionList/AccordionList'
import DataDocuments from 'containers/MediaCollection/DataDocuments'
import ArticleForm from './form'

const openNotificationWithIcon = (type, message, description) => {
  notification[type]({
    message,
    description,
    placement: 'bottomRight',
  })
}

class ArticleDetailPanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      article: {},
      loading: false,
      supportDocType: null,
      supportIndex: 0,
      support: {
        currentKey: '0',
      },
      openKeys: {
        support: ['0'],
      },
    }
    this.setReRender = this.setReRender.bind(this)

    this.onSaveFunc = this.onSaveFunc.bind(this)
    this.mutateArticle = this.mutateArticle.bind(this)

    this.shouldReRender = {
      title: true,
      short: true,
      long: true,
      body: true,
    }
  }

  componentDidMount() {
    const { article_id } = this.props

    if (!article_id) {
      return
    }

    const {
      eventQuery: { loading, article, error },
    } = this.props

    if (error || loading) {
      return
    }

    this.shouldReRender = {
      title: true,
      short: true,
      long: true,
      body: true,
    }

    this.setState({ article: article[0], loading })
  }

  componentWillReceiveProps(nextProps) {
    const {
      eventQuery: { loading, article },
    } = nextProps
    this.shouldReRender = {
      title: true,
      short: true,
      long: true,
      body: true,
    }

    if (!loading) {
      if (article && article[0]) this.setState({ article: article[0], loading })
    } else if (loading !== this.state.loading) this.setState({ loading })
  }

  setReRender = (should, field) => {
    this.shouldReRender[field] = should
  }

  mutateArticle = () =>
    new Promise((resolve, reject) => {
      const { article } = this.state
      const { updateArticle } = this.props
      let payload

      if (article._id) {
        // in this case, this is a real article, we should pass the _id as a parameter of mutation
        const { ...exceptID } = article
        payload = exceptID
      } else {
        // in this case, this is a new article, we shouldn't pass the _id as a paramenter of mutation
        const { _id, ...exceptID } = article
        payload = exceptID
      }

      this.setState({
        loading: true,
      })

      console.log('mutateEvent: payload: ', payload)
      if (payload.imageList) {
        payload.imageList = payload.imageList.map(asset => {
          const { __typename, ...exceptTypename } = asset

          return { ...exceptTypename }
        })
      }

      if (payload.videoList) {
        payload.videoList = payload.videoList.map(asset => {
          const { __typename, ...exceptTypename } = asset

          return { ...exceptTypename }
        })
      }

      if (payload.widgets) {
        payload.widgets = payload.widgets.map(asset => {
          const { __typename, ...exceptTypename } = asset

          return { ...exceptTypename }
        })
      }

      if (payload.source) {
        const { __typename, ...exceptTypename } = payload.source
        payload.source = { ...exceptTypename }
      }

      if (payload.presentationMode) {
        const { __typename, ...exceptTypename } = payload.presentationMode
        payload.presentationMode = { ...exceptTypename }
      }

      updateArticle({
        variables: {
          collectionName: queries.eventCollection,
          ...payload,
          majorVer: (payload.majorVer ? payload.majorVer : 0) + 1,
        },
        update: (proxy, { data: { updateArticle } }) => {
          try {
            const updatedArticle = {
              ...payload,
              _id: updateArticle._id,
              version: updateArticle.version,
              majorVer: updateArticle.majorVer,
              source: { ...payload.source, __typename: 'Source' },
            }
            // this.setState({ article: [updatedArticle] })
            proxy.writeQuery({
              query: queries.eventQuery,
              variables: {
                _id: article.id,
                collectionName: queries.eventCollection,
              },
              data: { article: [updatedArticle] },
            })
          } catch (error) {
            console.error(error)
          }
        },
      })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })

  onSaveFunc = () => {
    const { article } = this.state
    const { addRealArticle, updateRealArticle } = this.props
    let CREATE_MODE = false

    if (!article._id) CREATE_MODE = true

    this.mutateArticle()
      .then(res => {
        if (res.data.updateArticle) {
          if (CREATE_MODE) {
            addRealArticle(res.data.updateArticle)
          } else {
            updateRealArticle(res.data.updateArticle)
          }
          openNotificationWithIcon('success', 'Document', 'Successfully Done!')
        } else {
          openNotificationWithIcon('error', 'Document', 'Failed to Update!')
        }
        this.setState({ loading: false })
      })
      .catch(() => {
        openNotificationWithIcon('error', 'Document', 'Failed to Update!')
        this.setState({ loading: false })
      })
  }

  onAddImage = url => {
    const { article } = this.state
    console.log('onAddImage', url)
    if (!article.imageList) article.imageList = []
    article.imageList.push({ url, name: `Image #${article.imageList.length}` })

    this.setState({ article })
  }

  onAddVideo = url => {
    const { article } = this.state
    if (!article.videoList) article.videoList = []
    article.videoList.push({ url, name: `Video #${article.videoList.length}` })

    this.setState({ article })
  }

  onDeleteImage = resource_index => {
    const { article } = this.state
    article.imageList.splice(resource_index, 1)

    this.setState({ article })
  }

  onDeleteVideo = resource_index => {
    const { article } = this.state
    article.videoList.splice(resource_index, 1)

    this.setState({ article })
  }

  onLoadStreamVideo = url => {
    const { article } = this.state

    _.set(article, 'data.streaming.broadband_url', url)
    this.setState({ article })
  }

  onDropMediaFromExist = (ev, docType) => {
    const resourceUrl = ev.dataTransfer.getData('drag_url')
    const dragDocType = ev.dataTransfer.getData('drag_doc_type')
    if (!resourceUrl || dragDocType !== docType) return
    if (docType === constants.organizer.Image.docType) this.onAddImage(resourceUrl)
    else if (docType === constants.organizer.Video.docType) this.onAddVideo(resourceUrl)
  }

  addArticleToAreaGroup = (type, areaRef, article) => {
    const { client, updateGroupingMuation } = this.props

    client
      .query({
        query: queries.groupingQuery,
        variables: {
          ids: [areaRef._id],
        },
      })
      .then(({ data }) => {
        if (!data || !data.grouping || !data.grouping[0]) return
        const [group] = data.grouping
        const { list = [] } = group
        const foundArticle = list.find(item => item.id === article._id)

        if (!foundArticle) {
          updateGroupingMuation({
            variables: {
              _id: group._id,
              name: group.name,
              collectionName: group.collectionName,
              list: [...list.map(item => ({ ...item, __typename: undefined })), { id: article._id, __typename: undefined }],
              version: group.version,
            },
          })
            .then(() => {
              openNotificationWithIcon('success', 'Document', `Successfully added to ${type} Group!`)
            })
            .catch(() => {
              openNotificationWithIcon('warning', 'Document', `Failed to add to ${type} Group!`)
            })
        }
        console.log(list)
      })
      .catch(err => {
        console.log(err)
      })
  }

  onUpdate = (e, form) => {
    e.preventDefault()
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { article } = this.state

        const modified = objectAssignDeep(article, values.article)

        const areaRef = _.get(values.article, 'location.areaRef')
        const subAreaRef = _.get(values.article, 'location.subAreaRef')

        if (areaRef) {
          this.addArticleToAreaGroup('Area', areaRef, modified)
        }
        if (subAreaRef) {
          this.addArticleToAreaGroup('SubArea', subAreaRef, modified)
        }

        this.setState({ article: modified }, () => {
          this.onSaveFunc()
        })
      } else {
        openNotificationWithIcon('warning', 'Document', 'Please fill out all the necessary fields!')
      }
    })
  }

  onPublish = () => {
    const { article } = this.state
    const { parentFolderName } = this.props

    // if (parentFolderName) {
    //   this.addArticleToFolderNameGroup(article, parentFolderName)
    // }
  }

  // addArticleToFolderNameGroup = (article, folderName) => {
  //   const { client, updateGroupingMuation } = this.props

  //   client
  //     .query({
  //       query: queries.groupingQuery,
  //       variables: {
  //         names: [folderName],
  //       },
  //     })
  //     .then(({ data }) => {
  //       if (!data || !data.grouping || !data.grouping[0]) return
  //       const [group] = data.grouping
  //       const { list = [] } = group
  //       const foundArticle = list.find(item => item.id === article._id)

  //       if (!foundArticle) {
  //         updateGroupingMuation({
  //           variables: {
  //             _id: group._id,
  //             name: group.name,
  //             collectionName: group.collectionName,
  //             list: [...list.map(item => ({ ...item, __typename: undefined })), { id: article._id, __typename: undefined }],
  //             version: group.version,
  //           },
  //         })
  //           .then(() => {
  //             openNotificationWithIcon('success', 'Document', `Successfully added to (${folderName}) Group!`)
  //           })
  //           .catch(() => {
  //             openNotificationWithIcon('warning', 'Document', `Failed to add to (${folderName}) Group!`)
  //           })
  //       } else {
  //         openNotificationWithIcon('warning', 'Document', `This document is already in (${folderName}) Group!`)
  //       }
  //     })
  //     .catch(err => {
  //       console.log(err)
  //     })
  // }

  showSupportPanel = docType => {
    const { options } = this.props
    options.togglePanel(5, true)
    this.setState({
      supportDocType: docType,
      supportIndex: 0,
      support: {
        currentKey: docType === constants.organizer.Image.docType ? '1' : '2',
        disableAdd: false,
        disableAddItem: true,
        disableDel: false,
      },
      openKeys: {
        ...this.state.openKeys,
        support: docType === constants.organizer.Image.docType ? ['1'] : ['2'],
      },
    })
  }

  onSelectSupportFunc = index => {
    this.setState({ supportIndex: index })
  }

  render() {
    const { style, selectedTab, onChangeTab, onExit, width, minWidth, maxWidth, options, header } = this.props
    const { article, loading, supportDocType, supportIndex } = this.state

    const more = {
      width,
      minWidth,
      maxWidth,
      options,
      panelIndex: 3,
    }

    if (loading) {
      return (
        <GrayPanel title="Detail" {...style} {...more}>
          <ControlBtnsGroup disabled />
          <AccordionList loading />
        </GrayPanel>
      )
    }

    if (!article) {
      return (
        <GrayPanel title="Not Found" {...style} {...more}>
          <div style={{ position: 'absolute', top: 'calc(50% - 105px)', left: 'calc(50% - 110px)' }}>
            <img src="/oops.png" alt="oops" />
          </div>
        </GrayPanel>
      )
    }

    let thirdRender = ''

    if (options.visibles[5]) {
      const commonProps = {
        onSelectFunc: this.onSelectSupportFunc,
        selectedAppIndex: supportIndex,
        width: options.widths[5],
        options,
        minWidth: options.widthParams[5].min,
        maxWidth: options.widthParams[5].max,
        onAddMediaToArticle: supportDocType === constants.organizer.Image.docType ? this.onAddImage : this.onAddVideo,
        panelIndex: 5,
        parentPanelIndex: 3,
      }

      switch (supportDocType) {
        case constants.organizer.Image.docType:
          thirdRender = <DataDocuments key={2} collectionName="ImagesData" type="StockImage" {...commonProps} />
          break
        case constants.organizer.Video.docType:
          thirdRender = <DataDocuments key={2} collectionName="VideosData" type="StockVideo" {...commonProps} />
          break
        default:
          break
      }
    }

    return (
      <>
        <ArticleForm
          article={article}
          field="article"
          currentKey={article._id}
          shouldReRender={this.shouldReRender}
          setReRender={this.setReRender}
          onSaveFunc={this.onUpdate}
          onPublishFunc={this.onPublish}
          onShowThirdPanel={this.showSupportPanel}
          onDropMediaFromExist={this.onDropMediaFromExist}
          onAddImage={this.onAddImage}
          onAddVideo={this.onAddVideo}
          onDeleteImage={this.onDeleteImage}
          onDeleteVideo={this.onDeleteVideo}
          selectedTab={selectedTab}
          onChangeTab={onChangeTab}
          onExit={onExit}
          more={more}
          header={header}
          onLoadStreamVideo={this.onLoadStreamVideo}
          show={options.visibles[3]}
        />
        {options.visibles[5] && thirdRender}
      </>
    )
  }
}

ArticleDetailPanel.propTypes = {
  style: PropTypes.object,
}

ArticleDetailPanel.defaultProps = {
  style: {
    bgcolor: 'white',
    fgcolor: 'black',
  },
}

export default compose(
  graphql(queries.eventQuery, {
    name: 'eventQuery',
    options: props => {
      const { article_id } = props

      return {
        variables: {
          _id: article_id,
          collectionName: queries.eventCollection,
        },
      }
    },
  }),
  graphql(queries.imageQuery, { name: 'imageQuery' }),
  graphql(mutations.updateArticle, { name: 'updateArticle' }),
  graphql(mutations.deleteMutation, { name: 'deleteMutation' }),
  graphql(mutations.updateGroupingMuation, { name: 'updateGroupingMuation' }),
  withApollo,
)(ArticleDetailPanel)
