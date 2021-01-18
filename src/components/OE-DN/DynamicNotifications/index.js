/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { createRef, useRef, useState } from 'react'
import { OverlayTrigger, Overlay, Popover } from 'react-bootstrap'
import _ from 'lodash'
import InputSearchBar from 'components/InputSearchBar'
import Down from 'assets/images/down.png'
import Stacked from 'assets/images/stacked.png'
import Featured from 'assets/images/featured.png'

import MediaViewGroupContainer from './MediaViewGroup/Container'
import MediaViewGroupContentTopBar from './MediaViewGroup/Content/Top/Bar'
import MediaViewGroupContentNormalBar from './MediaViewGroup/Content/Normal/Bar'

import GroupLayoutC from './GroupLayoutC'
import './index.scss'

const DynamicNotifications = ({ groups, myGeo, clientInfo }) => {
  const refs = useRef([])
  const [mode, setMode] = useState(2)
  const [current, setCurrent] = useState(0)

  if (refs.current.length !== groups.length) {
    refs.current = Array(groups.length)
      .fill()
      .map((_, i) => refs.current[i] || createRef())
  }

  const renderTooltip = ({ show }, name, ref) => (
    <Overlay show={show} target={ref} placement="top" container={ref.current}>
      <Popover placement="top">
        <Popover.Content>
          <div dangerouslySetInnerHTML={{ __html: name }} />
        </Popover.Content>
      </Popover>
    </Overlay>
  )

  const currentDoc = groups[current]
  const articles = []

  if (currentDoc && currentDoc.contentIds) {
    currentDoc.contentIds.forEach(id => {
      const contentIndex = currentDoc.content.findIndex(article => article._id === id)
      if (contentIndex >= 0) articles.push(currentDoc.content[contentIndex])
    })
  }

  const clientName = _.get(clientInfo, 'data.displayName')
  const logoSrc = _.get(clientInfo.data, 'logo')

  let iconBack
  let groupComponent

  switch (mode) {
    case 0:
      iconBack = Down
      groupComponent = (
        <div>
          {groups && groups.length > 1 && (
            <div className="oe-dynamic-notifications-body-bar">
              {groups.map((group, index) => {
                const tooltipText = _.get(group, 'data.tooltip.text') || ''
                let renderItem
                if (tooltipText === '') {
                  renderItem = (
                    <div
                      key={index}
                      ref={refs.current[index]}
                      className="oe-dynamic-notifications-body-bar-item"
                      style={{ backgroundColor: _.get(group, 'style.title.bg_color') || 'gray', borderRadius: _.get(group, 'style.outline.radius') }}
                      onClick={() => setCurrent(index)}
                    />
                  )
                } else {
                  renderItem = (
                    <OverlayTrigger placement="top" delay={{ show: 250, hide: 250 }} overlay={props => renderTooltip(props, tooltipText || '', refs.current[index])} key={group._id}>
                      <div
                        id={index}
                        ref={refs.current[index]}
                        className="oe-dynamic-notifications-body-bar-item"
                        style={{ backgroundColor: _.get(group, 'style.title.bg_color') || 'gray', borderRadius: _.get(group, 'style.outline.radius') }}
                        onClick={() => setCurrent(index)}
                      />
                    </OverlayTrigger>
                  )
                }

                return renderItem
              })}
            </div>
          )}
          {currentDoc && <GroupLayoutC group={currentDoc} myGeo={myGeo} />}
        </div>
      )
      break
    case 1:
      iconBack = Stacked
      groupComponent = (
        <div>
          {groups &&
            groups.length > 0 &&
            groups.map((group, index) => (
              <div key={index} className="oe-dynamic-notifications-body-group">
                <GroupLayoutC group={group} myGeo={myGeo} key={index} />
              </div>
            ))}
        </div>
      )
      break
    case 2:
      iconBack = Featured
      if (groups && groups.length) {
        groupComponent = (
          <div>
            {groups.map((group, index) => {
              const params = { group, myGeo }

              if (index === 0) {
                return (
                  <>
                    <MediaViewGroupContainer key={group._id} group={group}>
                      <MediaViewGroupContentTopBar {...params} />
                    </MediaViewGroupContainer>
                    <InputSearchBar />
                  </>
                )
              }

              return (
                <MediaViewGroupContainer key={group._id} group={group}>
                  <MediaViewGroupContentNormalBar {...params} />
                </MediaViewGroupContainer>
              )
            })}
          </div>
        )
      }

      break
    default:
      break
  }

  return (
    <div className="oe-dynamic-notifications" style={{ maxWidth: mode === 2 ? '1200px' : '900px' }}>
      <div className="oe-dynamic-notifications-header">
        <div className="oe-dynamic-notifications-header-info">
          {logoSrc && <div className="oe-dynamic-notifications-header-info-logo-wrapper">{logoSrc && <img src={logoSrc} alt="" />}</div>}
          {clientName && <div className="oe-dynamic-notifications-header-info-client">{clientName}</div>}
        </div>
        <div className="oe-dynamic-notifications-header-icon">
          <div onClick={() => setMode((mode + 1) % 3)}>
            <img src={iconBack} alt="" />
          </div>
        </div>
      </div>
      <div className="oe-dynamic-notifications-body">{groupComponent}</div>
    </div>
  )
}

export default DynamicNotifications
