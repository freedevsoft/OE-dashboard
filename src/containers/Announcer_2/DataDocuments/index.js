import React from 'react'
import { graphql, withApollo } from 'react-apollo'
import * as compose from 'lodash.flowright'
import * as queries from 'utils/queries'
import * as mutations from 'utils/mutations'
import { notification } from 'antd'
import objectAssignDeep from 'object-assign-deep'
import AppsPanel from './AppsPanel'
import DataDocumentFilter from '../Filter'
import InfoFormModal from './AppInfoFormModal'
import ScheduleFormModal from './ScheduleFormModal'

const openNotificationWithIcon = (type, message, description) => {
  notification[type]({
    message,
    description,
    placement: 'bottomRight',
  })
}

class DataDocuments extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visibleSetting: false,
      visibleSchedule: false,
    }
  }

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

  onEditAppFunc = (index, values) => {
    const {
      dataQuery: { loading, data, error },
    } = this.props

    if (loading || error || !data) return

    const document = data[index]
    const modified = objectAssignDeep(document, values)

    console.log(modified)

    this.props
      .dataMutation({
        variables: {
          collectionName: this.props.collectionName,
          ...modified,
          schedule: {
            ...modified.schedule,
            __typename: undefined,
          },
        },
        update: (proxy, { data: { upsertData } }) => {
          try {
            console.log(upsertData)
            const data = proxy.readQuery({
              query: queries.dataQuery,
              variables: {
                collectionName: this.props.collectionName,
                types: this.props.type ? [this.props.type] : null,
              },
            })

            data.data[index] = upsertData
            this.props.onSelectFunc(index, upsertData._id)

            proxy.writeQuery({
              query: queries.dataQuery,
              variables: {
                collectionName: this.props.collectionName,
                types: this.props.type ? [this.props.type] : null,
              },
              data,
            })
          } catch (error) {
            console.error(error)
          }
        },
      })
      .then(res => {
        openNotificationWithIcon('success', 'Updated Successfully!', `${data[index].name} is updated successfully!`)
      })
      .catch(err => {
        openNotificationWithIcon('error', 'Failed to update!', 'There was an error while updating.')
        console.log(err)
      })
  }

  onAddAppFunc = () => {
    this.props
      .dataMutation({
        variables: {
          collectionName: this.props.collectionName,
          type: this.props.type ? this.props.type : null,
          ...this.props.newDocument,
        },
        update: (proxy, { data: { upsertData } }) => {
          try {
            const data = proxy.readQuery({
              query: queries.dataQuery,
              variables: {
                collectionName: this.props.collectionName,
                types: this.props.type ? [this.props.type] : null,
              },
            })

            data.data.push(upsertData)
            this.props.onSelectFunc(data.data.length - 1, upsertData._id)

            proxy.writeQuery({
              query: queries.dataQuery,
              variables: {
                collectionName: this.props.collectionName,
                types: this.props.type ? [this.props.type] : null,
              },
              data,
            })
          } catch (error) {
            console.error(error)
          }
        },
      })
      .then(res => {
        openNotificationWithIcon('success', 'Created Successfully!', `${this.props.newDocument.name} is created successfully!`)
      })
      .catch(err => {
        openNotificationWithIcon('error', 'Failed to add a new one!', 'There was an error while adding.')
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

    const selected = data[index]

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
                types: this.props.type ? [this.props.type] : null,
              },
            })

            data.data.splice(index, 1)
            let newIndex
            if (index >= data.data.length) newIndex = index <= 0 ? -1 : index - 1
            else newIndex = index
            this.props.onSelectFunc(newIndex, data.data[newIndex] ? data.data[newIndex]._id : null)

            proxy.writeQuery({
              query: queries.dataQuery,
              variables: {
                collectionName: this.props.collectionName,
                types: this.props.type ? [this.props.type] : null,
              },
              data,
            })
          } catch (error) {
            console.error(error)
          }
        },
      })
      .then(res => {
        openNotificationWithIcon('success', 'Deleted Successfully!', `${selected.name} is deleted!`)
      })
      .catch(err => {
        openNotificationWithIcon('error', `Failed to delete ${selected.name}`, 'There was an error while deleting.')
      })
  }

  onSettingsFunc = () => {
    const { selectedAppIndex } = this.props
    const {
      dataQuery: { loading, data, error },
      collectionName,
    } = this.props

    const selected_document = data[selectedAppIndex]
    const document_id = selected_document ? selected_document._id : null

    if (document_id) this.setState({ visibleSetting: true })
  }

  onUpdateSetting = (e, form) => {
    e.preventDefault()
    const { selectedAppIndex } = this.props
    const {
      dataQuery: { loading, data, error },
      collectionName,
    } = this.props

    const selected_document = data[selectedAppIndex]

    if (!selected_document) return

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let majorMinor = { major: 0, minor: 0 }
        if (selected_document.data && selected_document.data.appInfo && selected_document.data.appInfo.majorMinor) {
          majorMinor = selected_document.data.appInfo.majorMinor
        }
        const { major, minor } = majorMinor
        const { increaseMajor, increaseMinor } = values.comp.majorMinor

        this.onEditAppFunc(selectedAppIndex, {
          data: {
            appInfo: {
              ...values.comp,
              majorMinor: {
                major: (major || 0) + (increaseMajor == true),
                minor: (minor || 0) + (increaseMinor == true),
              },
            },
          },
        })
        this.setState({ visibleSetting: false })
      }
    })
  }

  onCancelSetting = () => {
    this.setState({ visibleSetting: false })
  }

  onScheduleModal = () => {
    const {
      dataQuery: { loading, data, error },
    } = this.props
    const { selectedAppIndex } = this.props
    if (error || loading || !data || !data[selectedAppIndex]) return
    this.setState({ visibleSchedule: true })
  }

  handleCancel_Schedule = () => {
    this.setState({ visibleSchedule: false })
  }

  onUpdateSchedule = (e, form) => {
    e.preventDefault()

    const {
      dataQuery: { loading, data, error },
    } = this.props

    const { selectedAppIndex } = this.props

    if (error || loading || !data || !data[selectedAppIndex]) return

    const selected_document = data[selectedAppIndex]

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values.comp)

        this.onEditAppFunc(selectedAppIndex, {
          ...values.comp,
        })
        this.setState({ visibleSchedule: false })
      }
    })
  }

  render() {
    const {
      dataQuery: { loading, data, error },
      collectionName,
    } = this.props

    const { visibleSetting, visibleSchedule } = this.state

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
      onItemEditFunc: (index, text) => this.onEditAppFunc(index, { name: text }),
      onSettingsFunc: this.onSettingsFunc,
      onCalendarFunc: this.onScheduleModal,
    }

    const selected_document = data[this.props.selectedAppIndex]
    const document_id = selected_document ? selected_document._id : null

    let custom_render = ''

    if (document_id) {
      const commonProps = {
        _id: document_id,
        collectionName,
      }
      switch (collectionName) {
        case 'Filters':
          custom_render = <DataDocumentFilter {...commonProps} />
          break
      }
    }

    return (
      <>
        <AppsPanel {...appsPanelParams} />
        {custom_render}
        {document_id && visibleSchedule && (
          <ScheduleFormModal title={`Schedule : ${selected_document.name}`} comp={selected_document} visible={visibleSchedule} onUpdate={this.onUpdateSchedule} onCancel={this.handleCancel_Schedule} />
        )}
        {document_id && visibleSetting && (
          <InfoFormModal
            title="Document Information"
            _id={document_id}
            comp={selected_document.data ? selected_document.data.appInfo : {}}
            visible={visibleSetting}
            onUpdate={this.onUpdateSetting}
            onCancel={this.onCancelSetting}
          />
        )}
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
        types: props.type ? [props.type] : null,
      },
    }),
  }),
  graphql(mutations.deleteMutation, { name: 'deleteMutation' }),
  graphql(mutations.dataMutation, { name: 'dataMutation' }),
  withApollo,
)(DataDocuments)
