import React from 'react'
import { Auth } from 'aws-amplify'
import { withRouter } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import * as utils from 'utils/index'
import { Menu, Dropdown, Icon, Modal, Button } from 'antd'

import './Header.scss'

class OEHeader extends React.PureComponent {
  onSide = false

  constructor(props) {
    super(props)
    this.state = {
      user: null,
      sider: false,
      versionInfo: {
        date: '',
        version: '',
      },
    }
    this.navigateFunc = this.navigateFunc.bind(this)
    this.onLogoClick = this.onLogoClick.bind(this)
  }

  componentDidMount() {
    Auth.currentAuthenticatedUser({
      bypassCache: false, // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    })
      .then(user => this.setState({ user }))
      .catch(err => console.log(err))
    const { location } = this.props

    const fullPath = window.location.href
    const position = fullPath.indexOf(location.pathname)
    let target = `${fullPath}deployment-time.txt`
    if (location.pathname !== '/') target = `${fullPath.substr(0, position)}/deployment-time.txt`
    fetch(target)
      .then(r => r.text())
      .then(timestamp => {
        const d = new Date(timestamp)
        this.setState({ versionInfo: { date: `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`, version: '0.0.0.0' } })
      })
  }

  onLogoClick = () => {
    const { versionInfo } = this.state
    Modal.info({
      title: 'Version Information',
      content: (
        <div>
          <p>
            Date:
            {versionInfo.date}
            <br />
            Version:&nbsp;
            {versionInfo.version}
          </p>
        </div>
      ),
      onOk() {},
    })
  }

  signOut = () => {
    Auth.signOut()
      .then(data => console.log(data))
      .catch(err => console.log(err))
  }

  navigateFunc = tab => {
    const { link, configId } = tab
    const { history } = this.props
    history.push(`/${utils.getPlainedString(link)}/${configId}`)
  }

  showSideMenu = bShow => {
    this.setState({ sider: bShow })
  }

  leaveToggler = () => {
    setTimeout(() => {
      if (!this.onSide) this.setState({ sider: false })
    }, 300)
  }

  onSideMenu = onSide => {
    this.onSide = onSide
    if (!onSide) {
      this.showSideMenu(false)
    }
  }

  render() {
    const { user, sider } = this.state
    const { toggleSideMenu, currentSide, location, history } = this.props
    let {
      data: { tablist: tabs },
    } = this.props

    if (!user) {
      return (
        <header className="header">
          <img src="/images/OpenZNet-White-Logo.png" alt="OElement - Logo" onClick={this.onLogoClick} style={{ cursor: 'pointer' }} />
        </header>
      )
    }

    const {
      attributes: { email },
    } = user

    let currentTab = 0
    const params = location.pathname.split('/')
    if (params[2]) {
      currentTab = tabs.findIndex(item => item.configId === params[2])
    }

    if (currentTab < 0) {
      console.log('Error occured while navigating')
      currentTab = 0
    }

    const menu = (
      <Menu onClick={this.signOut}>
        <Menu.Item key="1">
          <Icon type="logout" />
          Log Out
        </Menu.Item>
        <Menu.Item key="2">
          <Icon type="setting" />
          Configure
        </Menu.Item>
      </Menu>
    )

    const fIndex = history.location.pathname.indexOf('/')
    const eIndex = history.location.pathname.indexOf('/', 2)
    const currentMenu = history.location.pathname.slice(fIndex + 1, eIndex)
    const currentIndex = tabs.findIndex(tab => tab.text === currentMenu)

    return (
      <div>
        <header className="header">
          <Button type="button" style={{ marginLeft: '5px' }} onClick={toggleSideMenu}>
            {currentSide}
          </Button>

          <img src="/images/OpenZNet-White-Logo.png" alt="OElement - Logo" onClick={this.onLogoClick} style={{ cursor: 'pointer' }} />

          <ul>
            {tabs && tabs.length
              ? tabs.map((item, index) => (
                  <li className={currentTab === index ? 'active' : ''} key={index} onClick={() => this.navigateFunc(item)}>
                    {item.text}
                  </li>
                ))
              : ''}
          </ul>
          <FontAwesomeIcon icon={faBars} size="lg" onMouseOver={() => this.showSideMenu(true)} onMouseLeave={() => this.leaveToggler()} style={{ marginLeft: 'auto', marginRight: '10px' }} />
          <Dropdown.Button overlay={menu} icon={<Icon type="user" />}>
            {email}
          </Dropdown.Button>
          <div className="header__divider" />
        </header>
        {sider && (
          <div className="sidemenu" onMouseEnter={() => this.onSideMenu(true)} onMouseLeave={() => this.onSideMenu(false)}>
            <Menu theme="light" mode="inline" defaultSelectedKeys={[`${currentIndex}`]}>
              {tabs.map((item, index) => (
                <Menu.Item key={index} onClick={() => this.navigateFunc(item)}>
                  <span>{item.text}</span>
                </Menu.Item>
              ))}
            </Menu>
          </div>
        )}
      </div>
    )
  }
}

export default withRouter(OEHeader)
