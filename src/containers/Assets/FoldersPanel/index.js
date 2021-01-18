import React from 'react'
import PropTypes from 'prop-types'
import GrayPanel from 'components/GrayPanel/GrayPanel'
import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import ControlBtnsGroup from 'components/ControlBtnsGroup/ControlBtnsGroup'
import AccordionList from 'components/AccordionList/AccordionList'
import { Auth } from 'aws-amplify'
import ControlButton from 'components/ControlButton/ControlButton'
import TreeWidget from './TreeWidget/index'

class ArticleGroupsPanel extends React.Component {
  treeRef = null

  constructor(props) {
    super(props)
    this.state = {
      user: null,
    }
  }

  componentDidMount() {
    Auth.currentAuthenticatedUser({
      bypassCache: false, // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    })
      .then(user => this.setState({ user }))
      .catch(err => console.log(err))
  }

  renderTree = data => {
    const { user } = this.state
    if (user && data) {
      const { root } = data
      const { onSelectItemFunc, onDropFunc, titleChanged, currentKey, openKeys, onDragStart, onExpand } = this.props

      return (
        <TreeWidget
          key="0"
          root={root}
          onSelectItemFunc={onSelectItemFunc}
          onDropFunc={onDropFunc}
          onDragStart={onDragStart}
          titleChanged={titleChanged}
          currentKey={currentKey}
          openKeys={openKeys}
          onExpand={onExpand}
        />
      )
    }

    return null
  }

  render() {
    const {
      loading,
      data,
      style,
      onDeleteFunc,
      onAddFunc,
      disableAdd,
      disableDel,
      width,
      minWidth,
      maxWidth,
      options,
    } = this.props

    const more = {
      width,
      minWidth,
      maxWidth,
      options,
      panelIndex: 2,
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

    if (loading) {
      return (
        <GrayPanel title="Organizer" {...style} {...more}>
          <ControlBtnsGroup disabled {...barProps}>
            <ControlButton Icon={faPlus} />
            <ControlButton Icon={faTrashAlt} />
          </ControlBtnsGroup>
          <AccordionList loading />
        </GrayPanel>
      )
    }

    return (
      <GrayPanel title="Organizer" {...style} {...more}>
        <ControlBtnsGroup {...barProps}>
          <ControlButton Icon={faPlus} disabled={disableAdd} onClick={onAddFunc} />
          <ControlButton Icon={faTrashAlt} disabled={disableDel} onClick={onDeleteFunc} />
        </ControlBtnsGroup>
        {data.hasOwnProperty('root') && this.renderTree(data)}
      </GrayPanel>
    )
  }
}

ArticleGroupsPanel.propTypes = {
  loading: PropTypes.bool,
  data: PropTypes.object,
  style: PropTypes.object,
  onSaveFunc: PropTypes.func,
  onAddFunc: PropTypes.func,
  onDeleteFunc: PropTypes.func,
}

ArticleGroupsPanel.defaultProps = {
  loading: false,
  data: {},
  style: {
    bgcolor: '#FFFBF3',
    fgcolor: 'black',
    fgcolor_selected: 'black',
  },
  onSaveFunc: () => { },
  onAddFunc: () => { },
  onDeleteFunc: () => { },
}

export default ArticleGroupsPanel