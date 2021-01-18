import React, { useState } from 'react'
import {
    Form, Button, Icon, Row, Col,
} from 'antd'
import { getDepthValue } from 'utils'
import { subscriptionLevelOptions } from 'utils/constants'
import OZSelectItem from '../OZSelectItem'
import OZInput from '../OZInput'
import OZInputNumber from '../OZInputNumber'
import MapModal from './MapModal'

const ruleTypes = [
    {
        label: 'Geo Location',
        value: 'geolocation',
        comparisonTypes: [
            { label: 'is inside', value: 'inside' },
            { label: 'is outside', value: 'outside' },
        ],
        valueType: 'button',
    },
    {
        label: 'Tags',
        value: 'tags',
        comparisonTypes: [
            { label: 'contains', value: 'contain' },
            { label: 'doesn\'t contain', value: 'not_contain' },
        ],
        valueType: 'string',
    },
    {
        label: 'Machine Learning',
        value: 'ML',
        comparisonTypes: [
            { label: 'any', value: 'any' },
        ],
        valueType: 'button',
    },
    {
        label: 'Zip Code',
        value: 'zip_code',
        comparisonTypes: [
            { label: 'is', value: '=' },
            { label: 'is not', value: '<>' },
        ],
        valueType: 'string',
    }, {
        label: 'Gender',
        value: 'gender',
        comparisonTypes: [
            { label: 'is', value: '=' },
            { label: 'is not', value: '<>' },
        ],
        valueType: 'select',
        enumValues: [
            { label: 'Female', value: 'F' },
            { label: 'Male', value: 'M' },
            { label: 'N/A', value: null },
        ],
    }, {
        label: 'Age',
        value: 'age',
        comparisonTypes: [
            { label: 'is equal to', value: '=' },
            { label: 'is less than', value: '<' },
            { label: 'is greater than', value: '>' },
        ],
        valueType: 'number',
    }, {
        label: 'Income',
        value: 'income',
        comparisonTypes: [
            { label: 'is equal to', value: '=' },
            { label: 'is less than', value: '<' },
            { label: 'is greater than', value: '>' },
        ],
        valueType: 'number',
    }, {
        label: 'Device Type',
        value: 'device_type',
        comparisonTypes: [
            { label: 'is', value: '=' },
            { label: 'is not', value: '<>' },
        ],
        valueType: 'string',
    }, {
        label: 'Affiliations',
        value: 'affiliations',
        comparisonTypes: [
            { label: 'contains', value: 'contain' },
            { label: 'doesn\'t contain', value: 'not_contain' },
        ],
        valueType: 'string',
    }, {
        label: 'Interests',
        value: 'interests',
        comparisonTypes: [
            { label: 'contains', value: 'contain' },
            { label: 'doesn\'t contain', value: 'not_contain' },
        ],
        valueType: 'string',
    }, {
        label: 'Subscriptions',
        value: 'subscriptions',
        comparisonTypes: [
            { label: 'is', value: '=' },
            { label: 'is not', value: '<>' },
        ],
        valueType: 'select',
        enumValues: subscriptionLevelOptions,
    }, {
        label: 'Broadcast Flag',
        value: 'broadcast',
        comparisonTypes: [
            { label: 'is', value: '=' },
            { label: 'is not', value: '<>' },
        ],
        valueType: 'select',
        enumValues: [
            { label: 'None', value: null },
            { label: 'ATSC 3.0', value: 'ATSC 3.0' },
            { label: 'ATSC 1.0', value: 'ATSC 1.0' },
        ],
    }, {
        label: 'Broadband Flag',
        value: 'broadband',
        comparisonTypes: [
            { label: 'is', value: '=' },
            { label: 'is not', value: '<>' },
        ],
        valueType: 'select',
        enumValues: [
            { label: 'Connection', value: true },
            { label: 'No Connection', value: false },
        ],
    }, {
        label: 'Data Collection',
        value: 'data_collection',
        comparisonTypes: [
            { label: 'is', value: '=' },
            { label: 'is not', value: '<>' },
        ],
        valueType: 'select',
        enumValues: [
            { label: 'OPT IN', value: 'OPT IN' },
            { label: 'OPT OUT', value: 'OPT OUT' },
        ],
    }, {
        label: 'Alert Level',
        value: 'alert_level',
        comparisonTypes: [
            { label: 'is', value: '=' },
            { label: 'is not', value: '<>' },
        ],
        valueType: 'select',
        enumValues: [
            { label: 'LOW', value: 'LOW' },
            { label: 'MEDIUM', value: 'MEDIUM' },
            { label: 'HIGH', value: 'HIGH' },
        ],
    }, {
        label: 'Logged in',
        value: 'b_log',
        comparisonTypes: [
            { label: 'is', value: '=' },
            { label: 'is not', value: '<>' },
        ],
        valueType: 'select',
        enumValues: [
            { label: 'Yes', value: true },
            { label: 'No', value: false },
        ],
    },
]

const OZRules = ({
    label, getFieldDecorator, getFieldValue, setFieldsValue, initialValue, keysField, arrayField,
}) => {
    const [visibleMap, setVisibleMap] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(-1)

    const onOpenMap = currentIndex => {
        setVisibleMap(true)
        setCurrentIndex(currentIndex)
    }

    const onCancelMap = () => {
        setVisibleMap(false)
        setCurrentIndex(-1)
    }

    const onUpdateMap = (e, form) => {
        e.preventDefault()

        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log(values.comp, arrayField, currentIndex)

                setFieldsValue({
                    [`${arrayField}[${currentIndex}].value`]: values.comp,
                })

                setVisibleMap(false)
                setCurrentIndex(-1)
            }
        })
    }

    const remove = (k, keysField, dataField) => {
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
    }

    const add = keysField => {
        const keys = getFieldValue(keysField)
        const nextKeys = keys.concat({
            type: null,
            comparison: null,
            value: null,
            operator: null,
        })
        setFieldsValue({
            [keysField]: nextKeys,
        })
    }

    const handleChangeRuleType = (e, index) => {
        setFieldsValue({ [`${arrayField}[${index}].comparison`]: undefined })
        setFieldsValue({ [`${arrayField}[${index}].value`]: null })
    }

    getFieldDecorator(keysField, { initialValue })

    const items = getFieldValue(keysField)

    const formItems = items.map((item, index) => {
        getFieldDecorator(`${arrayField}[${index}].type`, { initialValue: getDepthValue(initialValue[index], 'type') })
        getFieldDecorator(`${arrayField}[${index}].value`, { initialValue: getDepthValue(initialValue[index], 'value', null) })

        const rule = getFieldValue(`${arrayField}[${index}].type`)

        let selectedRule = {
            comparisonTypes: [],
            valueType: 'string',
        }
        if (rule) {
            const selectedIndex = ruleTypes.findIndex(current => current.value == rule)
            if (selectedIndex >= 0) {
                selectedRule = ruleTypes[selectedIndex]
            }
        }

        return (
            <Form.Item
                label={index === 0 ? label : ''}
                key={index}
            >
                <Row gutter={16}>
                    <Col span={5}>
                        <OZSelectItem
                            field={`${arrayField}[${index}].type`}
                            initialValue={getDepthValue(initialValue[index], 'type')}
                            getFieldDecorator={getFieldDecorator}
                            combines={ruleTypes}
                            labelCol={{ span: 0 }}
                            wrapperCol={{ span: 24 }}
                            required={false}
                            placeholder="Rule Type"
                            onChange={e => handleChangeRuleType(e, index)}
                        />
                    </Col>
                    <Col span={5}>
                        <OZSelectItem
                            field={`${arrayField}[${index}].comparison`}
                            initialValue={getDepthValue(initialValue[index], 'comparison')}
                            getFieldDecorator={getFieldDecorator}
                            combines={selectedRule.comparisonTypes}
                            labelCol={{ span: 0 }}
                            wrapperCol={{ span: 24 }}
                            required={false}
                            placeholder="Rule Type Operator"
                        />
                    </Col>
                    <Col span={5}>
                        {selectedRule.valueType === 'string'
                            && (
                                <OZInput
                                    field={`${arrayField}[${index}].value`}
                                    initialValue={getDepthValue(initialValue[index], 'value')}
                                    getFieldDecorator={getFieldDecorator}
                                    placeholder="Value"
                                    required={false}
                                />
                            )}
                        {selectedRule.valueType === 'button'
                            && <Button onClick={() => onOpenMap(index)}>...</Button>
                        }
                        {selectedRule.valueType === 'number'
                            && (
                                <OZInputNumber
                                    field={`${arrayField}[${index}].value`}
                                    initialValue={getDepthValue(initialValue[index], 'value', 0)}
                                    min={0}
                                    max={1000000}
                                    getFieldDecorator={getFieldDecorator}
                                    required={false}
                                />
                            )}
                        {selectedRule.valueType === 'select'
                            && (
                                <OZSelectItem
                                    field={`${arrayField}[${index}].value`}
                                    initialValue={getDepthValue(initialValue[index], 'value')}
                                    getFieldDecorator={getFieldDecorator}
                                    combines={selectedRule.enumValues}
                                    labelCol={{ span: 0 }}
                                    wrapperCol={{ span: 24 }}
                                    required={false}
                                    placeholder="Select an Option"
                                />
                            )}
                    </Col>
                    <Col span={5}>
                        <OZSelectItem
                            // label="Type"
                            field={`${arrayField}[${index}].operator`}
                            initialValue={getDepthValue(initialValue[index], 'operator')}
                            getFieldDecorator={getFieldDecorator}
                            combines={[
                                { label: 'AND', value: 'and' },
                                { label: 'OR', value: 'or' },
                            ]}
                            labelCol={{ span: 0 }}
                            wrapperCol={{ span: 24 }}
                            required={false}
                            placeholder="AND or OR"
                        />
                    </Col>
                    {items.length > 1 ? (
                        <Icon
                            className="dynamic-delete-button"
                            type="minus-circle-o"
                            style={{ fontSize: '24px', marginTop: '7px', marginLeft: '10px' }}
                            onClick={() => remove(index, keysField, arrayField)}
                        />
                    ) : null}
                </Row>

            </Form.Item>
        )
    })

    return (
        <>
            {formItems}
            {(items.length < 5) && (
                <Form.Item>
                    <Button type="dashed" onClick={() => add(keysField)} style={{ width: '60%' }}>
                        <Icon type="plus" />
                        {' '}
                        Add another
                    </Button>
                </Form.Item>
            )}
            {visibleMap && (
                <MapModal
                    title="Map Information"
                    comp={getFieldValue(`${arrayField}[${currentIndex}].value`)}
                    visible={visibleMap}
                    onUpdate={onUpdateMap}
                    onCancel={onCancelMap}
                />
            )}
        </>
    )
}
OZRules.propTypes = {
}

OZRules.defaultProps = {
}
export default OZRules
