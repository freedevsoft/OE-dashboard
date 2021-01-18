import React, { useState } from 'react'
import { Table, Radio, Divider, Checkbox } from 'antd';
import { getDepthValue, inlineStyle } from 'utils'
import moment from 'moment'
import './index.scss'
import { useEffect } from 'react';

const GroupTypeList = ({
  data,
  arrayField,
  keysField,
  form: { getFieldDecorator, getFieldValue, setFieldsValue },
  initialValue
}) => {
  const [source, setSource] = useState([]);
  const checkboxStyle = {
    marginLeft: '5px',
  }

  const columns = [
    {
      title: '',
      dataIndex: 'name',
      render: (text, index) =>
        getFieldDecorator(`${arrayField}[${index.key}].name`, {
          initialValue: getDepthValue(initialValue[index.key], 'name'),
        })(<a>{text}</a>),
    },
    {
      title: 'View',
      dataIndex: 'view',
      render: (checked, index) =>
        getFieldDecorator(`${arrayField}[${index.key}].view`, {
          initialValue: getDepthValue(initialValue[index.key], 'view'),
          valuePropName: 'checked',
        })(<Checkbox checked={index.view} style={checkboxStyle} />)
    },
    {
      title: 'Update',
      dataIndex: 'update',
      render: (checked, index) =>
        getFieldDecorator(`${arrayField}[${index.key}].update`, {
          initialValue: getDepthValue(initialValue[index.key], 'update'),
          valuePropName: 'checked',
        })(<Checkbox checked={index.update} style={checkboxStyle} />)
    },
    {
      title: 'Publish',
      dataIndex: 'publish',
      render: (checked, index) =>
        getFieldDecorator(`${arrayField}[${index.key}].publish`, {
          initialValue: getDepthValue(initialValue[index.key], 'publish'),
          valuePropName: 'checked',
        })(<Checkbox checked={index.publish} style={checkboxStyle} />)
    },
  ];

  useEffect(() => {
    const clonedata = [];
    data.map((item, index) => {
      clonedata.push({
        key: index,
        name: item

      })
    })
    setSource(clonedata);
  }, [])

  return (
    <div>

      <Table
        columns={columns}
        dataSource={source}
      />
    </div>
  )
}

export default GroupTypeList
