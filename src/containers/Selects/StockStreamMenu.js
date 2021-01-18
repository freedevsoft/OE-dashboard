/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { graphql, withApollo } from 'react-apollo'
import * as compose from 'lodash.flowright'
import { Menu, Dropdown, Button, Icon as LegacyIcon } from 'antd'
import * as queries from 'utils/queries'
import _ from 'lodash'

const StockStreamMenu = ({ videoDataQuery: { loading, videoData: data, error }, style, onChange, placeholder, label, iconType, extract = 'style', ...rest }) => {
  if (loading) {
    const menu = (
      <Menu>
        <Menu.Item>
          <LegacyIcon type="loading" />
          Loading...
        </Menu.Item>
      </Menu>
    )

    return (
      <Dropdown overlay={menu} placement="bottomCenter">
        <Button style={style}>
          {iconType && <LegacyIcon type={iconType} />}
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
          {iconType && <LegacyIcon type={iconType} />}
          {label}
        </Button>
      </Dropdown>
    )
  }

  function handleChange(item) {
    onChange(_.get(item, extract))
  }

  const menu = (
    <Menu>
      {data.map(item => {
        const disabled = item.conversionState !== 'COMPLETE'

        return (
          <Menu.Item key={item._id} disabled={disabled}>
            <a
              style={{ color: disabled ? 'gray' : 'inherit' }}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (!disabled) handleChange(item)
              }}
            >
              {item.name}
              &nbsp;
              {disabled ? '(Conversion not completed)' : ''}
            </a>
          </Menu.Item>
        )
      })}
    </Menu>
  )

  return (
    <Dropdown overlay={menu} placement="bottomCenter">
      <Button style={style}>
        {iconType && <LegacyIcon type={iconType} />}
        {label}
      </Button>
    </Dropdown>
  )
}

export default compose(
  graphql(queries.videoDataQuery, {
    name: 'videoDataQuery',
    options: props => ({
      variables: {
        collectionName: props.collectionName,
        types: props.type ? [props.type] : null,
      },
    }),
  }),
  withApollo,
)(StockStreamMenu)
