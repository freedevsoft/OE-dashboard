import React from 'react'
import { Form } from 'antd'
import { convertToRaw, ContentState, EditorState } from 'draft-js'
import htmlToDraft from 'html-to-draftjs'
import draftToHtml from 'draftjs-to-html'
import CustomEditor from 'components/CustomEditor/CustomEditor'
import { inlineStyle } from 'utils'

let shouldReRender = true
const GroupingSettingsNotification = ({ data, form: { getFieldDecorator, setFieldsValue }, field }) => {
    const setReRender = should => {
        shouldReRender = should
    }

    const htmltoEditorState = html => {
        const blocksFromHtml = htmlToDraft(html)
        const { contentBlocks, entityMap } = blocksFromHtml
        const contentState = ContentState.createFromBlockArray(
            contentBlocks,
            entityMap,
        )
        const editorState = EditorState.createWithContent(contentState)

        return editorState
    }

    const changeEdit = (newState, field) => {
        const newBody = draftToHtml(convertToRaw(newState.getCurrentContent()))
        setFieldsValue({ [field]: newBody })
    }

    getFieldDecorator(field, { initialValue: data || '' })

    return (
        <Form.Item label="Notification:" {...inlineStyle}>
            <CustomEditor
                style={{ height: '200px', marginBottom: '.5rem' }}
                editorState={htmltoEditorState(data)}
                changeEditorState={newState => changeEdit(newState, field)}
                shouldReRender={shouldReRender}
                setReRender={setReRender}
            />
        </Form.Item>
    )
}

export default GroupingSettingsNotification
