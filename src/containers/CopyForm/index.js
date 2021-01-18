import React from 'react'
import { Form, Checkbox, Spin, Result } from 'antd'
import { getDepthValue } from 'utils'
import * as queries from 'utils/queries'
import { useQuery } from '@apollo/react-hooks'
import './index.scss'

const CheckboxGroup = Checkbox.Group

const CopyForm = ({
  form: { getFieldDecorator },
  field,
  clientId,
  initialValue = {
    servers: [],
  },
}) => {
  const { loading, error, data: serverData } = useQuery(queries.groupingQuery, {
    variables: {
      type: '/Servers/',
      clientId,
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

  if (error || !serverData || !serverData.grouping) {
    return <Result status="500" title="Something went wrong" />
  }

  const { grouping: servers } = serverData

  const register = key => {
    getFieldDecorator(`${field}.${key}`, { initialValue: initialValue[key] })
  }

  register('servers')

  return (
    <div className="oz-form-copy">
      {servers && servers.length ? (
        <Form.Item label="Servers" className="primary-label">
          {getFieldDecorator(`${field}.servers`)(<CheckboxGroup options={servers.map(server => ({ label: server.name, value: server.name }))} />)}
        </Form.Item>
      ) : (
        ''
      )}
    </div>
  )
}

export default CopyForm
