import React from 'react'
import { Form, Radio, Checkbox, InputNumber, Divider, Input } from 'antd'
import {
    faFont,
    faImages,
    faMapMarkerAlt,
    faHistory,
    faClipboardCheck,
    faPalette,
    faLink,
    faVideo,
    faAddressCard,
    faFilm,
    faBell,
    faUsers,
    faLock,
    faEnvelope,
    faAsterisk,
    faComments,
    faPuzzlePiece,
    faSwatchbook,
    faRocket,
    faTable,
    faBullhorn,
    faEye,
    faListUl,
    faInfoCircle
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import OZSelectItem from 'components/FormItems/OZSelectItem/index'
import ControlButton from 'components/ControlButton/ControlButton'
import ControlBtnsGroup from 'components/ControlBtnsGroup/ControlBtnsGroup'
import { inlineStyle, getDepthValue } from 'utils'

import './index.scss'

const FunctionForm = ({
    data,
    form: { getFieldDecorator, getFieldValue, setFieldsValue },
    field,
    disabled,
    initialValue = {
        timestamp: '',
        schedule: '',
        count: '',
        short: '',
        tooltip: {
            text: '',
        },
    },
}) => {
    const changeHandler = (field, value) => {
        const key = field
        setFieldsValue({ [key]: value })
    }

    const register = key => {
        getFieldDecorator(`${field}.${key}`, { initialValue: getDepthValue(data, key, initialValue[key]) })
    }

    const initial = key => getDepthValue(data, key, initialValue[key])

    register('mailing')
    register('mailingType')
    register('description')
    register('descriptionType')
    register('image')
    register('imageType')
    register('video')
    register('videoType')
    register('stream')
    register('streamType')
    register('contact')
    register('contactType')
    register('source')
    register('sourceType')
    register('permission')
    register('permissionType')
    register('comment')
    register('commentType')
    register('infomation')
    register('infomationType')
    register('survey')
    register('surveyType')
    register('quiz')
    register('quizType')
    register('reminder')
    register('reminderType')
    register('checklist')
    register('checklistType')
    register('socialmedia')
    register('socialmediaType')
    register('style')
    register('styleType')
    register('plugin')
    register('pluginType')
    register('tracking')
    register('trackingType')

    let bChanged = false

    Object.keys(initialValue).forEach(key => {
        if (getFieldValue(`${field}.${key}`) !== initialValue[key]) bChanged = true
    })

    const checkboxStyle = {
        display: 'flex',
        flexDirection: 'row',
        marginLeft: '20px',
        width: '60%'
    }

    return (
        <div className="bits-functionform">
            <Form.Item label="" className="bits-functionform-label">
                <div className="bits-functionform-label-item">
                    {getFieldDecorator(`${field}.mailing`, {
                        initialValue: initial('mailing'),
                        valuePropName: 'checked',
                    })(<Checkbox style={checkboxStyle}>
                        <span className="bits-functionform-label-item-buttontext">
                            <span className="bits-functionform-label-item-buttontext-button">
                                <FontAwesomeIcon icon={faListUl} />
                            </span>
                            Publish to Mailing, SMS List & Social Media
                        </span>
                    </Checkbox>)}
                    <OZSelectItem
                        label=""
                        field={`${field}.mailingType`}
                        initialValue={initial('mailingType')}
                        getFieldDecorator={getFieldDecorator}
                        combines={[
                            { label: 'Access', value: 'Access' },
                            { label: 'No Access', value: 'No Access' },
                            { label: 'Conditional', value: 'Conditional' }
                        ]}
                        style={{ width: '30%' }}
                        required={false}
                    />
                </div>
                <div className="bits-functionform-label-divider" />
                <div className="bits-functionform-label-item">
                    {getFieldDecorator(`${field}.description`, {
                        initialValue: initial('description'),
                        valuePropName: 'checked',
                    })(<Checkbox style={checkboxStyle}>
                        <span className="bits-functionform-label-item-buttontext">
                            <span className="bits-functionform-label-item-buttontext-button">
                                <FontAwesomeIcon icon={faFont} />
                            </span>
                            Edit Description
                        </span>
                    </Checkbox>)}
                    <OZSelectItem
                        label=""
                        field={`${field}.descriptionType`}
                        initialValue={initial('descriptionType')}
                        getFieldDecorator={getFieldDecorator}
                        combines={[
                            { label: 'Access', value: 'Access' },
                            { label: 'No Access', value: 'No Access' },
                            { label: 'Conditional', value: 'Conditional' }
                        ]}
                        style={{ width: '30%' }}
                        required={false}
                    />
                </div>
                <div className="bits-functionform-label-divider" />
                <div className="bits-functionform-label-item">
                    {getFieldDecorator(`${field}.image`, {
                        initialValue: initial('image'),
                        valuePropName: 'checked',
                    })(<Checkbox style={checkboxStyle}>
                        <span className="bits-functionform-label-item-buttontext">
                            <span className="bits-functionform-label-item-buttontext-button">
                                <FontAwesomeIcon icon={faImages} />
                                {/* <ControlButton Icon={faListUl} /> */}
                            </span>
                            Edit Image List
                        </span>
                    </Checkbox>)}
                    <OZSelectItem
                        label=""
                        field={`${field}.imageType`}
                        initialValue={initial('imageType')}
                        getFieldDecorator={getFieldDecorator}
                        combines={[
                            { label: 'Access', value: 'Access' },
                            { label: 'No Access', value: 'No Access' },
                            { label: 'Conditional', value: 'Conditional' }
                        ]}
                        style={{ width: '30%' }}
                        required={false}
                    />
                </div>
                <div className="bits-functionform-label-divider" />
                <div className="bits-functionform-label-item">
                    {getFieldDecorator(`${field}.video`, {
                        initialValue: initial('video'),
                        valuePropName: 'checked',
                    })(<Checkbox style={checkboxStyle}>
                        <span className="bits-functionform-label-item-buttontext">
                            <span className="bits-functionform-label-item-buttontext-button">
                                <FontAwesomeIcon icon={faVideo} />
                                {/* <ControlButton Icon={faListUl} /> */}
                            </span>
                            Edit Video File List
                        </span>
                    </Checkbox>)}
                    <OZSelectItem
                        label=""
                        field={`${field}.videoType`}
                        initialValue={initial('videoType')}
                        getFieldDecorator={getFieldDecorator}
                        combines={[
                            { label: 'Access', value: 'Access' },
                            { label: 'No Access', value: 'No Access' },
                            { label: 'Conditional', value: 'Conditional' }
                        ]}
                        style={{ width: '30%' }}
                        required={false}
                    />
                </div>
                <div className="bits-functionform-label-divider" />
                <div className="bits-functionform-label-item">
                    {getFieldDecorator(`${field}.stream`, {
                        initialValue: initial('stream'),
                        valuePropName: 'checked',
                    })(<Checkbox style={checkboxStyle}>
                        <span className="bits-functionform-label-item-buttontext">
                            <span className="bits-functionform-label-item-buttontext-button">
                                <FontAwesomeIcon icon={faFilm} />
                                {/* <ControlButton Icon={faListUl} /> */}
                            </span>
                            Edit Streamer List
                        </span>
                    </Checkbox>)}
                    <OZSelectItem
                        label=""
                        field={`${field}.streamType`}
                        initialValue={initial('streamType')}
                        getFieldDecorator={getFieldDecorator}
                        combines={[
                            { label: 'Access', value: 'Access' },
                            { label: 'No Access', value: 'No Access' },
                            { label: 'Conditional', value: 'Conditional' }
                        ]}
                        style={{ width: '30%' }}
                        required={false}
                    />
                </div>
                <div className="bits-functionform-label-divider" />
                <div className="bits-functionform-label-item">
                    {getFieldDecorator(`${field}.contact`, {
                        initialValue: initial('contact'),
                        valuePropName: 'checked',
                    })(<Checkbox style={checkboxStyle}>
                        <span className="bits-functionform-label-item-buttontext">
                            <span className="bits-functionform-label-item-buttontext-button">
                                <FontAwesomeIcon icon={faAddressCard} />
                                {/* <ControlButton Icon={faListUl} /> */}
                            </span>
                            Edit Contact Info
                        </span>
                    </Checkbox>)}
                    <OZSelectItem
                        label=""
                        field={`${field}.contactType`}
                        initialValue={initial('contactType')}
                        getFieldDecorator={getFieldDecorator}
                        combines={[
                            { label: 'Access', value: 'Access' },
                            { label: 'No Access', value: 'No Access' },
                            { label: 'Conditional', value: 'Conditional' }
                        ]}
                        style={{ width: '30%' }}
                        required={false}
                    />
                </div>
                <div className="bits-functionform-label-divider" />
                <div className="bits-functionform-label-item">
                    {getFieldDecorator(`${field}.video`, {
                        initialValue: initial('video'),
                        valuePropName: 'checked',
                    })(<Checkbox style={checkboxStyle}>
                        <span className="bits-functionform-label-item-buttontext">
                            <span className="bits-functionform-label-item-buttontext-button">
                                <FontAwesomeIcon icon={faVideo} />
                                {/* <ControlButton Icon={faListUl} /> */}
                            </span>
                            Edit Geolocation
                        </span>
                    </Checkbox>)}
                    <OZSelectItem
                        label=""
                        field={`${field}.videoType`}
                        initialValue={initial('videoType')}
                        getFieldDecorator={getFieldDecorator}
                        combines={[
                            { label: 'Access', value: 'Access' },
                            { label: 'No Access', value: 'No Access' },
                            { label: 'Conditional', value: 'Conditional' }
                        ]}
                        style={{ width: '30%' }}
                        required={false}
                    />
                </div>
                <div className="bits-functionform-label-divider" />
                <div className="bits-functionform-label-item">
                    {getFieldDecorator(`${field}.video`, {
                        initialValue: initial('video'),
                        valuePropName: 'checked',
                    })(<Checkbox style={checkboxStyle}>
                        <span className="bits-functionform-label-item-buttontext">
                            <span className="bits-functionform-label-item-buttontext-button">
                                <FontAwesomeIcon icon={faVideo} />
                                {/* <ControlButton Icon={faListUl} /> */}
                            </span>
                            Edit Schedule
                        </span>
                    </Checkbox>)}
                    <OZSelectItem
                        label=""
                        field={`${field}.videoType`}
                        initialValue={initial('videoType')}
                        getFieldDecorator={getFieldDecorator}
                        combines={[
                            { label: 'Access', value: 'Access' },
                            { label: 'No Access', value: 'No Access' },
                            { label: 'Conditional', value: 'Conditional' }
                        ]}
                        style={{ width: '30%' }}
                        required={false}
                    />
                </div>
                <div className="bits-functionform-label-divider" />
                <div className="bits-functionform-label-item">
                    {getFieldDecorator(`${field}.source`, {
                        initialValue: initial('source'),
                        valuePropName: 'checked',
                    })(<Checkbox style={checkboxStyle}>
                        <span className="bits-functionform-label-item-buttontext">
                            <span className="bits-functionform-label-item-buttontext-button">
                                <FontAwesomeIcon icon={faAsterisk} />
                            </span>
                            Edit Source and Destination Lists
                        </span>
                    </Checkbox>)}
                    <OZSelectItem
                        label=""
                        field={`${field}.sourceType`}
                        initialValue={initial('sourceType')}
                        getFieldDecorator={getFieldDecorator}
                        combines={[
                            { label: 'Access', value: 'Access' },
                            { label: 'No Access', value: 'No Access' },
                            { label: 'Conditional', value: 'Conditional' }
                        ]}
                        style={{ width: '30%' }}
                        required={false}
                    />
                </div>
                <div className="bits-functionform-label-divider" />
                <div className="bits-functionform-label-item">
                    {getFieldDecorator(`${field}.permission`, {
                        initialValue: initial('permission'),
                        valuePropName: 'checked',
                    })(<Checkbox style={checkboxStyle}>
                        <span className="bits-functionform-label-item-buttontext">
                            <span className="bits-functionform-label-item-buttontext-button">
                                <FontAwesomeIcon icon={faLock} />
                            </span>
                            Edit Permissions
                        </span>
                    </Checkbox>)}
                    <OZSelectItem
                        label=""
                        field={`${field}.permissionType`}
                        initialValue={initial('permissionType')}
                        getFieldDecorator={getFieldDecorator}
                        combines={[
                            { label: 'Access', value: 'Access' },
                            { label: 'No Access', value: 'No Access' },
                            { label: 'Conditional', value: 'Conditional' }
                        ]}
                        style={{ width: '30%' }}
                        required={false}
                    />
                </div>
                <div className="bits-functionform-label-divider" />
                <div className="bits-functionform-label-item">
                    {getFieldDecorator(`${field}.socialmedia`, {
                        initialValue: initial('socialmedia'),
                        valuePropName: 'checked',
                    })(<Checkbox style={checkboxStyle}>
                        <span className="bits-functionform-label-item-buttontext">
                            <span className="bits-functionform-label-item-buttontext-button">
                                <FontAwesomeIcon icon={faUsers} />
                            </span>
                            Edit Social Media
                        </span>
                    </Checkbox>)}
                    <OZSelectItem
                        label=""
                        field={`${field}.socialmediaType`}
                        initialValue={initial('socialmediaType')}
                        getFieldDecorator={getFieldDecorator}
                        combines={[
                            { label: 'Access', value: 'Access' },
                            { label: 'No Access', value: 'No Access' },
                            { label: 'Conditional', value: 'Conditional' }
                        ]}
                        style={{ width: '30%' }}
                        required={false}
                    />
                </div>
                <div className="bits-functionform-label-divider" />
                <div className="bits-functionform-label-item">
                    {getFieldDecorator(`${field}.reminder`, {
                        initialValue: initial('reminder'),
                        valuePropName: 'checked',
                    })(<Checkbox style={checkboxStyle}>
                        <span className="bits-functionform-label-item-buttontext">
                            <span className="bits-functionform-label-item-buttontext-button">
                                <FontAwesomeIcon icon={faBell} />
                            </span>
                            Manage Reminders
                        </span>
                    </Checkbox>)}
                    <OZSelectItem
                        label=""
                        field={`${field}.reminderType`}
                        initialValue={initial('reminderType')}
                        getFieldDecorator={getFieldDecorator}
                        combines={[
                            { label: 'Access', value: 'Access' },
                            { label: 'No Access', value: 'No Access' },
                            { label: 'Conditional', value: 'Conditional' }
                        ]}
                        style={{ width: '30%' }}
                        required={false}
                    />
                </div>
                <div className="bits-functionform-label-divider" />
                <div className="bits-functionform-label-item">
                    {getFieldDecorator(`${field}.comment`, {
                        initialValue: initial('comment'),
                        valuePropName: 'checked',
                    })(<Checkbox style={checkboxStyle}>
                        <span className="bits-functionform-label-item-buttontext">
                            <span className="bits-functionform-label-item-buttontext-button">
                                <FontAwesomeIcon icon={faComments} />
                            </span>
                            Manage Comments
                        </span>
                    </Checkbox>)}
                    <OZSelectItem
                        label=""
                        field={`${field}.commentType`}
                        initialValue={initial('commentType')}
                        getFieldDecorator={getFieldDecorator}
                        combines={[
                            { label: 'Access', value: 'Access' },
                            { label: 'No Access', value: 'No Access' },
                            { label: 'Conditional', value: 'Conditional' }
                        ]}
                        style={{ width: '30%' }}
                        required={false}
                    />
                </div>
                <div className="bits-functionform-label-divider" />
                <div className="bits-functionform-label-item">
                    {getFieldDecorator(`${field}.information`, {
                        initialValue: initial('information'),
                        valuePropName: 'checked',
                    })(<Checkbox style={checkboxStyle}>
                        <span className="bits-functionform-label-item-buttontext">
                            <span className="bits-functionform-label-item-buttontext-button">
                                <FontAwesomeIcon icon={faInfoCircle} />
                            </span>
                            Manage Information
                        </span>
                    </Checkbox>)}
                    <OZSelectItem
                        label=""
                        field={`${field}.informationType`}
                        initialValue={initial('informationType')}
                        getFieldDecorator={getFieldDecorator}
                        combines={[
                            { label: 'Access', value: 'Access' },
                            { label: 'No Access', value: 'No Access' },
                            { label: 'Conditional', value: 'Conditional' }
                        ]}
                        style={{ width: '30%' }}
                        required={false}
                    />
                </div>
                <div className="bits-functionform-label-divider" />
                <div className="bits-functionform-label-item">
                    {getFieldDecorator(`${field}.checklist`, {
                        initialValue: initial('checklist'),
                        valuePropName: 'checked',
                    })(<Checkbox style={checkboxStyle}>
                        <span className="bits-functionform-label-item-buttontext">
                            <span className="bits-functionform-label-item-buttontext-button">
                                <FontAwesomeIcon icon={faClipboardCheck} />
                            </span>
                            Manage Checklist
                        </span>
                    </Checkbox>)}
                    <OZSelectItem
                        label=""
                        field={`${field}.checklistType`}
                        initialValue={initial('checklistType')}
                        getFieldDecorator={getFieldDecorator}
                        combines={[
                            { label: 'Access', value: 'Access' },
                            { label: 'No Access', value: 'No Access' },
                            { label: 'Conditional', value: 'Conditional' }
                        ]}
                        style={{ width: '30%' }}
                        required={false}
                    />
                </div>
                <div className="bits-functionform-label-divider" />
                <div className="bits-functionform-label-item">
                    {getFieldDecorator(`${field}.survey`, {
                        initialValue: initial('survey'),
                        valuePropName: 'checked',
                    })(<Checkbox style={checkboxStyle}>
                        <span className="bits-functionform-label-item-buttontext">
                            <span className="bits-functionform-label-item-buttontext-button">
                                <FontAwesomeIcon icon={faMapMarkerAlt} />
                            </span>
                            Manage Surveys
                        </span>
                    </Checkbox>)}
                    <OZSelectItem
                        label=""
                        field={`${field}.surveyType`}
                        initialValue={initial('surveyType')}
                        getFieldDecorator={getFieldDecorator}
                        combines={[
                            { label: 'Access', value: 'Access' },
                            { label: 'No Access', value: 'No Access' },
                            { label: 'Conditional', value: 'Conditional' }
                        ]}
                        style={{ width: '30%' }}
                        required={false}
                    />
                </div>
                <div className="bits-functionform-label-divider" />
                <div className="bits-functionform-label-item">
                    {getFieldDecorator(`${field}.quiz`, {
                        initialValue: initial('quiz'),
                        valuePropName: 'checked',
                    })(<Checkbox style={checkboxStyle}>
                        <span className="bits-functionform-label-item-buttontext">
                            <span className="bits-functionform-label-item-buttontext-button">
                                <FontAwesomeIcon icon={faRocket} />
                            </span>
                            Manage Quizes
                        </span>
                    </Checkbox>)}
                    <OZSelectItem
                        label=""
                        field={`${field}.quizType`}
                        initialValue={initial('quizType')}
                        getFieldDecorator={getFieldDecorator}
                        combines={[
                            { label: 'Access', value: 'Access' },
                            { label: 'No Access', value: 'No Access' },
                            { label: 'Conditional', value: 'Conditional' }
                        ]}
                        style={{ width: '30%' }}
                        required={false}
                    />
                </div>
                <div className="bits-functionform-label-divider" />
                <div className="bits-functionform-label-item">
                    {getFieldDecorator(`${field}.style`, {
                        initialValue: initial('style'),
                        valuePropName: 'checked',
                    })(<Checkbox style={checkboxStyle}>
                        <span className="bits-functionform-label-item-buttontext">
                            <span className="bits-functionform-label-item-buttontext-button">
                                <FontAwesomeIcon icon={faPalette} />
                            </span>
                            Manage UI Layouts&Style
                        </span>
                    </Checkbox>)}
                    <OZSelectItem
                        label=""
                        field={`${field}.styleType`}
                        initialValue={initial('styleType')}
                        getFieldDecorator={getFieldDecorator}
                        combines={[
                            { label: 'Access', value: 'Access' },
                            { label: 'No Access', value: 'No Access' },
                            { label: 'Conditional', value: 'Conditional' }
                        ]}
                        style={{ width: '30%' }}
                        required={false}
                    />
                </div>
                <div className="bits-functionform-label-divider" />
                <div className="bits-functionform-label-item">
                    {getFieldDecorator(`${field}.plugin`, {
                        initialValue: initial('plugin'),
                        valuePropName: 'checked',
                    })(<Checkbox style={checkboxStyle}>
                        <span className="bits-functionform-label-item-buttontext">
                            <span className="bits-functionform-label-item-buttontext-button">
                                <FontAwesomeIcon icon={faPuzzlePiece} />
                            </span>
                            Manage Plugins
                        </span>
                    </Checkbox>)}
                    <OZSelectItem
                        label=""
                        field={`${field}.pluginType`}
                        initialValue={initial('pluginType')}
                        getFieldDecorator={getFieldDecorator}
                        combines={[
                            { label: 'Access', value: 'Access' },
                            { label: 'No Access', value: 'No Access' },
                            { label: 'Conditional', value: 'Conditional' }
                        ]}
                        style={{ width: '30%' }}
                        required={false}
                    />
                </div>
                <div className="bits-functionform-label-divider" />
                <div className="bits-functionform-label-item">
                    {getFieldDecorator(`${field}.tracking`, {
                        initialValue: initial('tracking'),
                        valuePropName: 'checked',
                    })(<Checkbox style={checkboxStyle}>
                        <span className="bits-functionform-label-item-buttontext">
                            <span className="bits-functionform-label-item-buttontext-button">
                                <FontAwesomeIcon icon={faHistory} />
                            </span>
                            View Tracking Infomation
                        </span>
                    </Checkbox>)}
                    <OZSelectItem
                        label=""
                        field={`${field}.trackingType`}
                        initialValue={initial('trackingType')}
                        getFieldDecorator={getFieldDecorator}
                        combines={[
                            { label: 'Access', value: 'Access' },
                            { label: 'No Access', value: 'No Access' },
                            { label: 'Conditional', value: 'Conditional' }
                        ]}
                        style={{ width: '30%' }}
                        required={false}
                    />
                </div>
                <div className="bits-functionform-label-divider" />
            </Form.Item>
        </div>
    )
}

export default FunctionForm
