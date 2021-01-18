import React, { useState, useEffect } from 'react'
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Circle, Polygon, InfoWindow } from 'react-google-maps'

const MapComponent = props => {
  const { zoom, center, color, onPointAdd, useCase, coordinates, zones, unit, showCenterMark, yourPosition } = props

  console.log(color)

  function convert_radius(radius) {
    switch (unit) {
      case 'feet':
        return radius * 0.3048
      case 'meter':
        return radius
      case 'mile':
        return radius * 1609.344
    }
  }
  let containers
  if (useCase === 2) {
    containers = coordinates.map((coordinate, index) => <Marker key={index} position={{ lat: coordinate.lat, lng: coordinate.lng }} />)
  } else {
    containers = zones.map((coordinate, index) => {
      return (
        <React.Fragment key={index}>
          <Marker position={{ lat: coordinate.lat, lng: coordinate.lng }} key={index}>
            {index}
          </Marker>
          <Circle
            radius={convert_radius(coordinate.radius)}
            visible={true}
            center={{ lat: coordinate.lat, lng: coordinate.lng }}
            options={{
              strokeColor: color,
              strokeWeight: 2,
              fillColor: color,
            }}
          />
        </React.Fragment>
      )
    })
  }
  return (
    <GoogleMap DefaultZoom={8} zoom={zoom} center={center} onClick={onPointAdd}>
      {showCenterMark == true && <Marker key="-1" position={yourPosition} icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' }} />}
      {containers}
      {useCase === 2 && (
        <Polygon
          path={coordinates}
          options={{
            strokeColor: color,
            strokeWeight: 2,
            fillColor: color,
          }}
        />
      )}
    </GoogleMap>
  )
}

export default withScriptjs(withGoogleMap(MapComponent))
