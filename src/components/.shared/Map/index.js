import React, { useState, useEffect } from 'react'
// import { useQuery } from '@apollo/react-hooks';
// import { gql } from 'apollo-boost';
import MapComponent from './MapComponent'
import PanelComponent from './PanelComponent'

import './index.scss'

const Map = props => {
  let [yourPosition, setYourPosition] = useState(null)
  let [address, setAddress] = useState(props.address ? props.address : yourPosition)
  let [viewport, setViewport] = useState(props.viewport ? props.viewport : { zoom: 15, unit: 'mile' })
  let [coordinates, setCoordinates] = useState(props.coordinates ? props.coordinates : [{ lat: 37.358604, lng: -122.067154 }])
  let [color, setColor] = useState(props.color ? props.color : '#ffffff')
  let [zones, setZones] = useState(props.zones ? props.zones : [{ lat: 37.358604, lng: -122.067154, radius: 1 }])
  let [radius, setRadius] = useState(props.radius ? props.radius : 1)
  let [FIPS, setFIPS] = useState(props.FIPS ? props.FIPS : undefined)
  let [useCase, setUsecase] = useState(props.useCase ? props.useCase : 1)

  useEffect(() => {
    if (props.onChange) props.onChange({ address, viewport, coordinates, color, zones, radius, useCase })
  }, [address, viewport, coordinates, color, zones, radius, useCase])

  useEffect(() => {
    setAddress(props.address ? props.address : yourPosition)
    setViewport(props.viewport ? props.viewport : { zoom: 15, unit: 'mile' })
    setCoordinates(props.coordinates ? props.coordinates : [{ lat: 37.358604, lng: -122.067154 }])
    setColor(props.color ? props.color : '#ff0000')
    setZones(props.zones ? props.zones : [{ lat: 37.358604, lng: -122.067154, radius: 1 }])
    setRadius(props.radius ? props.radius : 1)
    setUsecase(props.useCase ? props.useCase : 1)
  }, [props.currentKey])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const you = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setYourPosition(you)
        setAddress(props.address ? props.address : you)
        setCoordinates(props.coordinates ? props.coordinates : [you])
        setZones(props.zones ? props.zones : [{ ...you, radius: 1 }])
      })
    }
  }, [])

  function on_go(address) {
    var geocoder = new window.google.maps.Geocoder()
    geocoder.geocode(
      {
        address: address,
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

  function on_radius_change(radius, index) {
    radius = radius == '' ? '' : parseFloat(radius)
    setZones(state => {
      let temp = Object.assign([], state)
      temp[index].radius = radius
      return temp
    })
  }

  function on_color_change(color) {
    setColor(color)
  }

  function on_use_case_change(value) {
    setUsecase(value)
  }

  function on_zoom_change(zoom) {
    let temp = Object.assign({}, viewport)
    temp.zoom = parseInt(zoom)
    setViewport(temp)
  }

  function on_fips_change(FIPS) {
    setFIPS(FIPS)
  }

  function on_feet_change(unit) {
    let temp = Object.assign({}, viewport)
    temp.unit = unit
    setViewport(temp)
  }

  function onPointAddButton() {
    if (useCase === 2) {
      setCoordinates(state => {
        let temp = Object.assign([], state)
        temp.push(yourPosition)
        return temp
      })
    } else {
      setZones(state => {
        let temp = Object.assign([], state)
        temp.push({
          ...yourPosition,
          radius: 1,
        })
        return temp
      })
    }
  }

  function onPointRemove(index) {
    if (useCase === 2) {
      setCoordinates(state => {
        let temp = Object.assign([], state)
        temp.splice(index, 1)
        return temp
      })
    } else {
      setZones(state => {
        let temp = Object.assign([], state)
        temp.splice(index, 1)
        return temp
      })
    }
  }

  function onPointAdd(event) {
    if (useCase === 2) {
      setCoordinates(state => {
        let temp = Object.assign([], state)
        temp.push({
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        })
        return temp
      })
    } else {
      setZones(state => {
        let temp = Object.assign([], state)
        temp.push({
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
          radius: 1,
        })
        return temp
      })
    }
  }

  function on_lat_change(lat, index) {
    setZones(state => {
      let temp = Object.assign([], state)
      temp[index].lat = lat
      return temp
    })
  }

  function on_lng_change(lng, index) {
    setZones(state => {
      let temp = Object.assign([], state)
      temp[index].lng = lng
      return temp
    })
  }

  function on_lats_change(lat, index) {
    setCoordinates(state => {
      let temp = Object.assign([], state)
      temp[index].lat = lat
      return temp
    })
  }

  function on_lngs_change(lng, index) {
    setCoordinates(state => {
      let temp = Object.assign([], state)
      temp[index].lng = lng
      return temp
    })
  }

  if (!yourPosition) return ''

  return (
    <div className="oz-shared-map">
      <div className="row" style={{ height: '100%' }}>
        <div className="col-md-4">
          <PanelComponent
            onGo={on_go}
            onRadiusChange={on_radius_change}
            onUseCaseChange={on_use_case_change}
            onColorChange={on_color_change}
            onZoomChange={on_zoom_change}
            onFIPSChange={on_fips_change}
            lat_change={on_lat_change}
            lng_change={on_lng_change}
            lats_change={on_lats_change}
            lngs_change={on_lngs_change}
            onPointAddButton={onPointAddButton}
            onPointRemove={onPointRemove}
            onFeetChange={on_feet_change}
            useCase={useCase}
            coordinates={coordinates}
            zones={zones}
            FIPS={FIPS}
            viewport={viewport}
            radius={radius}
            color={color}
          />
        </div>
        <div className="col-md-8">
          <MapComponent
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDQ6fOZioeYFWHF-Q02vErr8v7duPXywRA&v=3.exp&libraries=geometry,drawing,places"
            loadingElement={<div className="loadingelement" />}
            mapElement={<div className="mapelement" id="map" />}
            containerElement={<div className="containerelement" />}
            zones={zones}
            radius={radius}
            color={color}
            zoom={viewport.zoom}
            color={color}
            useCase={useCase}
            center={address}
            yourPosition={yourPosition}
            unit={viewport.unit}
            onPointAdd={onPointAdd}
            coordinates={coordinates}
            showCenterMark
          />
        </div>
      </div>
    </div>
  )
}

export default Map
