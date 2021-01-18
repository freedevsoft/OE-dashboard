import React from 'react'
import PropTypes from 'prop-types'
import GrayPanel from 'components/GrayPanel/GrayPanel'
import {
  faSave, faCog, faPlus, faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'
import ControlBtnsGroup from 'components/ControlBtnsGroup/ControlBtnsGroup'
import ControlButton from 'components/ControlButton/ControlButton'
import AccordionList from 'components/AccordionList/AccordionList'
import { Auth } from 'aws-amplify'
import {
  Icon, Button, Dropdown, Modal, Input, Layout, Menu,
} from 'antd'
import TreeWidget from './TreeWidget/index'

class ArticleGroupsPanel extends React.Component {
  treeRef = null;

  constructor(props) {
    super(props)
    this.state = {
      user: null,
    }
  }

  componentDidMount() {
    Auth.currentAuthenticatedUser({
      bypassCache: false, // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    })
      .then(user => this.setState({ user }))
      .catch(err => console.log(err))
  }

  renderTree = data => {
    if (this.state.user) {
      const root = data[0].data
      const {
        onSelectItemFunc, onDropFunc, titleChanged, currentKey, openKeys, onDragStart, onExpand,
      } = this.props

      return (
        <TreeWidget
          key="0"
          root={root}
          onSelectItemFunc={onSelectItemFunc}
          onDropFunc={onDropFunc}
          onDragStart={onDragStart}
          titleChanged={titleChanged}
          currentKey={currentKey}
          openKeys={openKeys}
          onExpand={onExpand}
        />
      )
    }

    return null
  };

  render() {
    const {
      loading, data, style, onSaveFunc, onDeleteFunc, onAddFunc, onAddItemFunc, disableAdd, disableAddItem, disableDel,
    } = this.props

    const filemenu = (
      <Menu>
        <Menu.Item disabled={disableAdd} onClick={onAddFunc}>
          Add Criteria
        </Menu.Item>
        <Menu.Item disabled={disableAddItem} onClick={onAddItemFunc}>
          Add Rule
        </Menu.Item>
        <Menu.Item disabled={disableDel} onClick={onDeleteFunc}>
          Delete
        </Menu.Item>
      </Menu>
    )

    if (loading) {
      return (
        <GrayPanel title="Folder Structure" {...style}>
          <ControlBtnsGroup disabled>
            <>
              <Dropdown overlay={filemenu} placement="bottomLeft">
                <strong style={{ fontSize: '14px', padding: '7px 10px', cursor: 'pointer' }}>
Action
                  <Icon type="caret-down" />
                </strong>
              </Dropdown>
            </>
          </ControlBtnsGroup>
          <AccordionList loading />
        </GrayPanel>
      )
    }

    return (
      <GrayPanel
        title="Folder Structure"
        {...style}
      >
        <ControlBtnsGroup>
          <>
            <Dropdown overlay={filemenu} placement="bottomLeft">
              <strong style={{ fontSize: '14px', padding: '7px 10px', cursor: 'pointer' }}>
Action
                <Icon type="caret-down" />
              </strong>
            </Dropdown>
          </>
        </ControlBtnsGroup>
        {this.renderTree(data)}
      </GrayPanel>
    )
  }
}

ArticleGroupsPanel.propTypes = {
  loading: PropTypes.bool,
  data: PropTypes.array,
  style: PropTypes.object,
  onSaveFunc: PropTypes.func,
  onAddFunc: PropTypes.func,
  onDeleteFunc: PropTypes.func,
}

ArticleGroupsPanel.defaultProps = {
  loading: false,
  data: {},
  style: {
    width: 300,
    minWidth: 200,
    bgcolor: '#FFF8E7',
    fgcolor: 'black',
    fgcolor_selected: 'black',
  },
}

export default ArticleGroupsPanel
