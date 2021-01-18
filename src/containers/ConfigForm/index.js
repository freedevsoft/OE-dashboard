import React, { useState } from 'react'
import { Form, Radio, Checkbox, InputNumber, Input } from 'antd'
import ColorPicker from 'components/ColorPicker'
import { inlineStyle, getDepthValue } from 'utils'
import OZSelectItem from 'components/FormItems/OZSelectItem'
import OZInput from 'components/FormItems/OZInput'
import OZCheckboxGroup from 'components/FormItems/OZCheckboxGroup'
import './index.scss'

class ConfigForms extends React.Component {
    constructor(props) {
        super(props)
        this.changeHandler = this.changeHandler.bind(this)
    }

    // componentWillReceiveProps(nextProps) {
    //   const { data } = this.props
    //   if (nextProps.data !== data) {
    //     this.jsonEditor.set(nextProps.data ? nextProps.data : {})
    //   }
    // }

    changeHandler(field, value) {
        console.log(field, value)
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
            <div className="form-group-actions">
                <Form.Item label="" className="primary-label">
                    <OZCheckboxGroup
                        field={field}
                        initialValue={data || []}
                        combines={[
                            { label: 'Bookmark', value: 'Bookmark' },
                            { label: 'Hide', value: 'Hide' },
                            { label: 'Show', value: 'Show' },
                            { label: 'Load', value: 'Load' },
                            { label: 'Back', value: 'Back' },
                        ]}
                        getFieldDecorator={getFieldDecorator}
                        required={false}
                    />
                </Form.Item>
            </div>
        )
    }
}
export default ConfigForms