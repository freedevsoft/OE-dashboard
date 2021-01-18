import React, { Component } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import './CustomEditor.scss'
import { convertToRaw } from 'draft-js'

export default class CustomEditor extends Component {
  shouldReRender = false

  componentWillReceiveProps(props) {
    this.shouldReRender = props.shouldReRender
    props.setReRender(false)
  }

  render() {
    const { options } = this.props

    return (
      <div
        // onDrop={e => {
        //   e.preventDefault()
        //   e.stopPropagation()
        //   e.nativeEvent.stopImmediatePropagation()
        //   this.props.onDropImage()
        //   window.addEventListener('keydown', { capture: false })
        // }}
        className="rdw-editor-wrapper-container"
        style={this.props.style ? this.props.style : {}}
      >
        {this.shouldReRender ? (
          <Editor
            contentState={convertToRaw(
              this.props.editorState.getCurrentContent(),
            )}
            wrapperClassName="wrapper-class"
            editorClassName="editor-class"
            toolbarClassName="toolbar-class"
            onEditorStateChange={this.props.changeEditorState}
            {...options}
          />
        ) : (
        <Editor
            initialContentState={convertToRaw(
              this.props.editorState.getCurrentContent(),
            )}
            wrapperClassName="wrapper-class"
            editorClassName="editor-class"
            toolbarClassName="toolbar-class"
            onEditorStateChange={this.props.changeEditorState}
            {...options}
        />
      )}
      </div>
    )
  }
}
