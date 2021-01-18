/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react'
import Slider from 'react-slick'
import { graphql, withApollo } from 'react-apollo'

import { Player } from 'video-react'
import _ from 'lodash'
import moment from 'moment'
import * as compose from 'lodash.flowright'
import { TwitterTimelineEmbed } from 'react-twitter-embed'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import NWSListener from 'components/NWS'
import * as mutations from 'utils/mutations'
import MapComponent from './MapComponent'

import './GroupLayoutC.scss'

const Modes = {
  NONE: 'none',
  LIVE: 'Live',
  IMAGE: 'Images',
  VIDEO: 'Videos',
  LOC: 'Location',
}

const settings = {
  dots: true,
  infinite: true,
  fade: true,
  speed: 1500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplaySpeed: 5000,
  autoplay: true,
}

const AdditionalIndex = {
  None: -1,
  Twitter: -2,
  NWS: -3,
}

const GroupLayoutC = ({ myGeo, group, refetch, upsertTracking }) => {
  const { articles } = group
  const [current, setCurrent] = useState(-1)
  const [mode, setMode] = useState(Modes.IMAGE)

  if (!group) return ''

  const { data, style } = group

  const titleFgColor = _.get(style, 'title.fg_color') || 'white'
  const titleBgColor = _.get(style, 'title.bg_color') || 'gray'
  const fgColor = _.get(style, 'fg_color') || 'white'
  const bgColor = _.get(style, 'bg_color') || 'gray'

  const outline = {
    backgroundColor: titleBgColor,
  }

  if (style?.b_outline === true) {
    outline.borderWidth = style?.outline?.width || 0
    outline.borderStyle = 'solid'
    outline.borderColor = style?.outline?.color || 'white'
    outline.borderRadius = style?.outline?.radius || 0
  }

  if (style?.b_shadow === true) {
    outline.boxShadow = `3px 3px 3px${style?.shadow?.color || 'gray'}`
  }

  const groupHeaderBarStyle = {
    color: titleFgColor,
  }

  const groupFooterBarStyle = {
    color: fgColor,
  }

  const groupBodyBarStyle = {
    color: fgColor,
    backgroundColor: bgColor,
  }

  const socialStyle = {
    backgroundColor: 'rgba(196, 196, 196, 0.5',
  }

  const groupTimeBarStyle = {
    color: titleFgColor,
    backgroundColor: 'rgba(196, 196, 196, 0.5)',
  }

  const articleSummaryBarStyle = {
    color: titleFgColor,
    backgroundColor: 'rgba(196, 196, 196, 0.7)',
  }

  if (current > -1) {
    articleSummaryBarStyle.marginBottom = '5px'
  }

  const dividerStyle = {
    backgroundColor: style?.b_divide_major === true ? style?.divider_major : 'inherit',
  }

  const groupShortDescrStyle = {
    marginRight: style?.b_divide_major === false ? '14px' : '0px',
  }

  const article = articles.length ? articles[current] : null

  const articleStyle = _.get(article, 'style') || null

  const articleTitleFgColor = _.get(articleStyle, 'title.fg_color') || 'white'
  const articleTitleBgColor = _.get(articleStyle, 'title.bg_color') || bgColor
  const articleFgColor = _.get(articleStyle, 'fg_color') || 'white'
  const articleBgColor = _.get(articleStyle, 'bg_color') || bgColor

  const articleHeaderBarStyle = {
    color: articleTitleFgColor,
  }

  const articleActionBarStyle = {
    color: articleFgColor,
  }

  const articleBodyStyle = {
    color: articleFgColor,
    backgroundColor: articleBgColor,
  }

  const articleDescDividerStyle = {
    background: `linear-gradient(to left, rgba(0, 0, 0, 0), ${articleStyle?.b_divide_minor === true ? articleStyle?.divider_minor : 'inherit'})`,
    height: articleStyle?.b_divide_minor === true ? '2px' : '0px',
  }

  const articleOutline = {
    backgroundColor: articleTitleBgColor,
    display: current !== -1 ? 'inherit' : 'none',
  }

  if (!article) {
    articleOutline.padding = '0px 30px'
  }

  if (articleStyle?.b_outline === true) {
    articleOutline.borderWidth = articleStyle?.outline?.width || 0
    articleOutline.borderStyle = 'solid'
    articleOutline.borderColor = articleStyle?.outline?.color || 'black'
    articleOutline.borderRadius = articleStyle?.outline?.radius || 0
  }

  if (articleStyle?.b_shadow === true) {
    articleOutline.boxShadow = `3px 3px 3px ${articleStyle?.shadow?.color || 'gray'}`
  }

  let content = null
  const htmlType = _.get(article, 'data.HTML.htmlType')
  if (htmlType === 'mixed' || htmlType === 'body') {
    content = _.get(article, 'data.HTML.body') || null
  }

  let contentRender = ''
  const imageList = _.get(article, 'imageList')
  const videoList = _.get(article, 'videoList')
  const location = _.get(article, 'location')
  const viewPort = _.get(location, 'viewport') || null
  const bImageList = imageList && imageList.length > 0
  const bVideoList = videoList && videoList.length > 0
  const bLocation = location && location.bActive && location.type && location.type !== 'none' && viewPort
  let mMode = mode

  const availableModes = []
  if (bImageList) availableModes.push(Modes.IMAGE)
  if (bVideoList) availableModes.push(Modes.VIDEO)
  if (bLocation) availableModes.push(Modes.LOC)

  if (availableModes.length) {
    if (mMode === Modes.IMAGE && !bImageList) [mMode] = availableModes
    if (mMode === Modes.VIDEO && !bVideoList) [mMode] = availableModes
    if (mMode === Modes.LOC && !bLocation) [mMode] = availableModes
  } else {
    mMode = Modes.NONE
  }

  const judgeMainBar = availableModes.length

  const groupImage = _.get(data, 'desc.image') || null
  const groupShortDescr = _.get(data, 'desc.shortDescr') || null
  const groupLongDescr = _.get(data, 'desc.longDescr') || null

  switch (mMode) {
    case Modes.IMAGE:
      contentRender = (
        <div className="oe-group-layout-C-group-body-article-body-main-bar-right-media-image">
          <Slider {...settings}>{bImageList && imageList.map((image, index) => <img alt="slide" src={image.url} key={index} />)}</Slider>
        </div>
      )
      break
    case Modes.VIDEO:
      contentRender = <div className="oe-group-layout-C-group-body-article-body-main-bar-right-media-video">{videoList && videoList.length > 0 && <Player src={videoList[0].url} playsInline />}</div>
      break
    case Modes.LOC:
      contentRender = (
        <div className="oe-group-layout-C-group-body-article-body-main-bar-right-media-location">
          {bLocation && myGeo && (
            <MapComponent
              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDQ6fOZioeYFWHF-Q02vErr8v7duPXywRA&v=3.exp&libraries=geometry,drawing,places"
              loadingElement={<div className="loadingelement" />}
              mapElement={<div className="mapelement" id="map" />}
              containerElement={<div className="containerelement" />}
              zoom={location.viewport.zoom}
              center={{
                lat: myGeo.coordinate.latitude,
                lng: myGeo.coordinate.longitude,
              }}
              type={location.type}
              color={location.color}
              onPointAdd={() => {}}
              useCase={location.useCase}
              coordinates={location.coordinates}
              zones={location.zones}
              unit={location.viewport.unit}
              showCenterMark
            />
          )}
        </div>
      )
      break
    case Modes.NONE:
      contentRender = ''
      break
    default:
      break
  }

  const updatedAt = _.get(group, 'updatedAt')

  const sourceName = _.get(group, 'data.source') || null
  const sourceLogo = _.get(group, 'data.sourceLogo') || null

  const webLinks = _.get(group, 'data.webLinks') || []
  const sharedLinks = _.get(group, 'data.sharedLinks') || []
  const feeds = _.get(group, 'data.feeds') || []

  const articleSourceName = _.get(article, 'source.name') || null
  const articleSourceLogo = _.get(article, 'source.url') || null

  const articleImage = _.get(article, 'data.desc.image') || null
  let articleShortDescr = _.get(article, 'data.desc.shortDescr') || null
  let articleLongDescr = _.get(article, 'data.desc.longDescr') || null

  const groupIcon = _.get(data, 'desc.icon') || null
  const groupTitle = _.get(data, 'desc.title') || null

  let socialArticleBody = ''
  if (current === AdditionalIndex.Twitter) {
    articleShortDescr = 'Twitter Feed'
    socialArticleBody = <TwitterTimelineEmbed sourceType="profile" screenName="azitaman" options={{ height: 500 }} />
  }
  if (current === AdditionalIndex.NWS) {
    articleShortDescr = 'NWS Feed'
    socialArticleBody = <NWSListener />
  }

  const handleSharedLink = sharedLink => {
    console.log('group', typeof upsertTracking)
    upsertTracking({
      variables: {
        _id: group._id,
        collectionName: 'Groups',
        action: 'Shared -' + sharedLink.name,
        comment: `SharedLink (${sharedLink.name}) is clicked`,
      },
    })
      .then(() => {})
      .catch(err => {
        console.log(err)
      })

    console.log('Sent Tracking: ' + 'Shared - ' + sharedLink.name)
  }

  const setArticleIndex = (articleID, articleTitle, current) => {
    setCurrent(current)
    upsertTracking({
      variables: {
        _id: articleID,
        collectionName: 'Articles',
        action: 'Viewed',
        comment: `Article (${articleTitle}) is viewed`,
      },
    })
      .then(() => {})
      .catch(err => {
        console.log(err)
      })
    console.log('Sent Tracking: ' + 'Article - ' + articleTitle)
  }

  return (
    <div>
      {_.get(group, 'availability.state') === 'on' && (
        <div className="oe-group-layout-C" style={outline}>
          <div className="oe-group-layout-C-group">
            <div className="oe-group-layout-C-group-header">
              {(groupIcon || groupTitle) && (
                <div className="oe-group-layout-C-group-header-title-bar" style={groupHeaderBarStyle}>
                  {groupIcon && <img src={groupIcon} alt="desc.icon" />}
                  <span>{groupTitle}</span>
                </div>
              )}
              {(groupIcon || groupTitle || groupImage || groupShortDescr || groupLongDescr) && (
                <div className="oe-group-layout-C-group-header-time-bar" style={groupTimeBarStyle}>
                  <div className="oe-group-layout-C-group-header-time-bar-updatedAt">{`Updated: ${moment(updatedAt).format('MMM DD, hh:mm A')}`}</div>
                </div>
              )}
            </div>
            <div className="oe-group-layout-C-group-body">
              {(groupImage || groupShortDescr || groupLongDescr) && (
                <div className="oe-group-layout-C-group-body-desc-bar" style={groupBodyBarStyle}>
                  {groupImage && <img src={groupImage} alt="desc.clip" />}
                  <div className="oe-group-layout-C-group-body-desc-bar-text">
                    <div className="oe-group-layout-C-group-body-desc-bar-text-short" style={groupShortDescrStyle}>
                      {groupShortDescr}
                    </div>
                    {groupShortDescr && groupLongDescr && style?.b_divide_major === true && <div className="oe-group-layout-C-group-body-desc-bar-text-divider" style={dividerStyle} />}
                    <div className="oe-group-layout-C-group-body-desc-bar-text-long">{groupLongDescr}</div>
                  </div>
                </div>
              )}
              {articles.length > 0 && (
                <div className="oe-group-layout-C-group-body-articles-summary-bar" style={articleSummaryBarStyle}>
                  {articles &&
                    articles.map((article, index) => {
                      const articleIcon = _.get(article, 'data.desc.icon') || null
                      const articleTitle = _.get(article, 'data.desc.title') || ''
                      const articleID = _.get(article, '_id') || 0

                      return (
                        <div key={articleID}>
                          {articleTitle.length > 0 && (
                            <div
                              className="oe-group-layout-C-group-body-articles-summary-bar-item"
                              onClick={() => {
                                if (refetch) refetch()
                                setArticleIndex(articleID, articleTitle, index)
                              }}
                              style={{
                                color: index === current ? 'white' : 'inherit',
                              }}
                            >
                              <div className="oe-group-layout-C-group-body-articles-summary-bar-item-text">
                                {articleIcon && <img src={articleIcon} alt="article.icon" />}
                                <span>{articleTitle}</span>
                              </div>
                              {/* <div style={articleBottomDividerStyle} /> */}
                            </div>
                          )}
                        </div>
                      )
                    })}
                </div>
              )}
              {feeds.length > 0 && (
                <div className="oe-group-layout-C-group-body-feeds">
                  FEEDS:
                  {feeds.map((feed, index) => {
                    console.log(feed)
                    if (feed.type === 'Twitter') {
                      return (
                        <button type="button" onClick={() => setCurrent(AdditionalIndex.Twitter)} key={index}>
                          <FontAwesomeIcon className="fa-twitter" icon={faTwitter} color="#1b95e0" size="2x" />
                        </button>
                      )
                    } else if (feed.type === 'NWS') {
                      return (
                        <button type="button" onClick={() => setCurrent(AdditionalIndex.NWS)} key={index}>
                          <img src="/icons/NWS.png" alt="NWS" />
                        </button>
                      )
                    }
                  })}
                </div>
              )}
              <div className="oe-group-layout-C-group-body-article" style={articleOutline}>
                <div className="oe-group-layout-C-group-body-article-cancel" onClick={() => setCurrent(-1)}>
                  &times;
                </div>

                {(articleImage || articleShortDescr || articleLongDescr) && (
                  <div className="oe-group-layout-C-group-body-article-header-bar" style={articleHeaderBarStyle}>
                    {/* {articleIcon && <img src={articleIcon} alt="desc.icon" />} */}
                    {/* {articleImage && <img src={articleImage} alt="desc.image" />} */}
                    <div className="oe-group-layout-C-group-body-article-header-bar-desc">
                      <span className="oe-group-layout-C-group-body-article-header-bar-desc-short">{articleShortDescr}</span>
                      {articleShortDescr && articleLongDescr && articleStyle?.b_divide_minor === true && (
                        <div className="oe-group-layout-C-group-body-article-header-bar-desc-divider" style={articleDescDividerStyle} />
                      )}
                      <span className="oe-group-layout-C-group-body-article-header-bar-desc-long">{articleLongDescr}</span>
                    </div>
                  </div>
                )}

                <div className="oe-group-layout-C-group-body-article-body" style={articleBodyStyle}>
                  <div className="oe-group-layout-C-group-body-article-body-social">{[AdditionalIndex.Twitter, AdditionalIndex.NWS].includes(current) && socialArticleBody}</div>
                  {((content && content.length) || mMode !== Modes.NONE) && (
                    <div className="oe-group-layout-C-group-body-article-body-main-bar">
                      {content && content.length && (
                        <div className="oe-group-layout-C-group-body-article-body-main-bar-left">
                          <div dangerouslySetInnerHTML={{ __html: content }} />
                        </div>
                      )}
                      {mMode !== Modes.NONE && (
                        <>
                          <div className="oe-group-layout-C-group-body-article-body-main-bar-right">
                            <div className="oe-group-layout-C-group-body-article-body-main-bar-right-media">{contentRender}</div>
                          </div>
                          <div className="oe-group-layout-C-group-body-article-body-main-bar-actions" style={{ display: judgeMainBar > 1 ? 'inherit' : 'none' }}>
                            <div>
                              {bImageList ? <span onClick={() => setMode(Modes.IMAGE)}>Images</span> : ''}
                              {bVideoList ? <span onClick={() => setMode(Modes.VIDEO)}>Videos</span> : ''}
                              {bLocation && <span onClick={() => setMode(Modes.LOC)}>Map</span>}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
                {(articleSourceLogo || articleSourceName) && (
                  <div className="oe-group-layout-C-group-body-article-action-bar" style={articleActionBarStyle}>
                    <div className="oe-group-layout-C-group-body-article-action-bar-source">
                      {(articleSourceLogo || articleSourceName) && <span>Source:</span>}
                      {articleSourceLogo && <img src={articleSourceLogo} alt="source.logo" />}
                      <span>{articleSourceName}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {((webLinks.length > 0 && _.isEmpty(webLinks[0]) !== true) || (sharedLinks.length > 0 && _.isEmpty(sharedLinks[0]) !== true)) && (
            <div className="oe-group-layout-C-links">
              <div className="oe-group-layout-C-links-sharedLinks">
                {sharedLinks.length > 0 &&
                  _.isEmpty(sharedLinks[0]) !== true &&
                  sharedLinks.map((sharedLink, index) => (
                    <a
                      className="oe-group-layout-C-links-sharedLinks-item"
                      key={index}
                      onClick={() => {
                        handleSharedLink(sharedLink)
                      }}
                    >
                      {sharedLink.iconURL && <img src={sharedLink.iconURL} key={index} />}
                    </a>
                  ))}
              </div>
              <div className="oe-group-layout-C-links-webLinks">
                {webLinks.length > 0 &&
                  _.isEmpty(webLinks[0]) !== true &&
                  webLinks.map((link, index) => {
                    const label = _.get(link, 'label') || null
                    const iconURL = _.get(link, 'iconURL') || null
                    const url = _.get(link, 'url') || null

                    return (
                      <a href={url} className="oe-group-layout-C-links-webLinks-item" key={index} style={groupFooterBarStyle}>
                        {iconURL && <img src={iconURL} alt="Icon URL" />}
                        {label && <span>{label}</span>}
                      </a>
                    )
                  })}
              </div>
            </div>
          )}

          {(sourceLogo || sourceName) && (
            <div className="oe-group-layout-C-footer-bar" style={groupFooterBarStyle}>
              <div className="oe-group-layout-C-footer-bar-source">
                {(sourceLogo || sourceName) && <span>Source:</span>}
                {sourceLogo && <img src={sourceLogo} alt="source.logo" />}
                <span>{sourceName}</span>
              </div>
            </div>
          )}
          <div className="oe-group-layout-C-copyright">
            <a style={{ color: titleFgColor, marginLeft: 'auto' }} href="https://openznet.com">
              © OpenZNet Inc. 2020
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

GroupLayoutC.defaultProps = {
  upsertTracking: () => {},
}

export default compose(graphql(mutations.upsertTracking, { name: 'upsertTracking' }), withApollo)(GroupLayoutC)
