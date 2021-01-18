import React from 'react'
import PropTypes from 'prop-types'

import { convertToRaw, ContentState, EditorState } from 'draft-js'
import htmlToDraft from 'html-to-draftjs'
import draftToHtml from 'draftjs-to-html'

import ZipCodePanel from './ZipcodePanel'

import CustomEditor from '../../CustomEditor/CustomEditor'
import { getDepthValue } from '../../../utils'

let shouldReRender = true

const OZZipCodeBannerBodyArray = ({
  getFieldDecorator, getFieldValue, initialValue, arrayField, setFieldsValue,
}) => {
  const remove = () => {
    const index = getFieldValue('selectedZipCodeIndex')

    const data = getFieldValue(arrayField)
    let newIndex = index
    data.splice(index, 1)

    if (index === data.length) newIndex = index - 1

    setFieldsValue({
      [arrayField]: data,
      selectedZipCodeIndex: newIndex,
    })
    shouldReRender = true
  }

  const add = () => {
    const keys = getFieldValue(arrayField)
    const nextKeys = keys.concat({
      zip_code: '00000',
      body: '',
    })
    setFieldsValue({
      [arrayField]: nextKeys,
      selectedZipCodeIndex: nextKeys.length - 1,
    })
    shouldReRender = true
  }

  const select = index => {
    setFieldsValue({ selectedZipCodeIndex: index })
    shouldReRender = true
  }

  const editZipCode = (index, zipCode) => {
    const keys = getFieldValue(arrayField)

    keys.splice(index, 1, {
      zipCode,
      body: keys[index].body,
    })

    setFieldsValue({ [arrayField]: keys })
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

  const changeEdit = newState => {
    const newBody = draftToHtml(convertToRaw(newState.getCurrentContent()))
    const index = getFieldValue('selectedZipCodeIndex')
    const keys = getFieldValue(arrayField)

    keys.splice(index, 1, {
      zip_code: keys[index].zip_code,
      body: newBody,
    })

    setFieldsValue({ [arrayField]: keys })
  }

  const setReRender = should => {
    shouldReRender = should
  }

  getFieldDecorator(arrayField, { initialValue: getDepthValue(initialValue) })
  getFieldDecorator('selectedZipCodeIndex', { initialValue: 0 })

  const items = getFieldValue(arrayField)
  const selectedZipCodeIndex = getFieldValue('selectedZipCodeIndex')

  const zipcodePanelParams = {
    dataList: items && items.map(item => ({ name: item.zip_code, editable: true })),
    selectedIndex: selectedZipCodeIndex,
    selectItem: select,
    onItemAddFunc: add,
    onItemDeleteFunc: remove,
    onItemEditFunc: editZipCode,
  }

  return (
    <div style={{ display: 'flex', height: '100%', background: 'white' }}>
      <ZipCodePanel {...zipcodePanelParams} />
      {items[selectedZipCodeIndex]
        && (
          <CustomEditor
            style={{ flexGrow: '1' }}
            editorState={htmltoEditorState(!items[selectedZipCodeIndex].body ? '' : items[selectedZipCodeIndex].body)}
            changeEditorState={changeEdit}
            shouldReRender={shouldReRender}
            setReRender={setReRender}
          />
        )
      }
    </div>
  )
}

OZZipCodeBannerBodyArray.propTypes = {
  extra: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  maxLength: PropTypes.number,
}

OZZipCodeBannerBodyArray.defaultProps = {
  extra: '',
  label: '',
  required: true,
  maxLength: 40,
}

export default OZZipCodeBannerBodyArray
