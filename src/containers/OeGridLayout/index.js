import React, { Component } from 'react'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { Row } from 'react-bootstrap'

import OEFooter from 'components/Footer'
import { cComponentType } from 'utils/constants'
import Announcer2 from '../Announcer_2'
import OeProduct from '../OeProduct'

import './index.scss'

export const AppIdContext = React.createContext(null)

const OeNodeRow = styled(Row)`
  && {
    margin: ${props => props.node_style.margin || '0px'};
    border: ${props => props.node_style.border || 'none'};
    padding: ${props => props.node_style.padding || '0px'};
    background: ${props => props.node_style.background || 'white'};
  }
`
const OeNodeCol = styled.div`
  && {
    width: 100%;
    margin: ${props => props.node_style.margin || '0px'};
    border: ${props => props.node_style.border || 'none'};
    padding: ${props => props.node_style.padding || '0px'};
    background: ${props => props.node_style.background || 'white'};
  }
`

const SharedComponents = {
  [cComponentType.TOOL_FOOTER]: OEFooter,
  [cComponentType.ANNOUNCER_2_TOOL]: Announcer2,
}

const oeProductTypes = [cComponentType.ANNOUNCER_2_TOOL]

class OeGridLayout extends Component {
  constructor(props) {
    super(props)

    this.renderComponent = this.renderComponent.bind(this)
    this.renderNode = this.renderNode.bind(this)
  }

  renderComponent(comp, compIndex) {
    const {
      urlData,
      history: { location },
    } = this.props
    const {
      bSideMenu,
      setSideMenu,
      currentSide,
      onTabMount,
      onSelectMenuFunc,
      selectedMenuIndex,
      user: {
        attributes: { email },
      },
    } = this.props

    // if (!["azita@openznet.com", "gasto@openznet.com"].includes(email)) {
    //   if ([cComponentType.ANNOUNCER_2_TOOL, cComponentType.TOOL_HEADER, cComponentType.TOOL_FOOTER].includes(comp.component_type)) {

    //   }
    // }

    const searchParams = new URLSearchParams(location.search)
    const productBody = React.createElement(SharedComponents[comp.component_type], {
      applicationId: searchParams.get('appId'),
      onChangeApp: this.onChangeApp,
      data: comp.data,
      urlData,
      currentSide,
      onTabMount,
      onSelectMenuFunc,
      selectedMenuIndex,
      bShowSideMenu: bSideMenu,
      toggleSideMenu: () => setSideMenu(!bSideMenu),
      hideSideMenu: () => setSideMenu(false),
    })

    if (typeof SharedComponents[comp.component_type] !== 'undefined') {
      if (oeProductTypes.includes(comp.component_type)) {
        return (
          <OeNodeCol key={compIndex} node_style={comp.style}>
            <OeProduct>{productBody}</OeProduct>
          </OeNodeCol>
        )
      }

      return (
        <OeNodeCol key={compIndex} node_style={comp.style}>
          {productBody}
        </OeNodeCol>
      )
    }

    return (
      <OeNodeCol key={compIndex} node_style={comp.style}>
        {/* <Builder data={comp.data} /> */}
      </OeNodeCol>
    )
  }

  renderNode(node, nodeIndex) {
    if (node.type === 'component') {
      return this.renderComponent(node, nodeIndex)
    }
    if (node.type === 'row') {
      return (
        <OeNodeRow key={nodeIndex} node_style={node.style}>
          {node.children.map((child, childIndex) => this.renderNode(child, childIndex))}
        </OeNodeRow>
      )
    }
    if (node.type === 'col') {
      return (
        <OeNodeCol className={`${node.ratio}`} key={nodeIndex} node_style={node.style}>
          {node.children.map((child, childIndex) => this.renderNode(child, childIndex))}
        </OeNodeCol>
      )
    }

    return ''
  }

  render() {
    const { data, type } = this.props

    if (type === 'footer' || type === 'header') {
      return <div style={{ width: '100%' }}>{this.renderNode(data, 0)}</div>
    }

    return <div className="oe-pageview-container">{this.renderNode(data, 0)}</div>
  }
}

export default compose(withRouter(OeGridLayout))
