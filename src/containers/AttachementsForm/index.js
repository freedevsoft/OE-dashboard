import React, { useState } from 'react'
import { Form, Row, Col, Button, TimePicker, Upload, Input, Icon, Spin } from 'antd'
import { getDepthValue, inlineStyle } from 'utils'
import { groupingQuery } from 'utils/queries'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faTrashAlt, faPaperclip } from '@fortawesome/free-solid-svg-icons'
import { useQuery } from '@apollo/react-hooks'
import { uploadFileToS3 } from 'utils/index'
import { graphql, withApollo } from 'react-apollo'
import * as compose from 'lodash.flowright'
import * as mutations from 'utils/mutations'
import * as queries from 'utils/queries'
import moment from 'moment'
import OZInput from 'components/FormItems/OZInput'
import './index.scss'
const { Dragger } = Upload
const AttachementsForm = ({
  data,
  form: { getFieldDecorator, getFieldValue, setFieldsValue },
  field,
  initialValue = {
    list: [],
  },
  groupIds,
  onDrop,
  onAddAsset,
  addToUploadedFolder,
  panelDocType,
  dataMutation,
  onShowThirdPanel
}) => {
  const [loadingSpin, setLoadingSpin] = useState(false)
  const register = key => {
    getFieldDecorator(`${field}.${key}`, { initialValue: getDepthValue(data, key, initialValue[key]) })
  }

  register('list')

  const list = getFieldValue(`${field}.list`)

  const { loading, error, data: groupingQueryData } = useQuery(groupingQuery, {
    variables: {
      ids: list?.map(item => item.groupId),
    },
  })

  const update = (index, key, value) => {
    setFieldsValue({
      [`${field}.list`]: [...list.slice(0, index), { ...list[index], [key]: value }, ...list.slice(index + 1)],
    })
  }

  const remove = index => {
    setFieldsValue({ [`${field}.list`]: [...list.slice(0, index), ...list.slice(index + 1)] })
  }


  const addToResourceCollection = (url, filename) => {
    return new Promise(async (resolve, reject) => {
      // const { dataMutation } = props
      console.log('datamutaion-----------', dataMutation)
      console.log('url-----------', url)
      console.log('filename-----------', filename)
      let collectionName = null
      let type = null
      try {
        const result = await dataMutation({
          variables: {
            collectionName,
            name: filename,
            type,
            data: {
              url,
            },
          },
          update: (proxy, { data: { upsertData } }) => {
            try {
              const data = proxy.readQuery({
                query: queries.dataQuery,
                variables: {
                  collectionName,
                  types: [type],
                },
              })

              data.data.push(upsertData)

              proxy.writeQuery({
                query: queries.dataQuery,
                variables: {
                  collectionName,
                  types: [type],
                },
                data,
              })
            } catch (error) {
              console.error(error)
            }
          },
        })
        resolve(result)
      } catch (e) {
        reject(e)
      }
    })
  }

  const onDagger = info => {
    // const { status, name: filename } = info.file
    // if (status !== 'uploading') {
    //   setLoadingSpin(true);
    //   uploadFileToS3(info.file)
    //     .then(url => {
    //       // onAddAsset(url)
    //       return addToResourceCollection(url, filename)
    //     })
    //     .then(() => {
    //       addToUploadedFolder(panelDocType, null)
    //       setLoadingSpin(false)
    //     })
    //     .catch(err => {
    //       console.log(err)
    //       setLoadingSpin(false)
    //     })
    // }
  }


  return (
    <div className="oe-attachements-form">
      <div className="oe-attachements-form-buttongroup">
        <span onClick={() => onShowThirdPanel(panelDocType)} className="oe-attachements-form-buttongroup-endbutton">
          <FontAwesomeIcon icon={faPaperclip} />
        </span>
      </div>
      {list?.map((item, index) => {
        const { checked, name, text, groupId } = item
        const group = groupingQueryData?.grouping?.find(group => group._id === groupId)
        const daggerProps = {
          name: 'file',
          multiple: false,
          onChange: onDagger,
          showUploadList: false,
        }
        return (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <span
              className="dynamic-delete-button"
              style={{ fontSize: '24px', marginLeft: '10px', marginRight: '10px' }}
              onClick={() => remove(index)}
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </span>
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '30%', alignSelf: 'center' }}>
                  <Input
                    value={name}
                    onChange={e => update(index, 'name', e.target.value)}
                    placeholder='Enter a name'
                    style={{ marginLeft: '10px' }}
                  />
                </div>
                <div className="oe-attachements-form-upload">
                  <div className="oe-attachements-form-list">
                    <div
                      className="oe-attachements-form-list-panel"
                      onDragOver={e => {
                        e.preventDefault()
                      }}
                      onDrop={() => { }}
                    >
                      {loading && (
                        <div
                          style={{
                            position: 'absolute',
                            height: '100%',
                            width: '100%',
                            zIndex: '3',
                            backgroundColor: 'rgba(0, 0, 0, 0.4)',
                          }}
                        >
                          <Spin tip="Loading..." id="LayoutCreatorSpin" />
                        </div>
                      )}

                      <Dragger {...daggerProps}>
                        <p className="ant-upload-text">
                          Upload&nbsp;
                        </p>
                      </Dragger>
                    </div>
                  </div>
                  {/* <Dragger {...daggerProps}>
                    <p className="ant-upload-text">
                      Upload&nbsp;
                    </p>
                  </Dragger> */}
                </div>
              </div>
            </div>
            <span
              className="dynamic-delete-button"
              style={{ fontSize: '24px', marginLeft: '10px', marginRight: '10px' }}
              onClick={() => remove(index)}
            >
              <FontAwesomeIcon icon={faDownload} />
            </span>
          </div>
        )
      })}
      <Row gutter={16}>
        <Col span={8} offset={2}>
          <Button
            type="dashed"
            onClick={() => {
              setFieldsValue({ [`${field}.list`]: [...list, { datetime: moment.utc().format(), text: '' }] })
            }}
          >
            <Icon type="plus-circle" />
            Add another
          </Button>
        </Col>
      </Row>

    </div>
  )
}
export default compose(graphql(mutations.dataMutation, { name: 'dataMutation' }), withApollo)(AttachementsForm)
