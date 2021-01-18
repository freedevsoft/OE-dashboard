import React, { Component } from 'react'
import {
    Form, Button, Icon, Row, Col,
} from 'antd'
import DocumentTypesSelect from 'containers/Selects/DocumentTypesSelect'
import OZInput from '../OZInput'
import { getDepthValue, inlineStyle } from '../../../utils'

class OZMenuFilters extends Component {
    static defaultProps = {
        extra: '',
        label: '',
        required: true,
    }

    remove = (k, keysField, dataField) => {
        const { getFieldValue, setFieldsValue } = this.props
        const keys = getFieldValue(keysField)
        const data = getFieldValue(dataField)
        if (keys.length === 1) {
            return
        }

        keys.splice(k, 1)
        data.splice(k, 1)

        setFieldsValue({
            [keysField]: keys,
            [dataField]: data,
        })
    };

    add = keysField => {
        const { getFieldValue, setFieldsValue } = this.props
        const keys = getFieldValue(keysField)
        const nextKeys = keys.concat({
            text: '',
            filterId: null,
        })
        setFieldsValue({ [keysField]: nextKeys })
    };

    render() {
        const {
            label, getFieldDecorator, getFieldValue, initialValue, keysField, arrayField,
        } = this.props

        getFieldDecorator(keysField, { initialValue })
        const items = getFieldValue(keysField)

        const formItems = items.map((item, index) => {
            getFieldDecorator(`${arrayField}[${index}].text`, { initialValue: getDepthValue(initialValue[index], 'text') })
            getFieldDecorator(`${arrayField}[${index}].filterId`, { initialValue: getDepthValue(initialValue[index], 'filterId') })

            return (
                <Form.Item label={index === 0 ? label : ''} key={index}>
                    <Row gutter={16}>
                        <Col span={2}>
                            <Icon
                                className="dynamic-delete-button"
                                type="minus-circle"
                                style={{ fontSize: '24px', marginTop: '7px', marginLeft: '10px' }}
                                onClick={() => this.remove(index, keysField, arrayField)}
                            />
                        </Col>
                        <Col span={8}>
                            <OZInput
                                field={`${arrayField}[${index}].text`}
                                initialValue={getDepthValue(initialValue[index], 'text')}
                                getFieldDecorator={getFieldDecorator}
                                placeholder="Text here"
                                required={false}
                            />
                        </Col>
                        <Col span={8}>
                            <Form.Item {...inlineStyle}>
                                {getFieldDecorator(`${arrayField}[${index}].filterId`, { initialValue: getDepthValue(initialValue[index], 'filterId') })(
                                    <DocumentTypesSelect collectionName="ActiveFiltersData" type="menu-filter" />,
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                </Form.Item>
            )
        })

        return (
            <>
                {formItems}
                <Row gutter={16}>
                    <Col span={8} offset={2}>
                        <Button type="dashed" onClick={() => this.add(keysField)}>
                            <Icon type="plus" />
                            {' '}
                            Add another
                        </Button>
                    </Col>
                </Row>
            </>
        )
    }
}

export default OZMenuFilters
