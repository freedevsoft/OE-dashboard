import React from 'react'
import { graphql, withApollo } from 'react-apollo'
import * as compose from 'lodash.flowright'
import { Menu, Icon, Dropdown } from 'antd'
import * as queries from 'utils/queries'

const DocumentTypesMenuV2 = ({ dataQuery: { loading, data, error }, onChange, children, ...rest }) => {
  if (loading) {
    const menu = (
      <Menu>
        <Menu.Item>
          <Icon type="loading" /> Loading...
        </Menu.Item>
      </Menu>
    )

    return (
      <Dropdown overlay={menu} placement="bottomRight">
        {children}
      </Dropdown>
    )
  }
  if (error || !data) {
    const menu = (
      <Menu>
        <Menu.Item>Something went wrong</Menu.Item>
      </Menu>
    )

    return (
      <Dropdown overlay={menu} placement="bottomRight">
        {children}
      </Dropdown>
    )
  }

  const menu = (
    <Menu>
      <Menu.Item key={null}>
        <a target="_blank" rel="noopener noreferrer" onClick={() => onChange('All', null)}>
          All
        </a>
      </Menu.Item>
      {data.map(item => (
        <Menu.Item key={item._id}>
          <a target="_blank" rel="noopener noreferrer" onClick={() => onChange(item.name, item._id)}>
            {item.name}
          </a>
        </Menu.Item>
      ))}
    </Menu>
  )

  return (
    <Dropdown overlay={menu} placement="bottomRight">
      {children}
    </Dropdown>
  )
}

export default compose(
  graphql(queries.dataQuery, {
    name: 'dataQuery',
    options: props => ({
      variables: {
        collectionName: props.collectionName,
        types: props.type ? [props.type] : null,
      },
    }),
  }),
  withApollo,
)(DocumentTypesMenuV2)
