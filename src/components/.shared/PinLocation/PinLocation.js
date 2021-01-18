import React, { useState, useEffect } from 'react'
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Circle, Polygon, InfoWindow } from 'react-google-maps'

const PinLocation = props => {
  const { lat, lng, yourPosition } = props

  function setPosition(position) {
    console.log(position)
  }

  return (
    <GoogleMap DefaultZoom={8} zoom={8} center={{ lat, lng }} onClick={setPosition}>
      <Marker key="-1" position={yourPosition} icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' }} />
      <Marker key="0" position={{ lat, lng }} />
    </GoogleMap>
  )
}

export default withScriptjs(withGoogleMap(PinLocation))
