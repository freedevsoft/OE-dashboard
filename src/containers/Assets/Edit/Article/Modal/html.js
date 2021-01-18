import React, { useState, useEffect } from 'react'
import { convertToRaw, ContentState, EditorState } from 'draft-js'
import { Modal, Button } from 'antd'
import htmlToDraft from 'html-to-draftjs'
import draftToHtml from 'draftjs-to-html'
import CustomEditor from 'components/CustomEditor/CustomEditor'
import './html.scss'

let shouldReRender = true
const DescHTML = ({ data, visible, onCancel, onUpdate }) => {
  const [HTML, setHTML] = useState(data)

  useEffect(() => {
    setHTML(data)
  }, [data])

  const setReRender = should => {
    shouldReRender = should
  }

  const htmltoEditorState = html => {
    const blocksFromHtml = htmlToDraft(html)
    const { contentBlocks, entityMap } = blocksFromHtml
    const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap)
    const editorState = EditorState.createWithContent(contentState)

    return editorState
  }

  const changeEdit = newState => {
    const newBody = draftToHtml(convertToRaw(newState.getCurrentContent()))
    setHTML(newBody)
  }

  return (
    <Modal
      visible={visible}
      onOk={() => onUpdate(HTML)}
      onCancel={onCancel}
      width={1200}
      className="html-edit-modal"
      centered
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => onUpdate(HTML)}>
          Update
        </Button>,
      ]}
    >
      <CustomEditor style={{ height: '500px' }} editorState={htmltoEditorState(HTML)} changeEditorState={changeEdit} shouldReRender={shouldReRender} setReRender={setReRender} />
    </Modal>
  )
}

export default DescHTML
