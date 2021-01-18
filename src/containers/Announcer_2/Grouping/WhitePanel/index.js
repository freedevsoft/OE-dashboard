import React, { useEffect, useState } from 'react'
import { withApollo } from 'react-apollo'
import PropTypes from 'prop-types'
import moment from 'moment'
import { DatePicker, TimePicker, Button, Form, Select, Modal, notification, Radio } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLock,
  faBars,
  faImages,
  faSave,
  faCog,
  faMapMarkerAlt,
  faCalendarAlt,
  faFont,
  faHistory,
  faClipboardCheck,
  faPalette,
  faLink,
  faVideo,
  faAddressCard,
  faInfoCircle,
  faUpload,
  faFilm,
  faBell,
  faUsers,
  faEnvelope,
  faAsterisk,
  faComments,
  faPuzzlePiece,
  faSwatchbook,
  faRocket,
  faTable,
  faBullhorn,
  faEye,
  faListUl,
  faEllipsisV,
  faMousePointer,
  faFilter,
  faPaperclip,
  faHourglassHalf,
  faQuestionCircle,
  faCaretSquareDown,
  faTv,
  faTh,
  faBriefcase,
  faLayerGroup,
  faRulerCombined,
  faCommentDots,
  faExternalLinkSquareAlt,
  faStream,
  faStop,
  faThLarge,
  faTags,
  faChartBar,
  faCode,
  faIdCardAlt,
  faBuilding,
  faBroadcastTower,
  faPaperPlane,
  faShareAlt
} from '@fortawesome/free-solid-svg-icons'
import ControlButton from 'components/ControlButton/ControlButton'
import GrayPanel from 'components/GrayPanel/GrayPanel'
import ControlBtnsGroup from 'components/ControlBtnsGroup/ControlBtnsGroup'
import OZInput from 'components/FormItems/OZInput'
import OZInputNumber from 'components/FormItems/OZInputNumber'
import PresentationForm from 'containers/PresentationForm'
import TypesSelect from 'containers/Selects/TypesSelect'
import StyleForm from 'containers/StyleForm'
import PalettesForm from 'containers/PalettesForm'
import ConfigForm from 'containers/ConfigForm'
import ShowfieldForm from 'containers/ShowfieldForm'
import ScheduleForm from 'containers/ScheduleForm'
import LocationForm from 'containers/LocationForm'
import OZWidgets from 'components/FormItems/OZWidgets'
import DescForm from 'containers/DescForm'
import MailForm from 'containers/MailForm'
import LinkActionForm from 'containers/LinkActionForm'
import SourceForm from 'containers/SourceForm'
import PublishForm from 'containers/PublishForm'
import CopyForm from 'containers/CopyForm'
import DocumentTypesMenu from 'containers/Selects/DocumentTypesMenu'
import OZLinks from 'components/FormItems/OZLinks'
import OZSurveyList from 'components/FormItems/OZSurveyList'
import OZSharedLinks from 'components/FormItems/OZSharedLinks'
import OZFeeds from 'components/FormItems/OZFeeds'
import StockStreamMenu from 'containers/Selects/StockStreamMenu'
import DataDocuments from 'containers/MediaCollection/DataDocuments'
import StreamDocuments from 'containers/MediaCollection/StreamDocuments'
import ContactForm from 'containers/ContactForm'
import DeviceForm from 'containers/DeviceForm'
import ReminderForm from 'containers/ReminderForm'
import AttachementsForm from 'containers/AttachementsForm'
import WidgetForm from 'containers/WidgetForm'
import InstructionForm from 'containers/InstructionForm'
import TrackForm from 'containers/TrackForm'
import ChecklistForm from 'containers/ChecklistForm'
import StreamForm from 'containers/StreamForm'
import QuizForm from 'containers/QuizForm'
import OZWebLinks from 'components/FormItems/OZWebLinks'
import SocialForm from 'containers/SocialForm'
import TransmissionForm from 'containers/TransmissionForm'
import GroupTypeList from 'containers/GroupTypeList'
import FunctionForm from 'containers/FunctionForm'
import CommentsForm from 'containers/CommentsForm'
import SMSListForm from 'containers/SMSListForm'
import GroupListForm from 'containers/GroupListForm'
import DocumentListForm from 'containers/DocumentListForm'
import EmailListForm from 'containers/EmailListForm'
import PluginForm from 'containers/PluginForm'
import SetForm from 'containers/SetForm'
import SmsForm from 'containers/SmsForm'
import ActionsForm from 'containers/ActionsForm'
import WorkflowForm from 'containers/WorkflowForm'
import MenuForm from 'containers/MenuForm'
import MultiDescForm from 'containers/MultiDescForm'
import _ from 'lodash'
import parse from 'html-react-parser'
import { getDepthValue, inlineStyle, API_REST_URL } from 'utils/index'
import MediaListPanel from 'containers/MediaListPanel'
import StreamListPanel from 'containers/StreamListPanel'
import SingleLayerForm from 'containers/SingleLayerForm'
import RocketForm from 'containers/RocketForm'
import RocketDocumentForm from 'containers/RocketDocumentForm'
import OffsetForm from 'containers/OffsetForm'
import AssigneeForm from 'containers/AssigneeForm'
import TreeFilterForm from 'containers/TreeFilterForm'
import OZSelectItem from 'components/FormItems/OZSelectItem/index'
import HTMLEditModal from 'containers/Assets/Edit/Article/Modal/html'
import * as constants from 'utils/constants'
import * as queries from 'utils/queries'
import * as mutations from 'utils/mutations'
import { useMutation } from '@apollo/react-hooks'
import OZCheckbox from 'components/FormItems/OZCheckbox'
import axios from 'axios'
import GroupLayout from './Layout'
import GroupComponent from './Component'
import Private from './Private'
import GroupingSettingsFormModalInnerMajorMinor from '../../DataDocuments/AppInfoFormModal/Inner/majorminor'

import './index.scss'
import AttachmentDocuments from 'containers/MediaCollection/AttachmentDocuments'

const openNotificationWithIcon = (type, message, description) => {
  notification[type]({
    message,
    description,
    placement: 'bottomRight',
  })
}

const EnumSelected = {
  Detail: 0,
  Map: 1,
  Schedule: 2,
  Style: 3,
  Images: 4,
  Videos: 5,
  Links: 6,
  Contact: 7,
  Instruction: 8,
  Track: 9,
  Checklist: 10,
  Stream: 11,
  Permission: 12,
  Social: 13,
  Reminder: 14,
  Comment: 15,
  Mail: 16,
  Source: 17,
  Widget: 18,
  Filter: 19,
  LayerMenu: 20,
  LayerTable: 21,
  LayerNotification: 22,
  Palettes: 23,
  Eye: 24,
  SMSEmail: 25,
  Config: 26,
  Quiz: 27,
  List: 28,
  Actions: 29,
  Offset: 30,
  Attachements: 32,
  Menu: 33,
  Device: 34,
  TreeFilter: 35,
  Set: 36,
  Workflow: 37,
  Sms: 38,
  Tags: 39,
  ClientsData: 40,
  Transmission: 41,
  Users: 42,
}

const EnumIcons = {
  Detail: faFont,
  Map: faMapMarkerAlt,
  Schedule: faCalendarAlt,
  Style: faPalette,
  Images: faImages,
  Videos: faVideo,
  Links: faLink,
  Contact: faAddressCard,
  Users: faUsers,
  Instruction: 8,
  Track: faChartBar,
  Checklist: faClipboardCheck,
  Stream: faFilm,
  Permission: faLock,
  Social: faShareAlt,
  Reminder: faBell,
  Comment: faComments,
  Mail: faEnvelope,
  Source: faAsterisk,
  Widget: faPuzzlePiece,
  Filter: 19,
  LayerMenu: faRocket,
  LayerTable: faTable,
  LayerNotification: faBullhorn,
  Palettes: faSwatchbook,
  Eye: faEye,
  SMSEmail: faListUl,
  Config: 26,
  Quiz: faQuestionCircle,
  List: faEllipsisV,
  Actions: faMousePointer,
  Offset: faHourglassHalf,
  Attachements: faPaperclip,
  Menu: faBars,
  Device: faTv,
  TreeFilter: faFilter,
  Set: faTh,
  Workflow: faBriefcase,
  Sms: faCommentDots,
  Tags: faTags,
  ClientsData: faCode,
  Transmission: faBroadcastTower,
  Send: faPaperPlane,
  Publish: faUpload,
}

const MyForm = ({
  style,
  comp,
  form,
  currentKey,
  onSaveFunc,
  type,
  header,
  width,
  minWidth,
  maxWidth,
  options,
  show = true,
  grouplist,
  selectedGroupIndex,
  selectGroup,
  client,
  groupname,
}) => {
  const [imageType, setImageType] = useState('Default')
  const [attachmentType, setAttachmentType] = useState('Default')
  const [supportDocType, setSupportDocType] = useState(null)
  const [supportIndex, setSupportIndex] = useState(0)
  const [publishing, setPublishing] = useState(false)
  const [copying, setCopying] = useState(false)
  const [streamSupportIndex, setStreamSupportIndex] = useState(0)
  const [rocketOption, setRocketOption] = useState('layers')
  const [linkOption, setLinkOption] = useState('weblink')
  const [contactOption, setContactOption] = useState('first')
  const [descOption, setDescOption] = useState('single')
  const [groupName, setGroupName] = useState(groupname)
  const [createGroupingMuation] = useMutation(mutations.createGroupingMuation)
  const [background, setBackground] = useState(localStorage.getItem('bgcolorcode') || '#242D3C')
  const [foreground, setForeground] = useState(localStorage.getItem('fgcolorcode') || '#FFF')

  const onShowThirdPanel = docType => {
    options.togglePanel(4, true)
    setSupportIndex(0)
    setSupportDocType(docType)
    setImageType('Default')
  }

  const selectedChange = value => {
    setGroupName(grouplist[value].name)
  }

  const onShowStreamPanel = docType => {
    options.togglePanel(6, true)
    setStreamSupportIndex(0)
  }

  const onShowAttachmentPanel = docType => {
    options.togglePanel(8, true)
    setStreamSupportIndex(0)
    setSupportIndex(0)
    setSupportDocType(docType)
    setImageType('Default')
  }

  useEffect(() => {
    form.resetFields()
  }, [currentKey])

  useEffect(() => {
    setGroupName(groupname)
  }, [groupname])

  setInterval(() => {
    if(localStorage.getItem('bgcolorcode'))
    setBackground(localStorage.getItem('bgcolorcode'))
    if(localStorage.getItem('fgcolorcode'))
    setForeground(localStorage.getItem('fgcolorcode'))
  }, 200);

  const [selected, setSelected] = useState(EnumSelected.Detail)
  const [onSelected, setOnSelected] = useState(false)
  const [palette, setPalette] = useState('title')
  const [bShowHeaderModal, showHeaderModal] = useState(false)
  const [bShowPublishModal, showPublishModal] = useState(false)
  const [bShowCopyModal, showCopyModal] = useState(false)
  const [bShowHTMLEditModal, setBShowHTMLEditModal] = useState(false)
  const { getFieldDecorator, getFieldValue, setFieldsValue } = form
  const groupTypes = _.get(header, 'client.data.appInfo.groupType.options')
  getFieldDecorator('comp.data.desc.body', { initialValue: _.get(comp, 'data.desc.body') || '' })
  getFieldDecorator('comp.data.mail.html', { initialValue: _.get(comp, 'data.mail.html') || '' })
  getFieldDecorator('comp.data.email.html', { initialValue: _.get(comp, 'data.email.html') || '' })
  getFieldDecorator('comp.data.detailType', { initialValue: _.get(comp, 'data.detailType') || 'desc' })
  getFieldDecorator('comp.data.filterType', { initialValue: _.get(comp, 'data.filterType') || 'schedule' })
  getFieldDecorator('comp.data.presentationType', { initialValue: _.get(comp, 'data.presentationType') || 'layout' })
  getFieldDecorator('comp.data.permissionType', { initialValue: _.get(comp, 'data.permissionType') || 'function' })

  getFieldDecorator('comp.data.scheduleType', { initialValue: _.get(comp, 'data.scheduleType') || 'availability' })
  getFieldDecorator('comp.data.ArchiveOn', { initialValue: _.get(comp, 'data.ArchiveOn') ? moment.utc(_.get(comp, 'data.ArchiveOn')).format() : moment.utc().format() })
  getFieldDecorator('comp.data.DeleteOn', { initialValue: _.get(comp, 'data.DeleteOn') ? moment.utc(_.get(comp, 'data.DeleteOn')).format() : moment.utc().format() })
  getFieldDecorator('comp.data.PackageOn', { initialValue: _.get(comp, 'data.PackageOn') ? moment.utc(_.get(comp, 'data.PackageOn')).format() : moment.utc().format() })


  getFieldDecorator('comp.data.bRule', { initialValue: _.get(comp, 'data.bRule') || false })
  // getFieldDecorator('comp.data.linkType', { initialValue: _.get(comp, 'data.linkType') || 'Web' })
  getFieldDecorator('comp.data.styleType', { initialValue: _.get(comp, 'data.styleType') || 'Style' })
  getFieldDecorator('comp.data.SMSEmailType', { initialValue: _.get(comp, 'data.SMSEmailType') || 'SMS' })
  getFieldDecorator('comp.data.imageList', { initialValue: _.get(comp, 'data.imageList') || [] })
  getFieldDecorator('comp.data.videoList', { initialValue: _.get(comp, 'data.videoList') || [] })
  getFieldDecorator('comp.data.desc.icon', { initialValue: _.get(comp, 'data.desc.icon') || {} })
  getFieldDecorator('comp.data.desc.logo', { initialValue: _.get(comp, 'data.desc.logo') || {} })
  getFieldDecorator('comp.data.desc.image', { initialValue: _.get(comp, 'data.desc.image') || {} })
  getFieldDecorator('comp.data.multidesc.image', { initialValue: _.get(comp, 'data.multidesc.image') || {} })
  getFieldDecorator('comp.data.contact.avatar', { initialValue: _.get(comp, 'data.contact.avatar') || {} })
  getFieldDecorator('comp.data.contact.logo', { initialValue: _.get(comp, 'data.contact.logo') || {} })
  getFieldDecorator('comp.data.contact.image', { initialValue: _.get(comp, 'data.contact.image') || {} })
  getFieldDecorator('comp.data.organization.avatar', { initialValue: _.get(comp, 'data.organization.avatar') || {} })
  getFieldDecorator('comp.data.organization.logo', { initialValue: _.get(comp, 'data.organization.logo') || {} })
  getFieldDecorator('comp.data.organization.image', { initialValue: _.get(comp, 'data.organization.image') || {} })
  getFieldDecorator('comp.data.streamList', { initialValue: _.get(comp, 'data.streamList') || [] })
  getFieldDecorator('comp.data.videoURL', { initialValue: _.get(comp, 'data.videoURL') || '' })
  getFieldDecorator('comp.data.instruction', { initialValue: _.get(comp, 'data.instruction') || '' })
  getFieldDecorator('comp.data.streaming.broadband_url', { initialValue: _.get(comp, 'data.streaming.broadband_url') || '' })
  getFieldDecorator('comp.data.Canvasbase.width', { initialValue: _.get(comp, 'data.Canvasbase.width') || 1280 })
  getFieldDecorator('comp.data.Canvasbase.height', { initialValue: _.get(comp, 'data.Canvasbase.height') })
  getFieldDecorator('comp.data.ClientsData', { initialValue: _.get(comp, 'data.ClientsData') })
  getFieldDecorator('comp.data.cfg', { initialValue: _.get(comp, 'data.cfg') })

  useEffect(() => {
    options.togglePanel(3, false)
    options.togglePanel(4, false)
    options.togglePanel(5, false)
    options.togglePanel(6, false)
    options.togglePanel(8, false)
  }, [selected])

  const groupIds = grouplist?.map(group => group._id) || []

  const commonPresentationProps = { data: comp.presentationMode, field: 'comp.presentationMode', form }
  const commonStyleProps = { data: comp.style, field: 'comp.style', form }
  const commonPalettesTitleProps = { data: comp?.data?.palettes?.title, field: 'comp.data.palettes.title', form }
  const commonPalettesShortProps = { data: comp?.data?.palettes?.short, field: 'comp.data.palettes.short', form }
  const commonPalettesLongProps = { data: comp?.data?.palettes?.long, field: 'comp.data.palettes.long', form }
  const commonPalettesBodyProps = { data: comp?.data?.palettes?.body, field: 'comp.data.palettes.body', form }
  const commonPalettesMediaProps = { data: comp?.data?.palettes?.media, field: 'comp.data.palettes.media', form }
  const commonPalettesMenuProps = { data: comp?.data?.palettes?.menu, field: 'comp.data.palettes.menu', form }
  const commonPalettesCanvasProps = { data: comp?.data?.palettes?.canvas, field: 'comp.data.palettes.canvas', form }
  const commonPalettesFooterProps = { data: comp?.data?.palettes?.footer, field: 'comp.data.palettes.footer', form }
  const commonConfigProps = { data: comp?.data?.cfg, field: 'comp.data.cfg', form, comp }
  const commonShowfieldProps = { data: comp?.data?.showfield, field: 'comp.data.showfield', form }
  const commonActionsProps = { data: comp?.data?.actions?.list, field: 'comp.data.actions.list', form }
  const commonFunctionProps = { data: comp?.data?.function, field: 'comp.data.function', form }
  const commonDataProps = { data: comp.data, field: 'comp.data', form }
  const commonScheduleProps = { data: comp.schedule, field: 'comp.schedule', form }
  const commonLocationProps = { data: _.get(comp, 'data.location'), field: 'comp.data.location', form, onShowThirdPanel }
  const commonLayerMenuProps = {
    groupName: comp?.name,
    data: comp?.data?.LayoutConfig,
    field: 'comp.data.LayoutConfig',
    form,
    header,
  }
  const commonMenuProps = {
    groupName: comp?.name,
    data: comp?.data?.Menu,
    field: 'comp.data.Menu',
    form,
    header,
  }
  const commonOffsetProps = {
    data: _.get(comp, 'data.offset') || {},
    field: 'comp.data.offset',
    form,
    groupIds,
    grouplist,
  }
  const commonWorkflowProps = {
    data: _.get(comp, 'data.workflow') || {},
    field: 'comp.data.workflow',
    form,
    groupIds,
  }
  const commonDeviceProps = {
    data: _.get(comp, 'data.devices') || {},
    field: 'comp.data.devices',
    form,
    groupTypes,
    groupIds,
    imageassets: getFieldValue('comp.data.devices.imageURL') || [],
    onShowThirdPanel: onShowThirdPanel,
    onDeleteAsset: onDeleteContactImage,
  }
  console.log('comp------------------', comp)
  const commonAttachementsProps = {
    data: _.get(comp, 'data.attachements') || [],
    field: 'comp.data.attachements',
    form,
    onDrop: onDropAttachementsExist,
    addToUploadedFolder: () => { },
    panelDocType: constants.organizer.Attachment.docType,
    groupIds,
  }
  const commonLayerNotificationProps = { data: comp?.data?.LayerNotification, field: 'comp.data.LayerNotification', form, header }
  const commonLayerTableProps = { data: comp?.data?.LayerTable, field: 'comp.data.LayerTable', form, header }
  const commonContactProps = {
    data: _.get(comp, 'data.contact') || {},
    field: 'comp.data.contact',
    form,
    avatarassets: getFieldValue('comp.data.contact.avatar') || {},
    logoassets: getFieldValue('comp.data.contact.logo') || {},
    imageassets: getFieldValue('comp.data.contact.image') || {},
    onShowThirdPanel: onShowThirdPanel,
    onDeleteAsset: onDeleteContactImage,
    panelDocType: constants.organizer.Image.docType,
    onDrop: onDropContactMediaFromExist,
  }

  const commonTransmissionProps = {
    data: _.get(comp, 'data.transmission') || {},
    field: 'comp.data.transmission',
    form,
  }

  const commonOrganizationProps = {
    data: _.get(comp, 'data.organization') || {},
    field: 'comp.data.organization',
    form,
    avatarassets: getFieldValue('comp.data.organization.avatar') || {},
    logoassets: getFieldValue('comp.data.organization.logo') || {},
    imageassets: getFieldValue('comp.data.organization.image') || {},
    onShowThirdPanel: onShowThirdPanel,
    onDeleteAsset: onDeleteOrganizationImage,
    panelDocType: constants.organizer.Image.docType,
    onDrop: onDropOrganizationMediaFromExist,
  }

  const commonSourceProps = { data: _.get(comp, 'data.source') || {}, field: 'comp.data.source', form }
  const commonMailProps = {
    data: _.get(comp, 'data.mail') || {},
    htmldata: getFieldValue('comp.data.mail.html') || '',
    field: 'comp.data.mail',
    form,
    _id: comp?._id,
    collectionName: 'Groupings',
    maillist: comp?.emails,
    onEmailPublish: onEmailPublish,
    header,
  }

  const commonSmsProps = {
    data: _.get(comp, 'data.sms') || {},
    field: 'comp.data.sms',
    form,
    _id: comp?._id,
    collectionName: 'Groupings',
    list: comp?.emails,
    onEmailPublish: onEmailPublish,
    header,
  }

  const commonPermissionProps = {
    data: _.get(header, 'client.data.appInfo.groupType.options') || {},
    initialValue: _.get(comp, 'data.permission') || [],
    arrayField: 'comp.data.permission',
    keysField: 'comp.data.copy.permission',
    form,
  }

  const commonChecklistProps = { data: _.get(comp, 'data.checklist') || {}, field: 'comp.data.checklist', form }
  const commonStreamProps = { data: _.get(comp, 'data.scrolltext') || {}, field: 'comp.data.scrolltext', form }
  const commonQuizProps = { data: _.get(comp, 'data.quiz') || {}, field: 'comp.data.quiz', form, groupIds, onDeleteAsset: onDeleteImage }
  const commonTreeFilterProps = { data: _.get(comp, 'data.criterion') || {}, field: 'comp.data.criterion', form }
  const commonWidgetlistProps = {
    data: _.get(comp, 'data.mainwidget') || {},
    field: 'comp.data.mainwidget',
    form,
    groupTypes,
    header,
    groupIds,
  }
  const commonSetProps = {
    data: _.get(comp, 'data.set') || {},
    field: 'comp.data.set',
    form,
    groupTypes,
    header,
    groupIds,
  }

  const commonAssigneeProps = {
    data: _.get(comp, 'data.desc.assignee') || {},
    field: 'comp.data.desc.assignee',
    form,
    groupTypes,
    header,
    groupIds,
    title: 'Assignee',
  }
  const commonRolesProps = {
    data: _.get(comp, 'data.desc.roles') || {},
    field: 'comp.data.desc.roles',
    form,
    groupTypes,
    header,
    groupIds,
    title: 'Roles',
  }
  const commonGrouplistProps = {
    data: _.get(comp, 'data.groups') || {},
    field: 'comp.data.groups',
    form,
    groupIds,
  }
  const commonDocumentlistProps = {
    data: _.get(comp, 'data.groups') || {},
    field: 'comp.data.groups',
    form,
    groupIds,
  }
  const commonLinkactionlistProps = { data: _.get(comp, 'data.actions') || {}, field: 'comp.data.actions', form, groupTypes, header }
  const commonCommentProps = { _id: comp?._id, collectionName: 'Groupings' }
  const commonSMSListProps = { _id: comp?._id, collectionName: 'Groupings', list: comp?.phoneNumbers }
  const commonEmailListProps = {
    _id: comp?._id,
    collectionName: 'Groupings',
    list: comp?.emails,
    onEmailPublish: onEmailPublish,
  }

  const commonInstructionProps = { data: getFieldValue('comp.data.instruction') || '', setFieldsValue }

  const commonPublishProps = { field: 'publish', form }
  const commonCopyProps = { field: 'copy', form, clientId: _.get(header, 'client._id') }
  const commonClientsDataProps = { data: _.get(comp, 'data.ClientsData'), field: 'comp.data.ClientsData', form }

  const radioStyle = {
    display: 'inline-block',
    height: '30px',
    lineHeight: '30px',
    marginTop: '5px',
  }

  const detailTypeOptions = [
    { value: 'desc', label: 'Description' },
    { value: 'source', label: 'Source' },
    { value: 'tooltip', label: 'Tooltip' },
  ]
  const presentationTypeOptions = [
    { value: 'layout', label: 'Layout' },
    { value: 'component', label: 'Component' },
  ]

  const permissionTypeOptions = [
    { value: 'function', label: 'Function' },
    { value: 'folder', label: 'Folder' },
  ]

  const scheduleTypeOptions = [
    { value: 'availability', label: 'Availability' },
    { value: 'archiveOn', label: 'Archive On' },
    { value: 'deleteOn', label: 'Delete On' },
    { value: 'packageOn', label: 'Package On' },
  ]
  const palettesNameOptions = [
    { value: 'title', label: 'Title' },
    { value: 'short', label: 'Short' },
    { value: 'long', label: 'Long' },
    { value: 'body', label: 'Body' },
    { value: 'media', label: 'Media' },
    { value: 'menu', label: 'Menu' },
    { value: 'canvas', label: 'Canvas' },
    { value: 'footer', label: 'Footer' },
  ]
  if (type === 'Programs') detailTypeOptions.push({ value: 'program-info', label: 'Program Info' })
  const ImageAssets = getFieldValue('comp.data.multidesc.list')
  let leftImageArray = []
  let rightImageArray = []
  ImageAssets?.map((item, index) => {
    leftImageArray.push(item.left_image)
  })
  ImageAssets?.map((item, index) => {
    rightImageArray.push(item.right_image)
  })
  const detailType = getFieldValue('comp.data.detailType')
  const filterType = getFieldValue('comp.data.filterType')
  const presentationType = getFieldValue('comp.data.presentationType')
  const permissionType = getFieldValue('comp.data.permissionType')
  const scheduleType = getFieldValue('comp.data.scheduleType')
  const mediaType = getFieldValue('comp.data.mediaType')
  const imageList = getFieldValue('comp.data.imageList')
  const videoList = getFieldValue('comp.data.videoList')
  const descicon = getFieldValue('comp.data.desc.icon')
  const desclogo = getFieldValue('comp.data.desc.logo')
  const descimage = getFieldValue('comp.data.desc.image')
  const contactavatar = getFieldValue('comp.data.contact.avatar')
  const contactlogo = getFieldValue('comp.data.contact.logo')
  const contactimage = getFieldValue('comp.data.contact.image')
  const organizationavatar = getFieldValue('comp.data.organization.avatar')
  const organizationlogo = getFieldValue('comp.data.organization.logo')
  const organizationimage = getFieldValue('comp.data.organization.image')
  const streamList = getFieldValue('comp.data.streamList')
  const palettesName = getFieldValue('comp.data.palettes.name') || 'title'
  const body = getFieldValue('comp.data.desc.body')

  const cfg = getFieldValue('comp.data.cfg')

  const archiveOn = getFieldValue('comp.data.ArchiveOn')
  const deleteOn = getFieldValue('comp.data.DeleteOn')
  const packageOn = getFieldValue('comp.data.PackageOn')

  function onEmailPublish() {
    const promises = []
    setPublishing(true)
    Promise.all(promises)
      .then(res => {
        openNotificationWithIcon('success', 'Successfully Published!', 'Success')
        console.log(res)
      })
      .catch(err => {
        openNotificationWithIcon('warning', 'Failed to Publish!', 'Failed')
        console.log(err)
      })
      .finally(() => {
        setPublishing(false)
        showPublishModal(false)
      })
  }

  function onLoadTmpl(style) {
    setFieldsValue({ comp: { style } })
  }
  function onAddImage(url) {
    setFieldsValue({ 'comp.data.imageList': [...imageList, { url, name: `Image #${imageList.length}` }] })
  }

  function onAddImageAsset(url) {
    setFieldsValue({ 'comp.data.attach.url': [...attachementsList, { url, name: `${attachementsList.length}` }] })
  }

  function onAddDescImage(url, section) {
    if (section === 'icon') {
      setFieldsValue({ 'comp.data.desc.icon': { url, name: `Imageicon` } })
    } else if (section === 'logo') {
      setFieldsValue({ 'comp.data.desc.logo': { url, name: `Imagelogo` } })
    } else if (section === 'image') {
      setFieldsValue({ 'comp.data.desc.image': { url, name: `Imageimage` } })
    }
  }
  function onAddMultiDescImage(url) {
    setFieldsValue({ 'comp.data.multidesc.left_image': { url, name: `Imageimage` } })
  }

  function onDeleteDescImage(section) {
    if (section == 'icon') {
      setFieldsValue({ 'comp.data.desc.icon': '' })
    } else if (section == 'logo') {
      setFieldsValue({ 'comp.data.desc.logo': '' })
    } else if (section == 'image') {
      setFieldsValue({ 'comp.data.desc.image': '' })
    }
  }

  function onAddContactImage(url, section) {
    if (section === 'avatar') {
      setFieldsValue({ 'comp.data.contact.avatar': { url, name: `Imageavatar` } })
    } else if (section === 'logo') {
      setFieldsValue({ 'comp.data.contact.logo': { url, name: `Imagelogo` } })
    } else if (section === 'image') {
      setFieldsValue({ 'comp.data.contact.image': { url, name: `Imageimage` } })
    }
  }

  function onAddOrganizationImage(url, section) {
    if (section === 'avatar') {
      setFieldsValue({ 'comp.data.organization.avatar': { url, name: `Imageavatar` } })
    } else if (section === 'logo') {
      setFieldsValue({ 'comp.data.organization.logo': { url, name: `Imagelogo` } })
    } else if (section === 'image') {
      setFieldsValue({ 'comp.data.organization.image': { url, name: `Imageimage` } })
    }
  }

  function onDeleteContactImage(section) {
    if (section == 'avatar') {
      setFieldsValue({ 'comp.data.contact.avatar': '' })
    } else if (section == 'logo') {
      setFieldsValue({ 'comp.data.contact.logo': '' })
    } else if (section == 'image') {
      setFieldsValue({ 'comp.data.contact.image': '' })
    }
  }

  function onDeleteOrganizationImage(section) {
    if (section == 'avatar') {
      setFieldsValue({ 'comp.data.organization.avatar': '' })
    } else if (section == 'logo') {
      setFieldsValue({ 'comp.data.organization.logo': '' })
    } else if (section == 'image') {
      setFieldsValue({ 'comp.data.organization.image': '' })
    }
  }

  function onDeleteImage(index) {
    setFieldsValue({ 'comp.data.imageList': [...imageList.slice(0, index), ...imageList.slice(index + 1)] })
  }

  function onAddVideo(url) {
    setFieldsValue({ 'comp.data.videoList': [...videoList, { url, name: `Video #${videoList.length}` }] })
  }

  function onDeleteVideo(index) {
    setFieldsValue({ 'comp.data.videoList': [...videoList.slice(0, index), ...videoList.slice(index + 1)] })
  }

  function onAddStream(url) {
    setFieldsValue({ 'comp.data.streamList': [...streamList, { url, name: `Stream #${streamList.length}` }] })
  }

  function onDeleteStream(index) {
    setFieldsValue({ 'comp.data.streamList': [...streamList.slice(0, index), ...streamList.slice(index + 1)] })
  }

  function onLoadStreamVideo(output) {
    setFieldsValue({ 'comp.data.streaming.broadband_url': output?.hlsFile })
  }

  function onDropMediaFromExist(ev, docType) {
    const resourceUrl = ev.dataTransfer.getData('drag_url')
    const dragDocType = ev.dataTransfer.getData('drag_doc_type')
    if (!resourceUrl || dragDocType !== docType) return
    if (docType === constants.organizer.Image.docType) onAddImage(resourceUrl)
    else if (docType === constants.organizer.Video.docType) onAddVideo(resourceUrl)
  }

  function onDropImageFromExist(ev, docType) {
    const resourceUrl = ev.dataTransfer.getData('drag_url')
    console.log(resourceUrl)
    if (resourceUrl) onAddImage(resourceUrl)
  }

  function onDropVideoFromExist(ev, docType) {
    const resourceUrl = ev.dataTransfer.getData('drag_url')
    if (resourceUrl) onAddVideo(resourceUrl)
  }

  function onDropAttachementsExist(ev, docType) {
    const resourceUrl = ev.dataTransfer.getData('drag_url')
    const dragDocType = ev.dataTransfer.getData('drag_doc_type')
    if (!resourceUrl || dragDocType !== docType) return
    onAddAttachement(resourceUrl)
  }

  function onDropDescMediaFromExist(ev, docType, section) {
    const resourceUrl = ev.dataTransfer.getData('drag_url')
    const dragDocType = ev.dataTransfer.getData('drag_doc_type')
    if (docType === constants.organizer.Image.docType) onAddDescImage(resourceUrl, section)
  }
  function onDropMultiDescMediaFromExist(ev, docType, section) {
    const resourceUrl = ev.dataTransfer.getData('drag_url')
    const dragDocType = ev.dataTransfer.getData('drag_doc_type')
    if (docType === constants.organizer.Image.docType) onAddMultiDescImage(resourceUrl, section)
  }

  function onDropContactMediaFromExist(ev, docType, section) {
    const resourceUrl = ev.dataTransfer.getData('drag_url')
    const dragDocType = ev.dataTransfer.getData('drag_doc_type')
    if (docType === constants.organizer.Image.docType) onAddContactImage(resourceUrl, section)
  }

  function onDropOrganizationMediaFromExist(ev, docType, section) {
    const resourceUrl = ev.dataTransfer.getData('drag_url')
    const dragDocType = ev.dataTransfer.getData('drag_doc_type')
    if (docType === constants.organizer.Image.docType) onAddOrganizationImage(resourceUrl, section)
  }

  function onDropStreamFromExist(ev) {
    const resourceUrl = ev.dataTransfer.getData('drag_url')
    if (!resourceUrl) return
    onAddStream(resourceUrl)
  }
  // schdule change
  function onScheduleChange(date, dateString, field) {
    setFieldsValue({ [`${field}`]: date.utc().format() })
  }

  const onChangeImageType = type => {
    setImageType(type)
  }

  const onChangeAttachmentType = type => {
    setAttachmentType(type)
  }
  const more = {
    width,
    minWidth,
    maxWidth,
    options,
    panelIndex: 1,
  }
  let thirdRender = ''
  if (options.visibles[4]) {
    const commonProps = {
      onSelectFunc: setSupportIndex,
      selectedAppIndex: supportIndex,
      width: options.widths[4],
      options,
      minWidth: options.widthParams[4].min,
      maxWidth: options.widthParams[4].max,
      assets: getFieldValue('comp.data.imageList') || [],
      onDeleteAsset: onDeleteImage,
      onAddMediaToArticle: supportDocType === constants.organizer.Image.docType ? onAddImage : onAddVideo,
      panelIndex: 4,
      parentPanelIndex: 1,
    }

    thirdRender = <DataDocuments key={supportDocType} collectionName={supportDocType === constants.organizer.Image.docType ? "ImagesData" : supportDocType === constants.organizer.Attachment.docType ? "Attachments" : "VideosData"} onChangeImageType={onChangeImageType} type={imageType} {...commonProps} />

  }

  if (options.visibles[6]) {
    const commonProps = {
      onSelectFunc: setStreamSupportIndex,
      selectedAppIndex: streamSupportIndex,
      width: options.widths[6],
      options,
      minWidth: options.widthParams[6].min,
      maxWidth: options.widthParams[6].max,
      assets: getFieldValue('comp.data.streamList') || [],
      onDeleteAsset: onDeleteStream,
      onAddMediaToArticle: onAddStream,
      panelIndex: 6,
      parentPanelIndex: 1,
    }
    thirdRender = <StreamDocuments key={2} header={header} collectionName="StreamsData" {...commonProps} />
  }

  if (options.visibles[8]) {
    const commonProps = {
      onSelectFunc: setSupportIndex,
      selectedAppIndex: supportIndex,
      width: options.widths[8],
      options,
      minWidth: options.widthParams[8].min,
      maxWidth: options.widthParams[8].max,
      assets: getFieldValue('comp.data.imageList') || [],
      onDeleteAsset: onDeleteImage,
      onAddMediaToArticle: supportDocType === constants.organizer.Image.docType ? onAddImage : onAddVideo,
      panelIndex: 8,
      parentPanelIndex: 1,
    }
    thirdRender = <AttachmentDocuments key={supportDocType} collectionName="Attachments" onChangeImageType={onChangeAttachmentType} type={attachmentType} {...commonProps} />
  }

  const onCopy = () => {
    const values = getFieldValue('copy')
    console.log('copy', values)

    const promises = []
    setCopying(true)

    for (let i = 0; i < values?.servers?.length; i += 1) {
      const name = values?.servers[i]
      promises.push(
        createGroupingMuation({
          variables: {
            ...comp,
            _id: undefined,
            type: `/Servers/${name}`,
            schedule: {
              ...(comp.schedule ? comp.schedule : {}),
              __typename: undefined,
              status: undefined,
            },
            availability: comp.availability
              ? {
                ...comp.availability,
                __typename: undefined,
              }
              : undefined,
          },
        }),
      )
    }

    Promise.all(promises)
      .then(() => {
        openNotificationWithIcon('success', 'Successfully Copied!', 'Success')
      })
      .catch(err => {
        openNotificationWithIcon('warning', 'Failed to Copy!', 'Failed')
        console.error(err)
      })
      .finally(() => {
        setCopying(false)
        showCopyModal(false)
      })
  }

  const onPublish = () => {
    const values = getFieldValue('publish')
    console.log('publish', values)
    const promises = []

    setPublishing(true)

    if (values?.socialMedias?.length) {
      const desc = getFieldValue('comp.data.desc')

      promises.push(
        axios.post(`${API_REST_URL}/socialMedia`, {
          twitter: values?.socialMedias?.includes('Twitter') && desc?.twitter ? desc?.twitter : null,
          facebook: values?.socialMedias?.includes('Facebook') && desc?.facebook ? desc?.facebook : null,
          instagram: values?.socialMedias?.includes('Instagram') && desc?.instagram ? desc?.instagram : null,
        }),
      )
    }

    if (values?.lists?.includes('SMS List')) {
      promises.push(
        client.query({
          query: queries.sendMessagesQuery,
          variables: {
            _id: comp?._id,
            message: {
              sms: {
                // text: comp?.data?.desc?.sms,
                text: 'Testing SMS Text',
              },
              email: {
                subject: comp?.data?.desc?.title,
                text: 'email text version',
                html: 'email html version',
              },
            },
          },
          fetchPolicy: 'no-cache',
        }),
      )
    }
    Promise.all(promises)
      .then(res => {
        openNotificationWithIcon('success', 'Successfully Published!', 'Success')
        console.log(res)
      })
      .catch(err => {
        openNotificationWithIcon('warning', 'Failed to Publish!', 'Failed')
        console.log(err)
      })
      .finally(() => {
        setPublishing(false)
        showPublishModal(false)
      })
  }

  const renderBtns = []

  cfg && Object.keys(cfg).forEach(function (key) {
    EnumSelected[key] >= 0 && ((key == 'Send' || key == 'Publish') ? (
      (key == 'Send') ? (
        renderBtns.push(<ControlButton
          Icon={faPaperPlane}
          key={key}
          tooltip="Send"
          placement="bottom"
          onClick={() => showPublishModal(true)}
        />)
      ) : (
          renderBtns.push(<ControlButton
            Icon={faUpload}
            key={key}
            tooltip="Publish"
            placement="bottom"
            onClick={() => showCopyModal(true)}
          />)
        )
    ) : (
        renderBtns.push(<ControlButton
          Icon={EnumIcons[key]}
          tooltip={cfg[key]}
          key={key}
          placement="right"
          toggled={selected === EnumSelected[key]}
          onClick={() => setSelected(EnumSelected[key])}
        />)
      )

    )
  })

  return (
    <>
      <GrayPanel title="Grouping Settings" bgcolor={background}
        fgcolor={foreground} {...style} override={false} {...more} show={show}>
        <ControlBtnsGroup
          style={{
            width: '100%',
            // height: '100%'
            display: 'block',
            paddingLeft: '3px',
            backgroundColor: background,
          }}
          bgcolor={background}
          fgcolor={foreground}
          hlcolor="#FFD25B"
        >
          <ControlButton Icon={faCaretSquareDown} tooltip="Group" placement="bottom" onClick={() => setOnSelected(!onSelected)} style={{ float: 'left' }} />
          <div style={{ backgroundColor: background, padding: '1px 5px', width: '60%', float: 'left' }}>
            <Select placeholder="Selected Group" optionFilterProp="children" value={groupName} onChange={selectedChange} style={{ width: '100%' }}>
              {grouplist.map((item, index) => (
                <Select.Option value={index} label={item.name} key={index}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </div>

          <ControlButton Icon={faSave} tooltip="Save" placement="bottom" onClick={e => onSaveFunc(e, form)} style={{ float: 'right' }} />

          <ControlButton
            Icon={faCog}
            tooltip="Config"
            placement="bottom"
            toggled={selected === EnumSelected.Config}
            onClick={() => setSelected(EnumSelected.Config)}
            style={{ float: 'right' }}
          />
          <ControlButton
            Icon={faInfoCircle}
            tooltip="Infomation"
            placement="bottom"
            toggled={selected === EnumSelected.Instruction}
            onClick={() => setSelected(EnumSelected.Instruction)}
            style={{ float: 'right' }}
          />
        </ControlBtnsGroup>

        <Modal
          visible={bShowPublishModal}
          title="Publish"
          onCancel={() => showPublishModal(false)}
          width={600}
          footer={[
            <Button key="submit" type="primary" onClick={onPublish} loading={publishing}>
              Publish
            </Button>,
          ]}
        >
          <PublishForm {...commonPublishProps} />
        </Modal>
        <Modal
          visible={bShowCopyModal}
          title="Publish"
          onCancel={() => showCopyModal(false)}
          width={600}
          footer={[
            <Button key="submit" type="primary" onClick={onCopy} loading={copying}>
              Publish
            </Button>,
          ]}
        >
          <CopyForm {...commonCopyProps} />
        </Modal>
        <Modal
          visible={bShowHeaderModal}
          title="Group Information"
          onCancel={() => showHeaderModal(false)}
          width={600}
          footer={[
            <Button key="submit" type="primary" onClick={() => showHeaderModal(false)}>
              OK
            </Button>,
          ]}
        >
          <Form.Item label="ID" {...inlineStyle}>
            {comp._id}
          </Form.Item>
          <OZInput
            label="Name"
            field="comp.name"
            initialValue={getDepthValue(comp, 'name')}
            getFieldDecorator={getFieldDecorator}
            {...inlineStyle}
            autoFocus
            required
          />
        </Modal>

        <Form className="announcer-group-white-form">
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', height: '100%' }}>
            {onSelected && (
              <div
                style={{
                  backgroundColor: background,
                  padding: '1px -1px',
                  minWidth: '43px',
                  height: '0%',
                  position: 'relative',
                  marginTop: '-10px',
                }}
              >
                <ControlBtnsGroup
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'flex-start',
                    // backgroundColor: '#242d3c',
                    flexDirection: 'column',
                  }}
                  bgcolor={background}
                  fgcolor={foreground}
                  hlcolor="#FFD25B"
                >
                  {renderBtns}
                  {/* <ControlButton
                    Icon={faFont}
                    tooltip="Body"
                    placement="right"
                    toggled={selected === EnumSelected.Detail}
                    onClick={() => setSelected(EnumSelected.Detail)}
                  />
                  <ControlButton
                    Icon={faAddressCard}
                    tooltip="Contact Info"
                    placement="right"
                    toggled={selected === EnumSelected.Contact}
                    onClick={() => setSelected(EnumSelected.Contact)}
                  />
                  <ControlButton
                    Icon={faUsers}
                    tooltip="Users"
                    placement="right"
                    toggled={selected === EnumSelected.Users}
                    onClick={() => setSelected(EnumSelected.Users)}
                  />
                  <ControlButton
                    Icon={faTags}
                    tooltip="Tags"
                    placement="right"
                    toggled={selected === EnumSelected.Tags}
                    onClick={() => setSelected(EnumSelected.Tags)}
                  />
                  <ControlButton
                    Icon={faMapMarkerAlt}
                    tooltip="Map"
                    placement="right"
                    toggled={selected === EnumSelected.Map}
                    onClick={() => setSelected(EnumSelected.Map)}
                  />
                  <ControlButton
                    Icon={faCalendarAlt}
                    tooltip="Schedule"
                    placement="right"
                    toggled={selected === EnumSelected.Schedule}
                    onClick={() => setSelected(EnumSelected.Schedule)}
                  />
                  <ControlButton
                    Icon={faImages}
                    tooltip="Images"
                    placement="right"
                    toggled={selected === EnumSelected.Images}
                    onClick={() => setSelected(EnumSelected.Images)}
                  />
                  <ControlButton
                    Icon={faVideo}
                    tooltip="Videos"
                    placement="right"
                    toggled={selected === EnumSelected.Videos}
                    onClick={() => setSelected(EnumSelected.Videos)}
                  />
                  <ControlButton
                    Icon={faFilm}
                    tooltip="Streams"
                    placement="right"
                    toggled={selected === EnumSelected.Stream}
                    onClick={() => setSelected(EnumSelected.Stream)}
                  />
                  <ControlButton
                    Icon={faLink}
                    tooltip="Links"
                    placement="right"
                    toggled={selected === EnumSelected.Links}
                    onClick={() => setSelected(EnumSelected.Links)}
                  />
                  <ControlButton
                    Icon={faShareAlt}
                    tooltip="Social Media"
                    placement="right"
                    toggled={selected === EnumSelected.Social}
                    onClick={() => setSelected(EnumSelected.Social)}
                  />
                  <ControlButton
                    Icon={faEnvelope}
                    tooltip="Mail"
                    placement="right"
                    toggled={selected === EnumSelected.Mail}
                    onClick={() => setSelected(EnumSelected.Mail)}
                  />
                  <ControlButton
                    Icon={faCommentDots}
                    tooltip="SMS"
                    placement="right"
                    toggled={selected === EnumSelected.Sms}
                    onClick={() => setSelected(EnumSelected.Sms)}
                  />
                  <ControlButton
                    Icon={faComments}
                    tooltip="Comment"
                    placement="right"
                    toggled={selected === EnumSelected.Comment}
                    onClick={() => setSelected(EnumSelected.Comment)}
                  />
                  <ControlButton
                    Icon={faTv}
                    tooltip="Devices"
                    placement="right"
                    toggled={selected === EnumSelected.Device}
                    onClick={() => setSelected(EnumSelected.Device)}
                  />
                  <ControlButton
                    Icon={faAsterisk}
                    tooltip="Source and Destination"
                    placement="right"
                    toggled={selected === EnumSelected.Source}
                    onClick={() => setSelected(EnumSelected.Source)}
                  />
                  <ControlButton
                    Icon={faPaperclip}
                    tooltip="Attachements"
                    placement="right"
                    toggled={selected === EnumSelected.Attachements}
                    onClick={() => setSelected(EnumSelected.Attachements)}
                  />
                  <ControlButton
                    Icon={faChartBar}
                    tooltip="Tracking"
                    placement="right"
                    toggled={selected === EnumSelected.Track}
                    onClick={() => setSelected(EnumSelected.Track)}
                  />
                  <ControlButton
                    Icon={faClipboardCheck}
                    tooltip="Checklist"
                    placement="right"
                    toggled={selected === EnumSelected.Checklist}
                    onClick={() => setSelected(EnumSelected.Checklist)}
                  />
                  <ControlButton
                    Icon={faBell}
                    tooltip="Reminders"
                    placement="right"
                    toggled={selected === EnumSelected.Reminder}
                    onClick={() => setSelected(EnumSelected.Reminder)}
                  />
                  <ControlButton
                    Icon={faQuestionCircle}
                    tooltip="Quiz"
                    placement="right"
                    toggled={selected === EnumSelected.Quiz}
                    onClick={() => setSelected(EnumSelected.Quiz)}
                  />
                  <ControlButton
                    Icon={faBroadcastTower}
                    tooltip="Transmission"
                    placement="right"
                    toggled={selected === EnumSelected.Transmission}
                    onClick={() => setSelected(EnumSelected.Transmission)}
                  />
                  <ControlButton
                    Icon={faCode}
                    tooltip="ClientsData"
                    placement="right"
                    toggled={selected === EnumSelected.ClientsData}
                    onClick={() => setSelected(EnumSelected.ClientsData)}
                  /> */}

                  {/* <ControlButton
                    Icon={faEllipsisV}
                    tooltip="List"
                    placement="right"
                    toggled={selected === EnumSelected.List}
                    onClick={() => setSelected(EnumSelected.List)}
                  /> */}
                  {/* <ControlButton
                    Icon={faPuzzlePiece}
                    tooltip="Widget"
                    placement="right"
                    toggled={selected === EnumSelected.Widget}
                    onClick={() => setSelected(EnumSelected.Widget)}
                  /> */}
                  {/* <ControlButton
                    Icon={faMousePointer}
                    tooltip="Actions"
                    placement="right"
                    toggled={selected === EnumSelected.Actions}
                    onClick={() => setSelected(EnumSelected.Actions)}
                  /> */}
                  {/* <ControlButton
                    Icon={faListUl}
                    tooltip="SMS & Email"
                    placement="right"
                    toggled={selected === EnumSelected.SMSEmail}
                    onClick={() => setSelected(EnumSelected.SMSEmail)}
                  /> */}
                  {/* <ControlButton
                    Icon={faHourglassHalf}
                    tooltip="Offset"
                    placement="right"
                    toggled={selected === EnumSelected.Offset}
                    onClick={() => setSelected(EnumSelected.Offset)}
                  /> */}
                  {/* <ControlButton
                    Icon={faBars}
                    tooltip="Menu"
                    placement="right"
                    toggled={selected === EnumSelected.Menu}
                    onClick={() => setSelected(EnumSelected.Menu)}
                  /> */}
                  {/* <ControlButton
                    Icon={faTable}
                    tooltip="Table"
                    placement="right"
                    toggled={selected === EnumSelected.LayerTable}
                    onClick={() => setSelected(EnumSelected.LayerTable)}
                  /> */}
                  {/* <ControlButton
                    Icon={faBullhorn}
                    tooltip="Notification"
                    placement="right"
                    toggled={selected === EnumSelected.LayerNotification}
                    onClick={() => setSelected(EnumSelected.LayerNotification)}
                  /> */}
                  {/* <ControlButton
                    Icon={faPalette}
                    tooltip="Style"
                    placement="right"
                    toggled={selected === EnumSelected.Style}
                    onClick={() => setSelected(EnumSelected.Style)}
                  />
                  <ControlButton
                    Icon={faSwatchbook}
                    tooltip="Palettes"
                    placement="right"
                    toggled={selected === EnumSelected.Palettes}
                    onClick={() => setSelected(EnumSelected.Palettes)}
                  /> */}
                  {/* <ControlButton
                    Icon={faEye}
                    tooltip="Show Field"
                    placement="right"
                    toggled={selected === EnumSelected.Eye}
                    onClick={() => setSelected(EnumSelected.Eye)}
                  /> */}
                  {/* <ControlButton
                    Icon={faTh}
                    tooltip="Set"
                    placement="right"
                    toggled={selected === EnumSelected.Set}
                    onClick={() => setSelected(EnumSelected.Set)}
                  /> */}
                  {/* <ControlButton
                    Icon={faBriefcase}
                    tooltip="Workflow"
                    placement="right"
                    toggled={selected === EnumSelected.Workflow}
                    onClick={() => setSelected(EnumSelected.Workflow)}
                  /> */}

                  {/* <ControlButton
                    Icon={faRocket}
                    tooltip="Launch"
                    placement="bottom"
                    toggled={selected === EnumSelected.LayerMenu}
                    onClick={() => setSelected(EnumSelected.LayerMenu)}
                  />
                  <ControlButton
                    Icon={faFilter}
                    tooltip="Filter"
                    placement="bottom"
                    toggled={selected === EnumSelected.TreeFilter}
                    onClick={() => setSelected(EnumSelected.TreeFilter)}
                  />
                  <ControlButton
                    Icon={faPaperPlane}
                    tooltip="Send"
                    placement="bottom"
                    onClick={() => showPublishModal(true)}
                  />
                  <ControlButton Icon={faUpload} tooltip="Publish" placement="bottom" onClick={() => showCopyModal(true)} />
                  <ControlButton
                    Icon={faLock}
                    tooltip="Permission"
                    placement="bottom"
                    toggled={selected === EnumSelected.Permission}
                    onClick={() => setSelected(EnumSelected.Permission)}
                  /> */}
                </ControlBtnsGroup>
              </div>
            )}
            <span className="panel-content">
              {selected === EnumSelected.Detail && (
                <>
                  <div className="announcer-group-white-form-buttongroup">
                    <span
                      onClick={() => setDescOption('single')}
                      className="announcer-group-white-form-buttongroup-button"
                      style={{ backgroundColor: descOption == 'single' ? background : null }}
                    >
                      <FontAwesomeIcon icon={faStop} color={descOption == 'single' ? '#FFF' : 'rgba(0, 0, 0, 0.65)'} />
                    </span>
                    <span
                      onClick={() => setDescOption('multi')}
                      className="announcer-group-white-form-buttongroup-button"
                      style={{ backgroundColor: descOption == 'multi' ? background : null }}
                    >
                      <FontAwesomeIcon icon={faThLarge} color={descOption == 'multi' ? '#FFF' : 'rgba(0, 0, 0, 0.65)'} />
                    </span>
                    <span
                      onClick={() => setDescOption('stream')}
                      className="announcer-group-white-form-buttongroup-button"
                      style={{ backgroundColor: descOption == 'stream' ? background : null }}
                    >
                      <FontAwesomeIcon icon={faStream} color={descOption == 'stream' ? '#FFF' : 'rgba(0, 0, 0, 0.65)'} />
                    </span>
                  </div>
                  {descOption === 'single' && (
                    <>
                      <DescForm
                        data={getDepthValue(comp, 'data.desc')}
                        iconasset={getFieldValue('comp.data.desc.icon') || {}}
                        logoasset={getFieldValue('comp.data.desc.logo') || {}}
                        imageasset={getFieldValue('comp.data.desc.image') || {}}
                        field="comp.data.desc"
                        form={form}
                        onShowThirdPanel={onShowThirdPanel}
                        onAddAsset={onAddImageAsset}
                        onDeleteAsset={onDeleteDescImage}
                        panelDocType={constants.organizer.Image.docType}
                        addToUploadedFolder={() => { }}
                        onDrop={onDropDescMediaFromExist}
                      />
                      <Form.Item label="Details" {...inlineStyle} style={{ fontWeight: 'bold', marginBottom: '0' }}>
                        <Button type="default" icon="edit" onClick={() => setBShowHTMLEditModal(true)} />
                      </Form.Item>
                      {parse(body)[0] != undefined && parse(body)[0].props.children != null && (
                        <div className="html-preview" dangerouslySetInnerHTML={{ __html: body }} />
                      )}
                      {bShowHTMLEditModal && (
                        <HTMLEditModal
                          visible={bShowHTMLEditModal}
                          onCancel={() => setBShowHTMLEditModal(false)}
                          data={body}
                          onUpdate={newBody => {
                            setFieldsValue({ ['comp.data.desc.body']: newBody })
                            setBShowHTMLEditModal(false)
                          }}
                        />
                      )}
                    </>
                  )}
                  {descOption === 'multi' && (
                    <MultiDescForm
                      data={getDepthValue(comp, 'data.multidesc')}
                      field="comp.data.multidesc"
                      form={form}
                      onShowThirdPanel={onShowThirdPanel}
                      onAddAsset={onAddImageAsset}
                      panelDocType={constants.organizer.Image.docType}
                      addToUploadedFolder={() => { }}
                    />
                  )}
                  {descOption === 'stream' && <StreamForm {...commonStreamProps} />}
                </>
              )}
              {selected === EnumSelected.Users && <DocumentListForm {...commonDocumentlistProps} />}
              {selected === EnumSelected.Tags && (
                <>
                  <AssigneeForm {...commonAssigneeProps} />
                  <AssigneeForm {...commonRolesProps} />
                  <OZInput
                    label="Rank"
                    field="comp.rank"
                    type="number"
                    initialValue={getDepthValue(comp, 'rank')}
                    getFieldDecorator={getFieldDecorator}
                    {...inlineStyle}
                    style={{ fontWeight: 'bold', marginBottom: '0' }}
                  />
                  <Form.Item label="Tags::" className="form-item-tags" {...inlineStyle}>
                    {getFieldDecorator('comp.tags', {
                      initialValue: _.get(comp, 'tags') || [],
                    })(
                      <Select mode="tags" placeholder="Please add tags" style={{ width: '100%' }}>
                        {/* <Option key="Default">Default</Option> */}
                      </Select>,
                    )}
                  </Form.Item>
                  {/* <Form.Item label="Actions::" className="form-item-tags" {...inlineStyle}>
                    {getFieldDecorator('comp.data.desc.actions', {
                      initialValue: _.get(comp, 'data.desc.actions') || [],
                    })(<Select mode="tags" placeholder="Add an actions" style={{ width: '100%' }}></Select>)}
                  </Form.Item> */}
                </>
              )}
              {selected === EnumSelected.Social && <SocialForm data={getDepthValue(comp, 'data.desc')} field="comp.data.desc" form={form} />}
              {selected === EnumSelected.Map && <LocationForm {...commonLocationProps} config={_.get(header, 'client.data.appInfo.location')} />}
              {selected === EnumSelected.Schedule && (
                <>
                  {getFieldDecorator('comp.data.scheduleType', {
                    initialValue: _.get(comp, 'data.scheduleType') || 'availability',
                  })(
                    <Radio.Group style={{ marginLeft: '10px' }}>
                      {scheduleTypeOptions.map(option => (
                        <Radio style={radioStyle} value={option.value} key={option.value}>
                          {option.label}
                        </Radio>
                      ))}
                    </Radio.Group>,
                  )}
                  {scheduleType === 'availability' && <ScheduleForm {...commonScheduleProps} config={_.get(header, 'client.data.appInfo.schedule')} />}
                  {scheduleType === 'archiveOn' && (
                    <div className="oe-schedule-form-datetime">
                      <span className="oe-schedule-form-datetime-label">From:</span>
                      <div className="oe-schedule-form-datetime-pickers">
                        <DatePicker id="date-picker-from" value={archiveOn ? moment.utc(archiveOn).local() : moment()} onChange={(...e) => onScheduleChange(...e, 'comp.data.ArchiveOn')} />
                        <TimePicker id="time-picker-from" value={archiveOn ? moment.utc(archiveOn).local() : moment()} onChange={(...e) => onScheduleChange(...e, 'comp.data.ArchiveOn')} format="HH:mm" />
                      </div>
                    </div>
                  )}
                  {scheduleType === 'deleteOn' && (
                    <div className="oe-schedule-form-datetime">
                      <span className="oe-schedule-form-datetime-label">From:</span>
                      <div className="oe-schedule-form-datetime-pickers">
                        <DatePicker id="date-picker-from" value={deleteOn ? moment.utc(deleteOn).local() : moment()} onChange={(...e) => onScheduleChange(...e, 'comp.data.DeleteOn')} />
                        <TimePicker id="time-picker-from" value={deleteOn ? moment.utc(deleteOn).local() : moment()} onChange={(...e) => onScheduleChange(...e, 'comp.data.DeleteOn')} format="HH:mm" />
                      </div>
                    </div>
                  )}
                  {scheduleType === 'packageOn' && (
                    <div className="oe-schedule-form-datetime">
                      <span className="oe-schedule-form-datetime-label">From:</span>
                      <div className="oe-schedule-form-datetime-pickers">
                        <DatePicker id="date-picker-from" value={packageOn ? moment.utc(packageOn).local() : moment()} onChange={(...e) => onScheduleChange(...e, 'comp.data.PackageOn')} />
                        <TimePicker id="time-picker-from" value={packageOn ? moment.utc(packageOn).local() : moment()} onChange={(...e) => onScheduleChange(...e, 'comp.data.PackageOn')} format="HH:mm" />
                      </div>
                    </div>
                  )}

                </>
              )}
              {selected === EnumSelected.TreeFilter && <TreeFilterForm {...commonTreeFilterProps} />}
              {selected === EnumSelected.Filter && (
                <>
                  <OZSelectItem
                    label=""
                    field="comp.data.filterType"
                    initialValue={_.get(comp, 'data.filterType') || 'Schedule'}
                    getFieldDecorator={getFieldDecorator}
                    combines={[
                      // { label: 'Filter', value: 'Filter' },
                      { label: 'Schedule', value: 'Schedule' },
                      { label: 'Map', value: 'Map' },
                    ]}
                    required={false}
                  />
                  {getFieldValue('comp.data.filterType') === 'Schedule' && (
                    <>
                      <ScheduleForm {...commonScheduleProps} config={_.get(header, 'client.data.appInfo.schedule')} />
                    </>
                  )}
                  {getFieldValue('comp.data.filterType') === 'Map' && (
                    <>
                      <LocationForm {...commonLocationProps} config={_.get(header, 'client.data.appInfo.location')} />
                    </>
                  )}
                </>
              )}
              {selected === EnumSelected.Style && (
                <>
                  <OZSelectItem
                    label=""
                    field="comp.data.styleType"
                    initialValue={_.get(comp, 'data.styleType') || 'Style'}
                    getFieldDecorator={getFieldDecorator}
                    combines={[
                      { label: 'Style', value: 'Style' },
                      { label: 'Presentation', value: 'Presentation' },
                      { label: 'Notification', value: 'Notification' },
                    ]}
                    style={{ marginBottom: 0 }}
                  />
                  {getFieldValue('comp.data.styleType') === 'Style' && (
                    <>
                      <DocumentTypesMenu
                        collectionName="StylesData"
                        type="group"
                        iconType="download"
                        label="Load from Style Templates"
                        style={{ width: '100%' }}
                        onChange={onLoadTmpl}
                      />
                      <StyleForm {...commonStyleProps} />
                    </>
                  )}
                  {getFieldValue('comp.data.styleType') === 'Presentation' && (
                    <Form.Item>
                      {getFieldDecorator('comp.data.presentationType', {
                        initialValue: _.get(comp, 'data.presentationType') || 'layout',
                      })(
                        <Radio.Group style={{ marginLeft: '10px' }}>
                          {presentationTypeOptions.map(option => (
                            <Radio style={radioStyle} value={option.value} key={option.value}>
                              {option.label}
                            </Radio>
                          ))}
                        </Radio.Group>,
                      )}
                      {presentationType === 'layout' && <GroupLayout {...commonDataProps} />}
                      {presentationType === 'component' && <GroupComponent {...commonDataProps} />}
                    </Form.Item>
                  )}
                  {getFieldValue('comp.data.styleType') === 'Notification' && (
                    <>
                      <PresentationForm {...commonPresentationProps} />
                      <GroupingSettingsFormModalInnerMajorMinor data={getDepthValue(comp, 'majorMinor', {})} field="comp.majorMinor" form={form} />
                    </>
                  )}
                </>
              )}
              {selected === EnumSelected.Palettes && (
                <Form.Item>
                  <Radio.Group onChange={e => setPalette(e.target.value)} style={{ marginLeft: '10px' }} value={palette}>
                    {palettesNameOptions.map(option => (
                      <Radio style={radioStyle} value={option.value} key={option.value}>
                        {option.label}
                      </Radio>
                    ))}
                  </Radio.Group>
                  {palette === 'title' && <PalettesForm {...commonPalettesTitleProps} />}
                  {palette === 'short' && <PalettesForm {...commonPalettesShortProps} />}
                  {palette === 'long' && <PalettesForm {...commonPalettesLongProps} />}
                  {palette === 'body' && <PalettesForm {...commonPalettesBodyProps} />}
                  {palette === 'media' && <PalettesForm {...commonPalettesMediaProps} />}
                  {palette === 'menu' && <PalettesForm {...commonPalettesMenuProps} />}
                  {palette === 'canvas' && <PalettesForm {...commonPalettesCanvasProps} />}
                </Form.Item>
              )}
              {/* {selected === EnumSelected.Config && <ConfigForm {...commonConfigProps} />} */}
              {selected === EnumSelected.Config && <Private {...commonConfigProps} />}
              {selected === EnumSelected.Eye && <ShowfieldForm {...commonShowfieldProps} />}
              {selected === EnumSelected.Images && (
                <MediaListPanel
                  assets={getFieldValue('comp.data.imageList') || []}
                  onAddAsset={onAddImage}
                  onDeleteAsset={onDeleteImage}
                  panelDocType={constants.organizer.Image.docType}
                  onShowThirdPanel={onShowThirdPanel}
                  addToUploadedFolder={() => { }}
                  onDrop={onDropImageFromExist}
                />
              )}
              {selected === EnumSelected.Videos && (
                <div className="tab-video">
                  <Form.Item label="Stock Videos:">
                    <MediaListPanel
                      assets={getFieldValue('comp.data.videoList') || []}
                      onAddAsset={onAddVideo}
                      onDeleteAsset={onDeleteVideo}
                      panelDocType={constants.organizer.Video.docType}
                      onShowThirdPanel={onShowThirdPanel}
                      addToUploadedFolder={() => { }}
                      onDrop={onDropVideoFromExist}
                    />
                  </Form.Item>
                  <OZInput
                    label="External Video:"
                    field="comp.data.videoURL"
                    initialValue={getDepthValue(comp, 'data.videoURL', '')}
                    getFieldDecorator={getFieldDecorator}
                  />
                  <OZCheckbox
                    label="Auto-Play"
                    field="comp.data.layout.autoStart"
                    initialValue={_.get(comp, 'data.layout.autoStart') || false}
                    itemStyle={inlineStyle}
                    getFieldDecorator={getFieldDecorator}
                  />
                  <OZCheckbox
                    label="Auto-Loop"
                    field="comp.data.layout.autoLoop"
                    initialValue={_.get(comp, 'data.layout.autoLoop') || false}
                    itemStyle={inlineStyle}
                    getFieldDecorator={getFieldDecorator}
                  />
                  {/* <Form.Item label="Video Stream:">
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
                      field="comp.data.streaming.broadband_url"
                      initialValue={getDepthValue(comp, 'data.streaming.broadband_url', '')}
                      getFieldDecorator={getFieldDecorator}
                      style={{ width: '100%', marginBottom: '0' }}
                    />
                  </Form.Item> */}
                </div>
              )}
              {selected === EnumSelected.Stream && (
                <div className="tab-video">
                  <Form.Item label="Streams:">
                    <StreamListPanel
                      streamList={getFieldValue('comp.data.streamList') || []}
                      onAddStream={onAddStream}
                      onShowStreamPanel={onShowStreamPanel}
                      onDeleteStream={onDeleteStream}
                      addToUploadedFolder={() => { }}
                      onDrop={onDropStreamFromExist}
                    />
                    <Form.Item label="Tags::" className="form-item-tags" {...inlineStyle} style={{ marginTop: '1rem' }}>
                      {getFieldDecorator('comp.data.streamTags', {
                        initialValue: _.get(comp, 'data.streamTags') || [],
                      })(
                        <Select mode="tags" placeholder="Please add tags">
                          {/* <Option key="Default">Default</Option> */}
                        </Select>,
                      )}
                    </Form.Item>
                  </Form.Item>
                  <OZCheckbox
                    label="Auto-Play"
                    field="comp.data.stream.autoStart"
                    initialValue={_.get(comp, 'data.stream.autoStart') || false}
                    itemStyle={inlineStyle}
                    getFieldDecorator={getFieldDecorator}
                  />
                  <OZCheckbox
                    label="Auto-Loop"
                    field="comp.data.stream.autoLoop"
                    initialValue={_.get(comp, 'data.stream.autoLoop') || false}
                    itemStyle={inlineStyle}
                    getFieldDecorator={getFieldDecorator}
                  />
                </div>
              )}
              {selected === EnumSelected.Links && (
                <>
                  <div className="announcer-group-white-form-buttongroup">
                    <span
                      onClick={() => setLinkOption('weblink')}
                      className="announcer-group-white-form-buttongroup-button"
                      style={{ backgroundColor: linkOption == 'weblink' ? background : null }}
                    >
                      <FontAwesomeIcon icon={faExternalLinkSquareAlt} color={linkOption == 'weblink' ? '#FFF' : 'rgba(0, 0, 0, 0.65)'} />
                    </span>
                    <span
                      onClick={() => setLinkOption('list')}
                      className="announcer-group-white-form-buttongroup-button"
                      style={{ backgroundColor: linkOption == 'list' ? background : null }}
                    >
                      <FontAwesomeIcon icon={faEllipsisV} color={linkOption == 'list' ? '#FFF' : 'rgba(0, 0, 0, 0.65)'} />
                    </span>
                    <span
                      onClick={() => setLinkOption('plugin')}
                      className="announcer-group-white-form-buttongroup-button"
                      style={{ backgroundColor: linkOption == 'plugin' ? background : null }}
                    >
                      <FontAwesomeIcon icon={faPuzzlePiece} color={linkOption == 'plugin' ? '#FFF' : 'rgba(0, 0, 0, 0.65)'} />
                    </span>
                    <span
                      onClick={() => setLinkOption('offset')}
                      className="announcer-group-white-form-buttongroup-button"
                      style={{ backgroundColor: linkOption == 'offset' ? background : null }}
                    >
                      <FontAwesomeIcon icon={faHourglassHalf} color={linkOption == 'offset' ? '#FFF' : 'rgba(0, 0, 0, 0.65)'} />
                    </span>
                    <span
                      onClick={() => setLinkOption('set')}
                      className="announcer-group-white-form-buttongroup-button"
                      style={{ backgroundColor: linkOption == 'set' ? background : null }}
                    >
                      <FontAwesomeIcon icon={faTh} color={linkOption == 'set' ? '#FFF' : 'rgba(0, 0, 0, 0.65)'} />
                    </span>
                  </div>
                  {linkOption === 'weblink' && <LinkActionForm {...commonLinkactionlistProps} />}
                  {linkOption === 'list' && <GroupListForm {...commonGrouplistProps} />}
                  {linkOption === 'plugin' && <PluginForm {...commonWidgetlistProps} />}
                  {linkOption === 'offset' && <OffsetForm {...commonOffsetProps} />}
                  {linkOption === 'set' && <SetForm {...commonSetProps} />}
                </>
              )}
              {selected === EnumSelected.Mail && <MailForm {...commonMailProps} />}
              {selected === EnumSelected.Contact && (
                <>
                  <div className="announcer-group-white-form-buttongroup">
                    <span
                      onClick={() => setContactOption('first')}
                      className="announcer-group-white-form-buttongroup-button"
                      style={{ backgroundColor: contactOption == 'first' ? background : null }}
                    >
                      <FontAwesomeIcon icon={faIdCardAlt} color={contactOption == 'first' ? '#FFF' : 'rgba(0, 0, 0, 0.65)'} />
                    </span>
                    <span
                      onClick={() => setContactOption('second')}
                      className="announcer-group-white-form-buttongroup-button"
                      style={{ backgroundColor: contactOption == 'second' ? background : null }}
                    >
                      <FontAwesomeIcon icon={faBuilding} color={contactOption == 'second' ? '#FFF' : 'rgba(0, 0, 0, 0.65)'} />
                    </span>
                  </div>
                  {contactOption === 'first' && <ContactForm {...commonContactProps} />}
                  {contactOption === 'second' && <ContactForm {...commonOrganizationProps} />}
                </>
              )}
              {selected === EnumSelected.Reminder && <ReminderForm {...commonContactProps} />}
              {selected === EnumSelected.Instruction && <InstructionForm {...commonInstructionProps} />}
              {selected === EnumSelected.Track && <TrackForm group={comp} />}
              {selected === EnumSelected.Permission && (
                <>
                  {getFieldDecorator('comp.data.permissionType', {
                    initialValue: _.get(comp, 'data.permissionType') || 'function',
                  })(
                    <Radio.Group style={{ marginLeft: '10px' }}>
                      {permissionTypeOptions.map(option => (
                        <Radio style={radioStyle} value={option.value} key={option.value}>
                          {option.label}
                        </Radio>
                      ))}
                    </Radio.Group>,
                  )}
                  {permissionType === 'function' && <FunctionForm {...commonFunctionProps} />}
                  {permissionType === 'folder' && <GroupTypeList {...commonPermissionProps} />}
                </>
              )}
              {/* {selected === EnumSelected.Permission && <GroupTypeList {...commonPermissionProps} />} */}
              {selected === EnumSelected.Checklist && <ChecklistForm {...commonChecklistProps} />}
              {selected === EnumSelected.Quiz && <QuizForm {...commonQuizProps} />}
              {selected === EnumSelected.SMSEmail && (
                <>
                  <OZSelectItem
                    label=""
                    field="comp.data.SMSEmailType"
                    initialValue={_.get(comp, 'data.SMSEmailType') || 'SMS'}
                    getFieldDecorator={getFieldDecorator}
                    combines={[
                      { label: 'SMS', value: 'SMS' },
                      { label: 'Email', value: 'Email' },
                    ]}
                  />
                  {getFieldValue('comp.data.SMSEmailType') === 'SMS' && <SMSListForm {...commonSMSListProps} />}
                  {getFieldValue('comp.data.SMSEmailType') === 'Email' && <EmailListForm {...commonEmailListProps} />}
                </>
              )}
              {/* {selected === EnumSelected.SMSEmail && <EmailListForm {...commonEmailListProps} />} */}
              {selected === EnumSelected.Comment && <CommentsForm {...commonCommentProps} />}
              {selected === EnumSelected.List && <GroupListForm {...commonGrouplistProps} />}
              {selected === EnumSelected.Source && <SourceForm {...commonSourceProps} />}
              {selected === EnumSelected.Widget && (
                // <WidgetForm {...commonWidgetlistProps} />
                <PluginForm {...commonWidgetlistProps} />
              )}
              {selected === EnumSelected.LayerMenu && (
                <>
                  <div className="announcer-group-white-form-buttongroup">
                    <span
                      onClick={() => setRocketOption('layers')}
                      className="announcer-group-white-form-buttongroup-button"
                      style={{ backgroundColor: rocketOption == 'layers' ? background : null }}
                    >
                      <FontAwesomeIcon icon={faLayerGroup} color={rocketOption == 'layers' ? '#FFF' : 'rgba(0, 0, 0, 0.65)'} />
                    </span>
                    <span
                      onClick={() => setRocketOption('measurements')}
                      className="announcer-group-white-form-buttongroup-button"
                      style={{ backgroundColor: rocketOption == 'measurements' ? background : null }}
                    >
                      <FontAwesomeIcon icon={faRulerCombined} color={rocketOption == 'measurements' ? '#FFF' : 'rgba(0, 0, 0, 0.65)'} />
                    </span>
                    <span
                      onClick={() => setRocketOption('menu')}
                      className="announcer-group-white-form-buttongroup-button"
                      style={{ backgroundColor: rocketOption == 'menu' ? background : null }}
                    >
                      <FontAwesomeIcon icon={faBars} color={rocketOption == 'menu' ? '#FFF' : 'rgba(0, 0, 0, 0.65)'} />
                    </span>
                    <span
                      onClick={() => setRocketOption('palette')}
                      className="announcer-group-white-form-buttongroup-button"
                      style={{ backgroundColor: rocketOption == 'palette' ? background : null }}
                    >
                      <FontAwesomeIcon icon={faSwatchbook} color={rocketOption == 'palette' ? '#FFF' : 'rgba(0, 0, 0, 0.65)'} />
                    </span>
                    <span
                      onClick={() => setRocketOption('style')}
                      className="announcer-group-white-form-buttongroup-button"
                      style={{ backgroundColor: rocketOption == 'style' ? background : null }}
                    >
                      <FontAwesomeIcon icon={faPalette} color={rocketOption == 'style' ? '#FFF' : 'rgba(0, 0, 0, 0.65)'} />
                    </span>
                    <span
                      onClick={() => setRocketOption('showfield')}
                      className="announcer-group-white-form-buttongroup-button"
                      style={{ backgroundColor: rocketOption == 'showfield' ? background : null }}
                    >
                      <FontAwesomeIcon icon={faEye} color={rocketOption == 'showfield' ? '#FFF' : 'rgba(0, 0, 0, 0.65)'} />
                    </span>
                    <span
                      onClick={() => setRocketOption('table')}
                      className="announcer-group-white-form-buttongroup-button"
                      style={{ backgroundColor: rocketOption == 'table' ? background : null }}
                    >
                      <FontAwesomeIcon icon={faTable} color={rocketOption == 'table' ? '#FFF' : 'rgba(0, 0, 0, 0.65)'} />
                    </span>
                    <span
                      onClick={() => setRocketOption('pointer')}
                      className="announcer-group-white-form-buttongroup-button"
                      style={{ backgroundColor: rocketOption == 'pointer' ? background : null }}
                    >
                      <FontAwesomeIcon icon={faMousePointer} color={rocketOption == 'pointer' ? '#FFF' : 'rgba(0, 0, 0, 0.65)'} />
                    </span>
                  </div>
                  {rocketOption == 'layers' && (
                    <>{comp?.name?.endsWith('/') ? <RocketForm {...commonLayerMenuProps} /> : <RocketDocumentForm {...commonLayerMenuProps} />}</>
                  )}
                  {rocketOption == 'measurements' && (
                    <Form.Item label="Base" className="form-item-canvas-base">
                      <OZInputNumber
                        label="Width"
                        field="comp.data.Canvasbase.width"
                        initialValue={_.get(comp, 'data.Canvasbase.width') || 1280}
                        getFieldDecorator={getFieldDecorator}
                        max={10000}
                        required={false}
                        {...inlineStyle}
                      />
                      <OZInputNumber
                        label="Height"
                        field="comp.data.Canvasbase.height"
                        initialValue={_.get(comp, 'data.Canvasbase.height') || 720}
                        getFieldDecorator={getFieldDecorator}
                        max={10000}
                        required={false}
                        {...inlineStyle}
                      />
                    </Form.Item>
                  )}
                  {rocketOption === 'menu' && <MenuForm {...commonMenuProps} show />}
                  {rocketOption === 'showfield' && <ShowfieldForm {...commonShowfieldProps} />}
                  {rocketOption === 'table' && <SingleLayerForm {...commonLayerTableProps} show />}
                  {rocketOption === 'pointer' && <ActionsForm {...commonActionsProps} />}
                  {rocketOption === 'palette' && (
                    <Form.Item>
                      <Radio.Group onChange={e => setPalette(e.target.value)} style={{ marginLeft: '10px' }} value={palette}>
                        {palettesNameOptions.map(option => (
                          <Radio style={radioStyle} value={option.value} key={option.value}>
                            {option.label}
                          </Radio>
                        ))}
                      </Radio.Group>
                      {palette === 'title' && <PalettesForm {...commonPalettesTitleProps} />}
                      {palette === 'short' && <PalettesForm {...commonPalettesShortProps} />}
                      {palette === 'long' && <PalettesForm {...commonPalettesLongProps} />}
                      {palette === 'body' && <PalettesForm {...commonPalettesBodyProps} />}
                      {palette === 'media' && <PalettesForm {...commonPalettesMediaProps} />}
                      {palette === 'menu' && <PalettesForm {...commonPalettesMenuProps} />}
                      {palette === 'canvas' && <PalettesForm {...commonPalettesCanvasProps} />}
                      {palette === 'footer' && <PalettesForm {...commonPalettesFooterProps} />}
                    </Form.Item>
                  )}
                  {rocketOption == 'style' && (
                    <>
                      <OZSelectItem
                        label=""
                        field="comp.data.styleType"
                        initialValue={_.get(comp, 'data.styleType') || 'Style'}
                        getFieldDecorator={getFieldDecorator}
                        combines={[
                          { label: 'Style', value: 'Style' },
                          { label: 'Presentation', value: 'Presentation' },
                          { label: 'Notification', value: 'Notification' },
                        ]}
                        style={{ marginBottom: 0 }}
                      />
                      {getFieldValue('comp.data.styleType') === 'Style' && (
                        <>
                          <DocumentTypesMenu
                            collectionName="StylesData"
                            type="group"
                            iconType="download"
                            label="Load from Style Templates"
                            style={{ width: '100%' }}
                            onChange={onLoadTmpl}
                          />
                          <StyleForm {...commonStyleProps} />
                        </>
                      )}
                      {getFieldValue('comp.data.styleType') === 'Presentation' && (
                        <Form.Item>
                          {getFieldDecorator('comp.data.presentationType', {
                            initialValue: _.get(comp, 'data.presentationType') || 'layout',
                          })(
                            <Radio.Group style={{ marginLeft: '10px' }}>
                              {presentationTypeOptions.map(option => (
                                <Radio style={radioStyle} value={option.value} key={option.value}>
                                  {option.label}
                                </Radio>
                              ))}
                            </Radio.Group>,
                          )}
                          {presentationType === 'layout' && <GroupLayout {...commonDataProps} />}
                          {presentationType === 'component' && <GroupComponent {...commonDataProps} />}
                        </Form.Item>
                      )}
                      {getFieldValue('comp.data.styleType') === 'Notification' && (
                        <>
                          <PresentationForm {...commonPresentationProps} />
                          <GroupingSettingsFormModalInnerMajorMinor
                            data={getDepthValue(comp, 'majorMinor', {})}
                            field="comp.majorMinor"
                            form={form}
                          />
                        </>
                      )}
                    </>
                  )}
                </>
              )}
              {/* {selected === EnumSelected.Menu && <MenuForm {...commonMenuProps} show />} */}
              {selected === EnumSelected.Offset && <OffsetForm {...commonOffsetProps} />}
              {selected === EnumSelected.Actions && <ActionsForm {...commonActionsProps} />}
              {selected === EnumSelected.LayerTable && <SingleLayerForm {...commonLayerTableProps} show />}
              {selected === EnumSelected.LayerNotification && <SingleLayerForm {...commonLayerNotificationProps} show bLayout={false} />}
              {selected === EnumSelected.Attachements && <AttachementsForm {...commonAttachementsProps} onShowThirdPanel={onShowAttachmentPanel}/>}
              {selected === EnumSelected.Device && <DeviceForm {...commonDeviceProps} />}
              {selected === EnumSelected.Set && <SetForm {...commonSetProps} />}
              {selected === EnumSelected.Sms && <SmsForm {...commonSmsProps} />}
              {selected === EnumSelected.Transmission && <TransmissionForm {...commonTransmissionProps} />}
              {selected === EnumSelected.ClientsData && <Private {...commonClientsDataProps} />}
            </span>
          </div>
        </Form>
      </GrayPanel>
      {thirdRender}
    </>
  )
}
MyForm.propTypes = {
  style: PropTypes.object,
}

MyForm.defaultProps = {
  style: {
    bgcolor: 'white',
    fgcolor: 'black',
    bgcolor_selected: 'white',
    fgcolor_selected: 'black',
    bCollapsable: false,
  },
}
const GroupWhiteForm = Form.create()(MyForm)
export default withApollo(GroupWhiteForm)
