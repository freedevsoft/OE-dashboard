import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Result } from 'antd'
import PropTypes from 'prop-types'
import { cViewType, DB_LAYOUTCONFIG_TYPES } from 'utils/constants'
import { layoutQuery, layoutConfigCollectionName } from 'utils/queries'
import { graphql } from 'react-apollo'
import ReactLoading from 'react-loading'
import OeGridLayout from 'containers/OeGridLayout'

class MainPage extends Component {
  componentDidMount() {}

  render() {
    const {
      user,
      layoutQuery: { loading, error, layoutConfig },
      bSideMenu,
      setSideMenu,
      onTabMount,
      onSelectMenuFunc,
      selectedMenuIndex,
      body_config_id,
    } = this.props

    const {
      attributes: { email },
    } = user

    let curPageConfig

    if (!loading) {
      if (!layoutConfig) {
        return <Result status="404" title="Oops! Something went wrong!" style={{ height: '100%' }} />
      }

      layoutConfig.forEach(element => {
        switch (element.type) {
          default:
            curPageConfig = element.layout
            break
        }
      })

      return (
        <OeGridLayout
          data={curPageConfig}
          setSideMenu={setSideMenu}
          bSideMenu={bSideMenu}
          onTabMount={onTabMount}
          onSelectMenuFunc={onSelectMenuFunc}
          selectedMenuIndex={selectedMenuIndex}
          user={user}
        />
      )
    }

    return (
      <div style={{ flexGrow: '1' }}>
        <div
          style={{
            position: 'absolute',
            top: 'calc(50% - 25px)',
            left: '50%',
          }}
        >
          <ReactLoading type="cylon" color="lightgray" height={100} width={50} />
        </div>
      </div>
    )
  }
}

MainPage.propTypes = {
  viewType: PropTypes.string.isRequired,
  error_page: PropTypes.bool,
  body_config_id: PropTypes.string,
}

MainPage.defaultProps = {}

export default withRouter(
  graphql(layoutQuery, {
    name: 'layoutQuery',
    options: props => {
      const { viewType, body_config_id } = props
      const vTypes = []
      const vIds = []

      switch (viewType) {
        case cViewType.HOME_VIEW:
          vTypes.push(DB_LAYOUTCONFIG_TYPES.index)
          break
        case cViewType.PAGE_VIEW:
          vIds.push(body_config_id)
          break
        default:
          break
      }

      return {
        variables: {
          layoutConfigCollectionName,
          types: vTypes,
          ids: vIds,
        },
      }
    },
  })(MainPage),
)
