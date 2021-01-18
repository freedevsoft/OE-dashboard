import React from 'react'
import { graphql, withApollo } from 'react-apollo'
import * as compose from 'lodash.flowright'
import { Select } from 'antd'
import * as queries from 'utils/queries'
import _ from 'lodash'

class TypesSelect extends React.Component {
  componentDidMount() { }

  render() {
    const {
      dataQuery: { loading, data, error },
      thumbnail,
      placeholder = 'Please select an Option',
      ...rest
    } = this.props
    if (loading) {
      return <Select placeholder={placeholder} loading {...rest} />
    }
    if (error || !data) {
      return <Select placeholder={placeholder} loading {...rest} />
    }

    return (
      <Select placeholder={placeholder} showSearch optionFilterProp="children" {...rest}>
        <Select.Option value={null} label="None" key={-1}>
          None
        </Select.Option>
        {data.map((logo, index) => (
          <Select.Option value={_.get(logo, 'data.url')} label={_.get(logo, 'name')} key={index}>
            {thumbnail !== false && (
              <div style={{ width: '50px', height: '30px', display: 'flex' }}>
                <img
                  style={{
                    width: 'auto',
                    maxWidth: '100%',
                    height: '100%',
                  }}
                  src={_.get(logo, 'data.url')}
                  alt="type"
                />
              </div>
            )}
            {/* {logo.name} */}
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
        collectionName: props.collectionName,
        types: [props.type],
      },
    }),
  }),
  withApollo,
)(TypesSelect)
