import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Button, Form, Tabs, Radio, Modal } from 'antd'

import GrayPanel from 'components/GrayPanel/GrayPanel'
import ControlBtnsGroup from 'components/ControlBtnsGroup/ControlBtnsGroup'
import ControlButton from 'components/ControlButton/ControlButton'
import OZInput from 'components/FormItems/OZInput'
import OZRadioGroup from 'components/FormItems/OZRadioGroup'
import * as constants from 'utils/constants'
import TypesSelect from 'containers/Selects/TypesSelect'
import { getDepthValue, inlineStyle } from 'utils'
import _ from 'lodash'
import { faMapMarkerAlt, faSave, faFont, faPalette, faUpload, faImages, faCalendarAlt, faVideo } from '@fortawesome/free-solid-svg-icons'
import { convertToRaw, ContentState, EditorState } from 'draft-js'
import htmlToDraft from 'html-to-draftjs'
import draftToHtml from 'draftjs-to-html'
import CustomEditor from 'components/CustomEditor/CustomEditor'
import OZWidgets from 'components/FormItems/OZWidgets'
import OZSurveyList from 'components/FormItems/OZSurveyList'
import OZSharedLinks from 'components/FormItems/OZSharedLinks'
import OZWebLinks from 'components/FormItems/OZWebLinks'
import OZTags from 'components/FormItems/OZTags'
import OZSwitch from 'components/FormItems/OZSwitch'
import LocationForm from 'containers/LocationForm'
import ScheduleForm from 'containers/ScheduleForm'
import StyleForm from 'containers/StyleForm'
import DescForm from 'containers/DescForm/index'
import PresentationForm from 'containers/PresentationForm'
import DocumentTypesMenu from 'containers/Selects/DocumentTypesMenu'
import DocumentTypesSelect from 'containers/Selects/DocumentTypesSelect'
import MediaListPanel from 'containers/MediaListPanel'
import StockStreamMenu from 'containers/Selects/StockStreamMenu'
import HTMLEditModal from './Modal/html'
import StreamingForm from './Streaming'
import TrackingChart from './Tracking'

import './form.scss'

const { TabPane } = Tabs

const EnumSelected = {
  Detail: 0,
  Map: 1,
  Schedule: 2,
  Style: 3,
  Images: 4,
  Videos: 5,
}

class MyForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      bShowHeaderModal: false,
      selected: EnumSelected.Detail,
      bShowHTMLEditModal: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    const { currentKey } = this.props
    if (currentKey !== nextProps.currentKey) {
      nextProps.form.resetFields()
    }
  }

  htmltoEditorState = html => {
    const blocksFromHtml = htmlToDraft(html)
    const { contentBlocks, entityMap } = blocksFromHtml
    const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap)
    const editorState = EditorState.createWithContent(contentState)

    return editorState
  }

  changeEdit = (newState, field) => {
    const newBody = draftToHtml(convertToRaw(newState.getCurrentContent()))
    const { form } = this.props
    form.setFieldsValue({ [`article.${field}`]: newBody })
  }

  locationChange = values => {
    const {
      form: { setFieldsValue },
      field,
    } = this.props
    setFieldsValue({ [`${field}.location`]: values })
  }

  showHeaderModal = bShowHeaderModal => {
    this.setState({ bShowHeaderModal })
  }

  render() {
    const {
      style,
      article,
      field,
      form,
      onSaveFunc,
      selectedTab,
      onChangeTab,
      shouldReRender,
      setReRender,
      onAddImage,
      onDeleteImage,
      onAddVideo,
      onDeleteVideo,
      onShowThirdPanel,
      addToUploadedFolder,
      onDropMediaFromExist,
      onLoadStreamVideo,
      onExit,
      more,
      header,
      onPublishFunc,
      show,
    } = this.props
    const { getFieldDecorator, getFieldValue, setFieldsValue } = form
    const { bShowHeaderModal, selected, bShowHTMLEditModal } = this.state
    getFieldDecorator(`${field}.data.HTML.htmlType`, {
      initialValue: getDepthValue(article, 'data.HTML.htmlType', 'body'),
    })
    getFieldDecorator(`${field}.data.HTML.title`, {
      initialValue: getDepthValue(article, 'data.HTML.title', ''),
    })
    getFieldDecorator(`${field}.data.HTML.short`, {
      initialValue: getDepthValue(article, 'data.HTML.short', ''),
    })
    getFieldDecorator(`${field}.data.HTML.long`, {
      initialValue: getDepthValue(article, 'data.HTML.long', ''),
    })
    getFieldDecorator(`${field}.data.HTML.body`, {
      initialValue: getDepthValue(article, 'data.HTML.body', ''),
    })
    getFieldDecorator(`${field}.source.name`, {
      initialValue: getDepthValue(article, 'source.name', ''),
    })
    getFieldDecorator(`${field}.source.url`, {
      initialValue: getDepthValue(article, 'source.url', ''),
    })
    getFieldDecorator(`${field}.data.linkType`, {
      initialValue: getDepthValue(article, 'data.linkType', 'Web'),
    })

    getFieldDecorator(`${field}.data.mediaType`, { initialValue: _.get(article, 'data.mediaType') || 'image' })
    getFieldDecorator(`${field}.data.filterType`, { initialValue: _.get(article, 'data.filterType') || 'schedule' })
    getFieldDecorator(`${field}.data.presentationType`, { initialValue: _.get(article, 'data.presentationType') || 'notification' })
    getFieldDecorator(`${field}.imageList`, { initialValue: _.get(article, 'imageList') || [] })
    getFieldDecorator(`${field}.videoList`, { initialValue: _.get(article, 'videoList') || [] })
    getFieldDecorator(`${field}.videoURL`, { initialValue: _.get(article, 'videoURL') || '' })
    getFieldDecorator(`${field}.data.streaming.broadband_url`, { initialValue: _.get(article, 'data.streaming.broadband_url') || '' })

    const styleConfig = _.get(header, 'client.data.appInfo.style')
    const styleMode = (_.get(styleConfig, 'mode') || 'enabled').toLowerCase()

    const commonStyleProps = {
      data: article.style,
      field: `${field}.style`,
      form,
      disabled: styleMode === 'template',
    }
    const commonStreamingProps = {
      data: getDepthValue(article, 'data.streaming', {}),
      field: `${field}.data.streaming`,
      form,
    }

    const radioStyle = {
      display: 'inline-block',
      height: '30px',
      lineHeight: '30px',
      marginTop: '5px',
    }

    const mediaTypeOptions = [
      { value: 'image', label: 'Images' },
      { value: 'audio', label: 'Audio Clips' },
      { value: 'video', label: 'Videos' },
      { value: 'stream', label: 'Streaming' },
    ]
    const filterTypeOptions = [
      { value: 'schedule', label: 'Schedule' },
      { value: 'location', label: 'Location' },
      { value: 'rule', label: 'Rules' },
    ]
    const presentationTypeOptions = [{ value: 'notification', label: 'Notification' }]

    const title = getFieldValue(`${field}.data.HTML.title`)
    const short = getFieldValue(`${field}.data.HTML.short`)
    const long = getFieldValue(`${field}.data.HTML.long`)
    const body = getFieldValue(`${field}.data.HTML.body`)
    const mediaType = getFieldValue(`${field}.data.mediaType`)
    const filterType = getFieldValue(`${field}.data.filterType`)
    const presentationType = getFieldValue(`${field}.data.presentationType`)
    function onLoadTmpl(style) {
      setFieldsValue({ article: { style } })
    }

    const barProps = {
      style: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#242D3C',
      },
      hlcolor: '#FFD25B',
      bgcolor: '#242D3C',
      fgcolor: 'white',
    }

    return (
      <GrayPanel title="Article" {...style} {...more} show={show}>
        <ControlBtnsGroup {...barProps}>
          {/* <ControlButton Icon={faCaretLeft} onClick={onExit} /> */}
          <ControlButton Icon={faFont} toggled={selected === EnumSelected.Detail} onClick={() => this.setState({ selected: EnumSelected.Detail })} />
          <ControlButton
            Icon={faMapMarkerAlt}
            toggled={selected === EnumSelected.Map}
            onClick={() => this.setState({ selected: EnumSelected.Map })}
          />
          <ControlButton
            Icon={faCalendarAlt}
            toggled={selected === EnumSelected.Schedule}
            onClick={() => this.setState({ selected: EnumSelected.Schedule })}
          />
          {styleMode !== 'removed' && (
            <ControlButton
              Icon={faPalette}
              disabled={styleMode === 'disabled'}
              toggled={selected === EnumSelected.Style}
              onClick={() => this.setState({ selected: EnumSelected.Style })}
            />
          )}
          <ControlButton
            Icon={faImages}
            toggled={selected === EnumSelected.Images}
            onClick={() => this.setState({ selected: EnumSelected.Images })}
          />
          <ControlButton Icon={faVideo} toggled={selected === EnumSelected.Videos} onClick={() => this.setState({ selected: EnumSelected.Videos })} />
          <ControlButton Icon={faUpload} wrapperStyle={{ marginLeft: 'auto' }} onClick={onPublishFunc} />

          <ControlButton Icon={faSave} onClick={e => onSaveFunc(e, form)} />
        </ControlBtnsGroup>
        <Modal
          visible={bShowHeaderModal}
          title="Article Information"
          onCancel={() => this.showHeaderModal(false)}
          width={600}
          footer={[
            <Button key="submit" type="primary" onClick={() => this.showHeaderModal(false)}>
              OK
            </Button>,
          ]}
        >
          <Form.Item label="ID" {...inlineStyle}>
            {article._id}
          </Form.Item>
          <OZInput
            label="Name"
            field={`${field}.name`}
            initialValue={getDepthValue(article, 'name')}
            getFieldDecorator={getFieldDecorator}
            {...inlineStyle}
            autoFocus
            required
          />
        </Modal>
        <Form className="article-form">
          {selected === EnumSelected.Detail && (
            <>
              <DescForm data={_.get(article, 'data.desc')} field={`${field}.data.desc`} form={form} />
              <Form.Item label="Details" {...inlineStyle} style={{ fontWeight: 'bold', marginBottom: '0' }}>
                <Button type="default" icon="edit" onClick={() => this.setState({ bShowHTMLEditModal: true })} />
              </Form.Item>
              <div className="html-preview" dangerouslySetInnerHTML={{ __html: body }} />
              {bShowHTMLEditModal && (
                <HTMLEditModal
                  visible={bShowHTMLEditModal}
                  onCancel={() => this.setState({ bShowHTMLEditModal: false })}
                  data={body}
                  onUpdate={newBody => {
                    console.log(newBody)
                    setFieldsValue({ [`${field}.data.HTML.body`]: newBody })
                    this.setState({ bShowHTMLEditModal: false })
                  }}
                />
              )}
            </>
          )}
          {selected === EnumSelected.Map && (
            <LocationForm
              data={article.location}
              field={`${field}.location`}
              form={form}
              onShowThirdPanel={onShowThirdPanel}
              header={header}
              config={_.get(header, 'client.data.appInfo.location')}
            />
          )}
          {selected === EnumSelected.Schedule && (
            <ScheduleForm data={article.schedule} field={`${field}.schedule`} form={form} config={_.get(header, 'client.data.appInfo.schedule')} />
          )}
          {selected === EnumSelected.Style && (
            <>
              <DocumentTypesMenu
                collectionName="StylesData"
                type="article"
                iconType="download"
                label="Load from Style Templates"
                style={{ margin: '0px 0px 10px 30px', width: '300px' }}
                onChange={onLoadTmpl}
              />
              <StyleForm {...commonStyleProps} />
            </>
          )}
          {selected === EnumSelected.Images && (
            <MediaListPanel
              assets={getFieldValue(`${field}.imageList`) || []}
              onAddAsset={onAddImage}
              onDeleteAsset={onDeleteImage}
              panelDocType={constants.organizer.Image.docType}
              onShowThirdPanel={onShowThirdPanel}
              addToUploadedFolder={() => {}}
              onDrop={onDropMediaFromExist}
            />
          )}
          {selected === EnumSelected.Videos && (
            <div className="tab-video">
              <Form.Item label="Stock Videos:">
                <MediaListPanel
                  assets={getFieldValue(`${field}.videoList`) || []}
                  onAddAsset={onAddVideo}
                  onDeleteAsset={onDeleteVideo}
                  panelDocType={constants.organizer.Video.docType}
                  onShowThirdPanel={onShowThirdPanel}
                  addToUploadedFolder={() => {}}
                  onDrop={onDropMediaFromExist}
                />
              </Form.Item>
              <OZInput
                label="External Video:"
                field={`${field}.videoURL`}
                initialValue={getDepthValue(article, 'videoURL', '')}
                getFieldDecorator={getFieldDecorator}
              />
              <Form.Item label="Video Stream:">
                <StockStreamMenu
                  collectionName="VideoData"
                  type="Stock"
                  iconType="download"
                  label="Load from Stock Video Streams"
                  style={{ width: '100%' }}
                  extract="videoFileOutput"
                  onChange={onLoadStreamVideo}
                />
                <OZInput
                  field={`${field}.data.streaming.broadband_url`}
                  initialValue={getDepthValue(article, 'data.streaming.broadband_url', '')}
                  getFieldDecorator={getFieldDecorator}
                  style={{ width: '100%', marginBottom: '0' }}
                />
              </Form.Item>
            </div>
          )}
          {/* <Tabs activeKey={selectedTab} onChange={onChangeTab}>
            <TabPane tab="Details" key="1">
              <DescForm data={_.get(article, 'data.desc')} field={`${field}.data.desc`} form={form} />
            </TabPane>
            <TabPane tab="Media" key="2">
              <Form.Item style={{ borderBottom: '1px solid gainsboro', paddingBottom: '15px' }}>
                {getFieldDecorator(`${field}.data.mediaType`, {
                  initialValue: _.get(article, 'data.mediaType') || 'image',
                })(
                  <Radio.Group style={{ marginLeft: '10px' }}>
                    {mediaTypeOptions.map((option) => (
                      <Radio style={radioStyle} value={option.value} key={option.value}>
                        {option.label}
                      </Radio>
                    ))}
                  </Radio.Group>,
                )}
              </Form.Item>
              {mediaType === 'image' && (
                <MediaListPanel
                  assets={article.imageList}
                  onAddAsset={onAddImage}
                  onDeleteAsset={onDeleteImage}
                  panelDocType={constants.organizer.Image.docType}
                  onShowThirdPanel={onShowThirdPanel}
                  addToUploadedFolder={addToUploadedFolder}
                  onDrop={onDropMediaFromExist}
                />
              )}
              {mediaType === 'video' && (
                <MediaListPanel
                  assets={article.videoList}
                  onAddAsset={onAddVideo}
                  onDeleteAsset={onDeleteVideo}
                  panelDocType={constants.organizer.Video.docType}
                  onShowThirdPanel={onShowThirdPanel}
                  addToUploadedFolder={addToUploadedFolder}
                  onDrop={onDropMediaFromExist}
                />
              )}
              {mediaType === 'stream' && <StreamingForm {...commonStreamingProps} />}
            </TabPane>
            <TabPane tab="Filters" key="3">
              <Form.Item style={{ borderBottom: '1px solid gainsboro', paddingBottom: '15px' }}>
                {getFieldDecorator(`${field}.data.filterType`, {
                  initialValue: _.get(article, 'data.filterType') || 'schedule',
                })(
                  <Radio.Group style={{ marginLeft: '10px' }}>
                    {filterTypeOptions.map((option) => (
                      <Radio style={radioStyle} value={option.value} key={option.value}>
                        {option.label}
                      </Radio>
                    ))}
                  </Radio.Group>,
                )}
              </Form.Item>
              {filterType === 'schedule' && <ScheduleForm data={article.schedule} field={`${field}.schedule`} form={form} />}
              {filterType === 'location' && <LocationForm data={article.location} field={`${field}.location`} form={form} />}
              {filterType === 'rule' && (
                <Form.Item>
                  <OZSwitch
                    field="comp.data.bRule"
                    initialValue={_.get(article, 'data.bRule') || false}
                    getFieldDecorator={getFieldDecorator}
                    style={{ display: 'inline-block', marginRight: '1rem' }}
                  />
                  {getFieldValue('comp.data.bRule') &&
                    getFieldDecorator('comp.data.activeFilterId', { initialValue: _.get(article, 'data.activeFilterId') })(
                      <DocumentTypesSelect style={{ width: '300px' }} collectionName="ActiveFiltersData" type="group-filter" />,
                    )}
                </Form.Item>
              )}
            </TabPane>
            <TabPane tab="HTML" key="4">
              <OZRadioGroup
                label=""
                field={`${field}.data.HTML.htmlType`}
                initialValue={_.get(article, 'data.HTML.htmlType') || 'body'}
                getFieldDecorator={getFieldDecorator}
                combines={[
                  { label: 'Title/Short/Long', value: 'mixed' },
                  { label: 'Body', value: 'body' },
                ]}
                required={false}
              />
              {getFieldValue(`${field}.data.HTML.htmlType`) === 'mixed' && (
                <>
                  <div style={{ fontSize: '14px', margin: '10px 0px' }}>Title:</div>
                  <CustomEditor
                    style={{ height: '200px' }}
                    editorState={this.htmltoEditorState(title)}
                    changeEditorState={(newState) => this.changeEdit(newState, 'data.HTML.title')}
                    shouldReRender={shouldReRender.title}
                    setReRender={(e) => setReRender(e, 'title')}
                  />
                  <div style={{ fontSize: '14px', margin: '10px 0px' }}>Short Description:</div>
                  <CustomEditor
                    style={{ height: '200px' }}
                    editorState={this.htmltoEditorState(short)}
                    changeEditorState={(newState) => this.changeEdit(newState, 'data.HTML.short')}
                    shouldReRender={shouldReRender.short}
                    setReRender={(e) => setReRender(e, 'short')}
                  />

                  <div style={{ fontSize: '14px', margin: '10px 0px' }}>Long Description:</div>
                  <CustomEditor
                    style={{ height: '200px' }}
                    editorState={this.htmltoEditorState(long)}
                    changeEditorState={(newState) => this.changeEdit(newState, 'data.HTML.long')}
                    shouldReRender={shouldReRender.long}
                    setReRender={(e) => setReRender(e, 'long')}
                  />
                </>
              )}
              {getFieldValue(`${field}.data.HTML.htmlType`) === 'body' && (
                <>
                  <div style={{ fontSize: '14px', margin: '10px 0px' }}>Body:</div>
                  <CustomEditor
                    style={{ height: 'calc(100% - 100px)' }}
                    editorState={this.htmltoEditorState(body)}
                    changeEditorState={(newState) => this.changeEdit(newState, 'data.HTML.body')}
                    shouldReRender={shouldReRender.body}
                    setReRender={(e) => setReRender(e, 'body')}
                  />
                </>
              )}
            </TabPane>
            <TabPane tab="Style" key="5">
              <DocumentTypesMenu
                collectionName="StylesData"
                type="article"
                iconType="download"
                label="Load from Style Templates"
                style={{ margin: '0px 0px 10px 30px', width: '300px' }}
                onChange={onLoadTmpl}
              />
              <StyleForm {...commonStyleProps} />
            </TabPane>
            <TabPane tab="Tracking" key="6">
              <TrackingChart article={article} />
            </TabPane>
            <TabPane tab="Presentation" key="7">
              <Form.Item>
                {getFieldDecorator(`${field}.data.presentationType`, {
                  initialValue: _.get(article, 'data.presentationType') || 'notification',
                })(
                  <Radio.Group style={{ marginLeft: '10px' }}>
                    {presentationTypeOptions.map((option) => (
                      <Radio style={radioStyle} value={option.value} key={option.value}>
                        {option.label}
                      </Radio>
                    ))}
                  </Radio.Group>,
                )}
                {presentationType === 'notification' && <PresentationForm field={`${field}.presentationMode`} data={getDepthValue(article, 'presentationMode', {})} form={form} />}
              </Form.Item>
            </TabPane>
            <TabPane tab="Links" key="8">
              <OZRadioGroup
                label=""
                field={`${field}.data.linkType`}
                initialValue={getDepthValue(article, 'data.linkType')}
                getFieldDecorator={getFieldDecorator}
                combines={[
                  { label: 'Web', value: 'Web' },
                  { label: 'Widget', value: 'Widget' },
                  { label: 'Share', value: 'Share' },
                  { label: 'Survey', value: 'Survey' },
                  { label: 'Tags', value: 'Tags' },
                  { label: 'Source', value: 'Source' },
                ]}
                required={false}
              />
              {getFieldValue(`${field}.data.linkType`) === 'Web' && (
                <OZWebLinks
                  getFieldDecorator={getFieldDecorator}
                  getFieldValue={getFieldValue}
                  setFieldsValue={setFieldsValue}
                  initialValue={getDepthValue(article, 'data.webLinks', [
                    {
                      name: null,
                      iconURL: null,
                      label: null,
                      url: null,
                      token: null,
                    },
                  ])}
                  arrayField={`${field}.data.webLinks`}
                  keysField={`${field}.data.copy.webLinks`}
                />
              )}
              {getFieldValue(`${field}.data.linkType`) === 'Widget' && (
                <OZWidgets
                  form={form}
                  initialValue={
                    _.get(article, 'widgets') || [
                      {
                        name: 'Widget',
                        data: {
                          ref: null,
                          value: null,
                          location: {},
                        },
                      },
                    ]
                  }
                  arrayField={`${field}.widgets`}
                  keysField={`${field}.copy.widgets`}
                />
              )}
              {getFieldValue(`${field}.data.linkType`) === 'Share' && (
                <OZSharedLinks
                  getFieldDecorator={getFieldDecorator}
                  getFieldValue={getFieldValue}
                  setFieldsValue={setFieldsValue}
                  initialValue={getDepthValue(article, 'data.sharedLinks', [
                    {
                      name: null,
                      iconURL: null,
                      label: null,
                      url: null,
                      token: null,
                    },
                  ])}
                  arrayField={`${field}.data.sharedLinks`}
                  keysField={`${field}.data.copy.sharedLinks`}
                />
              )}
              {getFieldValue(`${field}.data.linkType`) === 'Survey' && (
                <OZSurveyList
                  getFieldDecorator={getFieldDecorator}
                  getFieldValue={getFieldValue}
                  setFieldsValue={setFieldsValue}
                  initialValue={getDepthValue(article, 'data.surveyList', [
                    {
                      name: null,
                      desc: null,
                    },
                  ])}
                  arrayField={`${field}.data.surveyList`}
                  keysField={`${field}.data.copy.surveyList`}
                />
              )}
              {getFieldValue(`${field}.data.linkType`) === 'Tags' && (
                <OZTags
                  getFieldDecorator={getFieldDecorator}
                  getFieldValue={getFieldValue}
                  setFieldsValue={setFieldsValue}
                  initialValue={getDepthValue(article, 'data.tags', [
                    {
                      value: null,
                    },
                  ])}
                  arrayField={`${field}.data.tags`}
                  keysField={`${field}.data.copy.tags`}
                />
              )}
              {getFieldValue(`${field}.data.linkType`) === 'Source' && (
                <>
                  <Form.Item label="Logo:">
                    {getFieldDecorator(`${field}.source.url`, { initialValue: _.get(article, 'source.url') })(<TypesSelect collectionName="ImagesData" type="Logo" style={{ width: '250px' }} />)}
                  </Form.Item>

                  <OZInput label="Name:" field={`${field}.source.name`} initialValue={_.get(article, 'source.name')} getFieldDecorator={getFieldDecorator} required={false} />
                </>
              )}
            </TabPane>
          </Tabs> */}
        </Form>
      </GrayPanel>
    )
  }
}
MyForm.propTypes = {
  style: PropTypes.object,
}

MyForm.defaultProps = {
  style: {
    bgcolor: 'white',
    fgcolor: 'black',
  },
}
const ArticleForm = Form.create()(MyForm)
export default ArticleForm
