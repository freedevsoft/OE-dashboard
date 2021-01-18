import React from 'react'
import { graphql, withApollo } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import * as compose from 'lodash.flowright'
import * as queries from 'utils/queries'
import * as mutations from 'utils/mutations'
import { EnumScreen } from 'utils/constants'
import _ from 'lodash'
import objectAssignDeep from 'object-assign-deep'
import { notification, Switch } from 'antd'
import moment from 'moment'
import AssetsPanel from 'containers/Assets'
import { faCalendar, faMapMarked } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { groupingUpdate, groupingAdd, documentDelete } from 'utils/subscriptions'
import GroupDetailPanel from './GroupDetailPanel'
import IframePanel from './IframePanel'
import GroupAddModal from './Modals/AddGroup'
import PreviewModal from './Modals/Preview'

const openNotificationWithIcon = (type, message, description) => {
  notification[type]({
    message,
    description,
    placement: 'bottomRight',
  })
}

const mockupXML = group => `<mos>
<ncsItem>
  <itemID>0</itemID>
  <itemSlug>${group?.name}</itemSlug>
  <objID>${group?._id}</objID>
  <mosID>openznet.mos</mosID>
  <mosAbstract>${group?.data?.desc?.title}</mosAbstract>
  <objPaths>
      <objPath techDescription="MPEG2 Video">\\server\media\clip392028cd2320s0d.mxf</objPath>
      <objProxyPath techDescription="WM9 750Kbps">${group?.data?.desc?.image}</objProxyPath>
      <objMetadataPath techDescription="MOS Object">http://server/proxy/clipe.xml</objMetadataPath>
    </objPaths>
</ncsItem>
</mos>`

class GroupDocuments extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      bShowAddModal: false,
      bLoadingAddModal: false,
      bShowPreviewModal: false,
      subscription: null,
      iframeUrl: '',
    }
  }

  componentDidUpdate(prevProps) {
    const {
      groupingQuery: { loading, grouping, error },
      updateGrouplist,
    } = this.props
    if (grouping !== prevProps.groupingQuery.grouping) {
      updateGrouplist(grouping)
    }
  }

  componentDidMount() {
    const {
      groupingQuery: { loading, grouping, error },
      updateGrouplist,
    } = this.props
    updateGrouplist(grouping)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.groupingQuery.loading) {
      return {
        subscription: [
          nextProps.groupingQuery.subscribeToMore({
            document: groupingUpdate,
            updateQuery: (previousResult, { subscriptionData }) => {
              // No extra logic needed for now. Apollo handles the change
              console.log('groupingUpdate: ', previousResult, subscriptionData)

              return previousResult

              /* if (!subscriptionData.data || !subscriptionData.data.groupingUpdate || !previousResult || !previousResult.grouping) return previousResult

              const updatedIndex = previousResult.grouping.findIndex(group => group._id === subscriptionData.data.groupingUpdate._id)
              if (updatedIndex < 0) return previousResult

              const updatedGroups = [...previousResult.grouping]
              const previousGroup = { ...updatedGroups[updatedIndex] }
              updatedGroups.splice(updatedIndex, 1, { ...previousGroup, ...subscriptionData.data.groupingUpdate })

              return Object.assign({}, previousResult, { grouping: [...updatedGroups] }) */
            },
          }),
          nextProps.groupingQuery.subscribeToMore({
            document: documentDelete,
            updateQuery: (previousResult, { subscriptionData }) => {
              // No extra logic needed for now. Apollo handles the change
              console.log('groupingDelete: ', previousResult, subscriptionData)

              if (
                !previousResult ||
                !previousResult.grouping ||
                !subscriptionData.data ||
                !subscriptionData.data.documentDelete ||
                subscriptionData.data.documentDelete.collectionName !== nextProps.collectionName
              ) {
                return previousResult
              }

              const { grouping } = previousResult

              const deleteIndex = grouping.findIndex(group => group._id === subscriptionData.data.documentDelete._id)
              if (deleteIndex < 0) return previousResult

              let newIndex
              if (deleteIndex >= grouping.length - 1) {
                newIndex = deleteIndex <= 0 ? -1 : deleteIndex - 1
                nextProps.onSelectFunc(newIndex, grouping[newIndex] ? grouping[newIndex]._id : null)
              } else {
                nextProps.onSelectFunc(deleteIndex, grouping[deleteIndex + 1] ? grouping[deleteIndex + 1]._id : null)
              }

              return Object.assign({}, previousResult, { grouping: [...grouping.slice(0, deleteIndex), ...grouping.slice(deleteIndex + 1)] })
            },
          }),
          nextProps.groupingQuery.subscribeToMore({
            document: groupingAdd,
            updateQuery: (previousResult, { subscriptionData }) => {
              // No extra logic needed for now. Apollo handles the change
              console.log('groupingAdd: ', previousResult, subscriptionData)

              if (
                !subscriptionData.data ||
                !subscriptionData.data.groupingAdd ||
                !previousResult ||
                nextProps.header?.type !== subscriptionData.data.groupingAdd.type ||
                !previousResult.grouping
              )
                return previousResult

              const updatedIndex = previousResult.grouping.findIndex(group => group._id === subscriptionData.data.groupingAdd._id)
              if (updatedIndex >= 0) return previousResult
              nextProps.onSelectFunc(previousResult.grouping.length, updatedIndex._id)

              return Object.assign({}, previousResult, { grouping: [...previousResult.grouping, subscriptionData.data.groupingAdd] })
            },
          }),
        ],
      }
    }

    return null
  }

  onSelectAppFunc = index => {
    const {
      groupingQuery: { loading, grouping, error },
      onSelectFunc,
      options,
    } = this.props

    if (loading || error || !grouping) return

    if (!grouping[index]) {
      onSelectFunc(0, grouping[0]._id)

      return
    }

    onSelectFunc(index, grouping[index]._id)
  }

  onSelectAppNameFunc = index => {
    const {
      groupingQuery: { loading, grouping, error },
      onSelectFunc,
      options,
    } = this.props

    if (loading || error || !grouping) return

    if (!grouping[index]) {
      onSelectFunc(0, grouping[0]._id)

      return
    }

    onSelectFunc(index, grouping[index]._id)

    options.togglePanel(1, true)
  }

  onSelectItemEdit = index => {
    const {
      groupingQuery: { loading, grouping, error },
      onSelectFunc,
      options,
      showWhitePanel,
    } = this.props

    if (loading || error || !grouping) return

    if (!grouping[index]) {
      onSelectFunc(0, grouping[0]._id)

      return
    }
    showWhitePanel(true, index, grouping[index]._id)
    onSelectFunc(index, grouping[index]._id)

    options.togglePanel(1, true)
  }

  trackStateChange = (index, action) => {
    const {
      groupingQuery: { loading, grouping, error },
      upsertTracking,
      collectionName,
    } = this.props

    if (loading || error || !grouping || !grouping[index]) return

    upsertTracking({
      variables: {
        _id: grouping[index]._id,
        collectionName,
        action,
        comment: `Changed State of the Group(${grouping[index].name}) to '${action}'`,
      },
    })
      .then(() => {
        openNotificationWithIcon('success', 'Announcer', 'Tracking success!')
      })
      .catch(err => {
        console.log(err)
        openNotificationWithIcon('warning', 'Announcer', 'Tracking Failed!')
      })
  }

  onEditAppFunc = (index, values) => {
    const {
      groupingQuery: { loading, grouping, error },
      updateGroupingMuation,
      onSelectFunc,
      type,
      header,
    } = this.props
    if (loading || error || !grouping || !grouping[index]) return

    const document = grouping[index]
    const modified = objectAssignDeep(document, values)
    updateGroupingMuation({
      variables: {
        ...modified,
        clientId: modified.clientId || _.get(header, 'client._id'),
        list: modified.list
          ? modified.list.map(item => {
            const { __typename, ...rest } = item

            return rest
          })
          : [],
        majorMinor: {
          major: modified.majorMinor ? modified.majorMinor.major : 0,
          minor: modified.majorMinor ? modified.majorMinor.minor : 0,
        },
        schedule: {
          recurrenceType: 'none',
          ...(modified.schedule ? modified.schedule : {}),
          __typename: undefined,
          status: undefined,
        },
        presentation: {
          ...(modified.presentation ? modified.presentation : {}),
          __typename: undefined,
        },
        presentationMode: {
          ...(modified.presentationMode ? modified.presentationMode : {}),
          __typename: undefined,
        },
        availability: {
          ...(modified.availability ? modified.availability : { state: 'off' }),
          state: _.get(modified, 'availability.state') || '',
          __typename: undefined,
        },
      },
      update: (proxy, { data: { updateGrouping } }) => {
        try {
          console.log(updateGrouping)

          const data = proxy.readQuery({
            query: queries.groupingQuery,
            variables: {
              ids: null,
              clientId: _.get(header, 'client._id'),
              type,
            },
          })

          data.grouping[index] = updateGrouping
          onSelectFunc(index, updateGrouping._id)

          proxy.writeQuery({
            query: queries.groupingQuery,
            variables: {
              ids: null,
              clientId: _.get(header, 'client._id'),
              type,
            },
            data,
          })
        } catch (error) {
          console.error(error)
        }
      },
    })
      .then(() => {
        openNotificationWithIcon('success', 'Announcer', 'Updated successfully!')
      })
      .catch(err => {
        console.log(err)
        openNotificationWithIcon('warning', 'Announcer', 'Failed to Update')
      })
  }

  onAddAppFunc = (e, form) => {
    const {
      createGroupingMuation,
      newDocument,
      stylesQuery: { styleLoading, styleError },
      onSelectFunc,
    } = this.props
    e.preventDefault()
    if (styleLoading || styleError) return

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const newName = values.name

        const {
          groupingQuery: { loading, grouping, error },
          header,
          type,
        } = this.props

        if (error || loading || !grouping) return

        if (!type) {
          openNotificationWithIcon('warning', 'Announcer', 'Please select specific Group Type')

          return
        }

        if (grouping.findIndex(group => group.name === newName) >= 0) {
          openNotificationWithIcon('warning', 'Announcer', 'That Group Name is already existed! Please use another name.')

          return
        }

        this.setState({ bLoadingAddModal: true })

        createGroupingMuation({
          variables: {
            ...newDocument,
            name: newName,
            clientId: _.get(header, 'client._id'),
            type,
          },
          update: (proxy, { data: { createGrouping } }) => {
            try {
              const data = proxy.readQuery({
                query: queries.groupingQuery,
                variables: {
                  ids: null,
                  clientId: _.get(header, 'client._id'),
                  type,
                },
              })

              if (data.grouping.findIndex(group => group._id === createGrouping._id) >= 0) return

              onSelectFunc(data.grouping.length, createGrouping._id)

              proxy.writeQuery({
                query: queries.groupingQuery,
                variables: {
                  ids: null,
                  clientId: _.get(header, 'client._id'),
                  type,
                },
                data: { grouping: [...data.grouping, createGrouping] },
              })
            } catch (error) {
              console.error(error)
            }
          },
        })
          .then(() => {
            openNotificationWithIcon('success', 'Announcer', `Group(${newName}) is successfully added!`)
            this.setState({ bShowAddModal: false, bLoadingAddModal: false })
          })
          .catch(err => {
            openNotificationWithIcon('warning', 'Announcer', `Failed to Add a Group(${newName})!`)
            console.log('GroupDocuments/onAddAppFunc Error: ', err)
            this.setState({ bShowAddModal: false, bLoadingAddModal: false })
          })
      }
    })
  }

  onAddFieldFunc = values => {
    const {
      createGroupingMuation,
      newDocument,
      stylesQuery: { styleLoading, styleError },
      onSelectFunc,
    } = this.props

    if (styleLoading || styleError) return

    const newName = values

    const {
      groupingQuery: { loading, grouping, error },
      header,
      type,
    } = this.props
    if (error || loading || !grouping) return

    if (!type) {
      openNotificationWithIcon('warning', 'Announcer', 'Please select specific Group Type')

      return
    }

    if (grouping.findIndex(group => group.name === newName) >= 0) {
      openNotificationWithIcon('warning', 'Announcer', 'That Group Name is already existed! Please use another name.')

      return
    }
    this.setState({ bLoadingAddModal: true })

    createGroupingMuation({
      variables: {
        ...newDocument,
        name: newName,
        clientId: _.get(header, 'client._id'),
        type,
      },
      update: (proxy, { data: { createGrouping } }) => {
        try {
          const data = proxy.readQuery({
            query: queries.groupingQuery,
            variables: {
              ids: null,
              clientId: _.get(header, 'client._id'),
              type,
            },
          })

          if (data.grouping.findIndex(group => group._id === createGrouping._id) >= 0) return

          onSelectFunc(data.grouping.length, createGrouping._id)
          console.log('Herere it is------------')
          proxy.writeQuery({
            query: queries.groupingQuery,
            variables: {
              ids: null,
              clientId: _.get(header, 'client._id'),
              type,
            },
            data: { grouping: [...data.grouping, createGrouping] },
          })
        } catch (error) {
          console.error(error)
        }
      },
    })
      .then(() => {
        openNotificationWithIcon('success', 'Announcer', `Group(${newName}) is successfully added!`)
        this.setState({ bShowAddModal: false, bLoadingAddModal: false })
      })
      .catch(err => {
        openNotificationWithIcon('warning', 'Announcer', `Failed to Add a Group(${newName})!`)
        console.log('GroupDocuments/onAddAppFunc Error: ', err)
        this.setState({ bShowAddModal: false, bLoadingAddModal: false })
      })
  }

  onDeleteAppFunc = index => {
    const {
      groupingQuery: { loading, grouping, error },
      collectionName,
      deleteMutation,
      onSelectFunc,
      type,
      header,
    } = this.props
    // const {selectedAppIndex} = this.props;
    const selectedAppIndex = index

    if (loading || error || !grouping) return

    if (!grouping[selectedAppIndex]) {
      console.log('apps grouping modified by others')

      return
    }

    const document = grouping[selectedAppIndex]

    deleteMutation({
      variables: {
        collectionName,
        _id: document._id,
      },
      update: proxy => {
        const data = proxy.readQuery({
          query: queries.groupingQuery,
          variables: {
            ids: null,
            clientId: _.get(header, 'client._id'),
            type,
          },
        })

        const deleteIndex = data.grouping.findIndex(group => group._id === document._id)

        if (deleteIndex < 0) return

        let newIndex
        if (deleteIndex >= data.grouping.length - 1) {
          newIndex = deleteIndex <= 0 ? -1 : deleteIndex - 1
          onSelectFunc(newIndex, data.grouping[newIndex] ? data.grouping[newIndex]._id : null)
        } else {
          onSelectFunc(deleteIndex, data.grouping[deleteIndex + 1] ? data.grouping[deleteIndex + 1]._id : null)
        }

        proxy.writeQuery({
          query: queries.groupingQuery,
          variables: {
            ids: null,
            clientId: _.get(header, 'client._id'),
            type,
          },
          data: { grouping: [...data.grouping.slice(0, deleteIndex), ...data.grouping.slice(deleteIndex + 1)] },
        })
      },
    })
      .then(() => {
        openNotificationWithIcon('success', 'Announcer', 'Successfully deleted!')
      })
      .catch(err => {
        openNotificationWithIcon('warning', 'Announcer', 'Failed to delete!')
        console.log('GroupDocuments/DeleteAppFunc Error: ', err)
      })
  }

  onUpdate = (e, form) => {
    e.preventDefault()
    const {
      groupingQuery: { loading, grouping, error },
    } = this.props

    const { selectedAppIndex } = this.props

    if (error || loading || !grouping || !grouping[selectedAppIndex]) return
    const selectedDocument = grouping[selectedAppIndex]

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const major = _.get(selectedDocument, 'majorMinor.major')
        const minor = _.get(selectedDocument, 'majorMinor.minor')

        this.onEditAppFunc(selectedAppIndex, {
          ...values.comp,
          majorMinor: {
            major: (major || 0) + (_.get(values, 'comp.majorMinor.increaseMajor') === true),
            minor: (minor || 0) + (_.get(values, 'comp.majorMinor.increaseMinor') === true),
          },
        })
      }
    })
  }

  switchStateFunc = index => {
    const {
      groupingQuery: { loading, grouping, error },
      type,
    } = this.props

    if (error || loading || !grouping || !grouping[index]) return

    if (grouping[index].availability && grouping[index].availability.state === 'on') {
      this.onEditAppFunc(index, { availability: { state: 'off' } })
      this.trackStateChange(index, 'off')
    } else {
      switch (type) {
        case 'Programs':
        case 'ENPS':
          for (const i in grouping) {
            if (i === index) continue

            const group = grouping[i]

            if (group.availability && group.availability.state === 'on') {
              this.onEditAppFunc(i, { availability: { state: 'off' } })
              this.trackStateChange(i, 'off')
            }
          }
          this.onEditAppFunc(index, { availability: { state: 'on' } })
          this.trackStateChange(index, 'on')
          break
        default:
          this.onEditAppFunc(index, { availability: { state: 'on' } })
          this.trackStateChange(index, 'on')
          break
      }
    }
  }

  onPreview = () => {
    this.setState({ bShowPreviewModal: true })
  }

  setIframeUrl = iframeUrl => {
    this.setState({ iframeUrl })
  }

  render() {
    const {
      groupingQuery: { loading, grouping, error },
      navigateScreen,
      type,
      header,
      options,
      onGroupTypeChange,
      font,
      searchItemId,
      onInitSearchItemFunc,
      onAddGroupType,
      onRemoveGroupType,
      onGroupCollectionSelect,
      collectionName
    } = this.props
    const { selectedAppIndex, selectedAppId, onSelectSubFunc, applicationId } = this.props
    const { bShowAddModal, bLoadingAddModal, bShowPreviewModal, iframeUrl } = this.state

    if (loading) {
      return (
        <GroupDetailPanel
          loading
          width={options.widths[0]}
          options={options}
          minWidth={options.widthParams[0].min}
          maxWidth={options.widthParams[0].max}
        />
      )
    }

    if (error || !grouping) {
      return ''
    }

    const appsPanelParams = {
      dataList: grouping.map(app => {
        const prefix = <Switch checked={app.availability && app.availability.state === 'on'} size="small" />
        let rightIcon = null
        let scheduleColor = null
        const icons = []

        if (_.get(app, 'data.location.bActive')) {
          icons.push('map')
        }

        if (_.get(app, 'data.bRule')) {
          icons.push('/images/icons/rule.png')
        }

        if (_.get(app, 'schedule.bActive')) {
          rightIcon = '/images/icons/gray-sm.png'
          if (app.availability && app.availability.state === 'on') {
            if (_.get(app, 'schedule.status') === 'active') {
              rightIcon = '/images/icons/green.png'
              scheduleColor = 'green'
            }
            if (_.get(app, 'schedule.status') === 'expired') {
              rightIcon = '/images/icons/red.png'
              scheduleColor = 'red'
            }
            if (_.get(app, 'schedule.status') === 'inactive') {
              rightIcon = '/images/icons/orange.png'
              scheduleColor = 'orange'
            }
          }
          icons.push(scheduleColor)
        }

        return {
          _id: app._id,
          name: app.name,
          editable: true,
          data: app.data,
          borderLeftSecond: _.get(app, 'style.hl_color'),
          prefix,
          scheduleColor,
          addon: (
            <>
            {icons.map((icon, index) => (
                (icon == 'map') ?
                  <span key={index} style={{ marginRight: '4px' }}>
                    <FontAwesomeIcon icon={faMapMarked} size="sm" color={icon} />
                  </span> :
                  <span key={index} style={{ marginRight: '4px' }}>
                    <FontAwesomeIcon icon={faCalendar} size="sm" color={icon} />
                  </span>
                // <img
                //   src={icon}
                //   style={{
                //     maxWidth: '30px',
                //     maxHeight: '16px',
                //     marginRight: '2px',
                //   }}
                //   key={icon}
                //   alt="filter"
                // />
              ))}
              <span>{moment(app.updatedAt).format('MM/DD hh:mm')}</span>
            </>
          ),
        }
      }),
      selectedIndex: selectedAppIndex,
      selectItem: index => {
        this.onSelectAppFunc(index)
      },
      onBack: () => {
        if (type && type !== '/') {
          const folders = type.split('/')

          if (folders.length > 2) onGroupTypeChange(`${folders.slice(0, -2).join('/')}/`)
        }
      },
      selectItemName: index => {
        // this.onSelectAppNameFunc(index)
        const groupName = grouping[index].name
        if (groupName?.endsWith('/')) {
          onGroupTypeChange(`${type}${grouping[index].name}`)
        }
      },
      selectItemEdit: this.onSelectItemEdit,
      selectIcon: this.switchStateFunc,
      selectSubItem: onSelectSubFunc,
      onItemDeleteFunc: this.onDeleteAppFunc,
      onItemAddFunc: () => {
        this.setState({ bShowAddModal: true, bLoadingAddModal: false })
      },
      onGroupAddFun: this.onAddFieldFunc,
      onItemEditFunc: (index, text) => {
        this.onEditAppFunc(index, { name: text })
      },
      onItemDropFunc: () => { },
      onDragItem: (e, index) => {
        e.dataTransfer.setData('Text', mockupXML(grouping[index]))
        e.dataTransfer.effectAllowed = 'copyMove'
        e.dataTransfer.dropEffect = 'copy'
      },
      onEditItem: () => navigateScreen(EnumScreen.GroupEdit),
      onArticles: () => navigateScreen(EnumScreen.Articles),
      header,
      groupType: type,
      onGroupTypeChange,
      font,
      onAddGroupType,
      onRemoveGroupType,
      onGroupCollectionSelect,
      collectionName
    }

    const customRender = []
    if (options.visibles[0]) {
      customRender.push(
        <GroupDetailPanel
          key={0}
          {...appsPanelParams}
          width={options.widths[0]}
          options={options}
          minWidth={options.widthParams[0].min}
          maxWidth={options.widthParams[0].max}
        />,
      )
    }

    customRender.push(
      <AssetsPanel
        key={1}
        navigateScreen={navigateScreen}
        options={options}
        header={header}
        onSelectFunc={onInitSearchItemFunc}
        searchPattern={{
          panel: 'main',
          id: searchItemId,
        }}
        selectedAppId={selectedAppId}
        {...appsPanelParams}
      />,
    )

    // if (documentId) {
    //   const commonProps = {
    //     groupId: documentId,
    //     onExit: () => navigateScreen(EnumScreen.Groups),
    //     onPreview: this.onPreview,
    //     type,
    //     header,
    //     width: options.widths[1],
    //     options,
    //     minWidth: options.widthParams[1].min,
    //     maxWidth: options.widthParams[1].max,
    //     onShowThirdPanel: this.showSupportPanel,
    //     grouplist: grouping,
    //     show: options.visibles[1],
    //   }
    //   customRender.push(<WhitePanelWrapper key={2} {...commonProps} />)
    // }

    if (options.visibles[7]) {
      customRender.push(
        <IframePanel
          url={iframeUrl}
          setUrl={this.setIframeUrl}
          width={options.widths[7]}
          options={options}
          minWidth={options.widthParams[7].min}
          maxWidth={options.widthParams[7].max}
          key={3}
        />,
      )
    }

    return (
      <>
        {customRender}
        {bShowPreviewModal && (
          <PreviewModal
            title="Preview"
            visible={bShowPreviewModal}
            onCancel={() => this.setState({ bShowPreviewModal: false })}
            client={header.client}
          />
        )}
        {bShowAddModal && (
          <GroupAddModal
            title="Add a new Category"
            visible={bShowAddModal}
            loading={bLoadingAddModal}
            initialValue={applicationId}
            onCancel={() => this.setState({ bShowAddModal: false })}
            onUpdate={this.onAddAppFunc}
          />
        )}
      </>
    )
  }
}

export default compose(
  graphql(queries.groupingQuery, {
    name: 'groupingQuery',
    options: ({ header, type, filterGroupId, collectionName }) => ({
      variables: {
        ids: filterGroupId ? [filterGroupId] : null,
        clientId: _.get(header, 'client._id'),
        type: type || 'none',
        collectionName
      },
      fetchPolicy: 'cache-and-network',
    }),
  }),
  graphql(queries.dataQuery, {
    name: 'stylesQuery',
    options: () => ({
      variables: {
        collectionName: 'StylesData',
        types: ['group'],
      },
    }),
  }),
  graphql(mutations.deleteMutation, { name: 'deleteMutation' }),
  graphql(mutations.upsertTracking, { name: 'upsertTracking' }),
  graphql(mutations.createGroupingMuation, { name: 'createGroupingMuation' }),
  graphql(mutations.updateGroupingMuation, { name: 'updateGroupingMuation' }),
  withApollo,
  withRouter,
)(GroupDocuments)
