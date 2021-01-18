import React, { useState } from 'react'
import { Select, Table, Form } from 'antd'
import _ from 'lodash'
import { inlineStyle } from 'utils/index'
import ArticlesTrackingChartWrapper from './group-wrapper'
import ArticlesTrackingChart from './chart'

import './index.scss'

const { Option } = Select

const columns = [
  {
    title: 'Number',
    key: 'phoneNumber',
  },
]

const TrackForm = ({ group }) => {
  const [menu, setMenu] = useState('sms')
  const [action, setAction] = useState(null)

  return (
    <div className="oe-track-form">
      <Select value={menu} onChange={setMenu}>
        <Select.Option value="sms">SMS Subscribers</Select.Option>
        <Select.Option value="track">Tracking</Select.Option>
      </Select>
      {menu === 'sms' && (
        <>
          <Table columns={columns} dataSource={group?.phoneNumbers} title={() => `Number of Subscribers: ${group?.phoneNumbers?.length || 0}`} showHeader={false} pagination={false} />
        </>
      )}
      {menu === 'track' && (
        <>
          <Form.Item label="Select Action:" {...inlineStyle}>
            <Select defaultValue={null} style={{ width: 170 }} onChange={setAction} value={action}>
              <Option value={null}>All</Option>
              <Option value="Article Active">Active</Option>
              <Option value="Article Inactive">Inactive</Option>
              <Option value="Viewed">Viewed</Option>
            </Select>
          </Form.Item>
          <ArticlesTrackingChartWrapper _id={group._id}>
            <ArticlesTrackingChart selectedAction={action} />
          </ArticlesTrackingChartWrapper>
        </>
      )}
    </div>
  )
}

export default TrackForm
