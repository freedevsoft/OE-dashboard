import React, { useState, useEffect } from 'react'
import PinLocation from './PinLocation'

import './index.scss'

const Map = ({ lat, lng }) => {
  let [yourPosition, setYourPosition] = useState(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const you = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setYourPosition(you)
        // setCoordinates(props.coordinates ? props.coordinates : [you])
      })
    }
  }, [])

  // function on_lat_change(lat, index) {
  //   setZones(state => {
  //     let temp = Object.assign([], state)
  //     temp[index].lat = lat
  //     return temp
  //   })
  // }

  if (!yourPosition) return ''

  return (
    <div className="oz-shared-pinlocation">
      <div className="row" style={{ height: '100%' }}>
        <div className="col-md-12">
          <PinLocation
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDQ6fOZioeYFWHF-Q02vErr8v7duPXywRA&v=3.exp&libraries=geometry,drawing,places"
            loadingElement={<div className="loadingelement" />}
            mapElement={<div className="mapelement" id="map" />}
            containerElement={<div className="containerelement" />}
            yourPosition={yourPosition}
            lat={lat}
            lng={lng}
          />
        </div>
      </div>
    </div>
  )
}

export default Map
