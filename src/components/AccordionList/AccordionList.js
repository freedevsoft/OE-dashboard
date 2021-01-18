import React from 'react'
import PropTypes from 'prop-types'
import ReactLoading from 'react-loading'
import styled from 'styled-components'
import { Upload } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ControlButton from 'components/ControlButton/ControlButton'
import ControlBtnsGroup from 'components/ControlBtnsGroup/ControlBtnsGroup'
import { Accordion, AccordionItem, AccordionItemTitle, AccordionItemBody } from 'react-accessible-accordion'
import { faFolder, faFolderOpen, faTrashAlt, faPencilAlt, faFileAlt, faArchive, faCalendar } from '@fortawesome/free-solid-svg-icons'

import 'react-accessible-accordion/dist/fancy-example.css'
import './AccordionList.scss'
import * as constants from 'utils/constants'

const { Dragger } = Upload

const CenterWrapper = styled.div`
  position: absolute;
  left: ${props => (props.width ? `calc(50% - ${props.width / 2}px)` : 'calc(50% - 35px)')};
  top: ${props => (props.height ? `calc(50% - ${props.height / 2}px)` : 'calc(50% - 35px)')};
`

class AccordionList extends React.Component {
  inputText = ''

  constructor(props) {
    super(props)
    this.state = {
      editable: [],
      editpencil: false,
    }
  }

  inputTextChanged = value => {
    this.inputText = value
  }

  // upDate = (e) => {
  //   this.props.upDate(e, this.state.inputValue);
  //   this.setState({ inputValue: '' })
  // }

  setEditable = index => {
    const { itemEditable, dataList } = this.props
    if (typeof itemEditable === 'boolean') {
      if (!itemEditable) return
    } else if (!itemEditable[index].editable) return

    const edit = []
    for (let i = 0; i < index; i += 1) edit.push(false)
    edit.push(true)
    this.inputText = dataList[index].name
    this.setState({ editable: edit }, () => document.addEventListener('click', this.handleClick, false))
  }

  handleClick = e => {
    const { titleChanged } = this.props
    const { editable } = this.state
    if (!this.inputRef.contains(e.target)) {
      if (titleChanged) titleChanged(editable.length - 1, this.inputText)
      this.removeEditable()
    }
  }

  removeEditable = () => {
    const edit = []
    this.setState({ editable: edit }, () => document.removeEventListener('click', this.handleClick, false))
  }

  onClickItem = index => {
    const { selectedIndex, selectItem, doubleSelectable, duplicateSelectable } = this.props
    if (index !== selectedIndex) {
      selectItem(index)
    } else if (doubleSelectable || duplicateSelectable) {
      selectItem(index)
    }
  }

  onClickItemName = index => {
    const { selectItemName } = this.props
    if (selectItemName) {
      selectItemName(index)
    }
  }

  handleEnter = e => {
    const { titleChanged } = this.props
    const { editable } = this.state
    e.stopPropagation()

    if (e.key === 'Enter') {
      e.target.blur()
      if (titleChanged) {
        titleChanged(editable.length - 1, this.inputText)
      }
      this.removeEditable()
    }
  }

  setInputRef = ref => {
    this.inputRef = ref
  }

  onClickIcon = (e, index) => {
    const { selectIcon } = this.props
    e.stopPropagation()
    if (selectIcon) selectIcon(index)
  }

  render() {
    const {
      loading,
      theme,
      bgcolor_selected,
      fgcolor_selected,
      border_left,
      showTrash,
      removeItem,
      draggable,
      droppable,
      nofixed,
      dataList,
      onDragItem,
      onDropItem,
      onDragEnd,
      onDragLeave,
      selectedIndex,
      dropIndex,
      expandable,
      itemThumb,
      spaceLabel,
      uploadFile,
      onUpload,
      onItemDeleteFunc,
      font,
      bottomArea = true,
      imagePanel,
      showSwitch,
      type,
      onGroupTypeChange,
      groupName,
      openEditable,
      selectItemEdit,
      groupType,
    } = this.props

    let { bgcolor, fgcolor, hlcolor } = this.props
    const { editable, editpencil } = this.state
    if (theme) {
      bgcolor = constants.getBackground(theme)
      fgcolor = constants.getColor(theme)
    } else if (!bgcolor && !fgcolor) {
      bgcolor = 'white'
      fgcolor = 'black'
    }

    let { children } = this.props
    const acrdStyle = {
      flexGrow: '1',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
    }

    if (!Array.isArray(children)) children = [children]
    if (loading) {
      return (
        <Accordion accordion id="mainContent" style={nofixed ? null : acrdStyle}>
          <CenterWrapper width={70} height={70}>
            <ReactLoading type="cylon" color="lightgray" height={70} width={70} />
          </CenterWrapper>
        </Accordion>
      )
    }

    if (!dataList) {
      return (
        <Accordion accordion id="mainContent" style={nofixed ? null : acrdStyle}>
          <CenterWrapper width={120} height={112}>
            <img src="/nodata-found.png" alt="nodata" />
          </CenterWrapper>
        </Accordion>
      )
    }

    return (
      <Accordion accordion id="mainContent">
        {dataList.map((container, index) => {
          let prefix = ''
          if (container.icon) {
            if (typeof container.icon === 'string') {
              prefix = (
                <img
                  src={container.icon}
                  style={{ maxWidth: container.maxIconWidth || '30px', maxHeight: container.maxIconHeight || '18px' }}
                  alt="prefix"
                />
              )
            } else {
              prefix = (
                <FontAwesomeIcon icon={container.icon} className={container.rotate ? `fa-Folder fa-rotate-${container.rotate}` : 'fa-Folder'} />
              )
            }
          } else if (container.prefix) {
            prefix = container.prefix
          } else if (itemThumb === 'folder') {
            prefix = <FontAwesomeIcon icon={selectedIndex === index ? faFolderOpen : faFolder} className="fa-Folder" />
          }

          let borderLeftColor = 'gray'
          if (container.borderLeftSecond) {
            borderLeftColor = container.borderLeftSecond
          } else if (border_left) {
            borderLeftColor = border_left
          }

          return (
            <AccordionItem
              key={`accordion_${index}`}
              onClick={() => {
                this.onClickItem(index)
                // if (container.name.endsWith('/')) {
                // groupName(container.name)
                //   onGroupTypeChange(container.name)
                // }
              }}
              draggable={draggable || droppable}
              onDragStart={e => {
                if (draggable) {
                  e.dataTransfer.setData('drag_index', index)
                  e.dataTransfer.setData('drag_name', container.name)
                  onDragItem(e, index)
                }
              }}
              onDrop={e => {
                if (droppable && onDropItem) {
                  onDropItem(e, parseInt(e.dataTransfer.getData('drag_index'), 10), index)
                }
              }}
              onDragEnd={e => {
                if (draggable && onDragEnd) onDragEnd(e)
              }}
              onDragOver={e => {
                e.stopPropagation()
                e.preventDefault()
              }}
              onDragLeave={e => {
                if (draggable && onDragLeave) onDragLeave(e)
              }}
            >
              <AccordionItemTitle
                className={`accordion__title${selectedIndex === index ? ' acc_selected_item' : ''}${dropIndex === index ? ' acc_drop_item' : ''}`}
                style={{
                  // color: selectedIndex === index ? !editpencil ? fgcolor_selected || fgcolor : fgcolor : fgcolor,
                  color: selectedIndex === index ? fgcolor_selected : fgcolor,
                  // background: imagePanel
                  //   ? '#F8F5F5'
                  //   : selectedIndex === index ? !editpencil
                  //     ? // ? constants.getHoverColor(bgcolor)
                  //     bgcolor_selected || bgcolor
                  //     : bgcolor : bgcolor,
                  background: imagePanel ? '#F8F5F5' : selectedIndex === index ? bgcolor_selected : bgcolor,
                  borderLeft: `8px solid ${borderLeftColor}`,
                  paddingTop: font == '14px' ? '8px' : '5px',
                  paddingBottom: font == '14px' ? '8px' : '5px',
                  fontWeight: selectedIndex === index ? 'bolder' : '',
                }}
              >
                {/* <div className="acc_item_left_line" style={{ background: container.borderLeftSecond || 'transparent' }} /> */}
                <div className="acc_item_line" style={{ height: container.lineTopHeight || '1px' }} />
                {dataList.length - 1 === index && (
                  <div className="acc_item_line acc_item_line-bottom" style={{ height: container.lineTopHeight || '1px' }} />
                )}
                <div>
                  <span style={{ marginTop: imagePanel && '4px', zIndex: 99 }}>
                    {openEditable && (
                      <ControlBtnsGroup
                        style={{
                          // width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          // backgroundColor: '#242d3c',
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                          right: '15px',
                          left: 'unset',
                          zIndex: 100,
                        }}
                        // bgcolor="#242d3c"
                        bgcolor={bgcolor}
                        fgcolor="white"
                        hlcolor="#FFD25B"
                      >
                        <ControlButton
                          Icon={faPencilAlt}
                          font={font}
                          toggled={selectedIndex == index && this.state.editpencil}
                          bluenavy={true}
                          hlcolor={hlcolor}
                          bgcolor={bgcolor}
                          fgcolor={fgcolor}
                          onClick={e => {
                            selectItemEdit && selectItemEdit(index)
                            this.setState({ editpencil: true })
                          }}
                        />
                        <ControlButton
                          Icon={faTrashAlt}
                          font={font}
                          bgcolor={bgcolor}
                          fgcolor={fgcolor}
                          onClick={e => {
                            e.stopPropagation()
                            if (onItemDeleteFunc) onItemDeleteFunc(index)
                          }}
                        />
                      </ControlBtnsGroup>
                      // <span
                      //   onClick={e => {
                      //     selectItemEdit && selectItemEdit(index)
                      //   }}
                      // >
                      //   <FontAwesomeIcon icon={faPencilAlt} />
                      // </span>
                    )}

                    {/* <span
                      style={{ marginLeft: '10px' }}
                      onClick={e => {
                        e.stopPropagation()
                        if (onItemDeleteFunc) onItemDeleteFunc(index)
                      }}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </span> */}
                  </span>
                  <div
                    className="u-position-relative"
                    style={{
                      display: 'flex',
                      marginRight: expandable || index === selectedIndex ? '0px' : '0px',
                      marginLeft: !imagePanel && '10px',
                    }}
                  >
                    {!imagePanel && showSwitch && (
                      <span
                        onClick={e => this.onClickIcon(e, index)}
                        style={{
                          width: font == '14px' ? '12px' : '8px',
                          height: font == '14px' ? '12px' : '8px',
                          borderRadius: font == '14px' ? '12px' : '8px',
                          backgroundColor: prefix?.props?.checked ? '#64FF33' : 'red',
                          marginRight: '10px',
                          alignSelf: 'center',
                        }}
                      ></span>
                    )}
                    {imagePanel && (
                      <span onClick={e => this.onClickIcon(e, index)} style={{ width: '25%', display: 'inline-block' }}>
                        {prefix}
                      </span>
                    )}
                    {!imagePanel && (
                      <>
                        {container.name.endsWith('/') ? (
                          <>
                            {groupType == '/' ? (
                              !container?.data?.desc?.icon.url &&
                              <span onClick={() => this.onClickItemName(index)} style={{ width: '35px', textAlign: 'center', marginRight: '10px' }}>
                                <FontAwesomeIcon icon={faArchive} color={container?.data?.cfg?.color} />
                              </span>
                            ) : (
                                <span onClick={() => this.onClickItemName(index)} style={{ width: '35px', textAlign: 'center', marginRight: '10px' }}>
                                  <FontAwesomeIcon icon={faFolder} />
                                </span>
                              )}
                          </>
                        ) : (
                            <span onClick={() => this.onClickItemName(index)} style={{ width: '35px', textAlign: 'center', marginRight: '10px' }}>
                              <FontAwesomeIcon icon={faFileAlt} />
                            </span>
                          )}
                      </>
                    )}
                    {!imagePanel && container?.data?.desc?.icon.url && (
                      <span style={{ width: '35px', textAlign: 'center', marginRight: '10px' }}>
                        <img
                          src={container.data.desc.icon.url}
                          style={{
                            maxWidth: font == '14px' ? '20px' : '15px',
                            maxHeight: font == '14px' ? '20px' : '15px',
                          }}
                        />
                      </span>
                    )}
                    <span style={{ width: !imagePanel && '50%', display: !imagePanel && 'inline-block' }}>
                      {editable[index] ? (
                        <input
                          type="text"
                          defaultValue={`${container.name}`}
                          autoFocus
                          ref={this.setInputRef}
                          onChange={e => this.inputTextChanged(e.target.value)}
                          onKeyPress={e => this.handleEnter(e)}
                        />
                      ) : container.name == 'StoryLine' ? (
                        <span>
                          Story
                          <font style={{ color: 'red' }}>Line</font>
                        </span>
                      ) : (
                            <span onClick={() => this.onClickItemName(index)}>{` ${container.name}`}</span>
                          )}
                    </span>

                    {container.rightIcon &&
                      (typeof container.rightIcon === 'string' ? (
                        <img
                          src={container.rightIcon}
                          style={{
                            maxWidth: '30px',
                            maxHeight: '16px',
                            marginTop: '3px',
                            float: 'right',
                            marginRight: '1rem',
                          }}
                          alt="scheduleStatus"
                        />
                      ) : (
                          <FontAwesomeIcon
                            icon={container.icon}
                            className={container.rotate ? `fa-Folder fa-rotate-${container.rotate}` : 'fa-Folder'}
                            style={{ float: 'right', marginRight: '1rem' }}
                          />
                        ))}
                    {container.addon && (
                      <div
                        style={{
                          position: 'absolute',
                          right: expandable ? '4.5rem' : '4.3rem',
                          top: '-1px',
                          display: 'flex',
                          alignItems: 'center',
                          lineHeight: '21px',
                          fontSize: font == '14px' ? '11px' : '10px',
                        }}
                      >
                        {container.addon}
                      </div>
                    )}
                    {showTrash === true && (
                      <button type="button" className="btn trashcan_button" onClick={() => removeItem(index)}>
                        <svg
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="fas"
                          data-icon="trash-alt"
                          className="svg-inline--fa fa-trash-alt fa-w-14 "
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 448 512"
                        >
                          <path
                            fill="currentColor"
                            d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                {expandable && <div className="accordion__arrow" role="presentation" />}
                {/* {!this.props.expandable && index === this.props.selectedIndex && (
                  <FontAwesomeIcon className="right-arrow" icon={faAngleRight} />
                )} */}
              </AccordionItemTitle>
              {
                expandable && (
                  <AccordionItemBody
                    style={{
                      color: fgcolor,
                      background: bgcolor,
                      borderLeft: `8px solid ${borderLeftColor}`,
                    }}
                  >
                    {/* {children[index].props.collectionName == 'Articles' && */}
                    {children[index]}
                    {/* } */}
                  </AccordionItemBody>
                )
              }
            </AccordionItem>
          )
        })
        }
        {
          imagePanel && bottomArea && !uploadFile ? (
            <div
              className="acc-bottom-area"
              draggable={draggable || droppable}
              onDrop={e => {
                if (droppable && onDropItem) {
                  onDropItem(e, parseInt(e.dataTransfer.getData('drag_index'), 10), dataList.length)
                }
              }}
              onDragOver={e => {
                e.stopPropagation()
                e.preventDefault()
              }}
            >
              {spaceLabel}
            </div>
          ) : (
              ''
            )
        }
        {
          bottomArea && uploadFile ? (
            <div className="acc-bottom-area">
              <Dragger name="file" multiple={false} onChange={onUpload} showUploadList={false}>
                <p>{spaceLabel}</p>
              </Dragger>
            </div>
          ) : (
              ''
            )
        }
      </Accordion >
    )
  }
}
AccordionList.propTypes = {
  expandable: PropTypes.bool,
  itemEditable: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
  nofixed: PropTypes.bool,
  draggable: PropTypes.bool,
  droppable: PropTypes.bool,
  duplicateSelectable: PropTypes.bool,
}

AccordionList.defaultProps = {
  expandable: false,
  itemEditable: true,
  nofixed: false,
  draggable: false,
  droppable: false,
  duplicateSelectable: false,
}

export default AccordionList
