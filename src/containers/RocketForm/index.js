import React, { useState } from 'react'
import { Form, Select } from 'antd'
import SingleLayerForm from 'containers/SingleLayerForm'
import './index.scss'

const RocketForm = ({ groupName, data, form, field, header }) => {
  const [layer, setLayer] = useState(0)

  console.log(groupName)

  return (
    <div className="oe-rocket-form">
      <Form.Item label="Layer" className="primary-label">
        <Select
          value={layer}
          onChange={setLayer}
          style={{
            width: '100%',
            display: 'inline-block',
            lineHeight: '40px',
            marginBottom: '0px',

          }}
        >
          {[...Array(10).keys()].map(number => (
            <Select.Option value={number} key={number}>
              Layer
              {number + 1}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      {[...Array(10).keys()].map(number => (
        <SingleLayerForm
          data={data ? data[number] : null}
          form={form}
          field={`${field}[${number}]`}
          header={header}
          show={layer === number}
          key={number}
        />
      ))}
    </div>
  )
}

export default RocketForm
