import React from 'react'
import {
  Form, Divider, Row, Col,
} from 'antd'
import CustomEditor from 'components/CustomEditor/CustomEditor'
import { convertToRaw, ContentState, EditorState } from 'draft-js'
import htmlToDraft from 'html-to-draftjs'
import draftToHtml from 'draftjs-to-html'

class GroupingSettingsFormModalInnerNotification extends React.Component {
  constructor(props) {
    super(props)

    this.shouldReRender = true
  }

    htmltoEditorState = html => {
      const blocksFromHtml = htmlToDraft(html)
      const { contentBlocks, entityMap } = blocksFromHtml
      const contentState = ContentState.createFromBlockArray(
        contentBlocks,
        entityMap,
      )
      const editorState = EditorState.createWithContent(contentState)

      return editorState
    };

    changeEdit = (newState, field) => {
      const newBody = draftToHtml(convertToRaw(newState.getCurrentContent()))
      this.props.form.setFieldsValue({ [field]: newBody })
    };

    setReRender = should => {
      this.shouldReRender = should
    };

    render() {
      const { data, form: { getFieldDecorator, getFieldValue }, field } = this.props
      const inlineStyle = {
        labelCol: { md: { span: 4 }, sm: { span: 12 } },
        wrapperCol: { md: { span: 20 }, sm: { span: 12 } },
      }
      getFieldDecorator(field, { initialValue: data || '' })

      return (
        <>
          <Form.Item label="Notification:" {...inlineStyle}>
            <CustomEditor
              style={{ height: '200px', marginBottom: '.5rem' }}
              editorState={this.htmltoEditorState(data)}
              changeEditorState={newState => this.changeEdit(newState, field)}
              shouldReRender={this.shouldReRender}
              setReRender={this.setReRender}
            />
          </Form.Item>
        </>
      )
    }
}
export default GroupingSettingsFormModalInnerNotification
