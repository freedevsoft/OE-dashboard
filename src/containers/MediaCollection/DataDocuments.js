import React from 'react'
import { graphql, withApollo } from 'react-apollo'
import * as compose from 'lodash.flowright'
import * as queries from 'utils/queries'
import * as mutations from 'utils/mutations'
import { uploadToS3UsingPresignedUrl, openNotification } from 'utils/index'
import _ from 'lodash'
import AppsPanel from './AppsPanel'
import AddModal from './AddModal'
import DetailModal from './DetailModal'

class DataDocuments extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      bShowAddModal: false,
      bShowDetailModal: false,
    }
  }

  onSelectAppFunc = index => {
    const {
      dataQuery: { loading, data, error },
      onSelectFunc,
      onAddMediaToArticle,
      options,
      parentPanelIndex,
    } = this.props

    if (loading || error || !data) return

    if (!data[index]) {
      onSelectFunc(0, data[0]._id)

      return
    }

    onSelectFunc(index, data[index]._id)

    if (options.isMobile) {
      const mediaURL = _.get(data[index], 'data.url')
      if (mediaURL) {
        onAddMediaToArticle(mediaURL)
        options.togglePanel(parentPanelIndex, true)
      }
    } else {
      this.setState({ bShowDetailModal: true })
    }
  }

  onEditAppFunc = (index, text) => {
    const {
      dataQuery: { loading, data, error },
      dataMutation,
      collectionName,
      onSelectFunc,
      type,
    } = this.props

    if (loading || error || !data) return

    dataMutation({
      variables: {
        collectionName,
        ...data[index],
        name: text,
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

          data.data[index] = upsertData
          onSelectFunc(index, upsertData._id)

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
      .then(() => { })
      .catch(err => {
        console.log(err)
      })
  }

  onAddAppFunc = newDocument => {
    const { dataMutation, collectionName, onSelectFunc, type } = this.props
    dataMutation({
      variables: {
        // _id: data._id,
        collectionName,
        ...newDocument,
        // version: data.version
      },
      update: (proxy, { data: { upsertData } }) => {
        try {
          console.log(upsertData)
          const data = proxy.readQuery({
            query: queries.dataQuery,
            variables: {
              collectionName,
              types: [type],
            },
          })

          data.data.push(upsertData)
          onSelectFunc(data.data.length - 1, upsertData._id)

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
      .then(() => { })
      .catch(err => {
        console.log(err)
      })
  }

  onDeleteAppFunc = (index) => {
    const {
      dataQuery: { loading, data, error },
    } = this.props

    const { selectedAppIndex, deleteMutation, collectionName, onSelectFunc, type } = this.props

    if (loading || error || !data) return

    if (!data[index]) {
      console.log('apps data modified by others')

      return
    }

    deleteMutation({
      variables: {
        collectionName,
        _id: data[index]._id,
      },
      update: (proxy, { data: { deleteMutation } }) => {
        try {
          const data = proxy.readQuery({
            query: queries.dataQuery,
            variables: {
              collectionName,
              types: [type],
            },
          })

          data.data.splice(index, 1)
          let newIndex
          if (index >= data.data.length) newIndex = index <= 0 ? -1 : index - 1
          else newIndex = index
          onSelectFunc(newIndex, data.data[newIndex] ? data.data[newIndex]._id : null)

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
      .then(() => console.log('delete app success'))
      .catch(() => console.log('delete app fail'))
  }

  onDagger = info => {
    const { status, name: filename } = info.file
    openNotification('open', 0, 'Preparing', 'Please wait ...')
    if (status !== 'uploading') {
      uploadToS3UsingPresignedUrl(info.file)
        .then(url => {
          this.onAddAppFunc({ name: filename, data: { url } })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  onAddFromModal = (e, form) => {
    e.preventDefault()
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({ bShowAddModal: false })
        this.onAddAppFunc(values)
      }
    })
  }

  render() {
    const {
      dataQuery: { loading, data, error },
      width,
      minWidth,
      maxWidth,
      options,
      selectedAppIndex,
      type,
      panelIndex,
      onChangeImageType,
      collectionName
    } = this.props

    const { bShowAddModal, bShowDetailModal } = this.state

    const more = {
      width,
      minWidth,
      maxWidth,
      options,
      panelIndex,
    }

    if (loading) {
      return <AppsPanel loading {...more} />
    }
    if (error || !data) {
      return ''
    }
    const appsPanelParams = {
      dataList: data.map(app => ({ name: app.name, icon: type === 'StockImage' || type === 'Icon' || type === 'Avatar' || type === 'Logo' ? _.get(app, 'data.url') : null, maxIconHeight: '35px', maxIconWidth: '55px', editable: true })),
      selectedIndex: selectedAppIndex,
      selectItem: this.onSelectAppFunc,
      onItemDeleteFunc: this.onDeleteAppFunc,
      onItemAddFunc: () => this.setState({ bShowAddModal: true }),
      onItemEditFunc: this.onEditAppFunc,
      onDragItemFunc: (e, index) => {
        if (!_.get(data, `${index}.data.url`)) return
        e.dataTransfer.setData('drag_url', data[index].data.url)
        e.dataTransfer.setData('drag_doc_type', type)
      },
      type,
      more,
      onChangeImageType: onChangeImageType,
      onUploadFile: this.onDagger,
      collectionName
    }

    const document = data[selectedAppIndex]

    return (
      <>
        <AppsPanel {...appsPanelParams} />
        <AddModal title={`Add a new ${type}`} visible={bShowAddModal} onCancel={() => this.setState({ bShowAddModal: false })} onUpdate={this.onAddFromModal} />
        <DetailModal title="Detail View" type={type} visible={bShowDetailModal} initialValue={document} onCancel={() => this.setState({ bShowDetailModal: false })} />
      </>
    )
  }
}

export default compose(
  graphql(queries.dataQuery, {
    name: 'dataQuery',
    options: props => ({
      variables: {
        collectionName: props.collectionName,
        types: [props.type],
      },
    }),
  }),
  graphql(mutations.deleteMutation, { name: 'deleteMutation' }),
  graphql(mutations.dataMutation, { name: 'dataMutation' }),
  withApollo,
)(DataDocuments)
