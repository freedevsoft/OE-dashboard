import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Button } from 'antd'
import GrayPanel from 'components/GrayPanel/GrayPanel'
import ControlBtnsGroup from 'components/ControlBtnsGroup/ControlBtnsGroup'
import { withApollo } from 'react-apollo'
import * as compose from 'lodash.flowright'

class EmptyPanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedIndex: 0,
    }
  }

  render() {
    const { style, changeMode } = this.props

    return (
      <GrayPanel title="Empty" {...style}>
        <ControlBtnsGroup>
          <>
            <Button style={{ width: 'auto', background: 'transparent' }} onClick={() => changeMode('edit')}>
              Edit
              <Icon type="edit" />
            </Button>
            <Button style={{ width: 'auto', background: 'transparent' }} onClick={() => changeMode('style')}>
              Style
              <Icon type="bg-colors" />
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
      </GrayPanel>
    )
  }
}

EmptyPanel.propTypes = {
  dataList: PropTypes.array,
  style: PropTypes.object,
  onDropFunc: PropTypes.func,
  disableControl: PropTypes.bool,
}

EmptyPanel.defaultProps = {
  dataList: [],
  style: {
    width: 520,
    minWidth: 520,
    bgcolor: 'white',
    fgcolor: 'black',
    bgcolor_selected: 'white',
    fgcolor_selected: 'black',
  },
  disableControl: false,
}

export default compose(withApollo)(EmptyPanel)
