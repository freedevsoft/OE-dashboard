import React from 'react'
import { graphql, withApollo } from 'react-apollo'
import * as compose from 'lodash.flowright'
import { Menu, Icon, Dropdown, Button } from 'antd'
import * as queries from 'utils/queries'

const DocumentTypesMenu = ({ dataQuery: { loading, data, error }, style, onChange, placeholder, label, iconType, ...rest }) => {
  if (loading) {
    const menu = (
      <Menu>
        <Menu.Item>
          <Icon type="loading" /> Loading...
        </Menu.Item>
      </Menu>
    )

    return (
      <Dropdown overlay={menu} placement="bottomCenter">
        <Button style={style}>
          {iconType && <Icon type={iconType} />}
          {label}
        </Button>
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
      <Dropdown overlay={menu} placement="bottomCenter">
        <Button style={style}>
          {iconType && <Icon type={iconType} />}
          {label}
        </Button>
      </Dropdown>
    )
  }

  function handleChange(item) {
    onChange(item.style)
  }

  const menu = (
    <Menu>
      {data.map(item => (
        <Menu.Item key={item._id}>
          <a target="_blank" rel="noopener noreferrer" onClick={() => handleChange(item)}>
            {item.name}
          </a>
        </Menu.Item>
      ))}
    </Menu>
  )

  return (
    <Dropdown overlay={menu} placement="bottomCenter">
      <Button style={style}>
        {iconType && <Icon type={iconType} />}
        {label}
      </Button>
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
)(DocumentTypesMenu)
