import React, { Component } from 'react'

import { graphql, withApollo } from 'react-apollo'
import * as compose from 'lodash.flowright'

import * as mutations from 'utils/mutations'
import * as queries from 'utils/queries'
import * as treeUtils from 'utils/tree-folder-item'

import { Button, Modal, notification } from 'antd'
import FoldersPanel from './FoldersPanel/index'

import ItemWhitePanel from './ItemWhitePanel'
import FolderWhitePanel from './FolderWhitePanel'

const openNotificationWithIcon = (type, message, description) => {
  notification[type]({
    message,
    description,
    placement: 'bottomRight',
  })
}

class DataDocumentCriteria extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,

      configData: [],
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

      visibleConfirmDialog: false,
      confirmDialogData: {
        title: 'Confirm',
        subtitle: 'Successfully saved',
      },
    }

    this.toggleConfirmDialog = this.toggleConfirmDialog.bind(this)
  }

  async componentDidMount() {
    const { collectionName, _id, selectedAppIndex } = this.props

    const configData = await this.loadFromDB(collectionName, _id, selectedAppIndex)

    this.setState({
      configData,
      loading: false,
      openKeys: {
        ...this.state.openKeys,
        main: ['0'],
      },
      main: {
        ...this.state.main,
        currentKey: '0',
        disableAdd: false,
        disableAddItem: true,
        disableDel: true,
      },
    })
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.collectionName !== this.props.collectionName || nextProps._id !== this.props._id || nextProps.selectedAppIndex !== this.props.selectedAppIndex) {
      const { collectionName, selectedAppIndex, _id } = nextProps
      const configData = await this.loadFromDB(collectionName, _id, selectedAppIndex)

      this.setState({
        configData,
        loading: false,
        openKeys: {
          ...this.state.openKeys,
          main: ['0'],
        },
        main: {
          ...this.state.main,
          currentKey: '0',
          disableAdd: false,
          disableAddItem: true,
          disableDel: true,
        },
      })
    }
  }

  loadFromDB = async (collectionName, appId, selectedAppIndex) => {
    const options = {
      query: queries.dataQuery,
      variables: appId
        ? {
          collectionName,
          ids: [appId],
        }
        : {
          collectionName,
        },
    }
    const res = await this.props.client.query(options)

    if (!res.data.data || (!appId && !res.data.data[selectedAppIndex])) return []

    return appId ? res.data.data : [res.data.data[selectedAppIndex]]
  }

  toggleConfirmDialog = () => {
    const { visibleConfirmDialog } = this.state
    this.setState({
      visibleConfirmDialog: !visibleConfirmDialog,
    })
  }

  showConfirmModal = data => {
    this.setState({
      visibleConfirmDialog: true,
      confirmDialogData: data,
    })
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
    const { configData } = this.state
    const { dataMutation, collectionName } = this.props

    if (!configData || !configData[0]) {
      console.log('onSaveFunc Error')

      return
    }

    const data = configData[0]

    console.log('before mutation: ', data)
    this.setState({ loading: true })
    dataMutation({
      variables: {
        collectionName,
        ...data,
        schedule: {
          recurrenceType: 'none',
          ...(data.schedule ? data.schedule : {}),
          __typename: undefined,
        },
      },
    })
      .then(res => {
        console.log(res)
        if (res && res.data && res.data.upsertData) {
          this.setState({
            configData: [
              {
                ...res.data.upsertData,
              },
            ],
          })
        }
        openNotificationWithIcon('success', 'Criteria', 'Successfully Done!')
        this.setState({ loading: false, visibleDelete: false })
      })
      .catch(err => {
        console.log(err)
        openNotificationWithIcon('error', 'Criteria', 'Failed to Update!')
        this.setState({ loading: false, visibleDelete: false })
      })
  }

  // touched
  getInfoFromKey = key => {
    const { configData } = this.state
    if (!configData || !configData[0] || !configData[0].data) return null

    return treeUtils.getInfoFromKey(configData[0].data, key)
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

    const disableAdd = !treeUtils.isAddFolderEnabled(keyInfo)
    const disableAddItem = !treeUtils.isAddItemEnabled(keyInfo)
    const disableDelItem = !treeUtils.isDeleteEnabled(keyInfo)

    this.setState({
      [panel]: {
        ...this.state[panel],
        currentKey: key,
        disableAdd,
        disableAddItem,
        disableDel: disableDelItem,
      },
    })
  }

  onAddFolderFunc = panel => {
    const { currentKey } = this.state[panel]

    const keyInfo = this.getInfoFromKey(currentKey)
    if (!keyInfo) {
      console.log('Exception')

      return
    }
    let newKey = -1
    newKey = treeUtils.addToFolder(keyInfo, {
      name: 'New Folder',
      type: 'Folder',
      data: {},
      folders: [],
      style: {},
    })
    console.log(this.state.configData)
    this.onSaveFunc()
    this.setOpenKey(panel, currentKey)
    if (newKey >= 0) this.setCurrentKey(panel, `${currentKey}-${newKey}`)
  }

  onAddItemFunc = panel => {
    const { currentKey } = this.state[panel]

    const keyInfo = this.getInfoFromKey(currentKey)
    if (!keyInfo) {
      console.log('Exception')

      return
    }
    let newKey = -1
    newKey = treeUtils.addToFolder(keyInfo, {
      name: 'New Item',
      type: 'Item',
      data: {
        list: [
          {
            type: null,
            comparison: null,
            value: null,
            operator: null,
          },
        ],
      },
      style: {},
    })
    this.onSaveFunc()
    this.setOpenKey(panel, currentKey)
    if (newKey >= 0) this.setCurrentKey(panel, `${currentKey}-${newKey}`)
  }

  setOpenKey = (panel, key) => {
    const openKeys = this.state.openKeys[panel].filter(openKey => openKey !== key)
    openKeys.push(key)
    this.setState({
      openKeys: {
        ...this.state.openKeys,
        [panel]: openKeys,
      },
    })
  }

  onSelectItemFunc = async (panel, keys) => {
    if (keys[0] === this.state[panel].currentKey) return
    const key = keys[0]
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
    if (keyInfo.isAsset) return

    treeUtils.changeName(keyInfo, changedName)
    this.onSaveFunc()
  }

  onUpdateComponent = (e, form) => {
    const panel = 'main'
    e.preventDefault()
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { currentKey } = this.state[panel]
        const keyInfo = this.getInfoFromKey(currentKey)
        if (treeUtils.updateFolder(keyInfo, values.comp)) {
          this.onSaveFunc()
        }
      } else {
        openNotificationWithIcon('warning', 'Criteria', 'Please fill out all the necessary fields!')
      }
    })
  }

  handleCancel_Delete = () => this.setState({ visibleDelete: false })

  showDeleteModal = () => this.setState({ visibleDelete: true })

  render() {
    const { configData, loading } = this.state
    const { disableAdd, disableAddItem, disableDel, currentKey } = this.state.main
    const openKeys = this.state.openKeys.main

    if (!configData || configData.length === 0) return ''

    const foldersPanelParams = {
      data: configData,
      loading,
      onAddFunc: () => this.onAddFolderFunc('main'),
      onAddItemFunc: () => this.onAddItemFunc('main'),
      onDeleteFunc: this.showDeleteModal,
      onSelectItemFunc: e => this.onSelectItemFunc('main', e),
      disableAdd,
      disableAddItem,
      disableDel,
      onSaveFunc: this.onSaveFunc,
      currentKey,
      openKeys,
      onExpand: e => this.onExpand('main', e),
      titleChanged: e => this.titleChanged('main', e),
      onDropFunc: () => { },
      onDragStart: () => { },
    }

    const keyInfo = this.getInfoFromKey(currentKey)
    let customRender = ''

    console.log(currentKey, keyInfo)

    console.log(currentKey, disableDel, disableAdd, disableAddItem, configData)

    if (keyInfo && !keyInfo.isRoot) {
      const commonProps = {
        comp: keyInfo.node,
        currentKey,
        onSaveFunc: this.onUpdateComponent,
      }
      if (keyInfo.isItem) customRender = <ItemWhitePanel {...commonProps} />
      if (keyInfo.isFolder) customRender = <FolderWhitePanel {...commonProps} />
    }

    return (
      <>
        <FoldersPanel {...foldersPanelParams} />
        {customRender}
        {this.state.visibleDelete && (
          <Modal
            visible={this.state.visibleDelete}
            title="Do you want to delete this?"
            onOk={() => this.onDeleteFunc('main')}
            onCancel={this.handleCancel_Delete}
            footer={[
              <Button key="back" onClick={this.handleCancel_Delete}>
                Cancel
              </Button>,
              <Button key="submit" type="primary" loading={this.state.loading} onClick={() => this.onDeleteFunc('main')}>
                Delete
              </Button>,
            ]}
          >
            <p>Changes will be immediately applied</p>
          </Modal>
        )}
      </>
    )
  }
}
export default compose(graphql(mutations.dataMutation, { name: 'dataMutation' }), graphql(mutations.deleteMutation, { name: 'deleteMutation' }), withApollo)(DataDocumentCriteria)
