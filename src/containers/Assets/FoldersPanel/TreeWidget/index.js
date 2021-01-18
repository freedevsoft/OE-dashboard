import React from 'react'
import { Tree } from 'antd'
import './index.scss'

const { TreeNode, DirectoryTree } = Tree

export default class TreeWidget extends React.Component {
  inputText = ''

  constructor(props) {
    super(props)
    this.state = {
      editable: {},
    }
  }

  componentDidMount() { }

  inputTextChanged = text => {
    this.inputText = text
  }

  handleEnter = e => {
    e.stopPropagation()
    if (e.key === 'Enter') {
      e.target.blur()
      if (this.props.titleChanged) this.props.titleChanged(this.inputText)
      this.removeEditable()
    }
  }

  setEditable = key => {
    const edit = {}
    edit[key] = true

    this.setState({ editable: edit }, () => document.addEventListener('click', this.handleClick, false))
  }

  removeEditable = () => {
    this.setState({ editable: {} }, () => document.removeEventListener('click', this.handleClick, false))
  }

  handleClick = e => {
    const { titleChanged } = this.props
    if (this.inputRef && !this.inputRef.contains(e.target)) {
      if (titleChanged) titleChanged(this.inputText)
      this.removeEditable()
    }
  }

  renderTreeNodes = (node, key, isFolder = true) => {
    const { folders, ids } = node
    const bLast = !!node.id

    return (
      <TreeNode
        bLast={bLast}
        isLeaf={bLast}
        title={
          this.state.editable[key] ? (
            <input type="text" defaultValue={node.name} autoFocus ref={ref => (this.inputRef = ref)} onChange={e => this.inputTextChanged(e.target.value)} onKeyPress={e => this.handleEnter(e)} />
          ) : (
              node.name
            )
        }
        key={key}
      >
        {folders && folders.length
          ? folders.map((folder, folder_index) => this.renderTreeNodes(folder, `${key}-${folder_index}`))
          : ids && ids.length && ids.map((id, resource_index) => this.renderTreeNodes(id, `${key}-${resource_index}`, false))}
      </TreeNode>
    )
  }

  render() {
    const { root, currentKey, openKeys, onExpand, onSelectItemFunc, onDropFunc, onDragStart } = this.props
    const data = root

    const editMode = Object.keys(this.state.editable).length > 0

    return (
      <DirectoryTree
        className="draggable-tree"
        onSelect={e => {
          if (editMode) return
          onSelectItemFunc(e)
        }}
        // autoExpandParent
        expandedKeys={openKeys}
        onExpand={e => {
          if (editMode) return
          onExpand(e)
        }}
        onDoubleClick={(event, data) => {
          event.persist()
          this.inputText = data.props.title
          this.setEditable(data.props.eventKey)
        }}
        selectedKeys={[currentKey]}
        onDrop={onDropFunc}
        draggable={!editMode}
        onDragStart={onDragStart}
        expandAction={false}
      >
        {this.renderTreeNodes(data, '0')}
      </DirectoryTree>
    )
  }
}
