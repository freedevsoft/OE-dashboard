import React from 'react'
import { graphql, withApollo } from 'react-apollo'
import * as compose from 'lodash.flowright'
import * as queries from 'utils/queries'
import * as mutations from 'utils/mutations'
import _ from 'lodash'
import AppsPanel from './AppsPanel'

class DataDocuments extends React.Component {
  componentDidMount() {}

  onSelectAppFunc = index => {
    const {
      dataQuery: { loading, data, error },
    } = this.props

    if (loading || error || !data) return

    if (!data[index]) {
      this.props.onSelectFunc(0, data[0]._id)

      return
    }

    this.props.onSelectFunc(index, data[index]._id)
  }

  onEditAppFunc = (index, text) => {
    const {
      dataQuery: { loading, data, error },
    } = this.props

    if (loading || error || !data) return

    this.props
      .dataMutation({
        variables: {
          collectionName: this.props.collectionName,
          ...data[index],
          name: text,
        },
        update: (proxy, { data: { upsertData } }) => {
          try {
            console.log(upsertData)
            const data = proxy.readQuery({
              query: queries.dataQuery,
              variables: {
                collectionName: this.props.collectionName,
              },
            })

            data.data[index] = upsertData
            this.props.onSelectFunc(index, upsertData._id)

            proxy.writeQuery({
              query: queries.dataQuery,
              variables: {
                collectionName: this.props.collectionName,
              },
              data,
            })
          } catch (error) {
            console.error(error)
          }
        },
      })
      .then(res => {})
      .catch(err => {
        console.log(err)
      })
  }

  onAddAppFunc = () => {
    this.props
      .dataMutation({
        variables: {
          // _id: data._id,
          collectionName: this.props.collectionName,
          ...this.props.newDocument,
          // version: data.version
        },
        update: (proxy, { data: { upsertData } }) => {
          try {
            console.log(upsertData)
            const data = proxy.readQuery({
              query: queries.dataQuery,
              variables: {
                collectionName: this.props.collectionName,
              },
            })

            data.data.push(upsertData)
            this.props.onSelectFunc(data.data.length - 1, upsertData._id)

            proxy.writeQuery({
              query: queries.dataQuery,
              variables: {
                collectionName: this.props.collectionName,
              },
              data,
            })
          } catch (error) {
            console.error(error)
          }
        },
      })
      .then(res => {})
      .catch(err => {
        console.log(err)
      })
  }

  onDeleteAppFunc = (index) => {
    const {
      dataQuery: { loading, data, error },
    } = this.props

    const { selectedAppIndex } = this.props

    if (loading || error || !data) return

    if (!data[index]) {
      console.log('apps data modified by others')

      return
    }

    this.props
      .deleteMutation({
        variables: {
          collectionName: this.props.collectionName,
          _id: data[index]._id,
        },
        update: (proxy, { data: { deleteMutation } }) => {
          try {
            const data = proxy.readQuery({
              query: queries.dataQuery,
              variables: {
                collectionName: this.props.collectionName,
              },
            })

            console.log(data)
            data.data.splice(index, 1)
            let newIndex
            if (index >= data.data.length) newIndex = index <= 0 ? -1 : index - 1
            else newIndex = index
            this.props.onSelectFunc(newIndex, data.data[newIndex] ? data.data[newIndex]._id : null)

            proxy.writeQuery({
              query: queries.dataQuery,
              variables: {
                collectionName: this.props.collectionName,
              },
              data,
            })
          } catch (error) {
            console.error(error)
          }
        },
      })
      .then(res => console.log('delete app success'))
      .catch(err => console.log('delete app fail'))
  }

  render() {
    const {
      dataQuery: { loading, data, error },
    } = this.props

    if (loading) {
      return <AppsPanel loading />
    }
    if (error || !data) {
      return ''
    }

    const appsPanelParams = {
      dataList: data.map(app => ({ name: app.name, editable: true })),
      selectedIndex: this.props.selectedAppIndex,
      selectItem: this.onSelectAppFunc,
      onItemDeleteFunc: this.onDeleteAppFunc,
      onItemAddFunc: this.onAddAppFunc,
      onItemEditFunc: this.onEditAppFunc,
      onDragItemFunc: (e, index) => {
        if (!_.get(data, `${index}.data.url`)) return
        e.dataTransfer.setData('drag_url', data[index].data.url)
        e.dataTransfer.setData('drag_doc_type', this.props.type)
      },
    }

    return <AppsPanel {...appsPanelParams} />
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
