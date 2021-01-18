/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react'
import Slider from 'react-slick'
import { Player } from 'video-react'
import _ from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVideo, faImage, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import MapComponent from 'components/OE-DN/DynamicNotifications/MapComponent'

import './Article.scss'

const Modes = {
  NONE: 'none',
  LIVE: 'Live',
  IMAGE: 'Images',
  VIDEO: 'Videos',
  LOC: 'Location',
}

const settings = {
  infinite: true,
  fade: true,
  speed: 1500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplaySpeed: 5000,
  autoplay: true,
}

const FeaturedArticleNormal = ({ myGeo, article, groupStyle }) => {
  const [mode, setMode] = useState(Modes.IMAGE)

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

  switch (mMode) {
    case Modes.IMAGE:
      contentRender = (
        <div className="oe-featured-layout-group-body-articles-bar-article-item-media-image">
          <Slider {...settings}>{bImageList && imageList.map((image, index) => <img alt="slide" src={image.url} key={index} />)}</Slider>
        </div>
      )
      break
    case Modes.VIDEO:
      contentRender = <div className="oe-featured-layout-group-body-articles-bar-article-item-media-video">{videoList && videoList.length > 0 && <Player src={videoList[0].url} playsInline />}</div>
      break
    case Modes.LOC:
      contentRender = (
        <div className="oe-featured-layout-group-body-articles-bar-article-item-media-location">
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

  const articleTitle = _.get(article, 'data.desc.title') || null
  const articleShortDescr = _.get(article, 'data.desc.shortDescr') || null
  const articleLongDescr = _.get(article, 'data.desc.longDescr') || null
  const articleID = _.get(article, '_id') || 0

  const articleStyle = _.get(article, 'style') || null
  const articleFgColor = _.get(articleStyle, 'fg_color') || 'white'
  const articleBgColor = _.get(articleStyle, 'bg_color') || _.get(groupStyle, 'bg_color') || 'gray'

  const articleOutline = {
    color: articleFgColor,
    backgroundColor: articleBgColor,
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

  return (
    <div className="oe-featured-layout-group-body-articles-bar-article" key={articleID}>
      <div className="oe-featured-layout-group-body-articles-bar-article-item" style={articleOutline}>
        <div className="oe-featured-layout-group-body-articles-bar-article-item-media">
          {mMode !== Modes.NONE && (
            <>
              {contentRender}
              <div className="oe-featured-layout-group-body-articles-bar-article-item-media-selector" style={{ display: judgeMainBar > 1 ? 'flex' : 'none' }}>
                {bImageList && (
                  <span>
                    <FontAwesomeIcon icon={faImage} size="xs" color="#1b95e0" onClick={() => setMode(Modes.IMAGE)} />
                  </span>
                )}
                {bVideoList && (
                  <span>
                    <FontAwesomeIcon icon={faVideo} size="xs" color="#1b95e0" onClick={() => setMode(Modes.VIDEO)} />
                  </span>
                )}
                {bLocation && (
                  <span>
                    <FontAwesomeIcon icon={faMapMarkerAlt} size="xs" color="#1b95e0" onClick={() => setMode(Modes.LOC)} />
                  </span>
                )}
              </div>
            </>
          )}
        </div>
        {(articleTitle || articleShortDescr || articleLongDescr) && (
          <div className="oe-featured-layout-group-body-articles-bar-article-item-text">
            <div className="oe-featured-layout-group-body-articles-bar-article-item-text-title">{articleTitle}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FeaturedArticleNormal
