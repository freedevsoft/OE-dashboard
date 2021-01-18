import React from 'react'
import { Checkbox, Input, Button, Row, Col, Icon } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import OZTextArea from 'components/FormItems/OZTextArea'
import { groupingQuery } from 'utils/queries'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { useQuery } from '@apollo/react-hooks'
import { getDepthValue } from 'utils'
import * as constants from 'utils/constants'
import './index.scss'

const MultiDescForm = ({
  data,
  form: { getFieldDecorator, getFieldValue, setFieldsValue },
  field,
  initialValue = {
    list: [],
  },
  onShowThirdPanel,
  panelDocType,
  onDeleteAsset,
  // onDrop,
  leftimageasset,
  rightimageasset,
}) => {
  const register = key => {
    getFieldDecorator(`${field}.${key}`, { initialValue: getDepthValue(data, key, initialValue[key]) })
  }

  register('list')

  const list = getFieldValue(`${field}.list`)

  const { loading, error, data: groupingQueryData } = useQuery(groupingQuery, {
    variables: {
      ids: list,
    },
  })

  const update = (index, internal, value) => {
    setFieldsValue({ [`${field}.list`]: [...list.slice(0, index), { ...list[index], [internal]: value }, ...list.slice(index + 1)] })
  }

  const remove = index => {
    setFieldsValue({ [`${field}.list`]: [...list.slice(0, index), ...list.slice(index + 1)] })
  }

  const add = () => {
    setFieldsValue({ [`${field}.list`]: [...list, { left_title: '', left_desc: '', left_image: '', right_title: '', right_desc: '', right_image: '' }] })
  }

  function onDrop(ev, docType, section, index) {
    const resourceUrl = ev.dataTransfer.getData('drag_url')
    const dragDocType = ev.dataTransfer.getData('drag_doc_type')
    if (docType === constants.organizer.Image.docType) update(index, section, resourceUrl)
  }

  return (
    <div className="oe-multidesc-form">
      <div className="oe-multidesc-form-list">
        {list?.map((_id, index) => {
          const group = groupingQueryData?.grouping?.find(group => group._id === _id)
          const { left_title, left_desc, left_image, right_title, right_desc, right_image } = _id
          return (
            <>
              <div className="oe-multidesc-form-list-left">
                <p>
                  Left.
                </p>
                <div className="oe-multidesc-form-list-left-content">
                  <div className="oe-multidesc-form-list-left-content-inputgroup">
                    <div className="oe-multidesc-form-list-left-content-inputgroup-input">
                      <p>
                        Title:
                      </p>
                      <Input
                        value={left_title}
                        placeholder="Enter Display Text"
                        onChange={e => update(index, 'left_title', e.target.value)}
                        style={{ width: '400px' }}
                      />
                    </div>
                    <div className="oe-multidesc-form-list-left-content-inputgroup-input">
                      <p>
                        Desc:
                      </p>
                      <Input
                        value={left_desc}
                        placeholder="Enter Display Text"
                        onChange={e => update(index, 'left_desc', e.target.value)}
                        style={{ width: '400px' }}
                      />
                    </div>
                  </div>
                  <div className="oe-multidesc-form-list-imagebox-itemgroup">
                    <div className="oe-multidesc-form-list-imagebox-item"
                      onDragOver={e => {
                        e.preventDefault()
                      }}
                      onDrop={ev => onDrop(ev, panelDocType, 'left_image', index)}>
                      {left_image ?
                        <div className="oe-multidesc-form-list-imagebox-item__item">
                          {panelDocType === constants.organizer.Image.docType &&
                            <img
                              src={left_image}
                              style={{ maxWidth: '80px', maxHeight: '60px' }}
                            />
                          }
                          <div className="oe-multidesc-form-list-imagebox-item__item__mask">
                            <button type="button" className="oe-multidesc-form-list-imagebox-item__item__mask__close" onClick={() => onDeleteAsset('leftimage')}>
                              X
                          </button>
                          </div>
                        </div>
                        :
                        <div className="oe-multidesc-form-list-imagebox-item">
                          <p className="oe-multidesc-form-list-imagebox-item-text">
                            Drag & Drop
                          </p>
                        </div>
                      }
                    </div>
                  </div>
                  <span onClick={() => onShowThirdPanel('StockImage')} className="oe-multidesc-form-list-arrowbutton">
                    <FontAwesomeIcon icon={faChevronRight} color="#000" size="2x" />
                  </span>
                </div>
              </div>
              <div className="oe-multidesc-form-list-right">
                <p>
                  Right.
                </p>
                <div className="oe-multidesc-form-list-right-content">
                  <div className="oe-multidesc-form-list-right-content-inputgroup">
                    <div className="oe-multidesc-form-list-right-content-inputgroup-input">
                      <p>
                        Title:
                      </p>
                      <Input
                        value={right_title}
                        placeholder="Enter Display Text"
                        onChange={e => update(index, 'right_title', e.target.value)}
                        style={{ width: '400px' }}
                      />
                    </div>
                    <div className="oe-multidesc-form-list-right-content-inputgroup-input">
                      <p>
                        Desc:
                      </p>
                      <Input
                        value={right_desc}
                        placeholder="Enter Display Text"
                        onChange={e => update(index, 'right_desc', e.target.value)}
                        style={{ width: '400px' }}
                      />
                    </div>
                  </div>
                  <div className="oe-multidesc-form-list-imagebox-itemgroup">
                    <div className="oe-multidesc-form-list-imagebox-item"
                      onDragOver={e => {
                        e.preventDefault()
                      }}
                      onDrop={ev => onDrop(ev, panelDocType, 'right_image', index)}>
                      {right_image ?
                        <div className="oe-multidesc-form-list-imagebox-item__item">
                          {panelDocType === constants.organizer.Image.docType &&
                            <img
                              src={right_image}
                              style={{ maxWidth: '80px', maxHeight: '60px' }}
                            />
                          }
                          <div className="oe-multidesc-form-list-imagebox-item__item__mask">
                            <button type="button" className="oe-multidesc-form-list-imagebox-item__item__mask__close" onClick={() => onDeleteAsset('rightimage')}>
                              X
                          </button>
                          </div>
                        </div>
                        :
                        <div className="oe-multidesc-form-list-imagebox-item">
                          <p className="oe-multidesc-form-list-imagebox-item-text">
                            Drag & Drop
                          </p>
                        </div>
                      }
                    </div>
                  </div>
                  <span onClick={() => onShowThirdPanel('StockImage')} className="oe-multidesc-form-list-arrowbutton">
                    <FontAwesomeIcon icon={faChevronRight} color="#000" size="2x" />
                  </span>
                </div>
              </div>
            </>
          )
        })}
      </div>

      <div style={{ marginTop: '30px' }}>
        <Row gutter={16} style={{ display: 'flex', justifyContent: 'center' }}>
          <Col span={12}>
            <Button type="dashed" onClick={add} style={{ width: '100%' }}>
              <Icon type="plus" /> Add another
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default MultiDescForm
