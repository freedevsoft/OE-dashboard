import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArchive, faArrowLeft, faBars, faCog, faFileAlt, faFolder, faSitemap } from '@fortawesome/free-solid-svg-icons'
import { Breadcrumb, Button, Dropdown, Menu, Modal } from 'antd'
import _ from 'lodash'
import GrayPanel from 'components/GrayPanel/GrayPanel'
import ControlBtnsGroup from 'components/ControlBtnsGroup/ControlBtnsGroup'
import ControlButton from 'components/ControlButton/ControlButton'
import AccordionList from 'components/AccordionList/AccordionList'
import CabinetForm from 'containers/CabinetForm'
import SettingForm from 'containers/SettingForm'
import GroupInside from './GroupInside'
import './GroupDetailPanel.scss'
import { collectionConfigs } from 'utils/config'

// import { list } from '../../../../../../.cache/typescript/4.1/node_modules/postcss/lib/postcss'

const EnumSelected = {
  Cabinet: 0,
  Folder: 1,
  Document: 2,
  Organizer: 3,
}
const GroupDetailPanel = ({
  loading,
  dataList,
  style,
  selectedIndex,
  selectItem,
  selectItemName,
  selectSubItem,
  onItemEditFunc,
  onItemDeleteFunc,
  onGroupAddFun,
  selectIcon,
  onDragItem,
  width,
  minWidth,
  maxWidth,
  options,
  groupType,
  onGroupTypeChange,
  header,
  font,
  history,
  onAddGroupType,
  onRemoveGroupType,
  onBack,
  selectItemEdit,
  onGroupCollectionSelect,
  collectionName,
}) => {
  const [showFolderDoc, setShowFolderDoc] = useState(true)
  const [showFolderFol, setShowFolderFol] = useState(true)
  const [selected, setSelected] = useState(EnumSelected.Document)
  const [onSelected, setOnSelected] = useState(false)
  const [showGroupType, setShowGroupType] = useState(false)
  const [bDeleteModal, showDeleteModal] = useState(false)
  const [bConfirmModal, showConfirmModal] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isCog, setIsCog] = useState(false)
  const [selectedGroupName, setSelectedGroupName] = useState('/')
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0)
  const [showSettingModal, setShowSettingModal] = useState(false)
  const [hlChecked, setHlChecked] = useState(localStorage.getItem('hlcolorcheck') || 'false')
  const [background, setBackground] = useState(localStorage.getItem('bgcolorcode') || '#242D3C')
  const [foreground, setForeground] = useState(localStorage.getItem('fgcolorcode') || '#FFF')
  const [highlight, setHighlight] = useState(localStorage.getItem('hlcolorcode') || '#f8e71c')
  const [isSearchCloseIconVisible, setIsSearchCloseIconVisible] = useState(false)
  const [datalist, setDataList] = useState([])
  const [search, setSearch] = useState('')

  const inputElement = useRef(null)

  setInterval(() => {
    if (localStorage.getItem('bgcolorcode')) {
      setBackground(localStorage.getItem('bgcolorcode'))
    }
    if (localStorage.getItem('fgcolorcode')) {
      setForeground(localStorage.getItem('fgcolorcode'))
    }
    if (localStorage.getItem('hlcolorcode')) {
      setHighlight(localStorage.getItem('hlcolorcode'))
    }
  }, 200)
  const more = {
    width,
    minWidth,
    maxWidth,
    options,
    panelIndex: 0,
  }
  if (loading) {
    return (
      <GrayPanel title="Menu" {...style} {...more}>
        <ControlBtnsGroup
          disabled
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
          }}
          hlcolor="#FFFF00"
        >
          <ControlButton Icon={faArchive} />
          <ControlButton Icon={faArrowLeft} />
        </ControlBtnsGroup>
        <AccordionList loading />
      </GrayPanel>
    )
  }

  const newFieldText = value => {
    setInputValue(value)
  }
  useEffect(() => {
    setDataList(dataList)
    // setTimeout(() => {
    //   inputElement?.current?.focus()
    // }, 1000)
    // Why hard-corded 1000? Can we assume no-activity during 1s? Temporarily commented because this affects to other input elements and their focus
  }, [dataList])

  const onAdd = e => {
    if (e.keyCode === 13) {
      e.preventDefault()
      if (inputValue == '') {
        return
      }
      if (isCog) {
        if (showFolderDoc) {
          onAddGroupType(inputValue + '/')
        } else {
          onAddGroupType(inputValue)
        }
      } else {
        if (showFolderDoc) {
          onGroupAddFun(inputValue + '/')
        } else {
          onGroupAddFun(inputValue)
        }
      }
      setInputValue('')
      inputElement.current.blur()
    }
  }
  const childRender = dataList.map((item, index) => {
    if (index === selectedIndex) {
      return <GroupInside collectionName="Articles" groupId={item._id} key={index} onSelectItem={selectSubItem} />
    }

    return <div key={index} />
  })
  const setOriginColor = e => {
    localStorage.setItem('bgcolorcode', '#242D3C')
    localStorage.setItem('fgcolorcode', '#FFF')
    localStorage.setItem('hlcolorcode', '#f8e71c')
    setBackground('#242D3C')
    setForeground('#FFF')
    setHighlight('#f8e71c')
  }

  const onChangeBGColorcode = color => {
    setBackground(color)
  }

  const onChangeFGColorcode = color => {
    setForeground(color)
  }

  const onChangeHLColorcode = color => {
    setHighlight(color)
  }
  const onChangeHLColorCheck = checked => {
    if (checked) {
      setHlChecked('true')
    } else {
      setHlChecked('false')
    }
  }
  const groupTypes = _.get(header, 'client.data.appInfo.groupType.options')
  // const bgcolor = 'rgb(36, 45, 60)'
  // const fgcolor = '#fff'

  const handleCollectionMenuClick = e => {
    onGroupCollectionSelect(e.key)
  }

  const collectiongMenu = (
    <Menu onClick={handleCollectionMenuClick} selectable selectedKeys={[collectionName]}>
      { collectionConfigs.Menu.map( menuItem => (
        <Menu.Item key={menuItem.name}>
          {menuItem.name}
        </Menu.Item>
        )
      ) 
    }
    </Menu>
  )

  const onSearch = e => {
    setSearch(e.target.value)
    if (e.key === 'Enter') {
      const list = dataList.filter(item => {
        return item.name.includes(e.target.value)
      })
      setDataList(list);
    }
  }

  const onReset = () => {
    document.getElementById('searchInput').value = '';
    setDataList(dataList);
    setIsSearchCloseIconVisible(false);
  }

  return (
    <>
      <GrayPanel
        title="Menu"
        bgcolor={background ? background : '#242D3C'}
        fgcolor={foreground ? foreground : '#FFF'}
        hlcolor={highlight ? highlight : '#FFFF00'}
        bgcolor_selected={background ? background : '#242D3C'}
        fgcolor_selected="#FFD25B"
        border_right={null}
        hlcolor={highlight ? highlight : '#FFFF00'}
        {...more}
      >
        <ControlBtnsGroup
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: background ? background : '#242D3C',
          }}
          hlcolor="#FFFF00"
        >
          <Dropdown overlay={collectiongMenu} trigger={['click']}>
            <ControlButton
              Icon={faBars}
              font={font}
              bgcolor={background ? background : '#242D3C'}
              fgcolor={foreground ? foreground : '#FFF'}
              hlcolor={highlight ? highlight : '#FFFF00'}
            />
          </Dropdown>
          <ControlButton
            Icon={faArchive}
            font={font}
            bgcolor={background ? background : '#242D3C'}
            fgcolor={foreground ? foreground : '#FFF'}
            hlcolor={highlight ? highlight : '#FFFF00'}
            onClick={() => onGroupTypeChange('/')}
          />
          <ControlButton
            Icon={faArrowLeft}
            font={font}
            bgcolor={background ? background : '#242D3C'}
            fgcolor={foreground ? foreground : '#FFF'}
            hlcolor={highlight ? highlight : '#FFFF00'}
            onClick={onBack}
          />
          <div className="group-type-nav" style={{ backgroundColor: background ? background : '#242D3C' }}>
            <p className="group-type-nav-base">/</p>
            <Breadcrumb className="group-type-breadcrumb">
              {groupType?.split('/').map((item, index) => (
                <Breadcrumb.Item
                  key={index}
                  onClick={() => {
                    onGroupTypeChange(
                      `${groupType
                        ?.split('/')
                        .slice(0, index + 1)
                        .join('/')}/`,
                    )
                  }}
                >
                  {item}
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>
            {/* <Select placeholder="Group Type" optionFilterProp="children" value={groupType} onChange={onGroupTypeChange} style={{ width: '100%', fontSize: font }} size={font == '14px' ? 'default' : 'small'}>
              {groupTypes.map((item, index) => (
                <Select.Option value={item} label={item} key={index}>
                  {item}
                </Select.Option>
              ))}
            </Select> */}
          </div>
          {/* <ControlButton
            Icon={faCog}
            font={font}
            bgcolor={background}
            fgcolor={foreground}
            onClick={() => setShowSettingModal(true)}
            wrapperStyle={{ marginLeft: 'auto' }}
          /> */}
        </ControlBtnsGroup>
        <div className="ps-relative">
          <input
            placeholder="search"
            id="searchInput"
            className="s-input s-input__search js-search-field"
            type="search"
            onKeyDown={e => onSearch(e)}
            onFocus={() => setIsSearchCloseIconVisible(true)}
          />
          <svg aria-hidden="true" className="s-input-icon s-input-icon__search svg-icon iconSearch" width="18" height="18" viewBox="0 0 18 18">
            <path d="M18 16.5l-5.14-5.18h-.35a7 7 0 10-1.19 1.19v.35L16.5 18l1.5-1.5zM12 7A5 5 0 112 7a5 5 0 0110 0z"></path>
          </svg>
          {isSearchCloseIconVisible && (
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="times"
              className="svg-inline--fa fa-times fa-w-11  search-close-icon"
              width="18"
              viewBox="0 0 352 512"
              height="18"
              onClick={() => onReset()}
            >
              <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path>
            </svg>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'stretch',
            height: '100%',
            marginTop: font == '11px' && '-11px',
          }}
        >
          {onSelected && (
            <div
              style={{
                // backgroundColor: '#242D3C',
                padding: '10px 0px',
                width: '37px',
                height: '100%',
                marginRight: '5px',
                position: 'relative',
              }}
            >
              <ControlBtnsGroup
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  // backgroundColor: '#242D3C',
                  flexDirection: 'column',
                }}
                // bgcolor="#242D3C"
                bgcolor={background}
                // fgcolor="white"
                fgcolor={foreground}
                //hlcolor="#FFD25B"
              >
                <ControlButton
                  Icon={faArchive}
                  font={font}
                  tooltip="Cabinet"
                  placement="right"
                  bgcolor={background ? background : '#242D3C'}
                  fgcolor={foreground ? foreground : '#FFF'}
                  hlcolor={highlight ? highlight : '#FFFF00'}
                  toggled={selected === EnumSelected.Cabinet}
                  onClick={() => setSelected(EnumSelected.Cabinet)}
                />
                <ControlButton
                  Icon={faFolder}
                  font={font}
                  tooltip="Folder"
                  placement="right"
                  bgcolor={background ? background : '#242D3C'}
                  fgcolor={foreground ? foreground : '#FFF'}
                  hlcolor={highlight ? highlight : '#FFFF00'}
                  onClick={() => setSelected(EnumSelected.Folder)}
                />
                <ControlButton
                  Icon={faFileAlt}
                  font={font}
                  tooltip="Document"
                  placement="right"
                  bgcolor={background ? background : '#242D3C'}
                  fgcolor={foreground ? foreground : '#FFF'}
                  hlcolor={highlight ? highlight : '#FFFF00'}
                  onClick={() => setSelected(EnumSelected.Document)}
                />
                <ControlButton Icon={faSitemap} font={font} tooltip="Organizer" placement="right" bgcolor={background} fgcolor={foreground} />
                <ControlButton Icon={faCog} font={font} tooltip="GearBox" placement="right" bgcolor={background} fgcolor={foreground} />
              </ControlBtnsGroup>
            </div>
          )}
          <span style={{ flexGrow: 1 }}>
            {selected === EnumSelected.Cabinet && <CabinetForm />}
            {selected === EnumSelected.Folder && (
              <>
                <AccordionList
                  dataList={groupTypes.map(item => ({ name: item }))}
                  font={font}
                  selectItem={selectItem}
                  selectedIndex={selectedGroupIndex}
                  selectItemName={setSelectedGroupIndex}
                  bgcolor_selected={hlChecked == 'true' ? highlight : background}
                  fgcolor_selected={hlChecked == 'false' && highlight}
                  bgcolor={background ? background : '#242D3C'}
                  fgcolor={foreground ? foreground : '#FFF'}
                  hlcolor={highlight ? highlight : '#FFFF00'}
                  onItemDeleteFunc={deleteIndex => {
                    setSelectedGroupIndex(deleteIndex === groupTypes?.length - 1 ? deleteIndex - 1 : deleteIndex)
                    onRemoveGroupType(deleteIndex)
                  }}
                />
                <div
                  className="add_new_inputItem"
                  style={{
                    marginRight: '0px',
                    background: background,
                    borderLeft: '8px solid gray',
                    marginTop: '1px',
                  }}
                >
                  <div className="oe-addnew-form-item" style={{ marginTop: font == '14px' ? '6px' : '4px' }}>
                    {showFolderFol ? (
                      groupType == '/' ? (
                        <span onClick={() => setShowFolderFol(!showFolderFol)} className="oe-addnew-form-item-icons">
                          <FontAwesomeIcon icon={faArchive} color="#FFF" />
                        </span>
                      ) : (
                        <span onClick={() => setShowFolderFol(!showFolderFol)} className="oe-addnew-form-item-icons">
                          <FontAwesomeIcon icon={faFolder} color="#FFF" />
                        </span>
                      )
                    ) : (
                      <span onClick={() => setShowFolderFol(!showFolderFol)} className="oe-addnew-form-item-icons">
                        <FontAwesomeIcon icon={faFileAlt} color="#FFF" />
                      </span>
                    )}
                    <span
                      style={{
                        background: '#FFF',
                        display: 'inline-block',
                        marginRight: '5px',
                        flexGrow: 1,
                      }}
                    >
                      <input
                        style={{
                          paddingTop: font == '14px' ? '6px' : '3px',
                          paddingBottom: font == '14px' ? '6px' : '3px',
                        }}
                        type="text"
                        placeholder="Add new"
                        value={inputValue}
                        onChange={e => newFieldText(e.target.value)}
                        onKeyDown={onAdd}
                        ref={inputElement}
                      />
                    </span>
                  </div>
                </div>
              </>
            )}
            {selected === EnumSelected.Document && (
              <>
                <AccordionList
                  dataList={datalist}
                  selectedIndex={selectedIndex}
                  selectItem={selectItem}
                  selectItemEdit={selectItemEdit}
                  selectItemName={selectItemName}
                  selectIcon={selectIcon}
                  // itemEditable={dataList}
                  bgcolor={background ? background : '#242D3C'}
                  fgcolor={foreground ? foreground : '#FFF'}
                  hlcolor={highlight ? highlight : '#FFFF00'}
                  onItemDeleteFunc={onItemDeleteFunc}
                  itemThumb="none"
                  bgcolor_selected={hlChecked == 'true' ? highlight : background}
                  fgcolor_selected={hlChecked == 'false' && highlight}
                  titleChanged={onItemEditFunc}
                  border_left={highlight}
                  groupType={groupType}
                  onGroupTypeChange={onGroupTypeChange}
                  // expandable
                  showSwitch={true}
                  duplicateSelectable
                  draggable
                  openEditable
                  onDragItem={onDragItem}
                  font={font}
                >
                  {childRender}
                </AccordionList>
                <div
                  className="add_new_inputItem"
                  style={{
                    marginRight: '0px',
                    background: background,
                    borderLeft: '8px solid gray',
                  }}
                >
                  <div className="oe-addnew-form-item" style={{ paddingTop: font == '14px' ? '6px' : '4px' }}>
                    {showFolderDoc ? (
                      groupType == '/' ? (
                        <span onClick={() => setShowFolderDoc(!showFolderDoc)} className="oe-addnew-form-item-icons">
                          <FontAwesomeIcon icon={faArchive} color="#FFF" />
                        </span>
                      ) : (
                        <span onClick={() => setShowFolderDoc(!showFolderDoc)} className="oe-addnew-form-item-icons">
                          <FontAwesomeIcon icon={faFolder} color="#FFF" />
                        </span>
                      )
                    ) : (
                      <span onClick={() => setShowFolderDoc(!showFolderDoc)} className="oe-addnew-form-item-icons">
                        <FontAwesomeIcon icon={faFileAlt} color="#FFF" />
                      </span>
                    )}
                    {/* <AddNewField newFieldText={newFieldText} font={font} onAdd={onAdd} inputValue={inputValue}/> */}
                    <span
                      style={{
                        background: '#FFF',
                        display: 'inline-block',
                        marginRight: '5px',
                        flexGrow: 1,
                      }}
                    >
                      <input
                        style={{
                          paddingTop: font == '14px' ? '4px' : '2px',
                          paddingBottom: font == '14px' ? '4px' : '2px',
                        }}
                        type="text"
                        placeholder="Add new"
                        value={inputValue}
                        onChange={e => newFieldText(e.target.value)}
                        onKeyDown={onAdd}
                        ref={inputElement}
                      />
                    </span>
                  </div>
                </div>
              </>
            )}
            {/* {selected == EnumSelected.Cog && <SettingForm onChangeBGColorcode={onChangeBGColorcode} onChangeFGColorcode={onChangeFGColorcode} />} */}
          </span>
        </div>
      </GrayPanel>
      <Modal
        title="Confirm"
        centered
        visible={bDeleteModal}
        onOk={() => {
          showDeleteModal()
          onItemDeleteFunc()
        }}
        onCancel={() => showDeleteModal(false)}
        footer={[
          <Button key="back" onClick={() => showDeleteModal(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="danger"
            onClick={() => {
              showDeleteModal()
              onItemDeleteFunc()
            }}
          >
            Delete
          </Button>,
        ]}
      >
        <p>Do you want to delete this group?</p>
      </Modal>
      <Modal
        title="Confirm"
        centered
        visible={bConfirmModal}
        onOk={() => {
          showConfirmModal(false)
          history.push({
            pathname: '/logout',
          })
        }}
        onCancel={() => showConfirmModal(false)}
        footer={[
          <Button key="back" onClick={() => showConfirmModal(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              showConfirmModal(false)
              history.push({
                pathname: '/logout',
              })
            }}
          >
            Logout
          </Button>,
        ]}
      >
        <p>Do you want to logout?</p>
      </Modal>
      <Modal
        title="Setting"
        centered
        visible={showSettingModal}
        onOk={() => setShowSettingModal(false)}
        onCancel={() => setShowSettingModal(false)}
        footer={[
          <Button
            form=""
            key="submit"
            type="primary"
            onClick={() => {
              setOriginColor()
            }}
          >
            Reset Color
          </Button>,
          <Button
            type="primary"
            onClick={() => {
              setShowSettingModal(false)
            }}
          >
            Ok
          </Button>,
        ]}
      >
        <SettingForm
          onChangeBGColorcode={onChangeBGColorcode}
          onChangeFGColorcode={onChangeFGColorcode}
          onChangeHLColorcode={onChangeHLColorcode}
          onChangeHLColorCheck={onChangeHLColorCheck}
          bgcolorcode={background}
          fgcolorcode={foreground}
          hlcolor={highlight}
        />
      </Modal>
    </>
  )
}

GroupDetailPanel.propTypes = {
  loading: PropTypes.bool,
  dataList: PropTypes.array,
  style: PropTypes.object,
}

GroupDetailPanel.defaultProps = {
  loading: false,
  dataList: [],
  style: {
    // bgcolor: localStorage.getItem('colorcode') || '#242D3C',
    // fgcolor: 'white',
  },
}

export default GroupDetailPanel