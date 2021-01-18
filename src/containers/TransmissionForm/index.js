import React, { useState, useEffect } from 'react'
import { InputNumber, Input, Radio, Upload, Select, Progress, Checkbox } from 'antd'
import _ from 'lodash'
import { uploadFileToS3 } from 'utils/index'
import './index.scss'
import { Spin } from '../../../node_modules/antd/lib/index'

const { Dragger } = Upload

const TransmissionForm = ({
  data,
  form: { getFieldDecorator, getFieldValue, setFieldsValue },
  field,
  initialValue = {
    protocol: '',
    destination: {
      type: 'IP',
      value: '',
    },
    datarate: 0,
    blocks: 0,
    status: '',
    package_info: null,
    transmitted: 0,
    total: 0,
    url: null,
  },
}) => {
  const [unit, setUnit] = useState({
    datarate: 1,
    blocks: 1,
    transmitted: 1,
    total: 1,
  })
  const [isUploading, setIsUploading] = useState(false)
  const [checked, setChecked] = useState('false')
  const protocolItems = ['FTP', 'NRT', 'FLUTE', 'HTTP', 'WebDAV', 'Synhronized S3']
  const initial = key => _.get(data, key) || _.get(initialValue, key)
  const register = key => {
    getFieldDecorator(`${field}.${key}`, { initialValue: initial(key) })
  }

  register('protocol')
  register('destination.type')
  register('destination.value')
  register('datarate')
  register('blocks')
  register('status')
  register('transmitted')
  register('package_info')
  register('total')
  register('url')

  const onDagger = info => {
    const { status, type: filetype } = info.file

    if (status !== 'uploading') {
      setFieldsValue({ [`${field}.total`]: info.file.size / 1000, [`${field}.status`]: 'Upload in progress' })
      setIsUploading(true)
      uploadFileToS3(info.file)
        .then(url => {
          setFieldsValue({ [`${field}.status`]: 'Complete', [`${field}.url`]: url })
        })
        .catch(err => {
          setFieldsValue({ [`${field}.status`]: 'Error' })
        })
        .finally(() => {
          setIsUploading(false)
        })
    }
  }

  const daggerProps = {
    name: 'file',
    multiple: false,
    onChange: onDagger,
    showUploadList: false,
  }

  const changeRate = (value, key) => {
    setUnit({
      ...unit,
      [key]: value,
    })
  }

  const changeValue = (value, key) => {
    if (key == 'package_info') {
      setFieldsValue({ [`${field}.${key}`]: value })
    } else {
      setFieldsValue({ [`${field}.${key}`]: value * unit[key] })
    }
  }

  const getValue = key => {
    if (key == 'package_info') {
      return getFieldValue(`${field}.${key}`)
    } else {
      return getFieldValue(`${field}.${key}`) / unit[key]
    }
  }

  useEffect(() => {
    setChecked(getValue('package_info'))
  }, [])

  const renderUnit = key => (
    <Select style={{ width: key === 'datarate' ? 80 : 70 }} value={unit[key]} onChange={value => changeRate(value, key)}>
      <Select.Option value={1}>{key === 'datarate' ? 'KBps' : 'KB'}</Select.Option>
      <Select.Option value={1000}>{key === 'datarate' ? 'MBps' : 'MB'}</Select.Option>
      <Select.Option value={1000000}>{key === 'datarate' ? 'GBps' : 'GB'}</Select.Option>
    </Select>
  )

  return (
    <div className="oe-transmission-form">
      <div className="oe-transmission-form-item">
        <span className="oe-transmission-form-item-title">Protocol:</span>
        {getFieldDecorator(`${field}.protocol`, {
          initialValue: initial('protocol'),
        })(
          <Radio.Group style={{ marginLeft: '10px' }}>
            {protocolItems.map(option => (
              <Radio value={option} key={option}>
                {option}
              </Radio>
            ))}
          </Radio.Group>,
        )}
      </div>
      <div className="oe-transmission-form-item">
        <span className="oe-transmission-form-item-title">Type:</span>
        {getFieldDecorator(`${field}.destination.type`, {
          initialValue: initial('destination.type'),
        })(
          <Select style={{ maxWidth: 'calc(100% - 250px)' }}>
            <Select.Option value="IP">IP Address</Select.Option>
            <Select.Option value="URL">URL</Select.Option>
            <Select.Option value="Hostname">Host Name</Select.Option>
          </Select>,
        )}
      </div>
      <div className="oe-transmission-form-item">
        <span className="oe-transmission-form-item-title">Destination:</span>
        {getFieldDecorator(`${field}.destination.value`, {
          initialValue: initial('destination.value'),
        })(<Input style={{ maxWidth: 'calc(100% - 250px)' }} />)}
      </div>
      <div className="oe-transmission-form-item">
        <span className="oe-transmission-form-item-title">Data Rate:</span>
        <InputNumber value={getValue('datarate')} onChange={value => changeValue(value, 'datarate')} />
        {renderUnit('datarate')}
      </div>
      <div className="oe-transmission-form-item">
        <span className="oe-transmission-form-item-title">Blocks:</span>
        <InputNumber value={getValue('blocks')} onChange={value => changeValue(value, 'blocks')} />
        {renderUnit('blocks')}
      </div>
      <div className="oe-transmission-form-item">
        <span className="oe-transmission-form-item-title">Package this information:</span>
        <Checkbox checked={checked == 'true' ? true : false} onChange={e => { e.target.checked ? changeValue('true', 'package_info') : changeValue('false', 'package_info'); console.log(e.target.checked); setChecked(e.target.checked ? 'true' : 'false') }}></Checkbox>
      </div>
      <div className="oe-transmission-form-item">
        <span className="oe-transmission-form-item-title">Upload</span>
        <div className="oe-transmission-form-item-upload">
          <Dragger {...daggerProps}>
            {isUploading ? <Spin tip="Uploading..." /> : getFieldValue(`${field}.url`) ? getFieldValue(`${field}.url`) : 'Drag and Drop a Package'}
          </Dragger>
        </div>
      </div>
      <div className="oe-transmission-form-item">
        <span className="oe-transmission-form-item-title">Status:</span>
        {getFieldDecorator(`${field}.status`, {
          initialValue: initial('status'),
        })(<Input style={{ maxWidth: 'calc(100% - 250px)' }} />)}
      </div>
      <div className="oe-transmission-form-item">
        <span className="oe-transmission-form-item-title">Transmitted:</span>
        <InputNumber value={getValue('transmitted')} onChange={value => changeValue(value, 'transmitted')} style={{ width: 300 }} />
        {renderUnit('transmitted')}
      </div>
      <div className="oe-transmission-form-item">
        <span className="oe-transmission-form-item-title">Total:</span>
        <InputNumber value={getValue('total')} onChange={value => changeValue(value, 'total')} style={{ width: 300 }} />
        {renderUnit('total')}
      </div>
      <div className="oe-transmission-form-progressbar">
        <Progress percent={getValue('total') == 0 ? 0 : (getValue('transmitted') / getValue('total') * 100).toFixed(2)} status="active" />
      </div>
    </div>
  )
}

export default TransmissionForm
