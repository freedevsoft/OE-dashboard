import React from 'react'
import { JsonEditor as Editor } from 'jsoneditor-react'
import 'jsoneditor-react/es/editor.min.css'
import ace from 'brace'
import 'brace/mode/json'
import 'brace/theme/github'

class Private extends React.Component {
  constructor(props) {
    super(props)
    this.changeHandler = this.changeHandler.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { data } = this.props
    if (nextProps.data && data && nextProps.data !== data) {
      this.jsonEditor.set(nextProps.data ? nextProps.data : {})
    }
  }

  setRef = instance => {
    if (instance) {
      const { jsonEditor } = instance
      this.jsonEditor = jsonEditor
    } else {
      this.jsonEditor = null
    }
  }

  changeHandler(field, value) {
    const {
      form: { setFieldsValue },
    } = this.props
    setFieldsValue({ [field]: value })
  }

  render() {
    const {
      data,
      form: { getFieldDecorator },
      field,
    } = this.props

    return (
      <>{getFieldDecorator(field, { initialValue: data || {} })(<Editor ref={this.setRef} mode="code" onChange={value => this.changeHandler(field, value)} ace={ace} theme="ace/theme/github" />)}</>
    )
  }
}
export default Private
