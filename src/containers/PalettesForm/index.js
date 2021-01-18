import React from 'react'
import { Form, Radio, Checkbox, InputNumber, Input } from 'antd'
import ColorPicker from 'components/ColorPicker'
import { inlineStyle, getDepthValue } from 'utils'
import BackgroundsSelect from 'containers/Selects/BackgroundsSelect'
import OZInput from 'components/FormItems/OZInput'
import OZSelectItem from 'components/FormItems/OZSelectItem'
import './index.scss'
import _ from 'lodash'

const PalettesForms = ({
    data,
    form: { getFieldDecorator, getFieldValue, setFieldsValue },
    field,
    disabled,
    initialValue = {
        bg: {
            color: '',
            image: null,
            transparency: ''
        },
        fg: {
            color: '',
            size: null,
            weight: ''
        },
        h1: {
            color: '',
        },
        divider: {
            color: '',
            weight: ''
        },
        shadow: {
            color: ''
        },
        outline: {
            color: '',
            weight: 0,
            radius: 0
        },
        b_shadow: false,
        b_outline: false,
        h1_type: 'color',
        width: 0,
        height: 0,
        position: {
            horizontal: undefined,
            vertical: undefined,
        },
    },
}) => {
    const changeHandler = (field, value) => {
        const key = field
        setFieldsValue({ [key]: value })
    }

    const palettesNameOptions = [
        { value: 'title', label: 'Title' },
        { value: 'short', label: 'Short' },
        { value: 'long', label: 'Long' },
        { value: 'body', label: 'Body' },
        { value: 'media', label: 'Media' },
    ]

    const register = key => {
        getFieldDecorator(`${field}.${key}`, { initialValue: getDepthValue(data, key, initialValue[key]) })
    }

    const initial = key => getDepthValue(data, key, initialValue[key])
    register('b_shadow')
    register('b_outline')
    register('bg.color')
    register('bg.transparency')
    register('bg.image')
    register('fg.color')
    register('fg.size')
    register('fg.weight')
    register('hl.color')
    register('hl_type')
    register('shadow.color')
    register('outline.color')
    register('outline.weight')
    register('outline.radius')
    register('divider.color')
    register('divider.weight')
    register('width')
    register('height')
    register('position.horizontal')
    register('position.vertical')

    let bChanged = false

    Object.keys(initialValue).forEach(key => {
        if (getFieldValue(`${field}.${key}`) !== initialValue[key]) bChanged = true
    })

    const radioStyle = {
        marginLeft: '20px',
        height: '30px',
        lineHeight: '40px',
    }

    const onChange = (item, e) => {
        if (item == 'shadow') {
            if (!e.target.value)
                setFieldsValue({ [`${field}.shadow.color`]: '' })
        } else if (item == 'outline') {
            if (!e.target.value) {
                setFieldsValue({ [`${field}.outline.color`]: '' })
                setFieldsValue({ [`${field}.outline.weight`]: 0 })
                setFieldsValue({ [`${field}.outline.radius`]: 0 })
            }
        }

    }

    return (
        <div className="palettes-form-style-v2">
            {/* <Form.Item label="Name" className="primary-label">
                {getFieldDecorator(`${field}.name`, { iannouncer-group-white-form-buttongroup-buttonnitialValue: initial('name') })(
                    <Radio.Group style={{ marginLeft: '10px' }} value={initial('name')}>
                        {palettesNameOptions.map(option => (
                            <Radio style={radioStyle} value={option.value} key={option.value}>
                                {option.label}
                            </Radio>
                        ))}
                    </Radio.Group>
                )}
            </Form.Item> */}
            <Form.Item label="Dimensions" className="primary-label">
                <div className="items-flex-row">
                    <p>Width: </p>
                    {getFieldDecorator(`${field}.width`, {
                        initialValue: initial('width'),
                    })(<InputNumber min={0} max={10000} placeholder="0" disabled={disabled} />)}
                </div>
                <div className="items-flex-row">
                    <p>Height: </p>
                    {getFieldDecorator(`${field}.height`, {
                        initialValue: initial('height'),
                    })(<InputNumber min={0} max={10000} placeholder="0" disabled={disabled} />)}
                </div>
            </Form.Item>
            <Form.Item label="Position" className="primary-label">
                <div>
                    <span style={{ width: '6rem', display: 'inline-block', marginLeft: '30px' }}>Horizontal:</span>
                    <OZSelectItem
                        field={`${field}.position.horizontal`}
                        initialValue={initial('position.horizontal')}
                        getFieldDecorator={getFieldDecorator}
                        combines={[
                            { label: 'Left', value: 'left' },
                            { label: 'Right', value: 'right' },
                            { label: 'Center', value: 'center' },
                        ]}
                        style={{
                            width: '225px',
                            display: 'inline-block',
                            lineHeight: '40px',
                            marginBottom: '0px',
                        }}
                    />
                </div>
                <div>
                    <span style={{ width: '6rem', display: 'inline-block', marginLeft: '30px' }}>Vertical:</span>
                    <OZSelectItem
                        field={`${field}.position.vertical`}
                        initialValue={initial('position.vertical')}
                        getFieldDecorator={getFieldDecorator}
                        combines={[
                            { label: 'Top', value: 'top' },
                            { label: 'Bottom', value: 'bottom' },
                            { label: 'Middle', value: 'middle' },
                        ]}
                        style={{
                            width: '225px',
                            display: 'inline-block',
                            lineHeight: '40px',
                            marginBottom: '0px',
                        }}
                    />
                </div>
            </Form.Item>
            <Form.Item label="Background" className="primary-label">
                <div className="items-flex-row">
                    <p>Image: </p>
                    {getFieldDecorator(`${field}.bg.image`, { initialValue: initial('bg.image') })(
                        <BackgroundsSelect style={{ width: '300px' }} />
                    )}
                </div>
                <div className="items-flex-row">
                    <p>Color: </p>
                    <ColorPicker
                        color={getFieldValue(`${field}.bg.color`)}
                        onValueChange={changeHandler}
                        field={`${field}.bg.color`}
                        wrapperStyle={{ display: 'inline-block' }}
                        disabled={disabled}
                    />
                </div>
                <div className="items-flex-row">
                    <p>Transparency: </p>
                    {getFieldDecorator(`${field}.bg.transparency`, {
                        initialValue: initial('bg.transparency'),
                    })(<InputNumber min={0} max={10000} placeholder="0" disabled={disabled} />)}
                </div>
            </Form.Item>
            <Form.Item label="Foreground" className="primary-label">
                <div className="items-flex-row">
                    <p>Color: </p>
                    <ColorPicker
                        color={getFieldValue(`${field}.fg.color`)}
                        onValueChange={changeHandler}
                        field={`${field}.fg.color`}
                        wrapperStyle={{ display: 'inline-block' }}
                        disabled={disabled}
                    />
                </div>
                <div className="items-flex-row">
                    <p>Size: </p>
                    {getFieldDecorator(`${field}.fg.size`, {
                        initialValue: initial('fg.size'),
                    })(<InputNumber min={0} max={10000} placeholder="0" disabled={disabled} />)}
                </div>
                <div className="items-flex-row">
                    <p>Weight: </p>
                    {getFieldDecorator(`${field}.fg.weight`, {
                        initialValue: initial('fg.weight'),
                    })(<InputNumber min={0} max={10000} placeholder="0" disabled={disabled} />)}
                </div>
            </Form.Item>
            <Form.Item label="Divider" className="primary-label">
                <div className="items-flex-row">
                    <p>Color: </p>
                    <ColorPicker
                        color={getFieldValue(`${field}.divider.color`)}
                        onValueChange={changeHandler}
                        field={`${field}.divider.color`}
                        wrapperStyle={{ display: 'inline-block' }}
                        disabled={disabled}
                    />
                </div>
                <div className="items-flex-row">
                    <p>Weight: </p>
                    {getFieldDecorator(`${field}.divider.weight`, {
                        initialValue: initial('divider.weight'),
                    })(<InputNumber min={0} max={10000} placeholder="0" disabled={disabled} />)}
                </div>
            </Form.Item>
            <Form.Item label="Highlight" className="primary-label">
                {getFieldDecorator(`${field}.hl_type`, { initialValue: initial('hl_type') })(
                    <Radio.Group style={{ paddingLeft: '30px' }} disabled={disabled}>
                        <Radio style={radioStyle} value="color">
                            Color &nbsp;&nbsp;
                            {getFieldValue(`${field}.hl_type`) === 'color' && (
                                <ColorPicker
                                    color={getFieldValue(`${field}.hl.color`)}
                                    onValueChange={changeHandler}
                                    field={`${field}.hl.color`}
                                    wrapperStyle={{ display: 'inline-block' }}
                                    disabled={disabled}
                                />
                            )}
                        </Radio>
                    </Radio.Group>
                )}
            </Form.Item>
            <Form.Item label="Outer" className="primary-label">
                <div>
                    {getFieldDecorator(`${field}.b_shadow`, {
                        initialValue: initial('b_shadow'),
                        valuePropName: 'checked',
                        rules: [
                            {
                                transform: value => value || undefined, // Those two lines
                                type: 'boolean',
                            },
                        ],
                    })(
                        <Checkbox
                            style={{
                                display: 'inline-block',
                                marginLeft: '30px',
                                marginRight: '10px',
                                lineHeight: '40px',
                                width: '100px',
                            }}
                            onChange={(e) => onChange('shadow', e)}
                            disabled={disabled}
                        >
                            Shadow
                        </Checkbox>,
                    )}
                    {getFieldValue(`${field}.b_shadow`) && (
                        <ColorPicker
                            color={getFieldValue(`${field}.shadow.color`)}
                            onValueChange={changeHandler}
                            field={`${field}.shadow.color`}
                            wrapperStyle={{ display: 'inline-block', marginLeft: '1rem' }}
                            disabled={disabled}
                        />
                    )}
                </div>
                {getFieldDecorator(`${field}.b_outline`, {
                    initialValue: initial('b_outline'),
                    valuePropName: 'checked',
                    rules: [
                        {
                            transform: value => value || undefined, // Those two lines
                            type: 'boolean',
                        },
                    ],
                })(
                    <Checkbox
                        style={{
                            display: 'inline-block',
                            marginLeft: '30px',
                            marginRight: '10px',
                            lineHeight: '40px',
                            width: '100px',
                        }}
                        disabled={disabled}
                        onChange={(e) => onChange('outline', e)}
                    >
                        Outline
                    </Checkbox>,
                )}
            </Form.Item>
            {getFieldValue(`${field}.b_outline`) && (
                <>
                    <Form.Item style={{ paddingLeft: '4rem' }}>
                        <span style={{ width: '4rem', display: 'inline-block' }}>Color:</span>
                        <ColorPicker
                            color={getFieldValue(`${field}.outline.color`)}
                            onValueChange={changeHandler}
                            field={`${field}.outline.color`}
                            wrapperStyle={{ display: 'inline-block', marginLeft: '1rem' }}
                            disabled={disabled}
                        />
                    </Form.Item>
                    <Form.Item style={{ paddingLeft: '4rem' }}>
                        <span style={{ width: '4rem', display: 'inline-block' }}>Weight:</span>
                        {getFieldDecorator(`${field}.outline.weight`, {
                            initialValue: initial('outline.weight'),
                        })(<InputNumber min={0} max={100} placeholder="0" disabled={disabled} />)}
                    </Form.Item>
                    <Form.Item style={{ paddingLeft: '4rem' }}>
                        <span style={{ width: '4rem', display: 'inline-block' }}>Radius:</span>
                        {getFieldDecorator(`${field}.outline.radius`, {
                            initialValue: initial('outline.radius'),
                        })(<InputNumber min={0} max={100} placeholder="0" disabled={disabled} />)}
                    </Form.Item>
                </>
            )}
        </div>
    )
}

export default PalettesForms
