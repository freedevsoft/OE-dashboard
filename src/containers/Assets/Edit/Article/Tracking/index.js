import React, { useState } from 'react'
import { Form, Select } from 'antd'
import ArticlesTrackingChart from './chart'

const { Option } = Select

const Tracking = ({
  article,
}) => {
  // const [date, setDate] = useState(moment())
  const [action, setAction] = useState(null)

  function onActionChange(value) {
    setAction(value)
  }

  return (
    <>
      {/* <Form.Item label="Select Date:">
        <DatePicker onChange={onDateChange} value={date} />
      </Form.Item> */}
      <Form.Item label="Select Action:">
        <Select defaultValue={null} style={{ width: 270 }} onChange={onActionChange} value={action}>
          <Option value={null}>All</Option>
          <Option value="Viewed">Viewed</Option>
          <Option value="Heart">Heart (Liked, Disliked, Neutral)</Option>
          <Option value="WebLinks">WebLinks</Option>
          {/* <Option value="Article Active">Article Active</Option> */}
          {/* <Option value="Article Inactive">Article Inactive</Option> */}
        </Select>
      </Form.Item>
      <ArticlesTrackingChart articles={[article]} selectedAction={action} />
    </>
  )
}

export default Tracking
