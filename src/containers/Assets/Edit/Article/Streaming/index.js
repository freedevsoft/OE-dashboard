import React from 'react'
import { Form, Radio } from 'antd'
import { getDepthValue, inlineStyle } from 'utils'
import OZInput from 'components/FormItems/OZInput/index'
import './index.scss'

const Streaming = ({
  data, form: { getFieldDecorator, getFieldValue }, field,
  initialValue = {
    type: undefined,
    broadband_url: '',
    global_service_id: '',
    cache_url: '',
  },
}) => {
  const register = key => {
    getFieldDecorator(`${field}.${key}`, { initialValue: getDepthValue(data, key, initialValue[key]) })
  }

  const initial = key => getDepthValue(data, key, initialValue[key])

  register('type')
  register('broadband_url')
  register('global_service_id')
  register('cache_url')

  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '40px',
  }

  return (
    <div className="article-form-streaming">
      <Form.Item label="Background" required className="primary-label">
        {getFieldDecorator(`${field}.type`, { initialValue: initial('type') })(
          <Radio.Group style={{ paddingLeft: '30px' }}>
            <Radio style={radioStyle} value="broadband">
              Broadband
            </Radio>
            {getFieldValue(`${field}.type`) === 'broadband' && (
              <OZInput
                label="Broadband URL"
                field={`${field}.broadband_url`}
                initialValue={getDepthValue(data, 'broadband_url')}
                getFieldDecorator={getFieldDecorator}
                {...inlineStyle}
                style={{ width: '600px', marginBottom: '0', marginTop: '1rem' }}
                required={false}
              />
            )}
            <Radio style={radioStyle} value="broadcast">
              Broadcast
            </Radio>
            {getFieldValue(`${field}.type`) === 'broadcast' && (
              <OZInput
                label="Global Service ID"
                field={`${field}.global_service_id`}
                initialValue={getDepthValue(data, 'global_service_id')}
                getFieldDecorator={getFieldDecorator}
                {...inlineStyle}
                style={{ width: '600px', marginBottom: '0', marginTop: '1rem' }}
                required={false}
              />
            )}
            <Radio style={radioStyle} value="cache">
              Local Cache
            </Radio>
            {getFieldValue(`${field}.type`) === 'cache' && (
              <OZInput
                label="Local Cache"
                field={`${field}.cache_url`}
                initialValue={getDepthValue(data, 'cache_url')}
                getFieldDecorator={getFieldDecorator}
                {...inlineStyle}
                style={{ width: '600px', marginBottom: '0', marginTop: '1rem' }}
                required={false}
              />
            )}
          </Radio.Group>,
        )}
      </Form.Item>
    </div>
  )
}

export default Streaming
