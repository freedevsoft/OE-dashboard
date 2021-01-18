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

const WidgetForm = ({
  data,
  form: { getFieldDecorator, getFieldValue, setFieldsValue },
  field,
  initialValue = {
    list: [],
  },
  groupTypes,
}) => {
  const register = key => {
    getFieldDecorator(`${field}.${key}`, { initialValue: getDepthValue(data, key, initialValue[key]) })
  }

  register('list')

  const list = getFieldValue(`${field}.list`)

  const update = (index, internal, value) => {
    setFieldsValue({ [`${field}.list`]: [...list.slice(0, index), { ...list[index], [internal]: value }, ...list.slice(index + 1)] })
  }

  const remove = index => {
    setFieldsValue({ [`${field}.list`]: [...list.slice(0, index), ...list.slice(index + 1)] })
  }

  const add = () => {
    setFieldsValue({ [`${field}.list`]: [...list, { name: '', type: '' }] })
  }

  return (
    <>
      {list?.map((item, index) => (
        <Form.Item className="form-item-oz-links" key={index}>
          <div className="form-item-oz-links-inline">
            <Icon className="dynamic-delete-button" type="minus-circle" onClick={() => remove(index)} />
            <Select
              style={{ width: '18%' }}
              onChange={value => update(index, 'type', value)}
              value={item.type}
              placeholder="Group Type"
            >
              {groupTypes?.map(groupType => (
                <Option key={groupType} value={groupType}>
                  {groupType}
                </Option>
              ))}
            </Select>
            <Input
              value={item.classname}
              placeholder="Enter Class Name"
              onChange={e => update(index, 'classname', e.target.value)}
              style={{ width: '18%', marginBottom: '6px' }}
            />
            <TypesSelect
              collectionName="ImagesData"
              value={item.url}
              onChange={value => update(index, 'url', value)}
              type="Icon"
              placeholder="Select an Icon"
              style={{ width: '18%' }}
            />
            <Input
              value={item.displayname}
              placeholder="Display Name"
              onChange={e => update(index, 'displayname', e.target.value)}
              style={{ width: '18%', marginBottom: '6px' }}
            />
            <Select
              mode="tags"
              placeholder="Add an action"
              style={{ width: '18%' }}
              defaultValue={item.action}
              onChange={value => update(index, 'action', value)}
            >
              {/* <Option key="Default">Default</Option> */}
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
)(WidgetForm)
