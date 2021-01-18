import React, { useState } from 'react'
import { Form, Icon, Upload, Spin } from 'antd'
import OZTextArea from 'components/FormItems/OZTextArea'
import TypesSelect from 'containers/Selects/TypesSelect'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getDepthValue, inlineStyle } from 'utils'
import { faPlusCircle, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { graphql, withApollo } from 'react-apollo'
import * as compose from 'lodash.flowright'
import { uploadFileToS3 } from 'utils/index'
import * as constants from 'utils/constants'
import * as mutations from 'utils/mutations'
import * as queries from 'utils/queries'
import './index.scss'

const DescForm = ({
  data,
  form: { getFieldDecorator },
  field,
  initialValue = {
    title: '',
    shortDescr: '',
    longDescr: '',
    icon: null,
    logo: null,
    image: null,
  },
  onShowThirdPanel,
  panelDocType,
  onDeleteAsset,
  onDrop,
  iconasset,
  logoasset,
  imageasset,

}) => {

  const register = key => {
    getFieldDecorator(`${field}.${key}`, { initialValue: getDepthValue(data, key, initialValue[key]) })
  }

  const initial = key => getDepthValue(data, key, initialValue[key])

  register('title')
  register('shortDescr')
  register('longDescr')

  return (
    <div className="oe-desc-form">
      <div className="oe-desc-form-imagebox">
        <div className="oe-desc-form-imagebox-itemgroup">
          <p className="oe-desc-form-imagebox-title">
            Icon:
          </p>
          <div className="oe-desc-form-imagebox-item"
            onDragOver={e => {
              e.preventDefault()
            }}
            onDrop={ev => onDrop(ev, panelDocType, 'icon')}>
            {(iconasset && Object.keys(iconasset).length > 0) ?
              <div className="oe-desc-form-imagebox-item__item">
                {panelDocType === constants.organizer.Image.docType &&
                  <img
                    src={iconasset.url}
                    style={{ maxWidth: '50px', maxHeight: '30px' }}
                  />}
                <div className="oe-desc-form-imagebox-item__item__mask">
                  <button type="button" className="oe-desc-form-imagebox-item__item__mask__close" onClick={() => onDeleteAsset('icon')}>
                    X
                  </button>
                </div>
              </div>
              :
              <div className="oe-desc-form-imagebox-item">
                <p className="oe-desc-form-imagebox-item-text">
                  Drag & Drop
                </p>
              </div>
            }
          </div>
        </div>
        <div className="oe-desc-form-imagebox-itemgroup">
          <p className="oe-desc-form-imagebox-title">
            Logo:
          </p>
          <div className="oe-desc-form-imagebox-item"
            onDragOver={e => {
              e.preventDefault()
            }}
            onDrop={ev => onDrop(ev, panelDocType, 'logo')}>
            {(logoasset && Object.keys(logoasset).length > 0) ?
              <div className="oe-desc-form-imagebox-item__item">
                {panelDocType === constants.organizer.Image.docType &&
                  <img
                    src={logoasset.url}
                    style={{ maxWidth: '50px', maxHeight: '30px' }}
                  />
                }
                <div className="oe-desc-form-imagebox-item__item__mask">
                  <button type="button" className="oe-desc-form-imagebox-item__item__mask__close" onClick={() => onDeleteAsset('logo')}>
                    X
                  </button>
                </div>
              </div>
              :
              <div className="oe-desc-form-imagebox-item">
                <p className="oe-desc-form-imagebox-item-text">
                  Drag & Drop
                </p>
              </div>
            }
          </div>
        </div>
        <div className="oe-desc-form-imagebox-itemgroup">
          <p className="oe-desc-form-imagebox-title">
            Image:
          </p>
          <div className="oe-desc-form-imagebox-item"
            onDragOver={e => {
              e.preventDefault()
            }}
            onDrop={ev => onDrop(ev, panelDocType, 'image')}>
            {(imageasset && Object.keys(imageasset).length > 0) ?
              <div className="oe-desc-form-imagebox-item__item">
                {panelDocType === constants.organizer.Image.docType &&
                  <img
                    src={imageasset.url}
                    style={{ maxWidth: '50px', maxHeight: '30px' }}
                  />
                }
                <div className="oe-desc-form-imagebox-item__item__mask">
                  <button type="button" className="oe-desc-form-imagebox-item__item__mask__close" onClick={() => onDeleteAsset('image')}>
                    X
                    </button>
                </div>
              </div>
              :
              <div className="oe-desc-form-imagebox-item">
                <p className="oe-desc-form-imagebox-item-text">
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
      <OZTextArea label="Title::" field={`${field}.title`} initialValue={initial('title')} getFieldDecorator={getFieldDecorator} {...inlineStyle} />
      <OZTextArea label="Short Desc::" field={`${field}.shortDescr`} initialValue={initial('shortDescr')} getFieldDecorator={getFieldDecorator} {...inlineStyle} />
      <OZTextArea label="Long Desc::" field={`${field}.longDescr`} initialValue={initial('longDescr')} getFieldDecorator={getFieldDecorator} {...inlineStyle} />
      {/* <Form.Item label="Logo:">{getFieldDecorator(`${field}.logo`, { initialValue: initial('logo') })(<TypesSelect collectionName="ImagesData" type="Logo" />)}</Form.Item> */}
    </div>
  )
}

export default compose(graphql(mutations.dataMutation, { name: 'dataMutation' }), withApollo)(DescForm)
