import React from 'react'
import { graphql, withApollo } from 'react-apollo'
import * as compose from 'lodash.flowright'
import { Select } from 'antd'
import * as queries from 'utils/queries'

class AvatarsSelect extends React.Component {
  render() {
    const {
      dataQuery: { loading, data, error },
      ...rest
    } = this.props

    if (loading) {
      return (
        <Select
          placeholder="Please select an avatar"
          // style={{ width: '300px' }}
          loading
          {...rest}
        />
      )
    }
    if (error || !data) {
      return (
        <Select
          placeholder="Please select an avatar"
          // style={{ width: '300px' }}
          loading
          {...rest}
        />
      )
    }

    return (
      <Select
        placeholder="Please select an avatar"
        showSearch
        // style={{ width: '300px' }}
        optionFilterProp="children"
        {...rest}
      >
        <Select.Option value={null} label="No Avatar" key={-1}>
          No Avatar
        </Select.Option>
        {data.map((avatar, index) => (
          <Select.Option value={avatar.data.url} label={avatar.name} key={index}>
            <span role="img" aria-label={avatar.name}>
              <img style={{ width: '30px' }} src={avatar.data.url} />{' '}
            </span>
            {avatar.name}
          </Select.Option>
        ))}
      </Select>
    )
  }
}

export default compose(
  graphql(queries.dataQuery, {
    name: 'dataQuery',
    options: props => ({
      variables: {
        collectionName: 'ImagesData',
        types: ['Avatar'],
      },
    }),
  }),
  withApollo,
)(AvatarsSelect)
