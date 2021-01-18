import React, { Component } from 'react'

import { graphql, withApollo } from 'react-apollo'
import * as compose from 'lodash.flowright'

import * as mutations from 'utils/mutations'
import * as queries from 'utils/queries'
import * as constants from 'utils/constants'
import * as treeUtils from 'utils/tree'

import { Button, Modal, notification } from 'antd'
import _ from 'lodash'

import FoldersPanel from './FoldersPanel/index'
import AddModal from './Modals/Add'

import { configData as localConfigData } from '../Organizer/configData'

const openNotificationWithIcon = (type, message, description) => {
  notification[type]({
    message,
    description,
    placement: 'bottomRight',
  })
}

const getKeyFromSearchPattern = (node, key, searchId) => {
  if (node.folders && node.folders.length) {
    // node has folders
    for (const folderIndex in node.folders) {
      const folder = node.folders[folderIndex]
      const result = getKeyFromSearchPattern(folder, `${key}-${folderIndex}`, searchId)
      if (result) return result
    }
  }
  if (node.ids && node.ids.length) {
    for (const resourceIndex in node.ids) {
      const resource = node.ids[resourceIndex]
      if (resource.id === searchId) return `${key}-${resourceIndex}`
    }
  }

  return null
}

class AssetsPanel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      collectionName: 'OrganizerEvents',
      orgDocIndex: 0,

      configData: [],
      folderPanelTree: [],
      openKeys: {
        main: ['0'],
      },
      main: {
        currentKey: '0',
        disableAdd: false,
        disableAddItem: true,
        disableDel: true,
      },

      visibleDelete: false,
      visibleDeleteArticle: false,

      mode: 'edit',

      selectedTab: '1',
    }

    this.backup = this.backup.bind(this)
  }

  async componentDidMount() {
    const { openKeys, main, orgDocIndex } = this.state
    const { header } = this.props

    const folderTree = await this.loadSelectedTree();
    this.setState({ folderPanelTree: folderTree, });

    const clientId = _.get(header, 'client._id')

    if (!clientId) {
      this.organizerMute()

      return
    }

    const configData = await this.loadFromDB(`${clientId}.organizer`)
    this.setState({
      configData,
      loading: false,
      openKeys: {
        ...openKeys,
        main: ['0'],
      },
      main: {
        ...main,
        currentKey: '0',
      },
    })

    this.idsBackup = this.backup(configData)

    const { searchPattern } = this.props
    if (searchPattern) {
      const searchKey = getKeyFromSearchPattern(configData[orgDocIndex].root, '0', searchPattern.id)
      if (searchKey != null) {
        this.setCurrentKey(searchPattern.panel, searchKey)
        this.setOpenKey(searchPattern.panel, searchKey)
      }
    }
  }

  async componentWillReceiveProps(nextProps) {
    const { searchPattern, header } = this.props
    const { orgDocIndex } = this.state
    const folderTree = await this.loadSelectedTree();
    this.setState({ folderPanelTree: folderTree, });
    if (_.get(nextProps, 'header.client._id') !== _.get(header, 'client._id')) {
      const clientId = _.get(nextProps, 'header.client._id')

      if (!clientId) {
        this.organizerMute()

        return
      }

      const configData = await this.loadFromDB(`${clientId}.organizer`)
      this.setState({
        configData,
        loading: false,
        openKeys: {
          main: ['0'],
        },
        main: {
          currentKey: '0',
          disableAdd: false,
          disableAddItem: true,
          disableDel: true,
        },
      })

      this.idsBackup = this.backup(configData)

      const { searchPattern } = nextProps
      if (searchPattern) {
        const searchKey = getKeyFromSearchPattern(configData[orgDocIndex].root, '0', searchPattern.id)
        if (searchKey != null) {
          this.setCurrentKey(searchPattern.panel, searchKey)
          this.setOpenKey(searchPattern.panel, searchKey)
        }
      }
    }

    if (nextProps.searchPattern && (nextProps.searchPattern.panel !== searchPattern.panel || nextProps.searchPattern.id !== searchPattern.id)) {
      // update searchPattern

      const { configData, loading } = this.state

      if (loading || !configData || !nextProps.searchPattern.id) return

      const { searchPattern } = nextProps
      const searchKey = getKeyFromSearchPattern(configData[orgDocIndex].root, '0', searchPattern.id)
      if (searchKey != null) {
        this.setCurrentKey(searchPattern.panel, searchKey)
        this.setOpenKey(searchPattern.panel, searchKey)
      }
    }
  }

  organizerMute = () => {
    this.setState({
      configData: [],
      loading: false,
      openKeys: {
        main: ['0'],
      },
      main: {
        disableAdd: true,
        disableAddItem: true,
        disableDel: true,
        currentKey: '0',
      },
    })
  }

  orgDocIndexChange = value => {
    this.setState({
      orgDocIndex: value,
      loading: false,
      openKeys: {
        main: ['0'],
        support: ['0'],
      },
      main: {
        currentKey: '0',
        disableAdd: false,
        disableAddItem: true,
        disableDel: true,
      },
      supportDocType: null,
      supportIndex: 0,
      support: {
        currentKey: '0',
      },
    })
  }

  loadFromDB = async collectionName => {
    const options = {
      query: queries.organizerQuery,
      variables: {
        ownerIds: null,
        collectionName,
      },
    }
    const { client } = this.props
    const res = await client.query(options)
    console.log("res::", res)
    const currentLength = res.data.organizer ? res.data.organizer.length : 0

    for (let i = currentLength; i < localConfigData.length; i++) {
      res.data.organizer.push({ _id: null, root: localConfigData[i].root, collectionName })
    }

    return res.data.organizer
  }

  loadSelectedTree = async () => {
    const { dataList, client, selectedIndex, groupType } = this.props;
    const paramType = typeof dataList[selectedIndex] !== 'undefined' ? `${groupType}${dataList[selectedIndex].name}` : '-';
    const options = {
      query: queries.groupingQuery,
      variables: {
        type: paramType,
      },
    }
    const { loading, data, error } = await client.query(options)
    if (data.grouping.length > 0) {
      const returnData = { "root": { 'name': dataList[selectedIndex].name, 'folders': [] } };
      if (typeof data.grouping !== 'undefined')
        data.grouping.map((folderData) => {
          returnData.root.folders.push({ 'name': folderData.name, 'folders': [] });
        });
      return returnData;
    } else {
      return [];
    }
  }

  onOrganizerCollectionChange = async collectionName => {
    // this.setState({ collectionName, loading: true })
    // const configData = await this.loadFromDB(collectionName)
    // this.setState({
    // configData,
    // loading: false,
    // openKeys: {
    //     main: ['0'],
    // },
    // main: {
    //     currentKey: '0',
    //     disableAdd: false,
    //     disableAddItem: true,
    //     disableDel: true,
    // },
    // collectionName,
    // })
    // this.idsBackup = this.backup(configData)
  }

  backup = configData => {
    const result = {}
    const iterateNode = (node, doc) => {
      if (node.ids) {
        node.ids.forEach(item => {
          result[item.id] = doc
        })
      }
      if (node.folders) {
        node.folders.forEach(folder => {
          iterateNode(folder, node.doc ? node.doc : doc)
        })
      }
    }

    for (const i in configData) {
      const resources = configData[i].root.folders
      for (const j in resources) {
        iterateNode(resources[j], resources[j].doc ? resources[j].doc : configData[i].doc)
      }
    }

    return result
  }

  addToUploadedFolder = (doc_type, id) => {
    // const { supportDocType } = this.state
    // this.setState({ supportDocType })
    /*
// needs to save this commented code blocks because Azita doesn't want to lose this
let { configData } = this.state;
let personal_root = configData[0].root

console.log('addToUploadedFolder: ', personal_root, doc_type, id)

let index = personal_root.folders.findIndex(folder => {
  return folder.doc.type == doc_type
})
if (index >= 0) {
  let folder = personal_root.folders[index]
  let uploaded_folder_index = folder.folders.findIndex(folder => {
    return folder.name == 'Uploaded'
  })
  if (uploaded_folder_index >= 0) {
    let uploaded_folder = folder.folders[uploaded_folder_index]
    if (!uploaded_folder.ids)
      uploaded_folder.ids = []
    uploaded_folder.ids.push({ id, name: 'New Asset' })
    console.log('Upload file to Uploaded Folder: ', configData)

    this.setState({ configData })
    this.onSaveFunc();
    return folder.doc
  }
}
return null
*/
  }

  onExpand = (panel, keys) => {
    this.setState({
      openKeys: {
        ...this.state.openKeys,
        [panel]: keys,
      },
    })
  }

  onSaveFunc = () => {
    const { configData, orgDocIndex } = this.state
    const { organizerMutation, header } = this.props

    const clientId = _.get(header, 'client._id')

    if (!clientId) return

    const collectionName = `${clientId}.organizer`

    if (!configData || !configData[orgDocIndex]) {
      console.log('onSaveFunc Error')

      return
    }

    const organizer = configData[orgDocIndex]

    console.log('before mutation: ', organizer)
    this.setState({ loading: true })
    organizerMutation({
      variables: {
        _id: organizer._id,
        collectionName,
        root: organizer.root,
        version: organizer.version,
      },
    })
      .then(res => {
        if (res && res.data && res.data.upsertOrganizer) {
          this.setState({
            configData: [
              ...configData.slice(0, orgDocIndex),
              {
                ...organizer,
                _id: res.data.upsertOrganizer._id,
                version: res.data.upsertOrganizer.version,
              },
              ...configData.slice(orgDocIndex + 1),
            ],
          })
        }
        this.setState({ loading: false, visibleDelete: false, visibleDeleteArticle: false, visibleAdd: false })
      })
      .catch(err => {
        console.log(err)
        this.setState({ loading: false, visibleDelete: false, visibleDeleteArticle: false, visibleAdd: false })
      })
  }

  // touched
  getInfoFromKey = key => {
    const { configData, orgDocIndex } = this.state

    if (!configData || !configData[orgDocIndex]) {
      return null
    }

    return treeUtils.getInfoFromKey(configData[orgDocIndex].root, key)
  }

  setCurrentKey = async (panel, key) => {
    const keyInfo = this.getInfoFromKey(key)

    if (!keyInfo) {
      this.setState({
        [panel]: {
          ...this.state[panel],
          currentKey: key,
        },
      })

      return
    }

    const disableAdd = keyInfo.isRoot ? !treeUtils.isAddFolderEnabled(keyInfo) : !treeUtils.isAddAssetEnabled(keyInfo)

    // const disableAdd = !treeUtils.isAddFolderEnabled(keyInfo)
    // const disableAddItem = !treeUtils.isAddAssetEnabled(keyInfo)
    this.setState({
      [panel]: {
        ...this.state[panel],
        currentKey: key,
        disableAdd,
        disableAddItem: true,
        disableDel: key === '0',
      },
    })
  }

  onAddFunc = (e, form) => {
    e.preventDefault()
    const panel = 'main'

    const {
      [panel]: { currentKey },
    } = this.state

    const keyInfo = this.getInfoFromKey(currentKey)
    if (!keyInfo) {
      return
    }

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (keyInfo.isRoot) {
          treeUtils.addFolderToFolder(keyInfo, {
            name: values?.name,
            ids: [],
          })
          this.onSaveFunc()
          this.setCurrentKey(panel, `${currentKey}-${keyInfo.node.folders.length - 1}`)
        } else {
          this.setState({ loading: true })
          this.mutateGroup(values?.name, values?.type)
            .then(res => {
              if (res.data.createGrouping) {
                this.addRealArticle(panel, res.data.createGrouping)
              }
              this.setState({ loading: false, visibleAdd: false })
            })
            .catch(() => {
              this.setState({ loading: false })
            })
        }
      }
    })
  }

  setOpenKey = (panel, key) => {
    const openKeys = this.state.openKeys[panel].filter(openKey => openKey != key)
    openKeys.push(key)
    this.setState({
      openKeys: {
        ...this.state.openKeys,
        [panel]: openKeys,
      },
    })
  }

  onSelectItemFunc = async (panel, keys) => {
    // if (keys[0] === this.state[panel].currentKey) return

    const key = keys[0]
    const { onSelectFunc } = this.props
    const assetId = this.getAssetID(key)
    if (assetId && onSelectFunc) onSelectFunc(panel, assetId)

    this.setCurrentKey(panel, key)
  }

  onDeleteFunc = panel => {
    const { currentKey } = this.state[panel]
    const keyInfo = this.getInfoFromKey(currentKey)
    const newKey = treeUtils.deleteByKeyInfo(keyInfo, currentKey)

    this.onSaveFunc()
    this.setCurrentKey(panel, newKey)
  }

  // deprecated
  titleChanged = (panel, changedName) => {
    const { currentKey } = this.state[panel]
    const keyInfo = this.getInfoFromKey(currentKey)

    if (!keyInfo || !keyInfo.node || keyInfo.node.name === changedName) return

    if (keyInfo.isAsset) {
      const id = _.get(keyInfo, 'node.id')
      this.updateArticleName(id, changedName)
        .then()
        .catch()
    }

    treeUtils.changeName(keyInfo, changedName)
    this.onSaveFunc()
  }

  // From ingested folder
  onDropFunc = (panel, { event, node, dragNode, dragNodesKeys }) => {
    let eventNode = event.dataTransfer.getData('ingest_eventNode')
    let eventDoc = event.dataTransfer.getData('ingest_eventDoc')
    const dropKey = node.props.eventKey

    const { configData } = this.state

    if (eventNode && eventDoc) {
      eventNode = JSON.parse(eventNode)
      eventDoc = JSON.parse(eventDoc)

      const keyInfo = treeUtils.getInfoFromKey(configData[0].root, dropKey)

      if (treeUtils.isAddAssetEnabled(keyInfo, eventDoc.type)) {
        treeUtils.addAssetToFolder(keyInfo, eventNode)
        this.onSaveFunc()

        this.setState({
          openKeys: {
            ...this.state.openKeys,
            [panel]: [...this.state.openKeys[panel], dropKey],
          },
          [panel]: {
            currentKey: dropKey,
          },
        })
      }

      event.dataTransfer.setData('ingest_eventNode', null)
      event.dataTransfer.setData('ingest_eventDoc', null)
    } else {
      eventNode = event.dataTransfer.getData('normal_dragNode')
      eventDoc = event.dataTransfer.getData('normal_dragDoc')

      if (eventNode && eventDoc) {
        eventNode = JSON.parse(eventNode)
        eventDoc = JSON.parse(eventDoc)

        const keyInfo = treeUtils.getInfoFromKey(configData[0].root, dropKey)

        if (treeUtils.isAddAssetEnabled(keyInfo, eventDoc.type)) {
          treeUtils.addAssetToFolder(keyInfo, eventNode)
          this.onSaveFunc()

          this.setState({
            openKeys: {
              ...this.state.openKeys,
              [panel]: [...this.state.openKeys[panel], dropKey],
            },
            [panel]: {
              currentKey: dropKey,
            },
          })
        }

        event.dataTransfer.setData('normal_dragNode', null)
        event.dataTransfer.setData('normal_dragDoc', null)
      }
    }
  }

  addRealArticle = (panel, asset) => {
    const { currentKey } = this.state[panel]
    const keyInfo = this.getInfoFromKey(currentKey)
    treeUtils.addAssetToFolder(keyInfo, {
      id: asset._id,
      name: asset.name,
    })
    this.onSaveFunc()
    this.setState({
      openKeys: {
        ...this.state.openKeys,
        [panel]: [...this.state.openKeys[panel], currentKey],
      },
      [panel]: {
        ...this.state[panel],
        currentKey: `${currentKey}-${keyInfo.node.ids.length - 1}`,
        disableAdd: true,
        disableAddItem: true,
      },
    })
  }

  updateArticleName = (_id, name) =>
    new Promise((resolve, reject) => {
      const { updateArticle } = this.props
      updateArticle({
        variables: {
          collectionName: queries.eventCollection,
          _id,
          name,
          version: 1,
        },
        update: (proxy, { data: { updateArticle } }) => {
          try {
            proxy.writeQuery({
              query: queries.eventQuery,
              variables: {
                _id,
                collectionName: queries.eventCollection,
              },
              data: {
                article: [updateArticle],
              },
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

  mutateGroup = (name, type) =>
    new Promise((resolve, reject) => {
      const {
        header,
        createGroupingMuation,
        stylesQuery: { styleLoading, styleError, data: styles },
        groupingQuery: { groupLoading, grouping, groupError },
      } = this.props

      if (styleLoading || styleError) reject()
      if (groupLoading || groupError || !grouping) reject()

      const defaultStyleDocument = styles.find(item => item.name === 'Default')

      if (!defaultStyleDocument) reject()

      if (grouping.findIndex(group => group.name === name && group.type === type) >= 0) {
        openNotificationWithIcon('warning', 'Announcer', 'That Group Name is already existed! Please use another name.')
        reject()

        return
      }

      const newDocument = {
        name,
        type,
        collectionName: 'Groupings',
        list: [],
        schedule: {},
        presentation: {
          mode: 'none',
        },
      }
      createGroupingMuation({
        variables: {
          ...newDocument,
          clientId: _.get(header, 'client._id'),
          style: defaultStyleDocument.style,
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
        .then(res => {
          resolve(res)
          openNotificationWithIcon('success', 'Announcer', `Group(${name}) is successfully added!`)
        })
        .catch(err => {
          reject(err)
          openNotificationWithIcon('warning', 'Announcer', `Failed to Add a Group(${name})!`)
        })
    })

  // touched
  onDeleteArticle = panel => {
    const { currentKey } = this.state[panel]
    const keyInfo = this.getInfoFromKey(currentKey)
    const newKey = treeUtils.deleteByKeyInfo(keyInfo, currentKey)

    if (newKey != currentKey) this.setCurrentKey(panel, newKey)

    this.onSaveFunc()
  }

  getAssetID = key => {
    const { configData, orgDocIndex } = this.state
    if (!configData || !configData[orgDocIndex] || !configData[orgDocIndex].root) return null

    return treeUtils.getAssetIDFromKey(configData[orgDocIndex].root, key)
  }

  updateRealArticle = (panel, asset) => {
    const { currentKey } = this.state[panel]
    const keyInfo = this.getInfoFromKey(currentKey)
    treeUtils.changeName(keyInfo, asset.name)
    this.onSaveFunc()
  }

  onDragStart = ({ event, node }) => {
    if (node.props.isLeaf) {
      const { eventKey } = node.props
      const keyInfo = this.getInfoFromKey(eventKey)

      if (keyInfo.isAsset) {
        const eventNode = keyInfo.node
        const eventDoc = keyInfo.doc
        event.dataTransfer.setData('normal_dragNode', JSON.stringify(eventNode))
        event.dataTransfer.setData('normal_dragDoc', JSON.stringify(eventDoc))
      }
    }
  }

  onDropArticle = (panel, e, drag_index, drop_index) => {
    // const { currentKey } = this.state[panel]
    // const { data } = this.getArrayFromKey(currentKey);
    // if (drag_index < drop_index) {
    // let temp = data.ids[drag_index]
    // for (let i = drag_index + 1; i <= drop_index; i++) {
    //     data.ids[i - 1] = data.ids[i]
    // }
    // data.ids[drop_index] = temp
    // } else {
    // let temp = data.ids[drag_index]
    // for (let i = drag_index - 1; i >= drop_index; i--) {
    //     data.ids[i + 1] = data.ids[i]
    // }
    // data.ids[drop_index] = temp
    // }
    // this.onSaveFunc()
  }

  onDragOverArticle = (e, drop_index) => { }

  hideAddModal = () => this.setState({ visibleAdd: false })

  showAddModal = () => this.setState({ visibleAdd: true })

  hideDeleteFolderModal = () => this.setState({ visibleDelete: false })

  showDeleteFolderModal = () => this.setState({ visibleDelete: true })

  hideDeleteArticleModal = () => this.setState({ visibleDeleteArticle: false })

  showDeleteArticleModal = () => this.setState({ visibleDeleteArticle: true })

  changeMode = mode => {
    this.setState({ mode })
  }

  onChangeTab = activeKey => {
    this.setState({ selectedTab: activeKey })
  }

  render() {
    const { configData, loading, selectedTab, main, visibleDelete, visibleDeleteArticle, visibleAdd, collectionName, orgDocIndex, folderPanelTree } = this.state
    const { disableAdd, disableAddItem, disableDel, currentKey } = main
    const {
      openKeys: { main: openKeys },
    } = this.state
    const {
      groupingQuery: { grouping, error },
      header,
      navigateScreen,
      options,
      selectedAppId
    } = this.props

    const selectedOrgDoc = configData[orgDocIndex]

    const currentResourceID = this.getAssetID(currentKey)
    const keyInfo = this.getInfoFromKey(currentKey)

    console.log('grouping::', grouping)

    const foldersPanelParams = {
      data: folderPanelTree,
      loading,
      onAddFunc: this.showAddModal,
      onDeleteFunc: this.showDeleteFolderModal,
      onSelectItemFunc: e => this.onSelectItemFunc('main', e),
      disableAdd,
      disableAddItem,
      disableDel,
      onSaveFunc: this.onSaveFunc,
      currentKey,
      openKeys,
      onExpand: e => this.onExpand('main', e),
      titleChanged: e => this.titleChanged('main', e),
      onDropFunc: e => this.onDropFunc('main', e),
      onDragStart: this.onDragStart,
      onExit: () => navigateScreen(constants.EnumScreen.Groups),
      onEditItem: () => navigateScreen(constants.EnumScreen.ArticleEdit),
      disableEdit: !currentResourceID,
      orgDocIndex,
      orgDocIndexChange: this.orgDocIndexChange,
      width: options.widths[2],
      options,
      minWidth: options.widthParams[2].min,
      maxWidth: options.widthParams[2].max,
    }

    const customRender = []

    if (options.visibles[2]) {
      customRender.push(<FoldersPanel key={0} {...foldersPanelParams} />)
    }

    const groupTypes = _.get(header, 'client.data.appInfo.groupType.options')

    return (
      <>
        {customRender}
        {visibleAdd && (
          <AddModal
            bFolder={keyInfo.isRoot}
            visible={visibleAdd}
            loading={loading}
            // initialValue={applicationId}
            onCancel={this.hideAddModal}
            onUpdate={this.onAddFunc}
            groupTypes={groupTypes}
          />
        )}
        <Modal
          visible={visibleDelete}
          title={`Do you want to delete this ${currentResourceID ? 'item' : 'folder'}?`}
          onOk={() => this.onDeleteFunc('main')}
          onCancel={this.hideDeleteFolderModal}
          footer={[
            <Button key="back" onClick={this.hideDeleteFolderModal}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={() => this.onDeleteFunc('main')}>
              Delete
            </Button>,
          ]}
        >
          <p>Changes will be immediately applied</p>
        </Modal>
        <Modal
          visible={visibleDeleteArticle}
          title="Do you want to delete this article?"
          onOk={() => this.onDeleteArticle('main')}
          onCancel={this.hideDeleteArticleModal}
          footer={[
            <Button key="back" onClick={this.hideDeleteArticleModal}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={() => this.onDeleteArticle('main')}>
              Delete
            </Button>,
          ]}
        >
          <p>Changes will be immediately applied</p>
        </Modal>
      </>
    )
  }
}
export default compose(
  graphql(queries.groupingQuery, {
    name: 'groupingQuery',
    options: ({ header, selectedAppId }) => ({
      variables: {
        ids: selectedAppId ? [selectedAppId] : null,
        clientId: _.get(header, 'client._id'),
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
  graphql(mutations.organizerMutation, { name: 'organizerMutation' }),
  graphql(mutations.deleteMutation, { name: 'deleteMutation' }),
  graphql(mutations.createGroupingMuation, { name: 'createGroupingMuation' }),
  withApollo,
)(AssetsPanel)
