import React from 'react'
import { Form, Row, Col, Button, Icon, Input, Select } from 'antd'
import { graphql, withApollo } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import * as compose from 'lodash.flowright'
import * as queries from 'utils/queries'
import TypesSelect from 'containers/Selects/TypesSelect'
import { getDepthValue } from 'utils'
import './index.scss'

const { Option } = Select
const actionTypes = [
  'Like',
  'Track',
  'Set Reminder',
  'Follow',
  'Upload',
  'Bookmark',
  'Info',
  'Map',
  'Schedule',
  'Watch',
  'SMS',
  'Email',
  'Share',
  'Save',
  'Twitter',
  'Facebook',
  'Instagram',
  'More',
  'Details',
  'WebLinks',
  'ImageList',
]
const LinkActionForm = ({
  data,
  form: { getFieldDecorator, getFieldValue, setFieldsValue },
  field,
  initialValue = {
    links: [],
  },
}) => {
  const register = key => {
    getFieldDecorator(`${field}.${key}`, { initialValue: getDepthValue(data, key, initialValue[key]) })
  }

  register('links')

  const links = getFieldValue(`${field}.links`)

  const update = (index, internal, value) => {
    setFieldsValue({ [`${field}.links`]: [...links.slice(0, index), { ...links[index], [internal]: value }, ...links.slice(index + 1)] })
  }

  const remove = index => {
    setFieldsValue({ [`${field}.links`]: [...links.slice(0, index), ...links.slice(index + 1)] })
  }

  const add = () => {
    setFieldsValue({ [`${field}.links`]: [...links, { name: '', type: '' }] })
  }

  return (
    <>
      {links?.map((item, index) => (
        <Form.Item className="form-item-oz-links" key={index}>
          <div className="form-item-oz-links-inline">
            <Icon className="dynamic-delete-button" type="minus-circle" onClick={() => remove(index)} />
            <Input
              value={item.name}
              placeholder="Enter Name"
              onChange={e => update(index, 'name', e.target.value)}
              style={{ width: '22%', marginBottom: '6px' }}
            />
            <TypesSelect
              collectionName="ImagesData"
              value={item.url}
              onChange={value => update(index, 'url', value)}
              type="Icon"
              placeholder="Select an Icon"
              style={{ width: '22%' }}
            />
            <Input
              value={item.displaytext}
              placeholder="Enter Display Text"
              onChange={e => update(index, 'displaytext', e.target.value)}
              style={{ width: '22%', marginBottom: '6px' }}
            />
            <Select style={{ width: '22%' }} onChange={value => update(index, 'type', value)} value={item.type} placeholder="Type">
              {actionTypes?.map(actionType => (
                <Option key={actionType} value={actionType}>
                  {actionType}
                </Option>
              ))}
            </Select>
          </div>
        </Form.Item>
      ))}
      <Row gutter={16}>
        <Col span={8}>
          <Button type="dashed" onClick={add}>
            <Icon type="plus" />
            &nbsp; Add another
          </Button>
        </Col>
      </Row>
    </>
  )
}

export default compose(
  graphql(queries.groupingQuery, {
    name: 'groupingQuery',
    options: ({ header, groupType, filterGroupId }) => ({
      variables: {
        ids: filterGroupId ? [filterGroupId] : null,
        clientId: _.get(header, 'client._id'),
        type: groupType || 'none',
      },
      fetchPolicy: 'cache-and-network',
    }),
  }),
  withApollo,
  withRouter,
)(LinkActionForm)
