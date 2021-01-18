import React, { Component } from 'react'
import {
    Form, Button, Icon, Row, Col,
} from 'antd'
import { subscriptionLevelOptions } from 'utils/constants'
import OZSelectItem from '../OZSelectItem'

class OZSubscriptions extends Component {
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
        const nextKeys = keys.concat(undefined)
        setFieldsValue({ [keysField]: nextKeys })
    };

    render() {
        const {
            label, getFieldDecorator, getFieldValue, initialValue, keysField, arrayField,
        } = this.props

        getFieldDecorator(keysField, { initialValue })
        const items = getFieldValue(keysField)

        const formItems = items.map((item, index) => {
            getFieldDecorator(`${arrayField}[${index}]`, { initialValue: initialValue[index] })

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
                            <OZSelectItem
                                field={`${arrayField}[${index}]`}
                                initialValue={initialValue[index]}
                                getFieldDecorator={getFieldDecorator}
                                combines={subscriptionLevelOptions}
                                labelCol={{ span: 0 }}
                                wrapperCol={{ span: 24 }}
                                required={false}
                                placeholder="Level Type"
                            />
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

export default OZSubscriptions
