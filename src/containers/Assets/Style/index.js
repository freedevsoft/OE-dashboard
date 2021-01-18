import React from 'react'
import PropTypes from 'prop-types'
import { graphql, withApollo } from 'react-apollo'
import * as compose from 'lodash.flowright'
import * as queries from 'utils/queries'
import * as mutations from 'utils/mutations'
import AlertGridStyleForm from './Form'

class StylePanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedIndex: 0,
    }
  }

  onSaveFunc = (e, form) => {
    e.preventDefault()
    form.validateFieldsAndScroll((err, values) => {
      console.log('has Error', err)
      if (!err) {
        console.log(values)

        const {
          dataQuery: { loading, data, error },
        } = this.props

        if (!loading && !error && data && data[0]) {
          const options = {
            ...data[0],
            collectionName: 'AppConfig',
            data: {
              ...data[0].data,
              style: {
                ...values.data,
              },
            },
          }

          console.log('before dataMutation: ', options)

          this.props
            .dataMutation({
              variables: options,
            })
            .then(res => {
              // console.log(res)
              this.props.showConfirmModal({
                title: 'Confirm',
                subtitle: 'Successfully Saved',
              })
            })
            .catch(err => {
              console.log(err)
            })
        }
      }
    })
  }

  render() {
    const { style, changeMode, showConfirmModal } = this.props

    const {
      dataQuery: { loading, data, error },
    } = this.props

    if (loading) return <AlertGridStyleForm style={style} loading changeMode={changeMode} />

    if (error) return <AlertGridStyleForm style={style} changeMode={changeMode} data={null} />

    if (!data || !data[0] || !data[0].data) return <AlertGridStyleForm style={style} changeMode={changeMode} data={{}} onSaveFunc={this.onSaveFunc} />

    return <AlertGridStyleForm style={style} changeMode={changeMode} data={data[0].data.style} onSaveFunc={this.onSaveFunc} />
  }
}

StylePanel.propTypes = {
  style: PropTypes.object,
}

StylePanel.defaultProps = {
  style: {
    width: 520,
    minWidth: 520,
    bgcolor: 'white',
    fgcolor: 'black',
    bgcolor_selected: 'white',
    fgcolor_selected: 'black',
  },
}
export default compose(
  graphql(queries.dataQuery, {
    name: 'dataQuery',
    options: props => ({
      variables: {
        collectionName: 'AppConfig',
        names: [props.configName],
      },
    }),
  }),
  graphql(mutations.dataMutation, { name: 'dataMutation' }),
  withApollo,
)(StylePanel)
