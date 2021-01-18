import React from 'react'
import { Form, Checkbox, Row, Col, Button, DatePicker, TimePicker, Input, Icon } from 'antd'
import OZTextArea from 'components/FormItems/OZTextArea'
import TypesSelect from 'containers/Selects/TypesSelect'
import OZInput from 'components/FormItems/OZInput/index'
import { getDepthValue, inlineStyle } from 'utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import * as constants from 'utils/constants'
import moment from 'moment'
import './index.scss'

const ContactForm = ({
  data,
  form: { getFieldDecorator, getFieldValue, setFieldsValue },
  field,
  initialValue = {
    name: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    bSMS: false,
    bCall: false,
    call: '',
    timelines: [],
  },
  onShowThirdPanel,
  panelDocType,
  onDeleteAsset,
  onDrop,
  avatarassets,
  logoassets,
  imageassets,
}) => {
  const register = key => {
    getFieldDecorator(`${field}.${key}`, { initialValue: getDepthValue(data, key, initialValue[key]) })
  }

  const initial = key => getDepthValue(data, key, initialValue[key])

  register('name')
  register('address')
  register('phone')
  register('email')
  register('sms')
  register('link')


  return (
    <div className="oe-contact-form">
      <div className="oe-contact-form-imagebox">
        <div className="oe-contact-form-imagebox-itemgroup">
          <p className="oe-contact-form-imagebox-title">
            Avatar:
          </p>
          <div className="oe-contact-form-imagebox-item"
            onDragOver={e => {
              e.preventDefault()
            }}
            onDrop={ev => onDrop(ev, panelDocType, 'avatar')}>
            {(avatarassets && Object.keys(avatarassets).length > 0) ?
              <div className="oe-contact-form-imagebox-item__item" >
                {panelDocType === constants.organizer.Image.docType &&
                  <img
                    src={avatarassets.url}
                    style={{ maxWidth: '50px', maxHeight: '30px' }}
                  />
                }
                <div className="oe-contact-form-imagebox-item__item__mask">
                  <button type="button" className="oe-contact-form-imagebox-item__item__mask__close" onClick={() => onDeleteAsset('avatar')}>
                    X
                  </button>
                </div>
              </div>
              :
              <div className="oe-contact-form-imagebox-item">
                <p className="oe-contact-form-imagebox-item-text">
                  Drag & Drop
                </p>
              </div>
            }
          </div>
        </div>
        <div className="oe-contact-form-imagebox-itemgroup">
          <p className="oe-contact-form-imagebox-title">
            Logo:
          </p>
          <div className="oe-contact-form-imagebox-item"
            onDragOver={e => {
              e.preventDefault()
            }}
            onDrop={ev => onDrop(ev, panelDocType, 'logo')}>
            {(logoassets && Object.keys(logoassets).length > 0) ?
              <div className="oe-contact-form-imagebox-item__item">
                {panelDocType === constants.organizer.Image.docType &&
                  <img
                    src={logoassets.url}
                    style={{ maxWidth: '50px', maxHeight: '30px' }}
                  />
                }
                <div className="oe-contact-form-imagebox-item__item__mask">
                  <button type="button" className="oe-contact-form-imagebox-item__item__mask__close" onClick={() => onDeleteAsset('logo')}>
                    X
                  </button>
                </div>
              </div>
              :
              <div className="oe-contact-form-imagebox-item">
                <p className="oe-contact-form-imagebox-item-text">
                  Drag & Drop
                </p>
              </div>
            }
          </div>
        </div>
        <div className="oe-contact-form-imagebox-itemgroup">
          <p className="oe-contact-form-imagebox-title">
            Image:
          </p>
          <div className="oe-contact-form-imagebox-item"
            onDragOver={e => {
              e.preventDefault()
            }}
            onDrop={ev => onDrop(ev, panelDocType, 'image')}>
            {(imageassets && Object.keys(imageassets).length > 0) ?
              <div className="oe-contact-form-imagebox-item__item">
                {panelDocType === constants.organizer.Image.docType &&
                  <img
                    src={imageassets.url}
                    style={{ maxWidth: '50px', maxHeight: '30px' }}
                  />
                }
                <div className="oe-contact-form-imagebox-item__item__mask">
                  <button type="button" className="oe-contact-form-imagebox-item__item__mask__close" onClick={() => onDeleteAsset('image')}>
                    X
                  </button>
                </div>
              </div>
              :
              <div className="oe-contact-form-imagebox-item">
                <p className="oe-contact-form-imagebox-item-text">
                  Drag & Drop
                </p>
              </div>
            }
          </div>
        </div>
        <span onClick={() => onShowThirdPanel('StockImage')}>
          <FontAwesomeIcon icon={faChevronRight} color="#000" size="2x" />
        </span>
      </div>
      <OZInput label="Name" field={`${field}.name`} initialValue={initial('name')} getFieldDecorator={getFieldDecorator} {...inlineStyle} />
      <OZTextArea label="Address" field={`${field}.address`} initialValue={initial('address')} getFieldDecorator={getFieldDecorator} {...inlineStyle} />
      <OZInput label="Phone" field={`${field}.phone`} initialValue={initial('phone')} getFieldDecorator={getFieldDecorator} {...inlineStyle} />
      <OZInput label="Email" field={`${field}.email`} initialValue={initial('email')} getFieldDecorator={getFieldDecorator} {...inlineStyle} />
      <OZInput label="SMS" field={`${field}.sms`} initialValue={initial('sms')} getFieldDecorator={getFieldDecorator} {...inlineStyle} />
      <OZTextArea label="Link" field={`${field}.link`} initialValue={initial('link')} getFieldDecorator={getFieldDecorator} {...inlineStyle} />
    </div>
  )
}

export default ContactForm
