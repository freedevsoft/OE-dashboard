import React from 'react'
import { Form, Checkbox, Row, Col, Button, DatePicker, TimePicker, Input, Icon } from 'antd'
import OZTextArea from 'components/FormItems/OZTextArea'
import TypesSelect from 'containers/Selects/TypesSelect'
import OZInput from 'components/FormItems/OZInput/index'
import { getDepthValue, inlineStyle } from 'utils'
import './index.scss'

const SourceForm = ({
    data,
    form: { getFieldDecorator, getFieldValue, setFieldsValue },
    field,
    initialValue = {
        name: '',
        link: '',
        account: ''
    },
}) => {
    const register = key => {
        getFieldDecorator(`${field}.${key}`, { initialValue: getDepthValue(data, key, initialValue[key]) })
    }

    const initial = key => getDepthValue(data, key, initialValue[key])

    register('name')
    register('logo')
    register('account')
    register('link')


    return (
        <div className="oe-contact-form">
            <Form.Item label="Logo" {...inlineStyle}>
                {getFieldDecorator(`${field}.logo`, { initialValue: initial('logo') })(<TypesSelect collectionName="ImagesData" type="Logo" />)}
            </Form.Item>
            <OZInput label="Name" field={`${field}.name`} initialValue={initial('name')} getFieldDecorator={getFieldDecorator} {...inlineStyle} />
            <OZInput label="Account" field={`${field}.account`} initialValue={initial('account')} getFieldDecorator={getFieldDecorator} {...inlineStyle} />
            <OZInput label="Link" field={`${field}.link`} initialValue={initial('link')} getFieldDecorator={getFieldDecorator} {...inlineStyle} />
        </div>
    )
}

export default SourceForm
