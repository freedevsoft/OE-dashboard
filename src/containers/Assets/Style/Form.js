import React from 'react'
import { Icon, Button, Form, Input, InputNumber, Row, Col } from 'antd'
import GrayPanel from 'components/GrayPanel/GrayPanel'
import ControlBtnsGroup from 'components/ControlBtnsGroup/ControlBtnsGroup'
import AccordionList from 'components/AccordionList/AccordionList'
import ColorPicker from 'components/ColorPicker'

import './Form.scss'

class MyForm extends React.Component {
  static defaultProps = {
    loading: false,
  }

  constructor(props) {
    super(props)
    this.changeHandler = this.changeHandler.bind(this)
  }

  changeHandler(field, colors) {
    const key = `data.${field}`
    this.props.form.setFieldsValue({ [key]: colors })
  }

  render() {
    const { style, changeMode, data, loading, error } = this.props
    const { getFieldDecorator } = this.props.form

    if (loading) {
      return (
        <GrayPanel title="Style" {...style}>
          <ControlBtnsGroup>
            <>
              <Button style={{ width: 'auto', background: 'transparent' }} onClick={() => changeMode('edit')}>
                Edit
                <Icon type="edit" />
              </Button>
              <Button style={{ width: 'auto', background: 'transparent' }} onClick={() => changeMode('grouping')}>
                Grouping
                <Icon type="appstore" />
              </Button>
              <Button type="primary" style={{ width: 'auto' }} disabled>
                Save
                <Icon type="save" />
              </Button>
              <Button style={{ width: 'auto', background: 'transparent' }} onClick={() => changeMode('preview')}>
                Preview
                <Icon type="pic-right" />
              </Button>
              <Button style={{ width: 'auto', background: 'transparent' }} onClick={() => changeMode('publish')}>
                Publish
                <Icon type="upload" />
              </Button>
            </>
          </ControlBtnsGroup>
          <AccordionList loading />
        </GrayPanel>
      )
    }

    if (error) {
      return (
        <GrayPanel title="Style" {...style}>
          <ControlBtnsGroup>
            <>
              <Button style={{ width: 'auto', background: 'transparent' }} onClick={() => changeMode('edit')}>
                Edit
                <Icon type="edit" />
              </Button>
              <Button style={{ width: 'auto', background: 'transparent' }} onClick={() => changeMode('grouping')}>
                Grouping
                <Icon type="appstore" />
              </Button>
              <Button type="primary" style={{ width: 'auto' }} disabled>
                Save
                <Icon type="save" />
              </Button>
              <Button style={{ width: 'auto', background: 'transparent' }} onClick={() => changeMode('preview')}>
                Preview
                <Icon type="pic-right" />
              </Button>
              <Button style={{ width: 'auto', background: 'transparent' }} onClick={() => changeMode('publish')}>
                Publish
                <Icon type="upload" />
              </Button>
            </>
          </ControlBtnsGroup>
          <div style={{ position: 'absolute', top: 'calc(50% - 105px)', left: 'calc(50% - 110px)' }}>
            <img src="/oops.png" />
          </div>
        </GrayPanel>
      )
    }

    getFieldDecorator('data.bg_color', { initialValue: data.bg_color ? data.bg_color : 'rgb(177, 3, 2)' })
    getFieldDecorator('data.fg_color', { initialValue: data.fg_color ? data.fg_color : 'white' })

    return (
      <GrayPanel title="Style" {...style}>
        <ControlBtnsGroup>
          <>
            <Button style={{ width: 'auto', background: 'transparent' }} onClick={() => changeMode('edit')}>
              Edit
              <Icon type="edit" />
            </Button>
            <Button type="primary" style={{ width: 'auto' }} onClick={e => this.props.onSaveFunc(e, this.props.form)}>
              Save
              <Icon type="save" />
            </Button>
            {/* <Button style={{ width: 'auto', background: 'transparent' }} onClick={() => changeMode('preview')}>Preview<Icon type="pic-right" /></Button> */}
            <Button style={{ width: 'auto', background: 'transparent' }} onClick={() => changeMode('publish')}>
              Publish
              <Icon type="upload" />
            </Button>
          </>
        </ControlBtnsGroup>
        <Form className="grouping-style-form">
          <Form.Item>
            Title:&nbsp;&nbsp;
            {getFieldDecorator('data.title', {
              initialValue: data.title,
              rules: [{ required: true, message: 'Please input title!' }],
            })(<Input placeholder="Grid App Title" className="grouping-style-title" />)}
          </Form.Item>
          <Row>
            <Col md={{ span: 8 }}>
              <Form.Item>
                Rows:&nbsp;&nbsp;
                {getFieldDecorator('data.rows', {
                  initialValue: data.rows ? data.rows : 1,
                  rules: [{ required: true, message: 'Please select row count' }],
                })(<InputNumber min={1} max={10} style={{ maxWidth: '60px' }} />)}
              </Form.Item>
            </Col>
            <Col md={{ span: 8 }}>
              <Form.Item>
                Columns:&nbsp;&nbsp;
                {getFieldDecorator('data.columns', {
                  initialValue: data.columns ? data.columns : 1,
                  rules: [{ required: true, message: 'Please select column count' }],
                })(<InputNumber min={1} max={10} style={{ maxWidth: '60px' }} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col md={{ span: 8 }}>
              <Form.Item>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  Background:&nbsp;&nbsp;
                  <ColorPicker color={this.props.form.getFieldValue('data.bg_color')} onValueChange={this.changeHandler} field="bg_color" />
                </div>
              </Form.Item>
            </Col>
            <Col md={{ span: 8 }}>
              <Form.Item>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  Foreground:&nbsp;&nbsp;
                  <ColorPicker color={this.props.form.getFieldValue('data.fg_color')} onValueChange={this.changeHandler} field="fg_color" />
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </GrayPanel>
    )
  }
}
const AlertGridStyleForm = Form.create()(MyForm)
export default AlertGridStyleForm
