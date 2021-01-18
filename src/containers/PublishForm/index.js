import React from 'react'
import { Form, Checkbox, Spin, Result } from 'antd'
import { getDepthValue } from 'utils'
import * as queries from 'utils/queries'
import { useQuery } from '@apollo/react-hooks'
import './index.scss'

const CheckboxGroup = Checkbox.Group

const PublishForm = ({
  data,
  form: { getFieldDecorator },
  field,
  initialValue = {
    devices: [],
    socialMedias: [],
    lists: [],
    servers: [],
  },
}) => {
  const { loading, error, data: platformData } = useQuery(queries.dataQuery, {
    variables: {
      collectionName: 'PlatformList',
    },
  })

  if (loading) {
    return (
      <div
        style={{
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Spin tip="Loading..." />
      </div>
    )
  }

  if (error || !platformData || !platformData.data) {
    return <Result status="500" title="Something went wrong" />
  }

  const { data: instances } = platformData

  const register = key => {
    getFieldDecorator(`${field}.${key}`, { initialValue: getDepthValue(data, key, initialValue[key]) })
  }

  register('devices')
  register('socialMedias')
  register('lists')
  register('servers')

  const extractOptions = type => instances.filter(instance => instance.type === type).map(instance => instance.name)

  const deviceOptions = extractOptions('device')
  const socialOptions = extractOptions('socialMedia')
  const listOptions = extractOptions('list')
  const serverOptions = extractOptions('server')

  return (
    <div className="oz-form-publish">
      {deviceOptions && deviceOptions.length ? (
        <Form.Item label="Devices" className="primary-label">
          {getFieldDecorator(`${field}.devices`)(<CheckboxGroup options={deviceOptions} />)}
        </Form.Item>
      ) : (
        ''
      )}
      {socialOptions && socialOptions.length ? (
        <Form.Item label="Social Media" className="primary-label">
          {getFieldDecorator(`${field}.socialMedias`)(<CheckboxGroup options={socialOptions} />)}
        </Form.Item>
      ) : (
        ''
      )}
      {listOptions && listOptions.length ? (
        <Form.Item label="Lists" className="primary-label">
          {getFieldDecorator(`${field}.lists`)(<CheckboxGroup options={listOptions} />)}
        </Form.Item>
      ) : (
        ''
      )}
      {serverOptions && serverOptions.length ? (
        <Form.Item label="Servers" className="primary-label">
          {getFieldDecorator(`${field}.servers`)(<CheckboxGroup options={serverOptions} />)}
        </Form.Item>
      ) : (
        ''
      )}
    </div>
  )
}

export default PublishForm
