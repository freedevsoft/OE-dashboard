import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { Modal, Button, Radio } from 'antd'
import ControlBtnsGroup from 'components/ControlBtnsGroup/ControlBtnsGroup'
import ControlButton from 'components/ControlButton/ControlButton'
import { faEllipsisV, faFolder, faSignOutAlt, faFont, faAngleUp, faAngleDown, faExchangeAlt, faLink, faCog } from '@fortawesome/free-solid-svg-icons'
import SettingForm from 'containers/SettingForm'
import './Footer.scss'

export class Footer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      bConfirmModal: false,
      bClientsModal: false,
      bSettingModal: false,
      clientId: null,
      background: localStorage.getItem('bgcolorcode') || '#242D3C',
      foreground: localStorage.getItem('fgcolorcode') || '#FFF',
      highlight: localStorage.getItem('hlcolorcode') || '#f8e71c',
      hlChecked: localStorage.getItem('hlcolorcheck') || 'false',
    }
  }
  timer() {
    this.setState({
      background: localStorage.getItem('bgcolorcode') || '#242D3C',
      foreground: localStorage.getItem('fgcolorcode') || '#FFF',
      highlight: localStorage.getItem('hlcolorcode') || '#f8e71c',
      hlChecked: localStorage.getItem('hlcolorcheck') || 'false'
    })
  }

  componentDidMount() {
    this.intervalId = setInterval(this.timer.bind(this), 200);
    const { clientId } = this.props

    this.setState({ clientId })
  }

  componentWillReceiveProps(nextProps) {
    const { clientId: currentClientId } = this.props
    if (nextProps.clientId !== currentClientId) {
      this.setState({ clientId: nextProps.clientId })
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  changeFontSize = () => {
    this.props.onChangeFont()
  }

  navigateToApp = appId => {
    const { history } = this.props
    history.push({
      pathname: history.pathname,
      search: appId ? `?${new URLSearchParams({ appId }).toString()}` : '',
    })
  }

  showModal = (bConfirmModal = true) => this.setState({ bConfirmModal })

  showClientsModal = (bClientsModal = true) => this.setState({ bClientsModal })
  showSettingModal = (bSettingModal = true) => this.setState({ bSettingModal })

  handleChange = e => this.setState({ clientId: e.target.value })

  onChangeBGColorcode = color => this.setState({ background: color })
  onChangeFGColorcode = color => this.setState({ foreground: color })
  onChangeHLColorcode = color => this.setState({ highlight: color })


  onChangeHLColorCheck = checked => {
    if (checked) {
      this.setState({ hlChecked: 'true' })
    } else {
      this.setState({ hlChecked: 'false' })
    }
  }

  render() {
    const { togglePanel, visibles, history, vertical, clients, myclient, onClientChange, font } = this.props
    const { bConfirmModal, bClientsModal, clientId, bSettingModal } = this.state
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    }
    const setOriginColor = e => {
      localStorage.setItem('bgcolorcode', '#242D3C');
      localStorage.setItem('fgcolorcode', '#FFF');
      localStorage.setItem('hlcolorcode', '#f8e71c');
      this.setState({ background: '#242D3C' })
      this.setState({ foreground: '#FFF' })
      this.setState({ hlcolorcode: '#f8e71c' })
    }
    return (
      <footer className={`footer ${vertical ? 'footer-vertical' : ''}`}>
        <div className="footer__divider" />
        <div className="footer__content">
          <ControlBtnsGroup
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              margin: '0',
              left: '0',
              backgroundColor: this.state.background,
            }}
            // hlcolor="#FFD25B"
            // bgcolor={this.state.background}
            // fgcolor={this.state.foreground}
          >

            <ControlButton Icon={faEllipsisV} font={font} toggled={visibles[0]} onClick={() => togglePanel(0)} />
            <ControlButton Icon={faLink} font={font} toggled={visibles[7]} onClick={() => togglePanel(7)} />
            <ControlButton Icon={faFolder} font={font} toggled={visibles[2]} onClick={() => togglePanel(2)} />
            {/* <ControlButton Icon={faPencilAlt} toggled={visibles[1]} onClick={() => togglePanel(1)} /> */}
            {/* <ControlButton Icon={faFile} toggled={visibles[3]} onClick={() => togglePanel(3)} /> */}
            <ControlButton
              Icon={faFont}
              subIcon={font === '14px' ? faAngleDown : faAngleUp}
              font={font}
              onClick={() => this.changeFontSize()}
              wrapperStyle={{ display: !vertical ? 'inherit' : 'none' }}
            />
            <ControlButton
              Icon={faExchangeAlt}
              font={font}
              onClick={() => this.showClientsModal()}
              wrapperStyle={{ display: vertical ? 'inherit' : 'none', bottom: '38px', position: 'absolute' }}
            />
            <ControlButton
              Icon={faSignOutAlt}
              font={font}
              onClick={() => this.showModal()}
              wrapperStyle={{ display: vertical ? 'inherit' : 'none', bottom: '0', position: 'absolute' }}
            />
            <ControlButton
              Icon={faExchangeAlt}
              font={font}
              onClick={() => this.showClientsModal()}
              wrapperStyle={{ display: !vertical ? 'inherit' : 'none' }}
            />
          </ControlBtnsGroup>
          <ControlBtnsGroup
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              margin: '0',
              textAlign: 'right',
              left: '0',
              backgroundColor: this.state.background,
            }}
            hlcolor={this.state.highlight}
            bgcolor={this.state.background}
            fgcolor={this.state.foreground}
          >
            <ControlButton
              Icon={faCog}
              font={font}
              bgcolor={this.state.background ? this.state.background : '#242D3C'}
              fgcolor={this.state.foreground ? this.state.foreground : '#FFF'}
              hlcolor={this.state.highlight ? this.state.highlight : '#FFFF00'}
              onClick={() => this.showSettingModal()}
              wrapperStyle={{ marginLeft: 'auto' }}
            />
            <ControlButton
              Icon={faSignOutAlt}
              font={font}
              onClick={() => this.showModal()}
              wrapperStyle={{ display: !vertical ? 'inherit' : 'none' }}
            />

          </ControlBtnsGroup>
          {/* <span className="footer__content__copyright">{`� OpenZNet Inc. ${moment().year()}`}</span> */}
          {/* <img src="/images/OpenZNet-White-Logo.png" alt="OElement - Logo" /> */}
        </div>

        <Modal
          title="Confirm"
          centered
          visible={bConfirmModal}
          onOk={() => {
            this.showModal(false)
            history.push({
              pathname: '/logout',
            })
          }}
          onCancel={() => this.showModal(false)}
          footer={[
            <Button key="back" onClick={() => this.showModal(false)}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={() => {
                this.showModal(false)
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
          title="Select Client"
          centered
          visible={bClientsModal}
          onOk={() => {
            this.showClientsModal(false)
            onClientChange(clientId)
          }}
          onCancel={() => this.showClientsModal(false)}
          footer={[
            <Button key="back" onClick={() => this.showClientsModal(false)}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={() => {
                this.showClientsModal(false)
                onClientChange(clientId)
              }}
            >
              Select
            </Button>,
          ]}
        >
          <Radio.Group onChange={this.handleChange} value={clientId}>
            {clients.map(cli => (
              <Radio style={radioStyle} value={cli._id} key={cli._id}>
                {cli.name}
              </Radio>
            ))}
          </Radio.Group>
        </Modal>
        <Modal
          title="Setting"
          centered
          visible={bSettingModal}
          onOk={() => this.showSettingModal(false)}
          onCancel={() => this.showSettingModal(false)}
          footer={[
            <Button
              form=''
              key='submit'
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
                this.showSettingModal(false)
              }}
            >
              Ok
          </Button>,
          ]}
        >
          <SettingForm
            onChangeBGColorcode={this.onChangeBGColorcode}
            onChangeFGColorcode={this.onChangeFGColorcode}
            onChangeHLColorcode={this.onChangeHLColorcode}
            onChangeHLColorCheck={this.onChangeHLColorCheck}
            bgcolorcode={this.state.background}
            fgcolorcode={this.state.foreground}
            hlcolorcode={this.state.highlight}
          />
        </Modal>
      </footer>
    )
  }
}

export default withRouter(Footer)
