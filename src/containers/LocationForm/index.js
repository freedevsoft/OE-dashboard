import React, { useEffect, useState } from 'react'
import { Row, Input, InputNumber } from 'antd'
import OZInput from 'components/FormItems/OZInput'
import OZSelectItem from 'components/FormItems/OZSelectItem'
import OZInputArrayLoc from 'components/FormItems/OZInputArrayLoc'
import OZLocRadiuses from 'components/FormItems/OZLocRadiuses'
import OZLocCoordinates from 'components/FormItems/OZLocCoordinates'
import MediaListPanel from 'containers/MediaListPanel'
import * as constants from 'utils/constants'
import GroupsSelectV2 from 'containers/Selects/GroupsSelectV2'
import OZCheckbox from 'components/FormItems/OZCheckbox'
import _ from 'lodash'
import MapComponent from './Mapcomponent'
import './index.scss'

const LocationForm = ({ data, form: { getFieldDecorator, getFieldValue, setFieldsValue }, field, onAddVideo, onShowThirdPanel = () => {}, header, config }) => {
  const [yourPosition, setYourPosition] = useState(null)
  const [address, setAddress] = useState(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const you = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setYourPosition(you)
        setAddress(you)
      })
    }
  }, [])

  function onGo() {
    const address = getFieldValue(`${field}.addressTxt`)
    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode(
      {
        address,
      },
      function(results) {
        if (!results || !results[0]) return
        let location = results[0].geometry.location
        setAddress({
          lat: location.lat(),
          lng: location.lng(),
        })
      },
    )
  }

  function goToPosition(pos) {
    setAddress(pos)
  }

  getFieldDecorator(`${field}.type`, { initialValue: _.get(data, 'type') || 'radius' })
  getFieldDecorator(`${field}.color`, { initialValue: _.get(data, 'color') || '#7DD964' })
  getFieldDecorator(`${field}.viewport.zoom`, { initialValue: _.get(data, 'viewport.zoom') || 10 })
  getFieldDecorator(`${field}.viewport.unit`, { initialValue: _.get(data, 'viewport.unit') || 'mile' })
  getFieldDecorator(`${field}.copy.zones`, { initialValue: _.get(data, 'zones') || [] })
  getFieldDecorator(`${field}.copy.coordinates`, { initialValue: _.get(data, 'coordinates') || [] })
  getFieldDecorator(`${field}.copy.points`, { initialValue: _.get(data, 'points') || [] })
  getFieldDecorator(`${field}.bFilter`, { initialValue: _.get(data, 'bFilter') || false })
  getFieldDecorator(`${field}.bActive`, { initialValue: _.get(data, 'bActive') || false })
  getFieldDecorator(`${field}.imageList`, { initialValue: _.get(data, 'imageList') || [] })

  const whitelist = _.get(config, 'options')

  const copyZones = getFieldValue(`${field}.copy.zones`)
  const zones = []
  const copyCoordinates = getFieldValue(`${field}.copy.coordinates`)
  const coordinates = []
  const copyPoints = getFieldValue(`${field}.copy.points`)
  const points = []
  const type = getFieldValue(`${field}.type`)
  const zoom = getFieldValue(`${field}.viewport.zoom`)
  const defaultZone = { ...yourPosition, radius: 10 }
  const defaultCoordinate = { ...yourPosition }
  const imageList = getFieldValue(`${field}.imageList`)

  if (copyZones) {
    copyZones.forEach((item, index) => {
      getFieldDecorator(`${field}.zones[${index}].lat`, { initialValue: _.get(data, `zones.${index}.lat`) || item.lat })
      getFieldDecorator(`${field}.zones[${index}].lng`, { initialValue: _.get(data, `zones.${index}.lng`) || item.lng })
      getFieldDecorator(`${field}.zones[${index}].radius`, { initialValue: _.get(data, `zones.${index}.radius`) || item.radius })

      zones.push({
        lat: getFieldValue(`${field}.zones[${index}].lat`),
        lng: getFieldValue(`${field}.zones[${index}].lng`),
        radius: getFieldValue(`${field}.zones[${index}].radius`),
      })
    })
  }

  if (copyCoordinates) {
    copyCoordinates.forEach((item, index) => {
      getFieldDecorator(`${field}.coordinates[${index}].lat`, { initialValue: _.get(data, `coordinates.${index}.lat`) || item.lat })
      getFieldDecorator(`${field}.coordinates[${index}].lng`, { initialValue: _.get(data, `coordinates.${index}.lng`) || item.lng })

      coordinates.push({
        lat: getFieldValue(`${field}.coordinates[${index}].lat`),
        lng: getFieldValue(`${field}.coordinates[${index}].lng`),
      })
    })
  }

  if (copyPoints) {
    copyPoints.forEach((item, index) => {
      getFieldDecorator(`${field}.points[${index}].lat`, { initialValue: _.get(data, `points.${index}.lat`) || item.lat })
      getFieldDecorator(`${field}.points[${index}].lng`, { initialValue: _.get(data, `points.${index}.lng`) || item.lng })

      points.push({
        lat: getFieldValue(`${field}.points[${index}].lat`),
        lng: getFieldValue(`${field}.points[${index}].lng`),
      })
    })
  }

  function onPointAdd(event) {
    if (type === 'polygon') {
      const keysField = `${field}.copy.coordinates`
      const keys = getFieldValue(keysField)
      const nextKeys = keys.concat({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      })
      setFieldsValue({ [keysField]: nextKeys })
    } else if (type === 'radius') {
      const keysField = `${field}.copy.zones`
      const keys = getFieldValue(keysField)
      const nextKeys = keys.concat({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        radius: 10,
      })
      setFieldsValue({ [keysField]: nextKeys })
    } else if (type === 'coord') {
      const keysField = `${field}.copy.points`
      const keys = getFieldValue(keysField)
      const nextKeys = keys.concat({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      })
      setFieldsValue({ [keysField]: nextKeys })
    }
  }

  const typeLabel = {
    none: 'None',
    region: 'Regions',
    radius: 'Radius',
    polygon: 'Polygon',
    FIPS: 'FIPS',
    'zip-code': 'ZIP',
    coord: 'Coordinates',
  }

  const typeOptions = [
    { value: 'disabled', label: 'Disabled' },
    { value: 'radius', label: 'Radius' },
    { value: 'polygon', label: 'Polygon' },
    { value: 'coord', label: 'Coordinates' },
    { value: 'zip-code', label: 'ZIP' },
    { value: 'region', label: 'Regions' },
    { value: 'FIPS', label: 'FIPS' },
    { value: 'images', label: 'Images' },
  ]

  const renderMap = (
    <MapComponent
      googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDQ6fOZioeYFWHF-Q02vErr8v7duPXywRA&v=3.exp&libraries=geometry,drawing,places"
      loadingElement={<div className="loadingelement" />}
      mapElement={<div className="mapelement" id="map" />}
      containerElement={<div className="containerelement" />}
      type={type}
      zoom={zoom}
      yourPosition={yourPosition}
      center={address}
      zones={zones}
      points={points}
      color={getFieldValue(`${field}.color`)}
      unit={getFieldValue(`${field}.viewport.unit`)}
      coordinates={coordinates}
      onPointAdd={onPointAdd}
      showCenterMark
    />
  )

  const renderMapOptions = (
    <Row>
      <div className="oe-location-form-item oe-location-form-item-zoom">
        <span className="oe-location-form-item-label">Zoom:</span>
        <div className="oe-location-form-item-pickers" style={{ flexGrow: '0' }}>
          {getFieldDecorator(`${field}.viewport.zoom`, {
            initialValue: _.get(data, 'viewport.zoom') || 10,
          })(<InputNumber min={1} max={1000} />)}
        </div>
      </div>

      <div className="oe-location-form-item oe-location-form-item-address">
        <div className="oe-location-form-item-pickers" style={{ flexGrow: '0' }}>
          {getFieldDecorator(`${field}.addressTxt`)(<Input.Search placeholder="Enter Address" enterButton="Go" onSearch={onGo} />)}
        </div>
      </div>
    </Row>
  )

  const colorOptions = [
    { label: 'White', value: '#ffffff' },
    { label: 'Green', value: '#7DD964' },
    { label: 'Yellow', value: '#FFF333' },
    { label: 'Orange', value: '#E9672E' },
    { label: 'Red', value: '#EB3223' },
    { label: 'Purple', value: '#EA3FF6' },
  ]

  const unitOptions = [
    { label: 'feet', value: 'feet' },
    { label: 'mile', value: 'mile' },
    { label: 'meter', value: 'meter' },
  ]

  const renderTextFields = (
    <>
      {header && (
        <div className="oe-location-form-item">
          <span className="oe-location-form-item-label">Area:</span>
          <div className="oe-location-form-item-pickers">{getFieldDecorator(`${field}.areaRef`, { initialValue: _.get(data, 'areaRef') })(<GroupsSelectV2 type="Areas" header={header} />)}</div>
        </div>
      )}
      {header && (
        <div className="oe-location-form-item">
          <span className="oe-location-form-item-label">SubArea:</span>
          <div className="oe-location-form-item-pickers">
            {getFieldDecorator(`${field}.subAreaRef`, { initialValue: _.get(data, 'subAreaRef') })(<GroupsSelectV2 type="SubAreas" header={header} />)}
          </div>
        </div>
      )}
      <div className="oe-location-form-item">
        <span className="oe-location-form-item-label">Title:</span>
        <div className="oe-location-form-item-pickers">
          <OZInput field={`${field}.title`} initialValue={_.get(data, 'title')} getFieldDecorator={getFieldDecorator} style={{ maxWidth: '300px' }} />
        </div>
      </div>
      <div className="oe-location-form-item">
        <span className="oe-location-form-item-label">Desc:</span>
        <div className="oe-location-form-item-pickers">
          <OZInput field={`${field}.desc`} initialValue={_.get(data, 'desc')} getFieldDecorator={getFieldDecorator} style={{ maxWidth: '300px' }} />
        </div>
      </div>
    </>
  )

  function onAddImage(url) {
    setFieldsValue({ [`${field}.imageList`]: [...imageList, { url, name: `Image #${imageList.length}` }] })
  }

  function onDeleteImage(index) {
    setFieldsValue({ [`${field}.imageList`]: [...imageList.slice(0, index), ...imageList.slice(index + 1)] })
  }

  function onDropMediaFromExist(ev, docType) {
    const resourceUrl = ev.dataTransfer.getData('drag_url')
    const dragDocType = ev.dataTransfer.getData('drag_doc_type')
    if (!resourceUrl || dragDocType !== docType) return
    if (docType === constants.organizer.Image.docType) onAddImage(resourceUrl)
    else if (docType === constants.organizer.Video.docType) onAddVideo(resourceUrl)
  }

  return (
    <div className="oe-location-form">
      <OZSelectItem
        field={`${field}.type`}
        initialValue={!_.get(data, 'type') ? 'disabled' : _.get(data, 'type')}
        getFieldDecorator={getFieldDecorator}
        required={false}
        combines={typeOptions.filter(item => !whitelist || whitelist.includes(item.value))}
        onChange={value => {
          if (value === 'disabled') {
            setFieldsValue({ [`${field}.bActive`]: false })
          } else {
            setFieldsValue({ [`${field}.bActive`]: true })
          }
        }}
        style={{ marginBottom: '0' }}
      />
      {getFieldValue(`${field}.bActive`) && (
        <>
          <div className="oe-location-form-item">
            <span className="oe-location-form-item-label">Filter:</span>
            <div className="oe-location-form-item-pickers">
              <OZCheckbox field={`${field}.bFilter`} initialValue={_.get(data, 'bFilter') || false} getFieldDecorator={getFieldDecorator} style={{ maxWidth: '300px' }} />
            </div>
          </div>

          {['region', 'FIPS', 'zip-code'].includes(type) && (
            <>
              {/* {areaRender} */}
              {renderTextFields}
              <div className="oe-location-form-item oe-location-form-item-color">
                <span className="oe-location-form-item-label">Color:</span>
                <div className="oe-location-form-item-pickers" style={{ flexGrow: '0' }}>
                  <OZSelectItem field={`${field}.color`} initialValue={_.get(data, 'color') || '#7DD964'} getFieldDecorator={getFieldDecorator} combines={colorOptions} style={{ width: '90px' }} />
                </div>
              </div>
              <OZInputArrayLoc
                label={`Provide the list of ${typeLabel[type]}`}
                arrayField={`${field}.strings`}
                keysField={`${field}.copy.strings`}
                initialValue={_.get(data, 'strings') || [{ value: '' }]}
                getFieldDecorator={getFieldDecorator}
                getFieldValue={getFieldValue}
                setFieldsValue={setFieldsValue}
              />
            </>
          )}
          {['radius'].includes(type) && (
            <>
              {renderTextFields}
              <Row>
                <div className="oe-location-form-item oe-location-form-item-color">
                  <span className="oe-location-form-item-label">Color:</span>
                  <div className="oe-location-form-item-pickers" style={{ flexGrow: '0' }}>
                    <OZSelectItem field={`${field}.color`} initialValue={_.get(data, 'color') || '#7DD964'} getFieldDecorator={getFieldDecorator} combines={colorOptions} style={{ width: '90px' }} />
                  </div>
                </div>

                <div className="oe-location-form-item oe-location-form-item-radius">
                  <span className="oe-location-form-item-label">Radius Unit:</span>
                  <div className="oe-location-form-item-pickers" style={{ flexGrow: '0' }}>
                    <OZSelectItem
                      field={`${field}.viewport.unit`}
                      initialValue={_.get(data, 'viewport.unit') || 'mile'}
                      getFieldDecorator={getFieldDecorator}
                      combines={unitOptions}
                      style={{ width: '95px' }}
                    />
                  </div>
                </div>
              </Row>
              {renderMapOptions}

              <OZLocRadiuses
                arrayField={`${field}.zones`}
                keysField={`${field}.copy.zones`}
                initialValue={_.get(data, 'zones') || []}
                getFieldDecorator={getFieldDecorator}
                getFieldValue={getFieldValue}
                setFieldsValue={setFieldsValue}
                defaultValue={defaultZone}
                goToPosition={goToPosition}
              />
              {renderMap}
            </>
          )}
          {['coord'].includes(type) && (
            <>
              {renderTextFields}
              <div className="oe-location-form-item oe-location-form-item-color">
                <span className="oe-location-form-item-label">Color:</span>
                <div className="oe-location-form-item-pickers" style={{ flexGrow: '0' }}>
                  <OZSelectItem field={`${field}.color`} initialValue={_.get(data, 'color') || '#7DD964'} getFieldDecorator={getFieldDecorator} combines={colorOptions} style={{ width: '90px' }} />
                </div>
              </div>
              <OZLocCoordinates
                arrayField={`${field}.points`}
                keysField={`${field}.copy.points`}
                initialValue={_.get(data, 'points') || []}
                getFieldDecorator={getFieldDecorator}
                getFieldValue={getFieldValue}
                setFieldsValue={setFieldsValue}
                defaultValue={defaultCoordinate}
              />
              {renderMap}
            </>
          )}
          {['polygon'].includes(type) && (
            <>
              {renderTextFields}
              <div className="oe-location-form-item oe-location-form-item-color">
                <span className="oe-location-form-item-label">Color:</span>
                <div className="oe-location-form-item-pickers" style={{ flexGrow: '0' }}>
                  <OZSelectItem field={`${field}.color`} initialValue={_.get(data, 'color') || '#7DD964'} getFieldDecorator={getFieldDecorator} combines={colorOptions} style={{ width: '90px' }} />
                </div>
              </div>
              <OZLocCoordinates
                arrayField={`${field}.coordinates`}
                keysField={`${field}.copy.coordinates`}
                initialValue={_.get(data, 'coordinates') || []}
                getFieldDecorator={getFieldDecorator}
                getFieldValue={getFieldValue}
                setFieldsValue={setFieldsValue}
                defaultValue={defaultCoordinate}
              />
              {renderMap}
            </>
          )}
          {['images'].includes(type) && (
            <>
              {renderTextFields}
              <MediaListPanel
                assets={imageList || []}
                onAddAsset={onAddImage}
                onDeleteAsset={onDeleteImage}
                panelDocType={constants.organizer.Image.docType}
                onShowThirdPanel={onShowThirdPanel}
                addToUploadedFolder={() => {}}
                onDrop={onDropMediaFromExist}
              />
            </>
          )}
        </>
      )}
    </div>
  )
}
export default LocationForm
