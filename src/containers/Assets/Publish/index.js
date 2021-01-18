import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Button, DatePicker } from 'antd'
import { CrossLine } from 'components/CrossLine/CrossLine'
import GrayPanel from 'components/GrayPanel/GrayPanel'

import ControlBtnsGroup from 'components/ControlBtnsGroup/ControlBtnsGroup'
import ConfirmDialog from 'components/ConfirmDialog'
import './index.scss'

class PublishPanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      startValue: null,
      endValue: null,
      endOpen: false,
    }
  }

  disabledStartDate = startValue => {
    const { endValue } = this.state
    if (!startValue || !endValue) {
      return false
    }

    return startValue.valueOf() > endValue.valueOf()
  }

  disabledEndDate = endValue => {
    const { startValue } = this.state
    if (!endValue || !startValue) {
      return false
    }

    return endValue.valueOf() <= startValue.valueOf()
  }

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    })
  }

  onStartChange = value => {
    this.onChange('startValue', value)
  }

  onEndChange = value => {
    console.log('onEndChange', value)
    this.onChange('endValue', value)
  }

  handleStartOpenChange = open => {
    if (!open) {
      this.setState({ endOpen: true })
    }
  }

  handleEndOpenChange = open => {
    this.setState({ endOpen: open })
  }

  publish = () => {
    const channelList = ['ATSC10', 'ATSC30', 'WEB', 'MOB']
    const socialList = ['TWITTER', 'FACEBOOK', 'INSTAGRAM']

    this.handleConfirm(true)

    return

    this.props.changeStatusMsg(true, 'Publishing ....')

    const channel = []
    this.props.subData.channelChecked.forEach((checked, index) => {
      if (checked) {
        const ch = channelList[index]
        channel.push(ch)
      }
    })
    this.props.subData.socialChecked.forEach((checked, index) => {
      if (checked) {
        const ch = socialList[index]
        channel.push(ch)
      }
    })

    const { OE } = this.props.subData

    fetch('https://notify.oelement.openznet.com/pubmsg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        msg: {
          OE,
          msgType: 'breakingnews',
        },
        channel,
      }),
    })
      .then((res, err) => {
        console.log(`push notification result: ${JSON.stringify(res)}`, 'breakingnews')
        if (err) {
          this.props.changeStatusMsg(false, err)
        } else {
          this.props.changeStatusMsg(false, `Published to channels ${channel}!`)
        }
      })
      .catch(err => {
        this.props.changeStatusMsg(false, err)
      })
  }

  render() {
    const { subData, style, changeMode } = this.props
    const { startValue, endValue, endOpen } = this.state

    return (
      <GrayPanel title="PublishPanel" {...style}>
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
            {/* <Button style={{ width: 'auto', background: 'transparent' }} onClick={() => changeMode('preview')}>Preview<Icon type="pic-right" /></Button> */}
            <Button type="primary" style={{ width: 'auto' }} onClick={this.publish}>
              Submit
              <Icon type="upload" />
            </Button>
          </>
        </ControlBtnsGroup>
        <CrossLine top={0} />
        {this.state.visibleConfirmDialog && <ConfirmDialog title="Confirm" subtitle="Successfully saved" onClick={this.toggleConfirmDialog} />}

        <div style={{ display: 'flex', margin: '5px 10px 5px 0px' }}>
          <div style={{ margin: '5px 5px 5px 10px' }}>Start:</div>
          <DatePicker
            disabledDate={this.disabledStartDate}
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            value={startValue}
            placeholder="Start"
            onChange={this.onStartChange}
            onOpenChange={this.handleStartOpenChange}
          />
          <div style={{ margin: '5px 5px 5px 10px' }}>End:</div>
          <DatePicker
            disabledDate={this.disabledEndDate}
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            value={endValue}
            placeholder="End"
            onChange={this.onEndChange}
            open={endOpen}
            onOpenChange={this.handleEndOpenChange}
          />
        </div>
      </GrayPanel>
    )
  }
}
PublishPanel.propTypes = {
  loading: PropTypes.bool,
  style: PropTypes.object,
  subData: PropTypes.object,
}

PublishPanel.defaultProps = {
  loading: false,
  style: {
    width: 600,
    minWidth: 600,
    // bgcolor: "#242D3C",
    // fgcolor: "white"
    bgcolor: 'white',
    fgcolor: 'black',
  },
}
export default PublishPanel
