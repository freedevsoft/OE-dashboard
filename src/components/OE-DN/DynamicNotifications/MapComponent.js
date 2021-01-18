import React from 'react'
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Circle, Polygon } from 'react-google-maps'

const MapComponent = props => {
  const { zoom, zones, color, unit, coordinates, center, type, showCenterMark, yourPosition, onPointAdd } = props

  function convertRadius(radius) {
    switch (unit) {
      case 'feet':
        return radius * 0.3048
      case 'meter':
        return radius
      case 'mile':
        return radius * 1609.344
      default:
        break
    }

    return 0
  }

  let containers = ''

  if (type === 'polygon') {
    if (coordinates && coordinates.length) {
      containers = coordinates ? coordinates.map((coordinate, index) => <Marker key={index} position={{ lat: coordinate.lat, lng: coordinate.lng }} />) : ''
    }
  } else if (type === 'radius') {
    if (zones && zones.length) {
      containers = zones.map((coordinate, index) => (
        <React.Fragment key={index}>
          <Marker position={{ lat: coordinate.lat, lng: coordinate.lng }} key={index}>
            {index}
          </Marker>
          <Circle
            radius={convertRadius(coordinate.radius)}
            visible
            center={{ lat: coordinate.lat, lng: coordinate.lng }}
            options={{
              strokeColor: color,
              strokeWeight: 2,
              fillColor: color,
            }}
          />
        </React.Fragment>
      ))
    }
  }

  return (
    <GoogleMap DefaultZoom={8} zoom={zoom} center={center} onClick={onPointAdd}>
      {showCenterMark === true ? <Marker key="-1" position={yourPosition} icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' }} /> : ''}
      {containers}
      {type === 'polygon' ? (
        <Polygon
          path={coordinates}
          options={{
            strokeColor: color,
            strokeWeight: 2,
            fillColor: color,
          }}
        />
      ) : (
        ''
      )}
    </GoogleMap>
  )
}

export default withScriptjs(withGoogleMap(MapComponent))
