import React, { Component } from 'react'
import { Result } from 'antd'
import { Auth } from 'aws-amplify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import DocumentTypesSelectV2 from '../Selects/DocumentTypesSelectV2'

import './index.scss'

function IsJsonString(str) {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }

  return true
}

class OeProduct extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      customer: { _id: null },
      client: { _id: null },
      platform: { _id: null },
      campaign: { _id: null },
      minimize: false,
    }
  }

  componentWillMount() {
    const loadStorageValue = field => {
      const storedCustomer = localStorage.getItem(`oe-product-header-announcer-${field}`)
      if (IsJsonString(storedCustomer)) this.setState({ [field]: JSON.parse(storedCustomer) })
    }

    loadStorageValue('customer')
    loadStorageValue('client')
    loadStorageValue('platform')
    loadStorageValue('campaign')
  }

  componentDidMount() {
    Auth.currentAuthenticatedUser({
      bypassCache: false, // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    })
      .then(user => this.setState({ user }))
      .catch(err => console.log(err))
  }

  onHeaderChange = (doc, field) => {
    localStorage.setItem(`oe-product-header-announcer-${field}`, JSON.stringify(doc))
    this.setState({ [field]: doc })
  }

  toggleHeader = e => {
    e.preventDefault()
    const { minimize } = this.state
    this.setState({ minimize: !minimize })
  }

  render() {
    const { customer, client, platform, campaign, minimize, user } = this.state
    const { children, ...rest } = this.props

    if (!user) {
      return <Result status="403" title="Oops! You can not access to this page!" style={{ height: '100%' }} />
    }

    const headerParams = {
      customer,
      client,
      platform,
      campaign,
      onHeaderChange: this.onHeaderChange,
    }

    return (
      <div className="oe-product">
        <div className={`oe-product-header oe-product-header-${minimize ? 'minimize' : 'maximize'} oe-product-header-announcer`}>
          <FontAwesomeIcon className="oe-product-header-toggle" icon={minimize ? faChevronDown : faChevronUp} size="sm" onClick={this.toggleHeader} />
          {minimize === false && (
            <>
              <span>Customer:</span>
              <DocumentTypesSelectV2
                collectionName="ConfigurationsData"
                type="customer-id"
                placeholder="Customer"
                value={customer}
                optionAll="All"
                onChange={doc => this.onHeaderChange(doc, 'customer')}
                style={{ width: '200px', marginLeft: '1rem' }}
              />
              <span>Client:</span>
              <DocumentTypesSelectV2
                collectionName="ClientsData"
                type={null}
                placeholder="Client"
                value={client}
                optionAll="All"
                onChange={doc => this.onHeaderChange(doc, 'client')}
                style={{ width: '200px', marginLeft: '1rem' }}
              />
              {/* <span>Platform:</span>
              <DocumentTypesSelectV2
                collectionName="PlatformList"
                placeholder="Platform"
                value={platform}
                optionAll="All"
                onChange={doc => this.onHeaderChange(doc, 'platform')}
                style={{ width: '200px', marginLeft: '1rem' }}
              /> */}
              {/* <span>Application:</span>
              <DocumentTypesSelectV2
                collectionName="ConfigurationsData"
                type="app-name"
                placeholder="Campaign"
                value={campaign}
                optionAll="All"
                onChange={doc => this.onHeaderChange(doc, 'campaign')}
                style={{ width: '200px', marginLeft: '1rem' }}
              /> */}
            </>
          )}
        </div>
        <div className="oe-product-body">
          {React.Children.map(children, child => {
            console.log(child)
            if (child) {
              return React.cloneElement(child, {
                ...rest,
                header: headerParams,
              })
            }

            return ''
          })}
        </div>
      </div>
    )
  }
}
export default OeProduct
