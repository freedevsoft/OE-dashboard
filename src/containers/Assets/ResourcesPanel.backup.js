import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Button, Dropdown, Menu } from 'antd'
import GrayPanel from 'components/GrayPanel/GrayPanel'
import ControlBtnsGroup from 'components/ControlBtnsGroup/ControlBtnsGroup'
import AccordionList from 'components/AccordionList/AccordionList'
import { withApollo } from 'react-apollo'
import * as compose from 'lodash.flowright'
import * as constants from 'utils/constants'

class ResourcesPanel extends React.Component {
  mainConfigs = ['Articles', 'Assets', 'Applications', 'Notifications']

  _isMounted = false

  state = {
    nameList: [],
    loading: true,
  }

  constructor(props) {
    super(props)
    this.compareProps = this.compareProps.bind(this)
  }

  // touched
  getResourceNames(idList, doc) {
    return new Promise(async (resolve, reject) => {
      const nameList = []
      for (const i in idList) {
        nameList.push({ name: await this.getResourceName(idList[i], doc || { type: 'Article', name: 'Articles' }) })
      }

      return resolve(nameList)
    })
  }

  // touched
  async getResourceName(resource, doc) {
    const options = {
      query: constants.organizer[doc.type].query,
      variables: {
        _id: resource.id,
        collectionName: constants.organizer[doc.type].collectionName,
      },
      // fetchPolicy: "network-only"
    }

    const { responseType } = constants.organizer[doc.type]

    const res = await this.props.client.query(options)
    if (res && res.data && res.data[responseType] && res.data[responseType][0] && res.data[responseType][0].name) {
      return res.data[responseType][0].name
    }

    return resource.id
  }

  componentDidMount() {
    this._isMounted = true
    this.getResourceNames(this.props.dataList, this.props.currentDoc).then(nameList => {
      this.setState({ nameList, loading: false })
    })
  }

  compareProps(prev, next) {
    if (prev.length != next.length) return false
    for (const i in prev) if (prev[i].id != next[i].id) return false

    return true
  }

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps', this.props.dataList, nextProps.dataList)
    // if (!this.compareProps(this.props.dataList, nextProps.dataList)) {
    this.setState({ loading: true })
    this.getResourceNames(nextProps.dataList, nextProps.currentDoc).then(nameList => {
      if (this._isMounted) this.setState({ nameList, loading: false })
    })
    // }
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    const { style, selectedIndex, onAddFunc, onDeleteFunc, selectItem, selectIcon, disabled, setCurrentPage, currentPage, currentDoc, alertsMap, dataList } = this.props

    const { loading, nameList } = this.state

    const filemenu = (
      <Menu>
        <Menu.Item>
          {' '}
          <a onClick={onAddFunc}> New </a>{' '}
        </Menu.Item>
        <Menu.Item>
          {' '}
          <a onClick={onDeleteFunc} disabled={selectedIndex === -1}>
            {' '}
            Delete{' '}
          </a>{' '}
        </Menu.Item>
        <Menu.Item>
          {' '}
          <a disabled> Copy </a>{' '}
        </Menu.Item>
        <Menu.Item>
          {' '}
          <a disabled> Move </a>{' '}
        </Menu.Item>
      </Menu>
    )

    if (loading) {
      return (
        <GrayPanel title="Resources" {...style}>
          <ControlBtnsGroup disabled>
            <Dropdown overlay={filemenu} placement="bottomLeft">
              <Button style={{ width: 'auto', background: 'transparent' }}>
                Action
                <Icon type="down" />
              </Button>
            </Dropdown>
          </ControlBtnsGroup>
          <AccordionList loading />
        </GrayPanel>
      )
    }

    return (
      <GrayPanel title="Resources" {...style}>
        <ControlBtnsGroup disabled={this.props.disableControl}>
          <Dropdown overlay={filemenu} placement="bottomLeft">
            <Button style={{ width: 'auto', background: 'transparent' }}>
              Action
              <Icon type="down" />
            </Button>
          </Dropdown>
        </ControlBtnsGroup>
        <AccordionList
          dataList={dataList.map((item, index) => ({ name: nameList[index].name, icon: alertsMap[item.id] ? '/images/icons/grouping-icon-selected.png' : '/images/icons/grouping-icon.png' }))}
          selectedIndex={selectedIndex}
          selectItem={selectItem}
          selectIcon={selectIcon}
          itemThumb="none"
          itemEditable={false}
          draggable
          droppable
          onDragItem={this.props.onDragArticle}
          onDropItem={this.props.onDropArticle}
          onDragOverItem={this.props.onDragOverArticle}
          // titleChanged={(index, title) =>
          //   this.props.onArticleTitleChanged(title)
          // }
        />
      </GrayPanel>
    )
  }
}

ResourcesPanel.propTypes = {
  dataList: PropTypes.array,
  style: PropTypes.object,
  onDropFunc: PropTypes.func,
  disableControl: PropTypes.bool,
}

ResourcesPanel.defaultProps = {
  dataList: [],
  style: {
    width: 300,
    minWidth: 150,
    bgcolor: '#FFF8E7',
    fgcolor: 'black',
    bgcolor_selected: '#FFF8E7',
    fgcolor_selected: 'black',
  },
  disableControl: false,
}

export default compose(withApollo)(ResourcesPanel)
