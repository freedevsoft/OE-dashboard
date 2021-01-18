import React from 'react'
import { Checkbox, Input, Button, Row, Col, Icon, Form, Select, InputNumber } from 'antd'
import { getDepthValue } from 'utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { inlineDeviceStyle } from 'utils/index'
import { groupingQuery } from 'utils/queries'
import { useQuery } from '@apollo/react-hooks'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import * as constants from 'utils/constants'
import './index.scss'
const { TextArea } = Input

const DeviceForm = ({
  data,
  form: { getFieldDecorator, getFieldValue, setFieldsValue },
  field,
  initialValue = {
    list: []
  },
  groupTypes,
  groupIds,
  onShowThirdPanel,
  panelDocType,
  onDeleteAsset,
  imageasset
}) => {
  const register = key => {
    getFieldDecorator(`${field}.${key}`, { initialValue: getDepthValue(data, key, initialValue[key]) })
  }
  register('list')
  const list = getFieldValue(`${field}.list`)

  const { loading, error, data: groupingQueryData } = useQuery(groupingQuery, {
    variables: {
      ids: list?.map(item => item.profile),
    },
  })

  const update = (index, internal, value) => {
    setFieldsValue({ [`${field}.list`]: [...list.slice(0, index), { ...list[index], [internal]: value }, ...list.slice(index + 1)] })
  }

  const remove = index => {
    setFieldsValue({ [`${field}.list`]: [...list.slice(0, index), ...list.slice(index + 1)] })
  }

  const removeItem = (index, item) => {
    setFieldsValue({ [`${field}.list`]: [...list.slice(0, index), { ...list[index], [item]: '' }, ...list.slice(index + 1)] })
  }

  const add = () => {
    setFieldsValue({ [`${field}.list`]: [...list, { name: '', iconURL: '', id: '', deviceType: '', region: '', URL: '', IP_Address: '', latitude: '', longitude: '', state: '', profile: '', account: '' }] })
  }

  const onDrop = (ev, index, panelDocType, internal) => {
    const resourceUrl = ev.dataTransfer.getData('drag_url')
    const dragDocType = ev.dataTransfer.getData('drag_doc_type')
    if (dragDocType === constants.organizer.Icon.docType) {
      setFieldsValue({ [`${field}.list`]: [...list.slice(0, index), { ...list[index], [internal]: resourceUrl }, ...list.slice(index + 1)] })
    }
  }
  return (
    <div className="device-form">
      {list?.map((item, index) => {
        const { name, iconURL, id, deviceType, region, URL, IP_Address, latitude, longitude, state, profile, account } = item
        const groupprofile = groupingQueryData?.grouping?.find(group => group._id === item.profile)
        const groupaccount = groupingQueryData?.grouping?.find(group => group._id === item.account)
        return (
          <div key={index} className="device-form-row">
            <Icon
              type="minus-circle"
              className="dynamic-delete-button"
              style={{ fontSize: '24px', marginLeft: '10px', marginRight: '10px' }}
              onClick={() => remove(index)}
            />
            <div className="device-form-row-body">
              <Form.Item label="Device Name:" {...inlineDeviceStyle}>
                <Input
                  value={name}
                  onChange={e => update(index, 'name', e.target.value)}
                  style={{ width: '100%', marginLeft: '10px', marginBottom: '6px' }}
                />
              </Form.Item>
              <Form.Item label="Device Icon:" {...inlineDeviceStyle}>
                <div className="device-form-imagebox-itemgroup">
                  {/* <p className="device-form-imagebox-title">
                  Image:
                </p> */}
                  <div className="device-form-imagebox-item"
                    onDragOver={e => {
                      e.preventDefault()
                    }}
                    onDrop={ev => onDrop(ev, index, panelDocType, 'iconURL')}>
                    {(iconURL && iconURL != undefined && iconURL != '') ?
                      <div className="device-form-imagebox-item__item">
                        <img
                          src={iconURL}
                          style={{ maxWidth: '50px', maxHeight: '30px' }}
                        />
                        <div className="device-form-imagebox-item__item__mask">
                          <button type="button" className="device-form-imagebox-item__item__mask__close" onClick={() => removeItem(index, 'iconURL')}>
                            X
                          </button>
                        </div>
                      </div>
                      :
                      <div className="device-form-imagebox-item">
                        <p className="device-form-imagebox-item-text">
                          Drag & Drop
                      </p>
                      </div>
                    }
                  </div>
                  <span onClick={() => onShowThirdPanel('StockImage')}>
                    <FontAwesomeIcon icon={faChevronRight} color="#000" size="2x" />
                  </span>
                </div>

              </Form.Item>
              <Form.Item label="Device ID:" {...inlineDeviceStyle}>
                <Input
                  value={id}
                  onChange={e => update(index, 'id', e.target.value)}
                  style={{ width: '100%', marginLeft: '10px', marginBottom: '6px' }}
                />
              </Form.Item>
              <Form.Item label="Device Type:" {...inlineDeviceStyle}>
                <Select
                  style={{ width: '100%', marginLeft: '10px' }}
                  onChange={value => update(index, 'deviceType', value)}
                  value={deviceType}
                  placeholder="Please select an option"
                >
                  {groupTypes?.map(groupType => (
                    <Option key={groupType} value={groupType}>
                      {groupType}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Region:" {...inlineDeviceStyle}>
                <Select
                  style={{ width: '100%', marginLeft: '10px' }}
                  onChange={value => update(index, 'region', value)}
                  value={region}
                  placeholder="Please select an option"
                >
                  {groupTypes?.map(groupType => (
                    <Option key={groupType} value={groupType}>
                      {groupType}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="URL:" {...inlineDeviceStyle}>
                <Input
                  value={URL}
                  onChange={e => update(index, 'URL', e.target.value)}
                  style={{ width: '100%', marginLeft: '10px', marginBottom: '6px' }}
                />
              </Form.Item>
              <Form.Item label="IP Address:" {...inlineDeviceStyle}>
                <Input
                  value={IP_Address}
                  onChange={e => update(index, 'IP_Address', e.target.value)}
                  style={{ width: '100%', marginLeft: '10px', marginBottom: '6px' }}
                />
              </Form.Item>
              <div className="device-form-row-latlong">
                <div className="device-form-row-latlong-latitude">
                  <p>
                    Latitude:
                  </p>
                  <InputNumber min={0} max={10000} placeholder="0" disabled={false} defaultValue={latitude} onChange={(value) => update(index, 'latitude', value)} />
                </div>
                <div className="device-form-row-latlong-latitude">
                  <p>
                    Longitude:
                  </p>
                  <InputNumber min={0} max={10000} placeholder="0" disabled={false} defaultValue={longitude} onChange={(value) => update(index, 'longitude', value)} />
                </div>
              </div>
              <Form.Item label="State:" {...inlineDeviceStyle}>
                <Input
                  value={state}
                  onChange={e => update(index, 'state', e.target.value)}
                  style={{ width: '100%', marginLeft: '10px', marginBottom: '6px' }}
                />
              </Form.Item>
              <div className="device-form-inside">
                <p className="device-form-inside-title">
                  Profile:
                </p>
                {item && (item.profile != undefined && item.profile != '') ?
                  <div className="device-form-inside-list">
                    <Form.Item className="form-item-groups" key={index}>
                      <div className="form-item-groups-inline">
                        <Icon className="dynamic-delete-button" type="minus-circle" onClick={() => removeItem(index, 'profile')} />
                        <span>{groupprofile ? groupprofile.name : profile}</span>
                      </div>
                    </Form.Item>
                    {loading ? <div className="device-form-inside-list-loading">Loading...</div> : ''}
                  </div>
                  :
                  <div
                    className="device-form-inside-dnd-container"
                    draggable
                    onDrop={e => {
                      const dragIndex = parseInt(e.dataTransfer.getData('drag_index'), 10)
                      const dragName = e.dataTransfer.getData('drag_name')
                      if (dragName && dragName.endsWith('/') && groupIds[dragIndex]) {
                        update(index, 'profile', groupIds[dragIndex])
                      }
                    }}
                    onDragOver={e => {
                      e.stopPropagation()
                      e.preventDefault()
                    }}
                  >
                    Drag & Drop a Document
                </div>
                }
              </div>
              <div className="device-form-inside">
                <p className="device-form-inside-title">
                  Account:
                </p>
                {item && (item.account != undefined && item.account != '') ?
                  <div className="device-form-inside-list">
                    <Form.Item className="form-item-groups" key={index}>
                      <div className="form-item-groups-inline">
                        <Icon className="dynamic-delete-button" type="minus-circle" onClick={() => removeItem(index, 'account')} />
                        <span>{groupaccount ? groupaccount.name : account}</span>
                      </div>
                    </Form.Item>
                    {loading ? <div className="device-form-inside-list-loading">Loading...</div> : ''}
                  </div>
                  :
                  <div
                    className="device-form-inside-dnd-container"
                    draggable
                    onDrop={e => {
                      const dragIndex = parseInt(e.dataTransfer.getData('drag_index'), 10)
                      const dragName = e.dataTransfer.getData('drag_name')
                      if (dragName && dragName.endsWith('/') && groupIds[dragIndex]) {
                        update(index, 'account', groupIds[dragIndex])
                      }
                    }}
                    onDragOver={e => {
                      e.stopPropagation()
                      e.preventDefault()
                    }}
                  >
                    Drag & Drop a Document
                </div>
                }
              </div>
            </div>
          </div>
        )
      })}
      <div style={{ marginTop: '30px' }}>
        <Row gutter={16} style={{ display: 'flex', justifyContent: 'center' }}>
          <Col span={12}>
            <Button type="dashed" onClick={add} style={{ width: '100%' }}>
              <Icon type="plus" /> Add another
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default DeviceForm
