import React, { Component } from 'react'
import { graphql, withApollo } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import * as compose from 'lodash.flowright'
import * as queries from 'utils/queries'
import * as mutations from 'utils/mutations'
import { EnumScreen } from 'utils/constants'
import OEFooter from 'components/Footer'
import _ from 'lodash'
import WhitePanelWrapper from './Grouping/WhitePanelWrapper'

import GroupDocuments from './Grouping/GroupDocuments'

const widthParams = [
  {
    min: 350,
    default: 450,
    max: 1200,
  },
  {
    min: 800,
    default: 900,
    max: 1400,
  },
  {
    min: 250,
    default: 375,
    max: 500,
  },
  {
    min: 425,
    default: 425,
    max: 700,
  },
  {
    min: 200,
    default: 375,
    max: 500,
  },
  {
    min: 200,
    default: 375,
    max: 500,
  },
  {
    min: 200,
    default: 375,
    max: 500,
  },
  {
    min: 400,
    default: 600,
    max: 1000,
  },
  {
    min: 200,
    default: 375,
    max: 500,
  },
]

class Announcer extends Component {
  constructor(props) {
    super(props)
    window.addEventListener('resize', this.updateDimensions)
    this.state = {
      selectedAppIndex: 0,
      selectedAppId: null,
      screen: EnumScreen.Groups,
      visibles: [true, false, false, false, false, false, false, false, false],
      widths: [widthParams[0].default, 0, 0, 0, 0, 0, 0, 0, 0],
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      collectionName: 'Groupings',
      groupType: '/',
      groupTypeIndex: localStorage.getItem('groupTypeIndex') || 0,
      clientId: localStorage.getItem('clientId') || 'clients',
      searchItemId: null,
      filterGroupId: null,
      grouplist: [],
      flag: false,
    }
  }

  componentDidMount() {
    const { location } = this.props
    const filterGroupId = new URLSearchParams(location.search).get('id')

    this.setState({ filterGroupId })
  }

  componentWillReceiveProps({ location }) {
    const { location: prevLocation } = this.props

    const prevGroup = new URLSearchParams(prevLocation.search).get('id')
    const nextGroup = new URLSearchParams(location.search).get('id')

    if (prevGroup !== nextGroup && nextGroup) {
      this.setState({ filterGroupId: nextGroup })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions)
  }

  onSelectAppFunc = (index, _id) => {
    const { grouplist, flag } = this.state
    let groupname = ''
    if (flag) {
      this.setState({ selectedAppIndex: index, selectedAppId: _id }, () => {
        groupname = grouplist && grouplist[index]?.name
        this.setState({ groupname }, () => {
          this.setState({ flag: false })
        })
      })
    }
  }

  navigateScreen = screen => {
    this.setState({ screen })
  }

  updateDimensions = () => {
    // let sum = 0
    // let wi = 0
    // const { widths, visibles } = this.state
    // const newVisibles = [...visibles]
    // const newWidths = [...widths]
    // let changed = false
    // for (wi = 0; wi < widths.length; wi += 1) {
    //   const w = widths[wi]
    //   if (sum + (visibles[wi] ? w : 0) > window.innerWidth) {
    //     newVisibles[wi] = false
    //     newWidths[wi] = 0
    //     changed = true
    //   }
    //   sum += visibles[wi] ? w : 0
    // }
    // if (changed) this.setState({ visibles: newVisibles, widths: newWidths })

    this.setState({ windowHeight: window.innerHeight, windowWidth: window.innerWidth })
  }

  resizePanel = (index, width) => {
    const { widths, visibles } = this.state
    let sum = 0
    widths.forEach((w, wi) => {
      sum += wi === index ? width : visibles[wi] ? w : 0
    })
    if (sum >= window.innerWidth) {
      return
    }
    this.setState({ widths: [...widths.slice(0, index), width, ...widths.slice(index + 1)] })
  }

  togglePanel = (index, show = undefined) => {
    const { widths, visibles, windowWidth } = this.state

    if (visibles[index] === show) {
      return
    }
    if (visibles[index]) {
      this.setState({ visibles: [...visibles.slice(0, index), false, ...visibles.slice(index + 1)] })

      return
    }
    let sum = 0
    let newWidth = widthParams[index].default

    if (windowWidth <= 575) {
      this.setState({
        visibles: [...visibles.slice(0, index).map(() => false), true, ...visibles.slice(index + 1).map(() => false)],
        widths: [...widths.slice(0, index), windowWidth, ...widths.slice(index + 1)],
      })

      return
    }

    widths.forEach((w, wi) => {
      sum += visibles[wi] ? w : 0
    })

    if (window.innerWidth - sum < widthParams[index].min) {
      newWidth = widthParams[index].default
    } else if (window.innerWidth - sum >= widthParams[index].default) {
      newWidth = widthParams[index].default
    } else {
      newWidth = window.innerWidth - sum
    }

    this.setState({
      widths: [...widths.slice(0, index), newWidth, ...widths.slice(index + 1)],
      visibles: [...visibles.slice(0, index), true, ...visibles.slice(index + 1)],
    })
  }

  onGroupCollectionChange = (collectionName) => {
    this.setState({ collectionName })
  }

  onGroupTypeChange = groupType => {
    // const {
    //   clientsQuery: { loading, error, data: clients },
    // } = this.props
    // const { clientId } = this.state
    // if (loading || error || !clients || !clients[0]) return

    // let myclient = clients.find(client => client._id === clientId)

    // if (!myclient) [myclient] = clients

    // const groupTypes = _.get(myclient, 'data.appInfo.groupType.options')
    // const groupTypeIndex = groupTypes.findIndex(item => item === groupType)
    // localStorage.setItem('groupTypeIndex', groupTypeIndex)
    // this.setState({ groupTypeIndex: groupTypeIndex >= 0 ? groupTypeIndex : 0 })
    this.setState({ flag: false, groupType })
  }

  onAddGroupType = newType => {
    const { clients, dataMutation } = this.props
    const { clientId } = this.state
    if (!clients || !clients[0]) return

    let myclient = clients.find(client => client._id === clientId)

    if (!myclient) [myclient] = clients
    const groupTypes = _.get(myclient, 'data.appInfo.groupType.options')
    const updated = { ...myclient }
    _.set(updated, 'data.appInfo.groupType.options', [...groupTypes, newType])

    dataMutation({
      variables: {
        ...updated,
        collectionName: 'ClientsData',
      },
    })
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }

  onRemoveGroupType = index => {
    const { clients, dataMutation } = this.props
    const { clientId } = this.state
    if (!clients || !clients[0]) return

    let myclient = clients.find(client => client._id === clientId)

    if (!myclient) [myclient] = clients
    const groupTypes = _.get(myclient, 'data.appInfo.groupType.options')
    const updated = { ...myclient }
    _.set(updated, 'data.appInfo.groupType.options', [...groupTypes.slice(0, index), ...groupTypes.slice(index + 1)])

    dataMutation({
      variables: {
        ...updated,
        collectionName: 'ClientsData',
      },
    })
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }

  onClientChange = clientId => {
    this.setState({ clientId })
    localStorage.setItem('clientId', clientId)
  }

  onSearchItemFunc = searchItemId => {
    this.setState({ searchItemId })
    this.togglePanel(3, true)
  }

  onInitSearchItemFunc = (panel, _id) => {
    if (panel === 'main') this.setState({ searchItemId: null, selectedAppId: _id })
    this.togglePanel(1, true)
  }

  updateGrouplist = grouplist => {
    this.setState({ grouplist })
  }

  showWhitePanel = (value, index, id) => {
    this.setState({ flag: true }, () => this.onSelectAppFunc(index, id))
  }

  render() {
    const {
      selectedAppIndex,
      selectedAppId,
      screen,
      visibles,
      widths,
      windowHeight,
      groupTypeIndex,
      groupType,
      clientId,
      searchItemId,
      filterGroupId,
      windowWidth,
      grouplist,
      groupname,
      collectionName,
    } = this.state

    const { clients, location, font, onChangeFont } = this.props

    const params = new URLSearchParams(location.search)
    const vGroup = params.get('id')

    const {
      groupingQuery: { grouploading, grouping, grouperror },
    } = this.props

    console.log('clients', clients)

    const containerStyle = {
      flexGrow: '1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#242d3c',
    }

    let myclient = clients.find(client => client._id === clientId)

    if (!myclient) [myclient] = clients

    const newDocuments = {
      Groupings: {
        name: 'New Group',
        collectionName,
        list: [],
        schedule: {},
        presentation: {
          mode: 'none',
        },
      },
    }

    const widthOptions = {
      visibles,
      widths,
      widthParams,
      togglePanel: this.togglePanel,
      resizePanel: this.resizePanel,
      isMobile: windowWidth <= 575,
    }

    const footerParams = {
      clients,
      clientId: myclient._id,
      onClientChange: this.onClientChange,
      font,
      visibles,
      onChangeFont,
      togglePanel: this.togglePanel,
    }
    const documentId = selectedAppId || (grouplist && grouplist[selectedAppIndex]?._id)
    const commonProps = {
      groupId: documentId,
      onExit: () => this.navigateScreen(EnumScreen.Groups),
      // onPreview: this.onPreview,
      type: groupType,
      header: { client: myclient },
      width: widthOptions.widths[1],
      options: widthOptions,
      minWidth: widthOptions.widthParams[1].min,
      maxWidth: widthOptions.widthParams[1].max,
      // onShowThirdPanel: this.showSupportPanel,
      grouplist,
      show: widthOptions.visibles[1],
      groupname,
      collectionName,
    }

    return (
      <>
        <div style={{ display: 'flex', flexGrow: '1', overflowX: 'auto', overflowY: 'hidden' }}>
          {windowHeight <= 274 && <OEFooter {...footerParams} vertical />}
          <GroupDocuments
            collectionName={collectionName}
            type={groupType}
            clients={clients}
            onGroupCollectionSelect={this.onGroupCollectionChange}
            onGroupTypeChange={this.onGroupTypeChange}
            newDocument={newDocuments.Groupings}
            onSelectFunc={this.onSelectAppFunc}
            onSelectSubFunc={this.onSearchItemFunc}
            selectedAppIndex={selectedAppIndex}
            selectedAppId={selectedAppId}
            navigateScreen={this.navigateScreen}
            bEditMode={screen === EnumScreen.GroupEdit}
            options={widthOptions}
            onChangeFont={onChangeFont}
            onClientChange={this.onClientChange}
            font={font}
            clientId={clientId}
            header={{ client: myclient }}
            filterGroupId={filterGroupId}
            vGroup={vGroup}
            searchItemId={searchItemId}
            onInitSearchItemFunc={this.onInitSearchItemFunc}
            onAddGroupType={this.onAddGroupType}
            onRemoveGroupType={this.onRemoveGroupType}
            updateGrouplist={this.updateGrouplist}
            showWhitePanel={this.showWhitePanel}
          />
          <WhitePanelWrapper key={2} {...commonProps} />
        </div>
        {windowHeight > 274 && <OEFooter {...footerParams} />}
      </>
    )
  }
}

export default compose(
  // graphql(queries.dataQuery, {
  //   name: 'clientsQuery',
  //   options: () => {
  //     const { hostname } = window.location
  //     const dashboard = hostname === 'localhost' ? 'dash.oelement.net' : hostname

  //     return {
  //       variables: {
  //         collectionName: 'ClientsData',
  //         dashboard,
  //       },
  //     }
  //   },
  // }),
  graphql(queries.groupingQuery, {
    name: 'groupingQuery',
    options: ({ header, groupType, filterGroupId }) => ({
      variables: {
        ids: filterGroupId ? [filterGroupId] : null,
        clientId: _.get(header, 'client._id'),
        type: groupType || 'none',
      },
      fetchPolicy: 'cache-and-network',
    }),
  }),
  graphql(mutations.dataMutation, { name: 'dataMutation' }),
  withApollo,
  withRouter,
)(Announcer)
