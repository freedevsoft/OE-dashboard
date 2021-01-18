import React from 'react'
import { Tree } from 'antd'
import './index.scss'

const { TreeNode, DirectoryTree } = Tree

export default class TreeWidget extends React.Component {
  inputText = '';

  constructor(props) {
    super(props)
    this.state = {
      editable: {},
    }
  }

  componentDidMount() {

  }

  inputTextChanged = text => {
    this.inputText = text
  };

  handleEnter = e => {
    e.stopPropagation()
    if (e.key === 'Enter') {
      e.target.blur()
      if (this.props.titleChanged) this.props.titleChanged(this.inputText)
      this.removeEditable()
    }
  };

  setEditable = key => {
    const edit = {}
    edit[key] = true

    this.setState({ ...this.state, editable: edit }, () => document.addEventListener('click', this.handleClick, false))
  };

  removeEditable = () => {
    this.setState({ ...this.state, editable: {} }, () => document.removeEventListener('click', this.handleClick, false))
  };

  handleClick = e => {
    if (this.inputRef && !this.inputRef.contains(e.target)) {
      if (this.props.titleChanged) this.props.titleChanged(this.inputText)
      this.removeEditable()
    }
  };

  renderTreeNodes = (node, key, isFolder = true) => {
    const {
      name, type, folders, content,
    } = node
    const bLast = node.type == 'Item'

    return (
      <TreeNode
        bLast={bLast}
        isLeaf={bLast}
        showIcon={false}
        title={
          this.state.editable[key] ? (
            <input
              type="text"
              defaultValue={node.name}
              autoFocus
              ref={ref => (this.inputRef = ref)}
              onChange={e => this.inputTextChanged(e.target.value)}
              onKeyPress={e => this.handleEnter(e)}
            />
          ) : (
            node.type == 'Folder' ? node.name + (node.data && node.data.operator ? ` (${node.data.operator})` : '') : node.name
          )
        }
        key={key}
      >
        {folders && folders.map((folder, folder_index) => this.renderTreeNodes(folder, `${key}-${folder_index}`))}
      </TreeNode>
    )
  };

  render() {
    const {
      root, currentKey, openKeys, onExpand, onSelectItemFunc, onDropFunc, onDragStart,
    } = this.props
    const data = root

    const edit_mode = Object.keys(this.state.editable).length > 0

    return (
      <DirectoryTree
        className="draggable-tree"
        showIcon={false}
        onSelect={e => {
          if (edit_mode) return
          onSelectItemFunc(e)
        }}
        // autoExpandParent={true}
        expandedKeys={openKeys}
        onExpand={e => {
          if (edit_mode) return
          onExpand(e)
        }}
        onDoubleClick={(event, data) => {
          event.persist()
          this.inputText = data.props.title
          this.setEditable(data.props.eventKey)
        }}
        selectedKeys={[currentKey]}
        onDrop={onDropFunc}
        draggable={!edit_mode}
        onDragStart={onDragStart}
      >
        {this.renderTreeNodes(
          data,
          '0',
        )}
      </DirectoryTree>
    )
  }
}
