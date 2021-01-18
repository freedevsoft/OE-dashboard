import React, { useState, useEffect } from 'react'
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, InputNumber } from 'antd'

const PanelComponent = props => {
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  }
  const zoneStyle = {
    color: 'black',
    textDecoration: 'underline',
  }
  return (
    <Form id="panel" {...formItemLayout}>
      {/* <div className="form-group"> */}
      <br />
      <Form.Item label="Address:" placeholder="Please type an Address">
        <Input.Group compact>
          <Input type="address" id="map-panel-address" style={{ width: 'calc(100% - 50px)' }} />
          <Button type="default" style={{ width: '50px' }} onClick={e => props.onGo(document.getElementById('map-panel-address').value)}>
            Go
          </Button>
        </Input.Group>
      </Form.Item>
      <div className="form-group" style={{ marginLeft: '30px' }}>
        <div className="form-check form-check-inline">
          <input className="form-check-input" type="radio" name="inlineRadioOptions" onChange={e => props.onUseCaseChange(1)} id="inlineRadio1" value="option1" checked={props.useCase === 1} />
          <label className="form-check-label" htmlFor="inlineRadio1">
            Pin Drop
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input className="form-check-input" type="radio" name="inlineRadioOptions" onChange={e => props.onUseCaseChange(2)} id="inlineRadio2" value="option2" checked={props.useCase === 2} />
          <label className="form-check-label" htmlFor="inlineRadio2">
            Polygon
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input className="form-check-input" type="radio" name="inlineRadioOptions" onChange={e => props.onUseCaseChange(3)} id="inlineRadio3" value="option3" checked={props.useCase === 3} />
          <label className="form-check-label" htmlFor="inlineRadio3">
            What3words
          </label>
        </div>
      </div>

      <Form.Item label="Zoom:" placeholder="Zoom">
        <InputNumber size="large" onChange={props.onZoomChange} value={props.viewport.zoom} />
      </Form.Item>
      <Form.Item label="FIPS:" placeholder="FIPS">
        <InputNumber size="large" onChange={props.onFIPSChange} value={props.FIPS} style={{ width: '120px' }} minLength={6} maxLength={6} />
      </Form.Item>
      {props.useCase !== 2 && (
        <Form.Item label="Radius Unit:" placeholder="Please select an Option">
          <Select value={props.viewport.unit} onChange={props.onFeetChange} size="large">
            <Option value="feet">feet</Option>
            <Option value="mile">mile</Option>
            <Option value="meter">meter</Option>
          </Select>
        </Form.Item>
      )}
      <Form.Item label="Color Code:" placeholder="Please select an Option">
        <Select onChange={props.onColorChange} value={props.color} size="large">
          <Option value="#ffffff">White</Option>
          <Option value="#7DD964">Green</Option>
          <Option value="#FFF333">Yellow</Option>
          <Option value="#E9672E">Orange</Option>
          <Option value="#EB3223">Red</Option>
          <Option value="#EA3FF6">Purple</Option>
        </Select>
      </Form.Item>

      {props.useCase === 1 && (
        <Row style={{ marginBottom: '8px' }}>
          <Col span={8} align="right" style={{ ...zoneStyle, padding: '0px 8px' }}>
            Incident Points:
          </Col>
          <Col span={6} align="center" style={zoneStyle}>
            Latitude
          </Col>
          <Col span={6} align="center" style={zoneStyle}>
            Longitude
          </Col>
          <Col span={4} align="center" style={zoneStyle}>
            Radius
          </Col>
        </Row>
      )}

      {props.useCase === 2 && (
        <Row style={{ marginBottom: '8px' }}>
          <Col span={8} align="right" style={{ ...zoneStyle, padding: '0px 8px' }}>
            Incident Points:
          </Col>
          <Col span={8} align="center" style={zoneStyle}>
            Latitude
          </Col>
          <Col span={8} align="center" style={zoneStyle}>
            Longitude
          </Col>
        </Row>
      )}

      {props.useCase === 1 &&
        props.zones.map((coordinate, index) => (
          <Row key={index} style={{ marginBottom: '8px' }}>
            <Col span={8} align="right" style={{ padding: '0px 8px' }}>
              <Button size="large" type="default" onClick={e => props.onPointRemove(index)}>
                {' '}
                -{' '}
              </Button>
            </Col>
            <Col span={6} align="center">
              <InputNumber size="large" style={{ width: '100%' }} value={coordinate.lat} onChange={e => props.lat_change(e, index)} placeholder="Latitude" />
            </Col>
            <Col span={6} align="center">
              <InputNumber size="large" style={{ width: '100%' }} value={coordinate.lng} onChange={e => props.lng_change(e, index)} placeholder="Longitude" />
            </Col>
            <Col span={4} align="center">
              <InputNumber size="large" style={{ width: '100%' }} value={coordinate.radius} onChange={e => props.onRadiusChange(e, index)} placeholder="Radius" />
            </Col>
          </Row>
        ))}
      {props.useCase === 2 &&
        props.coordinates.map((coordinate, index) => (
          <Row key={index} style={{ marginBottom: '8px' }}>
            <Col span={8} align="right" style={{ padding: '0px 8px' }}>
              <Button size="large" type="default" onClick={e => props.onPointRemove(index)}>
                {' '}
                -{' '}
              </Button>
            </Col>
            <Col span={8} align="center">
              <InputNumber size="large" style={{ width: '100%' }} value={coordinate.lat} onChange={e => props.lats_change(e, index)} placeholder="Latitude" />
            </Col>
            <Col span={8} align="center">
              <InputNumber size="large" style={{ width: '100%' }} value={coordinate.lng} onChange={e => props.lngs_change(e, index)} placeholder="Longitude" />
            </Col>
          </Row>
        ))}
      {(props.useCase === 1 || props.useCase === 2) && (
        <Row>
          <Col span={8} align="right" style={{ padding: '0px 8px' }}>
            <Button size="large" type="primary" onClick={props.onPointAddButton}>
              {' '}
              +{' '}
            </Button>
          </Col>
        </Row>
      )}
    </Form>
  )
}

export default PanelComponent
